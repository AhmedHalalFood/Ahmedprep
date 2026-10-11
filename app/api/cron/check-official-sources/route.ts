import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { checkAllSources, type SourceCheckResult } from "@/lib/source-checker"
import { todayInNewYork } from "@/lib/updates"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const REVIEWER = "Tariq@ahmedprep.com"

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) return request.headers.get("authorization") === `Bearer ${secret}`
  // Without a secret, only allow local development. Production requires CRON_SECRET.
  return process.env.NODE_ENV !== "production"
}

function describe(result: SourceCheckResult) {
  const lines = [`${result.name} — ${result.status.toUpperCase()}`, result.url]
  if (result.detail) lines.push(`Detail: ${result.detail}`)
  if (result.missingFacts.length) lines.push("Published facts no longer found on the page:", ...result.missingFacts.map((f) => `  - ${f}`))
  if (result.newDates.length) lines.push("New dates near tracked keywords:", ...result.newDates.map((d) => `  - ${d}`))
  return lines.join("\n")
}

async function sendReviewAlert(flagged: SourceCheckResult[], today: string) {
  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!apiKey || !domain) {
    console.error("[source-check] Cannot send review alert: RESEND_API_KEY or RESEND_EMAIL_DOMAIN is missing")
    return false
  }
  const text = [
    "The daily official-source check needs a human review. Nothing on ahmedprep.com was changed automatically; the site keeps showing the last verified information.",
    "",
    ...flagged.map(describe).flatMap((block) => [block, ""]),
    "To publish a confirmed change: edit lib/updates.ts and lib/official-dates.ts, update dateModified, then update expectations, knownDates and lastVerified in lib/official-sources.ts.",
  ].join("\n")

  const fingerprint = createHash("sha256").update(text).digest("hex").slice(0, 16)
  const { error } = await new Resend(apiKey).emails.send(
    {
      from: `AhmedPrep Source Check <updates@${domain}>`,
      to: [REVIEWER],
      subject: `Review needed: ${flagged.length} official source${flagged.length > 1 ? "s" : ""} flagged (${today})`,
      text,
    },
    { idempotencyKey: `source-check/${today}/${fingerprint}` },
  )
  if (error) console.error("[source-check] Review alert failed:", error.name, error.message)
  return !error
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const today = todayInNewYork()
  const results = await checkAllSources()
  const flagged = results.filter((r) => r.status !== "verified")

  for (const r of results) console.log(`[source-check] ${r.sourceId}: ${r.status}`, r.detail ?? "")

  const alerted = flagged.length ? await sendReviewAlert(flagged, today) : false
  return NextResponse.json({ checkedAt: new Date().toISOString(), reviewNeeded: flagged.length > 0, alerted, results })
}

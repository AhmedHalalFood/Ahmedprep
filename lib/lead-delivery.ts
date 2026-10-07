import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"

// Shared by /api/diagnostic and /api/referral. Mirrors the proven /api/contact delivery path.
const RECIPIENT = "Tariq@ahmedprep.com"
const MIN_FILL_MS = 1500
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PROGRAMS = new Set(["SHSAT", "Digital SAT"])

// Best-effort, per-instance limiter. Duplicate sends are also blocked by Resend idempotency keys.
const recentByKey = new Map<string, number[]>()

export const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : ""

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

export const fail = (status: number, error: string) => NextResponse.json({ success: false, error }, { status })

export const hasPhoneDigits = (phone: string) => phone.replace(/\D/g, "").length >= 10

export async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json()
    return body && typeof body === "object" ? body : null
  } catch {
    return null
  }
}

/** Returns an error response if the submission looks like spam or exceeds the rate limit. */
export function screenSubmission(request: Request, body: Record<string, unknown>, scope: string) {
  const elapsed = Number(body.elapsedMs)
  if (clean(body.website) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    console.warn(`[${scope}] Rejected likely spam submission`)
    return fail(400, "Invalid request.")
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const key = `${scope}:${ip}`
  const now = Date.now()
  const hits = (recentByKey.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs)
  hits.push(now)
  recentByKey.set(key, hits)
  if (hits.length > RATE_LIMIT.max) {
    console.warn(`[${scope}] Rate limit exceeded`)
    return fail(429, "Too many requests.")
  }
  return null
}

type Confirmation = {
  to: string
  subject: string
  heading: string
  paragraphs: string[]
  /** Optional button inserted after the paragraph at `afterParagraph`. Only https links are rendered. */
  link?: { label: string; href: string; afterParagraph: number }
}

function confirmationBody({ heading, paragraphs, link }: Confirmation) {
  const safeLink = link && /^https:\/\//i.test(link.href) ? link : undefined
  const textParts = [heading, ...paragraphs]
  const htmlParts = paragraphs.map((p) => `<p style="margin:0 0 14px;white-space:pre-wrap">${escapeHtml(p)}</p>`)
  if (safeLink) {
    textParts.splice(safeLink.afterParagraph + 2, 0, `${safeLink.label}: ${safeLink.href}`)
    htmlParts.splice(
      safeLink.afterParagraph + 1,
      0,
      `<p style="margin:0 0 18px"><a href="${escapeHtml(safeLink.href)}" style="display:inline-block;background:#f2b31a;color:#0b1d35;font-weight:bold;text-decoration:none;padding:12px 20px">${escapeHtml(safeLink.label)}</a></p>`,
    )
  }
  return {
    text: textParts.join("\n\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#0b1d35;line-height:1.6;max-width:560px">
<h2 style="margin:0 0 16px">${escapeHtml(heading)}</h2>
${htmlParts.join("\n")}
</div>`,
  }
}

type LeadEmail = {
  scope: string
  fromLocalPart: string
  heading: string
  subject: string
  replyTo: string
  rows: [string, string][]
  /** Optional courtesy email to the submitter, sent only after AhmedPrep's notification succeeds. */
  confirmation?: Confirmation
}

export async function deliverLead({ scope, fromLocalPart, heading, subject, replyTo, rows, confirmation }: LeadEmail) {
  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!apiKey || !domain) {
    console.error(`[${scope}] Email delivery is not configured: RESEND_API_KEY or RESEND_EMAIL_DOMAIN is missing`)
    return fail(500, "Delivery unavailable.")
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  })
  const allRows: [string, string][] = [...rows, ["Date/time submitted", `${submittedAt} (New York time)`]]

  const text = allRows.map(([label, value]) => `${label}: ${value}`).join("\n")
  const html = `<div style="font-family:Arial,sans-serif;color:#0b1d35">
<h2 style="margin:0 0 16px">${escapeHtml(heading)}</h2>
<table cellpadding="8" style="border-collapse:collapse">
${allRows
  .map(
    ([label, value]) =>
      `<tr><td style="border-bottom:1px solid #e5e7eb;font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table></div>`

  // Identical submissions share a key, so Resend sends them only once.
  const fingerprint = createHash("sha256")
    .update(rows.map(([, value]) => value.toLowerCase()).join("|"))
    .digest("hex")

  const resend = new Resend(apiKey)
  const { data: sent, error } = await resend.emails.send(
    {
      from: `AhmedPrep Website <${fromLocalPart}@${domain}>`,
      to: [RECIPIENT],
      replyTo,
      subject,
      text,
      html,
    },
    { idempotencyKey: `${scope}/${fingerprint}` },
  )

  if (error || !sent?.id) {
    console.error(`[${scope}] Resend delivery failed:`, error?.name, error?.message)
    return fail(502, "Delivery failed.")
  }

  console.log(`[${scope}] Delivered, Resend id:`, sent.id)

  if (confirmation) {
    // AhmedPrep already has the lead, so a failed courtesy email is logged rather than shown as a failed registration.
    const { data: confirmed, error: confirmError } = await resend.emails.send(
      {
        from: `AhmedPrep <${fromLocalPart}@${domain}>`,
        to: [confirmation.to],
        replyTo: RECIPIENT,
        subject: confirmation.subject,
        ...confirmationBody(confirmation),
      },
      { idempotencyKey: `${scope}-confirmation/${fingerprint}` },
    )
    if (confirmError || !confirmed?.id) {
      console.error(`[${scope}] Confirmation email failed:`, confirmError?.name, confirmError?.message)
    } else {
      console.log(`[${scope}] Confirmation delivered, Resend id:`, confirmed.id)
    }
  }

  return NextResponse.json({ success: true })
}

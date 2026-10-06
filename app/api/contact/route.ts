import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const RECIPIENT = "Tariq@ahmedprep.com"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PROGRAMS = new Set(["SHSAT", "Digital SAT"])
const MIN_FILL_MS = 1500
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }

// Best-effort, per-instance limiter. Duplicate sends are also blocked by Resend idempotency keys.
const recentByIp = new Map<string, number[]>()

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : ""

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

const fail = (status: number, error: string) => NextResponse.json({ success: false, error }, { status })

function isRateLimited(ip: string) {
  const now = Date.now()
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs)
  hits.push(now)
  recentByIp.set(ip, hits)
  return hits.length > RATE_LIMIT.max
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return fail(400, "Invalid request.")
  }

  // Spam checks: hidden honeypot field and implausibly fast submissions.
  const elapsed = Number(body.elapsedMs)
  if (clean(body.website) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    console.warn("[contact] Rejected likely spam submission")
    return fail(400, "Invalid request.")
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (isRateLimited(ip)) {
    console.warn("[contact] Rate limit exceeded")
    return fail(429, "Too many requests.")
  }

  const data = {
    name: clean(body.name),
    grade: clean(body.grade, 50),
    email: clean(body.email),
    phone: clean(body.phone, 30),
    program: clean(body.program, 30),
    level: clean(body.level),
    goal: clean(body.goal),
    message: clean(body.message, 2000),
  }

  const phoneDigits = data.phone.replace(/\D/g, "")
  if (
    !data.name ||
    !data.grade ||
    !EMAIL_PATTERN.test(data.email) ||
    !PROGRAMS.has(data.program) ||
    (data.phone && phoneDigits.length < 10)
  ) {
    return fail(400, "Please complete all required fields.")
  }

  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!apiKey || !domain) {
    console.error("[contact] Email delivery is not configured: RESEND_API_KEY or RESEND_EMAIL_DOMAIN is missing")
    return fail(500, "Delivery unavailable.")
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  })

  const rows: [string, string][] = [
    ["Parent / Student Name", data.name],
    ["Student Grade", data.grade],
    ["Email", data.email],
    ["Phone", data.phone || "Not provided"],
    ["Program", data.program],
    ["Current score or starting level", data.level || "Not provided"],
    ["Target score or goal", data.goal || "Not provided"],
    ["Message", data.message || "Not provided"],
    ["Date/time submitted", `${submittedAt} (New York time)`],
  ]

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n")
  const html = `<div style="font-family:Arial,sans-serif;color:#0b1d35">
<h2 style="margin:0 0 16px">New consultation request</h2>
<table cellpadding="8" style="border-collapse:collapse">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="border-bottom:1px solid #e5e7eb;font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table></div>`

  // Identical submissions within 24 hours share a key, so Resend sends them only once.
  const fingerprint = createHash("sha256")
    .update([data.name, data.grade, data.email.toLowerCase(), data.phone, data.program, data.level, data.goal, data.message].join("|"))
    .digest("hex")

  const resend = new Resend(apiKey)
  const { data: sent, error } = await resend.emails.send(
    {
      from: `AhmedPrep Website <consultations@${domain}>`,
      to: [RECIPIENT],
      replyTo: data.email,
      subject: `New consultation request: ${data.program} (${data.name})`,
      text,
      html,
    },
    { idempotencyKey: `consultation-request/${fingerprint}` },
  )

  if (error || !sent?.id) {
    console.error("[contact] Resend delivery failed:", error?.name, error?.message)
    return fail(502, "Delivery failed.")
  }

  console.log("[contact] Consultation request delivered, Resend id:", sent.id)
  return NextResponse.json({ success: true })
}

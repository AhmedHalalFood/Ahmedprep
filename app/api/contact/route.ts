import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const RECIPIENT = "Tariq@ahmedprep.com"
const DEFAULT_FROM = "AhmedPrep Website <onboarding@resend.dev>"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PROGRAMS = new Set(["SHSAT", "Digital SAT"])
const MIN_FILL_MS = 3000
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5

// Best-effort per-instance limiter; Resend idempotency keys handle cross-instance duplicates.
const submissionsByIp = new Map<string, number[]>()

const clean = (value: unknown, max = 200) =>
  typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : ""

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    submissionsByIp.set(ip, recent)
    return true
  }
  recent.push(now)
  submissionsByIp.set(ip, recent)
  return false
}

const fail = (status: number, error: string) => NextResponse.json({ success: false, error }, { status })

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return fail(400, "Invalid request.")
  }

  // Honeypot / timing traps: pretend success so bots don't adapt, but send nothing.
  const honeypot = clean(body.company)
  const startedAt = Number(body.startedAt)
  if (honeypot || (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS)) {
    console.warn("[contact] Submission blocked by spam filter")
    return NextResponse.json({ success: true })
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (isRateLimited(ip)) {
    return fail(429, "Too many requests. Please try again later.")
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

  const errors: string[] = []
  if (!data.name) errors.push("name")
  if (!data.grade) errors.push("grade")
  if (!EMAIL_PATTERN.test(data.email)) errors.push("email")
  if (data.phone && data.phone.replace(/\D/g, "").length < 10) errors.push("phone")
  if (!PROGRAMS.has(data.program)) errors.push("program")
  if (errors.length) {
    return NextResponse.json({ success: false, error: "Please complete all required fields.", fields: errors }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not configured; consultation request was NOT delivered")
    return fail(500, "Delivery failed.")
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
    ["Date/time submitted", `${submittedAt} (ET)`],
  ]

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n")
  const html = `<div style="font-family:Arial,sans-serif;color:#0b1d35">
<h2 style="margin:0 0 16px">New consultation request</h2>
<table cellpadding="8" style="border-collapse:collapse;font-size:14px">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="border:1px solid #d9d3c8;font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="border:1px solid #d9d3c8;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table></div>`

  const fingerprint = createHash("sha256")
    .update(JSON.stringify([data.name, data.email, data.phone, data.program, data.level, data.goal, data.message]).toLowerCase())
    .digest("hex")

  const resend = new Resend(apiKey)
  const { data: sent, error } = await resend.emails.send(
    {
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [RECIPIENT],
      replyTo: data.email,
      subject: `New consultation request: ${data.name} (${data.program})`,
      text,
      html,
    },
    { idempotencyKey: `consultation/${fingerprint}` },
  )

  if (error) {
    // 409 means an identical request was already accepted within 24h — treat as delivered.
    if (error.statusCode === 409) {
      return NextResponse.json({ success: true, duplicate: true })
    }
    console.error("[contact] Resend delivery failed:", { name: error.name, message: error.message })
    return fail(502, "Delivery failed.")
  }

  console.log("[contact] Consultation request delivered", { id: sent?.id })
  return NextResponse.json({ success: true })
}

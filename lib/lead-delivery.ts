import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { pool } from "@/lib/db"

// Shared email delivery for every lead form. Database storage for those forms lives in lib/lead-storage.ts.
const RECIPIENT = "Tariq@ahmedprep.com"
const MIN_FILL_MS = 1500
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PROGRAMS = new Set(["SHSAT", "Digital SAT"])

// Fallback limiter, used only if the shared one in Neon is unreachable. Duplicate sends are also blocked by Resend idempotency keys.
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

function countInMemory(key: string) {
  const now = Date.now()
  const hits = (recentByKey.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs)
  hits.push(now)
  recentByKey.set(key, hits)
  return hits.length
}

/** Fixed-window counter shared by every server instance. The bucket stores a hash, never the raw IP address. */
async function countShared(key: string) {
  const { rows } = await pool.query<{ hits: number }>(
    `INSERT INTO form_rate_limits (bucket, window_start, hits) VALUES ($1, now(), 1)
     ON CONFLICT (bucket) DO UPDATE SET
       hits = CASE WHEN form_rate_limits.window_start < now() - make_interval(secs => $2) THEN 1
                   ELSE form_rate_limits.hits + 1 END,
       window_start = CASE WHEN form_rate_limits.window_start < now() - make_interval(secs => $2) THEN now()
                           ELSE form_rate_limits.window_start END
     RETURNING hits`,
    [createHash("sha256").update(key).digest("hex"), RATE_LIMIT.windowMs / 1000],
  )
  return rows[0].hits
}

/** Returns an error response if the submission looks like spam or exceeds the rate limit. */
export async function screenSubmission(request: Request, body: Record<string, unknown>, scope: string) {
  const elapsed = Number(body.elapsedMs)
  if (clean(body.website) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    console.warn(`[${scope}] Rejected likely spam submission`)
    return fail(400, "Invalid request.")
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const key = `${scope}:${ip}`
  let hits: number
  try {
    hits = await countShared(key)
  } catch (error) {
    // A database hiccup must never block a real parent, so fall back to this instance's own counter.
    console.warn(`[${scope}] Shared rate limit unavailable, using in-memory limit:`, error instanceof Error ? error.message : error)
    hits = countInMemory(key)
  }
  if (hits > RATE_LIMIT.max) {
    console.warn(`[${scope}] Rate limit exceeded`)
    return fail(429, "Too many requests.")
  }
  return null
}

export type Confirmation = {
  to: string
  subject: string
  heading: string
  paragraphs: string[]
  /** Optional button inserted after the paragraph at `afterParagraph`. Only https links are rendered. */
  link?: { label: string; href: string; afterParagraph: number }
}

function confirmationBody({ heading, paragraphs, link }: Confirmation) {
  const safeLink = link && /^https:\/\//i.test(link.href) ? link : undefined
  const textParts = ["AhmedPrep.com", heading, ...paragraphs]
  const htmlParts = paragraphs.map((p) => `<p style="margin:0 0 14px;white-space:pre-wrap">${escapeHtml(p)}</p>`)
  if (safeLink) {
    textParts.splice(safeLink.afterParagraph + 3, 0, `${safeLink.label}: ${safeLink.href}`)
    htmlParts.splice(
      safeLink.afterParagraph + 1,
      0,
      `<p style="margin:0 0 18px"><a href="${escapeHtml(safeLink.href)}" style="display:inline-block;background:#f2b31a;color:#0b1d35;font-weight:bold;text-decoration:none;padding:12px 20px">${escapeHtml(safeLink.label)}</a></p>`,
    )
  }
  return {
    text: textParts.join("\n\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#0b1d35;line-height:1.6;max-width:560px;border-top:4px solid #f2b31a">
<p style="margin:0;padding:16px 0 4px;font-size:20px;font-weight:800;letter-spacing:-0.02em"><a href="https://ahmedprep.com" style="color:#0b1d35;text-decoration:none">AhmedPrep<span style="color:#1d4ed8">.com</span></a></p>
<h2 style="margin:0 0 16px">${escapeHtml(heading)}</h2>
${htmlParts.join("\n")}
<p style="margin:24px 0 0;padding-top:12px;border-top:1px solid #e5e7eb;font-size:12px;color:#5b6474">AhmedPrep.com · SHSAT &amp; Digital SAT Prep</p>
</div>`,
  }
}

export type LeadEmail = {
  scope: string
  fromLocalPart: string
  heading: string
  subject: string
  replyTo: string
  rows: [string, string][]
  /** Optional courtesy email to the submitter, sent only after AhmedPrep's notification succeeds. */
  confirmation?: Confirmation
  /** Values that identify one registration. Repeat submissions with the same values are treated as duplicates. Defaults to all row values. */
  dedupeKey?: string[]
  /** Extra admin-only text added to the "confirmation not delivered" alert, e.g. a signed resend link. */
  failureAlertNote?: string
  /**
   * Called after each delivery stage so the caller can record it immediately. Errors thrown here are logged and
   * never block or repeat delivery.
   */
  onDelivery?: (event: DeliveryEvent) => Promise<void>
  /**
   * Set when the submission is already saved in the database. A failed notification then still reports success to
   * the submitter (their request is safely stored) and AhmedPrep gets a separate alert instead.
   */
  persisted?: { label: string }
}

export type ConfirmationStatus = "sent" | "failed" | "not_requested"

export type DeliveryEvent =
  | { stage: "admin"; ok: true }
  | { stage: "admin"; ok: false; error: string }
  | { stage: "confirmation"; status: ConfirmationStatus; error?: string }

// Resend rejects a reused idempotency key with these codes, meaning the original request already went through or is in flight.
const DUPLICATE_ERRORS = new Set(["invalid_idempotent_request", "concurrent_idempotent_requests"])

// Resend's own test inboxes. Submissions from these never reach a real person, so the admin copy goes there too.
const isTestAddress = (email: string) => /@resend\.dev$/i.test(email)

export async function deliverLead({
  scope,
  fromLocalPart,
  heading,
  subject,
  replyTo,
  rows,
  confirmation,
  dedupeKey,
  failureAlertNote,
  onDelivery,
  persisted,
}: LeadEmail) {
  const savedButNotNotified = async (reason: string, alertKey: string) => {
    console.error(`[${scope}] ${persisted?.label} saved, but AhmedPrep was not notified (${reason}); submitter told it was received`)
    const alerted = await sendAdminAlert({
      scope,
      fromLocalPart,
      replyTo,
      subject: `ACTION NEEDED: ${heading} saved, but the notification email failed`,
      text: [
        `A new submission was saved in the database as ${persisted?.label}, but the normal notification email could not be sent (${reason}).`,
        confirmation
          ? `The submitter was told their request was received and that their confirmation email may be delayed. No confirmation was sent to ${confirmation.to}. Please follow up with them.`
          : "The submitter was told their request was received. Please follow up with them.",
        ...(failureAlertNote ? ["", failureAlertNote] : []),
        "",
        ...rows.map(([label, value]) => `${label}: ${value}`),
      ].join("\n"),
      idempotencyKey: alertKey,
    })
    if (!alerted) console.error(`[${scope}] Alert for ${persisted?.label} also failed; the record is flagged as not notified`)
    // Not attempted, so the record is flagged for follow-up instead of being left as pending.
    const confirmationStatus: ConfirmationStatus = confirmation ? "failed" : "not_requested"
    if (confirmation) await record({ stage: "confirmation", status: "failed", error: `confirmation: not attempted (${reason})` })
    return NextResponse.json({ success: true, duplicate: false, saved: true, notified: false, confirmation: confirmationStatus })
  }

  const record = async (event: DeliveryEvent) => {
    if (!onDelivery) return
    try {
      await onDelivery(event)
    } catch (err) {
      console.error(`[${scope}] Could not record ${event.stage} delivery:`, err instanceof Error ? err.message : err)
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!apiKey || !domain) {
    console.error(`[${scope}] Email delivery is not configured: RESEND_API_KEY or RESEND_EMAIL_DOMAIN is missing`)
    await record({ stage: "admin", ok: false, error: "email_not_configured" })
    if (persisted) return savedButNotNotified("email_not_configured", `${scope}-notify-failed/${persisted.label}`)
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
    .update((dedupeKey ?? rows.map(([, value]) => value)).map((v) => v.trim().toLowerCase()).join("|"))
    .digest("hex")

  const testMode = isTestAddress(replyTo)
  const resend = new Resend(apiKey)
  const { data: sent, error } = await resend.emails.send(
    {
      from: `AhmedPrep Website <${fromLocalPart}@${domain}>`,
      to: [testMode ? "delivered@resend.dev" : RECIPIENT],
      replyTo,
      subject: testMode ? `[TEST] ${subject}` : subject,
      text,
      html,
    },
    { idempotencyKey: `${scope}/${fingerprint}` },
  )

  const duplicate = Boolean(error && DUPLICATE_ERRORS.has(error.name))
  if (duplicate) {
    console.warn(`[${scope}] Duplicate submission; AhmedPrep already has this registration`)
  } else if (error || !sent?.id) {
    console.error(`[${scope}] Resend delivery failed:`, error?.name, error?.message)
    await record({ stage: "admin", ok: false, error: error?.name ?? "no_message_id" })
    if (persisted) return savedButNotNotified(error?.name ?? "no_message_id", `${scope}-notify-failed/${fingerprint}`)
    return fail(502, "Delivery failed.")
  } else {
    console.log(`[${scope}] Delivered${testMode ? " (test mode)" : ""}, Resend id:`, sent.id)
  }
  // Recorded before the confirmation is attempted, so a later failure can never cause AhmedPrep to be notified twice.
  await record({ stage: "admin", ok: true })

  let confirmationStatus: ConfirmationStatus = "not_requested"

  if (confirmation) {
    // AhmedPrep already has the lead, so a failed confirmation keeps the registration and is reported, not treated as a failed registration.
    // The confirmation body is deterministic, so a repeat submission reuses the same key and Resend never sends it twice.
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
    if (confirmed?.id || (confirmError && DUPLICATE_ERRORS.has(confirmError.name))) {
      confirmationStatus = "sent"
      console.log(`[${scope}] Confirmation delivered, Resend id:`, confirmed?.id ?? "(already sent)")
    } else {
      confirmationStatus = "failed"
      console.error(`[${scope}] Confirmation email failed:`, confirmError?.name, confirmError?.message)
      const { error: alertError } = await resend.emails.send(
        {
          from: `AhmedPrep Website <${fromLocalPart}@${domain}>`,
          to: [testMode ? "delivered@resend.dev" : RECIPIENT],
          replyTo,
          subject: `${testMode ? "[TEST] " : ""}ACTION NEEDED: confirmation email not delivered (${confirmation.to})`,
          text: `The registration below was saved, but the automatic confirmation email to ${confirmation.to} could not be sent (${confirmError?.name ?? "unknown error"}). ${failureAlertNote ? `\n\n${failureAlertNote}` : " Please send the class details manually."}\n\n${text}`,
        },
        { idempotencyKey: `${scope}-confirmation-alert/${fingerprint}` },
      )
      if (alertError && !DUPLICATE_ERRORS.has(alertError.name)) {
        console.error(`[${scope}] Confirmation failure alert also failed:`, alertError.name)
      }
    }
    await record({
      stage: "confirmation",
      status: confirmationStatus,
      error: confirmationStatus === "failed" ? `confirmation: ${confirmError?.name ?? "unknown error"}` : undefined,
    })
  } else {
    await record({ stage: "confirmation", status: "not_requested" })
  }

  return NextResponse.json({ success: true, duplicate, confirmation: confirmationStatus })
}

/** Sends a standalone alert to AhmedPrep. The idempotency key keeps a repeated failure from alerting twice. */
export async function sendAdminAlert({
  scope,
  fromLocalPart,
  subject,
  text,
  replyTo,
  idempotencyKey,
}: {
  scope: string
  fromLocalPart: string
  subject: string
  text: string
  replyTo: string
  idempotencyKey: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!apiKey || !domain) return false
  const testMode = isTestAddress(replyTo)
  const { error } = await new Resend(apiKey).emails.send(
    {
      from: `AhmedPrep Website <${fromLocalPart}@${domain}>`,
      to: [testMode ? "delivered@resend.dev" : RECIPIENT],
      replyTo,
      subject: `${testMode ? "[TEST] " : ""}${subject}`,
      text,
    },
    { idempotencyKey },
  )
  if (error && !DUPLICATE_ERRORS.has(error.name)) {
    console.error(`[${scope}] Admin alert failed:`, error.name, error.message)
    return false
  }
  return true
}

/** Sends only the parent confirmation (used by the admin resend). The caller supplies a per-attempt idempotency key. */
export async function sendConfirmationEmail(confirmation: Confirmation, fromLocalPart: string, idempotencyKey: string) {
  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  if (!apiKey || !domain) return { ok: false as const, error: "Email delivery is not configured." }
  const { data, error } = await new Resend(apiKey).emails.send(
    {
      from: `AhmedPrep <${fromLocalPart}@${domain}>`,
      to: [confirmation.to],
      replyTo: RECIPIENT,
      subject: confirmation.subject,
      ...confirmationBody(confirmation),
    },
    { idempotencyKey },
  )
  if (data?.id) return { ok: true as const, id: data.id }
  if (error && DUPLICATE_ERRORS.has(error.name)) return { ok: true as const, id: null }
  console.error("[confirmation-resend] Resend failed:", error?.name, error?.message)
  return { ok: false as const, error: error?.name ?? "unknown error" }
}

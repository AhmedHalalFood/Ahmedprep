import "server-only"
import { createHash, randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { clean, deliverLead, fail, sendAdminAlert, type LeadEmail } from "@/lib/lead-delivery"
import { describeDbError, withDbRetry } from "@/lib/sunday-registrations"

// "enrollment_2027" requires db/migrations/0004_enrollment_2027_form_type.sql.
export type LeadFormType = "diagnostic" | "contact" | "referral" | "shsat_intensive" | "enrollment_2027"

type LeadRecord = {
  contactName: string
  contactEmail: string
  contactPhone: string
  studentName?: string | null
  program?: string | null
  /** Every validated field, stored as submitted. */
  payload: Record<string, string>
}

type Claim = { kind: "deliver"; id: number } | { kind: "duplicate"; id: number; confirmation: string | null }

/**
 * Parent confirmation results are kept inside the existing payload jsonb under these reserved keys, so no schema
 * change is needed. They are written after insert and never feed the idempotency key, which is computed from the
 * submitted fields only.
 */
export const CONFIRMATION_KEYS = {
  status: "_parentConfirmation",
  at: "_parentConfirmationAt",
  error: "_parentConfirmationError",
  resendStartedAt: "_confirmationResendStartedAt",
  resendCount: "_confirmationResendCount",
} as const

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
// Long enough to cover a slow Resend call; after this a stalled attempt can be taken over by a retry.
const LEASE_SECONDS = 120

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex")

/**
 * The browser sends one random id per filled-in form, so double clicks and network retries share a key, while a
 * genuinely new or edited submission does not. Without a valid id (an old cached page), identical content dedupes.
 */
export function leadIdempotencyKey(formType: LeadFormType, submissionId: string, payload: Record<string, string>) {
  const contentHash = sha256(
    Object.keys(payload)
      .sort()
      .map((key) => `${key}=${payload[key].trim().toLowerCase()}`)
      .join("|"),
  )
  const clientId = UUID_PATTERN.test(submissionId) ? submissionId.toLowerCase() : "no-client-id"
  return sha256(`${formType}|${clientId}|${contentHash}`)
}

/**
 * Saves the submission, or finds the one already saved under the same key. The original row is never overwritten.
 * Returns "deliver" only to the one request that holds the delivery lease and only while AhmedPrep has not been
 * notified, so concurrent repeats can never both send the notification. Re-running with the same lease token (the
 * database retry) is recognised as the same request.
 */
async function claimLead(formType: LeadFormType, idempotencyKey: string, lease: string, record: LeadRecord): Promise<Claim> {
  const { rows } = await pool.query<{ id: string; owns: boolean; confirmation: string | null }>(
    `INSERT INTO lead_submissions
       (form_type, idempotency_key, contact_name, contact_email, contact_phone, student_name, program, payload,
        delivery_lease, delivery_started_at, delivery_attempts)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, now(), 1)
     ON CONFLICT (idempotency_key) DO UPDATE SET
       duplicate_attempts = lead_submissions.duplicate_attempts
         + CASE WHEN lead_submissions.delivery_lease = EXCLUDED.delivery_lease THEN 0 ELSE 1 END,
       delivery_attempts = lead_submissions.delivery_attempts
         + CASE WHEN lead_submissions.admin_notified_at IS NULL
                 AND lead_submissions.delivery_lease IS DISTINCT FROM EXCLUDED.delivery_lease
                 AND (lead_submissions.delivery_started_at IS NULL
                      OR lead_submissions.delivery_started_at < now() - make_interval(secs => ${LEASE_SECONDS}))
                THEN 1 ELSE 0 END,
       delivery_started_at = CASE WHEN lead_submissions.admin_notified_at IS NULL
                 AND lead_submissions.delivery_lease IS DISTINCT FROM EXCLUDED.delivery_lease
                 AND (lead_submissions.delivery_started_at IS NULL
                      OR lead_submissions.delivery_started_at < now() - make_interval(secs => ${LEASE_SECONDS}))
                THEN now() ELSE lead_submissions.delivery_started_at END,
       delivery_lease = CASE WHEN lead_submissions.admin_notified_at IS NULL
                 AND (lead_submissions.delivery_lease = EXCLUDED.delivery_lease
                      OR lead_submissions.delivery_started_at IS NULL
                      OR lead_submissions.delivery_started_at < now() - make_interval(secs => ${LEASE_SECONDS}))
                THEN EXCLUDED.delivery_lease ELSE lead_submissions.delivery_lease END,
       updated_at = now()
     RETURNING id, (admin_notified_at IS NULL AND delivery_lease = $9) AS owns,
               payload->>'${CONFIRMATION_KEYS.status}' AS confirmation`,
    [
      formType,
      idempotencyKey,
      record.contactName,
      record.contactEmail,
      record.contactPhone,
      record.studentName || null,
      record.program || null,
      JSON.stringify(record.payload),
      lease,
    ],
  )
  const row = rows[0]
  return row.owns ? { kind: "deliver", id: Number(row.id) } : { kind: "duplicate", id: Number(row.id), confirmation: row.confirmation }
}

/** Records the parent confirmation result without touching the submitted fields or the admin delivery status. */
export async function setLeadConfirmation(id: number, status: "sent" | "failed" | "not_requested", error?: string | null) {
  await pool.query(
    `UPDATE lead_submissions
     SET payload = payload || jsonb_build_object('${CONFIRMATION_KEYS.status}', $2::text,
                                                 '${CONFIRMATION_KEYS.at}', now()::text,
                                                 '${CONFIRMATION_KEYS.error}', coalesce($3::text, '')),
         updated_at = now()
     WHERE id = $1`,
    [id, status, error ? error.slice(0, 200) : null],
  )
}

export type StoredLead = {
  id: number
  formType: string
  contactEmail: string
  createdAt: string
  payload: Record<string, string>
}

export async function getLead(id: number): Promise<StoredLead | null> {
  const { rows } = await pool.query<{ id: string; form_type: string; contact_email: string; created_at: Date; payload: Record<string, string> }>(
    `SELECT id, form_type, contact_email, created_at, payload FROM lead_submissions WHERE id = $1`,
    [id],
  )
  const row = rows[0]
  return row
    ? { id: Number(row.id), formType: row.form_type, contactEmail: row.contact_email, createdAt: row.created_at.toISOString(), payload: row.payload }
    : null
}

/**
 * Claims one admin resend attempt. Returns the attempt number, or null if another attempt started in the last two
 * minutes (a double click), so the family never receives two copies.
 */
export async function claimLeadResendAttempt(id: number): Promise<number | null> {
  const { rows } = await pool.query<{ attempt: string }>(
    `UPDATE lead_submissions
     SET payload = payload || jsonb_build_object(
           '${CONFIRMATION_KEYS.resendStartedAt}', now()::text,
           '${CONFIRMATION_KEYS.resendCount}', (coalesce(payload->>'${CONFIRMATION_KEYS.resendCount}', '0')::int + 1)::text),
         updated_at = now()
     WHERE id = $1
       AND (payload->>'${CONFIRMATION_KEYS.resendStartedAt}' IS NULL
            OR (payload->>'${CONFIRMATION_KEYS.resendStartedAt}')::timestamptz < now() - interval '2 minutes')
     RETURNING payload->>'${CONFIRMATION_KEYS.resendCount}' AS attempt`,
    [id],
  )
  return rows[0] ? Number(rows[0].attempt) : null
}

/** Keeps the first notification time, so a retried request never moves it. */
async function markLeadNotified(id: number) {
  await pool.query(
    `UPDATE lead_submissions
     SET delivery_status = 'notified', admin_notified_at = coalesce(admin_notified_at, now()),
         last_delivery_error = NULL, delivery_lease = NULL, updated_at = now()
     WHERE id = $1`,
    [id],
  )
}

/** Releases the lease so a later retry can try again. Never downgrades a lead that was already notified. */
async function markLeadFailed(id: number, error: string) {
  await pool.query(
    `UPDATE lead_submissions
     SET delivery_status = CASE WHEN admin_notified_at IS NULL THEN 'failed' ELSE delivery_status END,
         last_delivery_error = $2, delivery_lease = NULL, delivery_started_at = NULL, updated_at = now()
     WHERE id = $1`,
    [id, `admin: ${error}`.slice(0, 200)],
  )
}

/**
 * Saves the inquiry in Neon first, then sends AhmedPrep's notification.
 * - Not saved (database unreachable after one retry): the submitter is asked to try again and AhmedPrep is alerted
 *   with the details, so the lead is not lost.
 * - Saved but the notification failed: the submitter is told it went through (it did), the row is marked failed,
 *   and AhmedPrep is alerted separately.
 */
export async function saveAndDeliverLead({
  formType,
  submissionId,
  record,
  email,
  failureAlertNoteFor,
}: {
  formType: LeadFormType
  submissionId: unknown
  record: LeadRecord
  email: Omit<LeadEmail, "dedupeKey" | "onDelivery" | "persisted">
  /** Admin-only note (e.g. a signed resend link) for the stored row, added to delivery-failure alerts. */
  failureAlertNoteFor?: (leadId: number) => string | undefined
}) {
  const idempotencyKey = leadIdempotencyKey(formType, clean(submissionId, 64), record.payload)
  const lease = randomUUID()

  let claim: Claim
  try {
    claim = await withDbRetry(() => claimLead(formType, idempotencyKey, lease, record))
  } catch (error) {
    console.error(`[${email.scope}] Inquiry NOT saved, submitter asked to retry: ${describeDbError(error)}`)
    await sendAdminAlert({
      scope: email.scope,
      fromLocalPart: email.fromLocalPart,
      replyTo: email.replyTo,
      subject: `ACTION NEEDED: ${email.heading} could not be saved`,
      text: [
        "Someone submitted the form below, but the database was unavailable, so it was NOT saved.",
        "They were shown an error and asked to try again. If a normal notification for this person arrives later, no action is needed. Otherwise, please contact them.",
        "",
        ...email.rows.map(([label, value]) => `${label}: ${value}`),
      ].join("\n"),
      idempotencyKey: `${email.scope}-unsaved/${idempotencyKey}`,
    })
    return fail(503, "Your request could not be saved. Please try again in a few minutes.")
  }

  if (claim.kind === "duplicate") {
    console.warn(`[${email.scope}] Repeat submission for lead #${claim.id}; original kept, no email sent`)
    // Report the original confirmation only when it was recorded as sent; anything else stays "unconfirmed".
    const confirmation = claim.confirmation === "sent" ? { confirmation: "sent" } : {}
    return NextResponse.json({ success: true, duplicate: true, saved: true, ...confirmation })
  }

  const leadId = claim.id
  const failureAlertNote = failureAlertNoteFor?.(leadId) ?? email.failureAlertNote
  return deliverLead({
    ...email,
    failureAlertNote,
    // Ties Resend's own 24-hour idempotency to the stored row, a second guard against a double send.
    dedupeKey: [idempotencyKey],
    persisted: { label: `lead_submissions #${leadId}` },
    onDelivery: async (event) => {
      if (event.stage === "admin") {
        await withDbRetry(() => (event.ok ? markLeadNotified(leadId) : markLeadFailed(leadId, event.error)))
      } else if (email.confirmation) {
        await withDbRetry(() => setLeadConfirmation(leadId, event.status, event.error))
      }
    },
  })
}

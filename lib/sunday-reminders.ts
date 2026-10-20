import "server-only"
import { Resend } from "resend"
import { pool } from "@/lib/db"
import { getZoomLink } from "@/lib/class-zoom-links"
import { assertWritableDatabase, reminderDeliveryMode, type DeliveryMode } from "@/lib/db-environment"
import { getClassByDate, type RsvpProgram } from "@/lib/free-class"
import { buildReminderEmail, type ZoomDetails } from "@/lib/reminder-emails"
import { dueSlotFor, isSlotOpen, newYorkClock, REMINDER_WINDOWS, type ReminderSlot } from "@/lib/reminder-schedule"

const ADMIN_INBOX = "Tariq@ahmedprep.com"
const MAX_ATTEMPTS = 3
/** Each scheduler run stays well inside cron-job.org's 30-second limit; the catch-up run finishes anything left. */
const RUN_BUDGET_MS = 20_000
const BATCH_LIMIT = 25
/** Keeps sends under Resend's default rate limit. */
const SEND_SPACING_MS = 550

type Candidate = {
  id: number
  classDate: string
  program: RsvpProgram
  studentName: string
  parentName: string
  parentEmail: string
}

type Trigger = "scheduler" | "late-registration"
type SendOutcome = "sent" | "already-handled" | "failed" | "no-recipient"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const domain = process.env.RESEND_EMAIL_DOMAIN
  return apiKey && domain ? { resend: new Resend(apiKey), from: `AhmedPrep <reminders@${domain}>` } : null
}

/** Registrations for a class that still need this reminder: not excluded, not already sent, not out of retries. */
async function findCandidates(classDate: string, slot: ReminderSlot, mode: DeliveryMode["mode"], limit: number) {
  const { rows } = await pool.query<Candidate>(
    `SELECT r.id::int AS id, r.class_date::text AS "classDate", r.program, r.student_name AS "studentName",
            r.parent_name AS "parentName", r.parent_email AS "parentEmail"
       FROM sunday_class_registrations r
      WHERE r.class_date = $1
        AND r.program IN ('shsat', 'digital_sat')
        AND NOT EXISTS (SELECT 1 FROM sunday_reminder_exclusions x WHERE x.registration_id = r.id)
        AND NOT EXISTS (
          SELECT 1 FROM sunday_reminder_deliveries d
           WHERE d.registration_id = r.id AND d.slot = $2 AND d.mode = $3
             AND (d.status = 'sent'
                  OR (d.status = 'failed' AND d.attempts >= ${MAX_ATTEMPTS})
                  OR (d.status = 'sending' AND d.updated_at > now() - interval '10 minutes')))
      ORDER BY r.id
      LIMIT $4`,
    [classDate, slot, mode, limit],
  )
  return rows
}

/**
 * Atomically takes ownership of one reminder. Only one caller can ever win the row, so overlapping scheduler runs or a
 * late registration racing the scheduler cannot send twice. A reminder stuck in "sending" (the process died mid-send)
 * keeps its original Resend idempotency key, so Resend itself refuses to send that copy again.
 */
async function claim(candidate: Candidate, slot: ReminderSlot, mode: DeliveryMode["mode"], recipient: string, trigger: Trigger) {
  const baseKey = `sunday-reminder/${mode}/${candidate.id}/${slot}`
  const { rows } = await pool.query<{ id: number; idempotency_key: string }>(
    `INSERT INTO sunday_reminder_deliveries AS d (registration_id, slot, mode, status, idempotency_key, recipient, trigger)
     VALUES ($1, $2, $3, 'sending', $4, $5, $6)
     ON CONFLICT (registration_id, slot, mode) DO UPDATE
        SET status = 'sending',
            attempts = d.attempts + 1,
            idempotency_key = CASE WHEN d.status = 'failed' THEN $4 || '/retry-' || (d.attempts + 1) ELSE d.idempotency_key END,
            recipient = EXCLUDED.recipient,
            trigger = EXCLUDED.trigger,
            error = NULL,
            updated_at = now()
      WHERE (d.status = 'failed' AND d.attempts < ${MAX_ATTEMPTS})
         OR (d.status = 'sending' AND d.updated_at < now() - interval '10 minutes')
     RETURNING d.id::int AS id, d.idempotency_key`,
    [candidate.id, slot, mode, baseKey, recipient, trigger],
  )
  return rows[0] ?? null
}

async function finish(deliveryId: number, ok: boolean, detail: string | null) {
  await pool.query(
    ok
      ? "UPDATE sunday_reminder_deliveries SET status = 'sent', resend_id = $2, sent_at = now(), updated_at = now() WHERE id = $1"
      : "UPDATE sunday_reminder_deliveries SET status = 'failed', error = $2, updated_at = now() WHERE id = $1",
    [deliveryId, detail],
  )
}

async function sendOne(candidate: Candidate, slot: ReminderSlot, zoom: ZoomDetails, trigger: Trigger): Promise<SendOutcome> {
  const delivery = reminderDeliveryMode()
  const recipient = delivery.mode === "live" ? candidate.parentEmail : delivery.testRecipient
  if (!recipient) return "no-recipient"
  const email = emailConfig()
  const session = getClassByDate(candidate.classDate)
  if (!email || !session) return "failed"

  const claimed = await claim(candidate, slot, delivery.mode, recipient, trigger)
  if (!claimed) return "already-handled"

  const message = buildReminderEmail({
    slot,
    session,
    program: candidate.program,
    parentName: candidate.parentName,
    studentName: candidate.studentName,
    zoom,
    testNote: delivery.mode === "test" ? `Registration #${candidate.id}. The live email would go to ${candidate.parentEmail}.` : undefined,
  })
  const { data, error } = await email.resend.emails.send(
    { from: email.from, to: [recipient], replyTo: ADMIN_INBOX, ...message },
    { idempotencyKey: claimed.idempotency_key },
  )
  // A duplicate-key response means Resend already accepted this exact reminder earlier.
  const duplicate = error?.name === "invalid_idempotent_request" || error?.name === "concurrent_idempotent_requests"
  if (data?.id || duplicate) {
    await finish(claimed.id, true, data?.id ?? null)
    return "sent"
  }
  console.error(`[sunday-reminders] ${slot} reminder failed for registration ${candidate.id}:`, error?.name, error?.message)
  await finish(claimed.id, false, error?.name ?? "unknown error")
  return "failed"
}

/** Tells AhmedPrep (or the test inbox) once per class, program, and slot that families are waiting on a missing Zoom link. */
async function alertMissingZoom(classDate: string, program: RsvpProgram, slot: ReminderSlot, waiting: number) {
  const delivery = reminderDeliveryMode()
  const to = delivery.mode === "live" ? ADMIN_INBOX : delivery.testRecipient
  const email = emailConfig()
  if (!to || !email) return
  const label = program === "shsat" ? "SHSAT" : "Digital SAT"
  const { error } = await email.resend.emails.send(
    {
      from: email.from,
      to: [to],
      subject: `${delivery.mode === "test" ? "[TEST] " : ""}ACTION NEEDED: add the Zoom link for ${label} on ${classDate}`,
      text: `${waiting} registered ${label} famil${waiting === 1 ? "y is" : "ies are"} waiting for the ${REMINDER_WINDOWS[slot].label} reminder, but no Zoom link is saved for this class.\n\nAdd it at https://ahmedprep.com/admin/classes. The catch-up run will send the reminders once the link is saved.`,
    },
    { idempotencyKey: `zoom-missing/${delivery.mode}/${classDate}/${program}/${slot}` },
  )
  if (error && error.name !== "invalid_idempotent_request") console.error("[sunday-reminders] Missing-Zoom alert failed:", error.name)
}

export type RunReport = {
  slot: ReminderSlot
  newYorkTime: string
  classDate: string
  mode: DeliveryMode["mode"]
  status: "sent" | "outside-window" | "dry-run" | "not-configured"
  pending: number
  sent: number
  failed: number
  alreadyHandled: number
  missingZoom: string[]
  remaining: boolean
}

/** One scheduler run: sends this slot's reminder to every eligible registration for today's class. */
export async function runReminderSlot(slot: ReminderSlot, { now = new Date(), dryRun = false } = {}): Promise<RunReport> {
  const ny = newYorkClock(now)
  const delivery = reminderDeliveryMode()
  const base: RunReport = {
    slot,
    newYorkTime: `${ny.isoDate} ${String(Math.floor(ny.minutes / 60)).padStart(2, "0")}:${String(ny.minutes % 60).padStart(2, "0")}`,
    classDate: ny.isoDate,
    mode: delivery.mode,
    status: "sent",
    pending: 0,
    sent: 0,
    failed: 0,
    alreadyHandled: 0,
    missingZoom: [],
    remaining: false,
  }
  if (!isSlotOpen(slot, now)) return { ...base, status: "outside-window" }
  if (delivery.mode === "test" && !delivery.testRecipient) return { ...base, status: "not-configured" }

  await assertWritableDatabase()
  const started = Date.now()
  const candidates = await findCandidates(ny.isoDate, slot, delivery.mode, BATCH_LIMIT + 1)
  base.remaining = candidates.length > BATCH_LIMIT
  const batch = candidates.slice(0, BATCH_LIMIT)
  base.pending = batch.length
  if (dryRun) return { ...base, status: "dry-run" }

  const zoomByProgram = new Map<RsvpProgram, ZoomDetails | null>()
  for (const candidate of batch) {
    if (Date.now() - started > RUN_BUDGET_MS) {
      base.remaining = true
      break
    }
    if (!zoomByProgram.has(candidate.program)) zoomByProgram.set(candidate.program, await getZoomLink(ny.isoDate, candidate.program))
    const zoom = zoomByProgram.get(candidate.program)
    if (!zoom) continue
    const outcome = await sendOne(candidate, slot, zoom, "scheduler")
    if (outcome === "sent") base.sent++
    else if (outcome === "failed") base.failed++
    else if (outcome === "already-handled") base.alreadyHandled++
    if (outcome === "sent" || outcome === "failed") await sleep(SEND_SPACING_MS)
  }

  for (const [program, zoom] of zoomByProgram) {
    if (zoom) continue
    base.missingZoom.push(program)
    await alertMissingZoom(ny.isoDate, program, slot, batch.filter((c) => c.program === program).length)
  }
  return base
}

/**
 * Called right after a registration is saved. On class day after 10:00 AM ET, the family would otherwise miss the
 * scheduled reminder, so the reminder that is due now is sent immediately through the same once-only claim.
 */
export async function sendDueReminderForRegistration(registrationId: number, now = new Date()) {
  const { rows } = await pool.query<Candidate & { excluded: boolean }>(
    `SELECT r.id::int AS id, r.class_date::text AS "classDate", r.program, r.student_name AS "studentName",
            r.parent_name AS "parentName", r.parent_email AS "parentEmail",
            EXISTS (SELECT 1 FROM sunday_reminder_exclusions x WHERE x.registration_id = r.id) AS excluded
       FROM sunday_class_registrations r WHERE r.id = $1`,
    [registrationId],
  )
  const registration = rows[0]
  if (!registration || registration.excluded) return null
  const slot = dueSlotFor(registration.classDate, now)
  if (!slot) return null
  await assertWritableDatabase()
  const zoom = await getZoomLink(registration.classDate, registration.program)
  if (!zoom) {
    await alertMissingZoom(registration.classDate, registration.program, slot, 1)
    return { slot, outcome: "missing-zoom" as const }
  }
  return { slot, outcome: await sendOne(registration, slot, zoom, "late-registration") }
}

/** Admin preview: sends one reminder to EMAIL_TEST_RECIPIENT only, with sample names. Nothing is recorded. */
export async function sendAdminTestReminder(classDate: string, program: RsvpProgram, slot: ReminderSlot) {
  const recipient = process.env.EMAIL_TEST_RECIPIENT?.trim()
  const email = emailConfig()
  const session = getClassByDate(classDate)
  if (!recipient) return { ok: false, error: "EMAIL_TEST_RECIPIENT is not set." }
  if (!email || !session) return { ok: false, error: "Email delivery is not configured." }
  const zoom = await getZoomLink(classDate, program)
  if (!zoom) return { ok: false, error: "Save a Zoom link for this class first." }
  const message = buildReminderEmail({
    slot,
    session,
    program,
    parentName: "Sample Parent",
    studentName: "Sample Student",
    zoom,
    testNote: "Sent from the admin dashboard. No family received this email.",
  })
  const { data, error } = await email.resend.emails.send({ from: email.from, to: [recipient], replyTo: ADMIN_INBOX, ...message })
  return data?.id ? { ok: true as const } : { ok: false as const, error: error?.name ?? "Send failed." }
}

export type ClassRegistrationRow = {
  id: number
  program: string
  studentName: string
  parentName: string
  excluded: boolean
  morning: string | null
  afternoon: string | null
}

/** Registrations and reminder status for one class, for the admin dashboard. */
export async function listClassRegistrations(classDate: string): Promise<ClassRegistrationRow[]> {
  const mode = reminderDeliveryMode().mode
  const { rows } = await pool.query<ClassRegistrationRow>(
    `SELECT r.id::int AS id, r.program, r.student_name AS "studentName", r.parent_name AS "parentName",
            EXISTS (SELECT 1 FROM sunday_reminder_exclusions x WHERE x.registration_id = r.id) AS excluded,
            (SELECT status FROM sunday_reminder_deliveries d WHERE d.registration_id = r.id AND d.slot = 'morning' AND d.mode = $2) AS morning,
            (SELECT status FROM sunday_reminder_deliveries d WHERE d.registration_id = r.id AND d.slot = 'afternoon' AND d.mode = $2) AS afternoon
       FROM sunday_class_registrations r WHERE r.class_date = $1 ORDER BY r.id`,
    [classDate, mode],
  )
  return rows
}

export async function setReminderExclusion(registrationId: number, excluded: boolean) {
  await assertWritableDatabase()
  await pool.query(
    excluded
      ? "INSERT INTO sunday_reminder_exclusions (registration_id, reason) VALUES ($1, 'Excluded from the admin dashboard') ON CONFLICT DO NOTHING"
      : "DELETE FROM sunday_reminder_exclusions WHERE registration_id = $1",
    [registrationId],
  )
}

import { createHash, randomBytes, randomUUID } from "node:crypto"
import type { Pool, PoolClient } from "pg"
import {
  PAYMENT_HOLD_MINUTES,
  SAT_INTENSIVE_CAPACITY,
  hasClassStarted,
  isClassDate,
  isPaymentMethod,
  newYorkWallClock,
  phoneDigits,
  quoteFor,
  studentKey,
  type PaymentMethod,
  type RegistrationInput,
  type TuitionQuote,
} from "@/lib/sat-final-intensive"

/**
 * Registrations, payment records, verification and confirmation for the Digital SAT Final Intensive.
 *
 * - Registration (sat_intensive_enrollments) holds a seat for PAYMENT_HOLD_MINUTES and stays pending_payment until an
 *   administrator verifies full tuition. A lapsed hold simply stops counting toward capacity; the registration is kept.
 * - Payments (sat_intensive_payments) are separate rows. Today only an authenticated administrator writes them
 *   (source 'manual'); a future Stripe/Square integration writes source 'stripe'/'square' after provider verification.
 * - Every write that can affect capacity runs under a per-program advisory lock, so confirmed seats plus active holds can
 *   never exceed 12, even with simultaneous registrations.
 * - Every administrator action is recorded in sat_intensive_audit_log in the same transaction.
 */

export type EnrollmentStatus = "pending_payment" | "confirmed" | "expired" | "canceled" | "needs_review"

export type EmailKind = "family_pending" | "admin_new_registration" | "family_confirmation"
export const REGISTRATION_EMAIL_KINDS: EmailKind[] = ["family_pending", "admin_new_registration"]
export const CONFIRMATION_EMAIL_KINDS: EmailKind[] = ["family_confirmation"]

export type PaymentSource = "manual" | "stripe" | "square"
export type PaymentStatus = "pending" | "verified" | "failed" | "refunded" | "canceled"

export type EnrollmentRecord = {
  publicId: string
  referenceCode: string
  programKey: string
  status: EnrollmentStatus
  studentName: string
  studentGrade: string
  parentName: string
  parentEmail: string
  parentPhone: string
  firstClassDate: string
  remainingClasses: number
  remainingHours: number
  tuitionCents: number
  paymentMethod: PaymentMethod | null
  previousScore: string | null
  targetScore: string | null
  satRegistrationStatus: string
  holdExpiresAt: Date
  confirmedAt: Date | null
  canceledAt: Date | null
  cancelReason: string | null
  createdAt: Date
}

type Row = {
  public_id: string
  reference_code: string | null
  program_key: string
  status: EnrollmentStatus
  student_name: string
  student_grade: string
  parent_name: string
  parent_email: string
  parent_phone: string
  first_class_date: string
  remaining_classes: number
  remaining_hours: number
  tuition_cents: number
  payment_method: string | null
  previous_score: string | null
  target_score: string | null
  sat_registration_status: string
  hold_expires_at: Date
  confirmed_at: Date | null
  canceled_at: Date | null
  cancel_reason: string | null
  created_at: Date
}

const toRecord = (r: Row): EnrollmentRecord => ({
  publicId: r.public_id,
  referenceCode: r.reference_code ?? r.public_id.slice(0, 8).toUpperCase(),
  programKey: r.program_key,
  status: r.status,
  studentName: r.student_name,
  studentGrade: r.student_grade,
  parentName: r.parent_name,
  parentEmail: r.parent_email,
  parentPhone: r.parent_phone,
  firstClassDate: r.first_class_date,
  remainingClasses: r.remaining_classes,
  remainingHours: r.remaining_hours,
  tuitionCents: r.tuition_cents,
  paymentMethod: r.payment_method && isPaymentMethod(r.payment_method) ? r.payment_method : null,
  previousScore: r.previous_score,
  targetScore: r.target_score,
  satRegistrationStatus: r.sat_registration_status,
  holdExpiresAt: r.hold_expires_at,
  confirmedAt: r.confirmed_at,
  canceledAt: r.canceled_at,
  cancelReason: r.cancel_reason,
  createdAt: r.created_at,
})

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isPublicId = (value: unknown): value is string => typeof value === "string" && UUID.test(value)

// Crockford base32 without I, L, O, U: easy to read aloud over the phone.
const REF_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
export function newReferenceCode() {
  const bytes = randomBytes(8)
  const chars = Array.from(bytes, (b) => REF_ALPHABET[b % 32]).join("")
  return `SAT-${chars.slice(0, 4)}-${chars.slice(4)}`
}

/** Eastern calendar date (YYYY-MM-DD) for `now`. */
export const newYorkDate = (now: Date) => newYorkWallClock(now).slice(0, 10)

async function inProgramLock<T>(pool: Pool, programKey: string, work: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`sat_intensive:${programKey}`])
    const result = await work(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {})
    throw error
  } finally {
    client.release()
  }
}

async function countSeats(client: PoolClient | Pool, programKey: string, now: Date, excludePublicId?: string) {
  const { rows } = await client.query<{ confirmed: string; held: string }>(
    `SELECT count(*) FILTER (WHERE status = 'confirmed') AS confirmed,
            count(*) FILTER (WHERE status = 'pending_payment' AND hold_expires_at > $2) AS held
     FROM sat_intensive_enrollments
     WHERE program_key = $1 AND ($3::uuid IS NULL OR public_id <> $3::uuid)`,
    [programKey, now, excludePublicId ?? null],
  )
  return { confirmed: Number(rows[0].confirmed), held: Number(rows[0].held) }
}

export type SeatSummary = { capacity: number; confirmed: number; held: number; available: number }

export async function getSeatSummary(pool: Pool, programKey: string, now = new Date(), capacity = SAT_INTENSIVE_CAPACITY): Promise<SeatSummary> {
  const { confirmed, held } = await countSeats(pool, programKey, now)
  return { capacity, confirmed, held, available: Math.max(0, capacity - confirmed - held) }
}

async function enqueueEmails(client: PoolClient, publicId: string, kinds: EmailKind[], now: Date) {
  await client.query(
    `INSERT INTO sat_intensive_email_outbox (enrollment_public_id, kind, next_attempt_at, created_at, updated_at)
     SELECT $1, kind, $2, $2, $2 FROM unnest($3::text[]) AS kind
     ON CONFLICT (enrollment_public_id, kind) DO NOTHING`,
    [publicId, now, kinds],
  )
}

async function audit(
  client: PoolClient,
  entry: { publicId: string | null; paymentId?: string | null; actor: string; action: string; details?: Record<string, unknown> },
  now: Date,
) {
  await client.query(
    `INSERT INTO sat_intensive_audit_log (enrollment_public_id, payment_public_id, actor, action, details, created_at)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [entry.publicId, entry.paymentId ?? null, entry.actor, entry.action, JSON.stringify(entry.details ?? {}), now],
  )
}

export type ReserveResult =
  | { ok: true; record: EnrollmentRecord; quote: TuitionQuote; seatsLeftAfter: number }
  | { ok: false; reason: "invalid_date" | "class_started" | "invalid_method" | "already_enrolled" | "already_pending" | "full" }

/**
 * Creates a pending registration with a temporary seat hold. Input must already have passed validateRegistration on
 * the server; tuition is recomputed here from the date alone. A 13th seat is never held: when confirmed seats plus
 * active holds reach capacity the request is refused and the family is directed to contact AhmedPrep.
 */
export async function reserveSeat(
  pool: Pool,
  programKey: string,
  input: RegistrationInput,
  now = new Date(),
  capacity = SAT_INTENSIVE_CAPACITY,
): Promise<ReserveResult> {
  if (!isClassDate(input.firstClassDate)) return { ok: false, reason: "invalid_date" }
  if (hasClassStarted(input.firstClassDate, now)) return { ok: false, reason: "class_started" }
  if (!isPaymentMethod(input.paymentMethod)) return { ok: false, reason: "invalid_method" }
  const quote = quoteFor(input.firstClassDate)
  const key = studentKey(input.parentEmail, input.studentName)

  return inProgramLock(pool, programKey, async (client) => {
    const existing = await client.query<{ status: EnrollmentStatus }>(
      `SELECT status FROM sat_intensive_enrollments
       WHERE program_key = $1 AND student_key = $2 AND status IN ('pending_payment', 'confirmed')`,
      [programKey, key],
    )
    if (existing.rows.some((r) => r.status === "confirmed")) return { ok: false as const, reason: "already_enrolled" as const }
    if (existing.rows.length) return { ok: false as const, reason: "already_pending" as const }

    const { confirmed, held } = await countSeats(client, programKey, now)
    if (confirmed + held >= capacity) return { ok: false as const, reason: "full" as const }

    const holdExpiresAt = new Date(now.getTime() + PAYMENT_HOLD_MINUTES * 60_000)
    // payment_token_hash is a legacy NOT NULL column from the simulated checkout; nothing reads it any more.
    const unusedTokenHash = createHash("sha256").update(randomBytes(32)).digest("hex")
    const { rows } = await client.query<Row>(
      `INSERT INTO sat_intensive_enrollments (
         program_key, status, reference_code, student_name, student_grade, parent_name, parent_email, parent_phone,
         student_key, first_class_date, remaining_classes, remaining_hours, tuition_cents, payment_method, payment_mode,
         previous_score, target_score, sat_registration_status, policy_acknowledged_at, payment_token_hash,
         hold_expires_at, family_email_status, admin_email_status, created_at, updated_at
       ) VALUES ($1, 'pending_payment', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'manual', $14, $15, $16, $17, $18,
                 $19, 'queued', 'queued', $17, $17)
       RETURNING *`,
      [
        programKey,
        newReferenceCode(),
        input.studentName.trim().replace(/\s+/g, " "),
        input.studentGrade,
        input.parentName.trim().replace(/\s+/g, " "),
        input.parentEmail.trim().toLowerCase(),
        phoneDigits(input.parentPhone),
        key,
        quote.firstClassDate,
        quote.remainingClasses,
        quote.remainingHours,
        quote.tuitionCents,
        input.paymentMethod,
        input.previousScore.trim() || null,
        input.targetScore.trim() || null,
        input.satRegistration,
        now,
        unusedTokenHash,
        holdExpiresAt,
      ],
    )
    const record = toRecord(rows[0])
    await enqueueEmails(client, record.publicId, REGISTRATION_EMAIL_KINDS, now)
    await audit(client, { publicId: record.publicId, actor: "family", action: "registration_submitted", details: { tuitionCents: record.tuitionCents, paymentMethod: record.paymentMethod } }, now)
    return { ok: true as const, record, quote, seatsLeftAfter: capacity - confirmed - held - 1 }
  })
}

export type PaymentRecord = {
  publicId: string
  enrollmentPublicId: string
  source: PaymentSource
  method: string
  status: PaymentStatus
  amountCents: number
  receivedOn: string | null
  reference: string | null
  recordedBy: string
  notes: string | null
  createdAt: Date
}

type PaymentRow = {
  public_id: string
  enrollment_public_id: string
  source: PaymentSource
  method: string
  status: PaymentStatus
  amount_cents: number
  received_on: string | null
  reference: string | null
  recorded_by: string
  notes: string | null
  created_at: Date
}

const toPayment = (r: PaymentRow): PaymentRecord => ({
  publicId: r.public_id,
  enrollmentPublicId: r.enrollment_public_id,
  source: r.source,
  method: r.method,
  status: r.status,
  amountCents: r.amount_cents,
  receivedOn: r.received_on,
  reference: r.reference,
  recordedBy: r.recorded_by,
  notes: r.notes,
  createdAt: r.created_at,
})

const PAYMENT_COLUMNS = `public_id, enrollment_public_id, source, method, status, amount_cents,
  to_char(received_on, 'YYYY-MM-DD') AS received_on, reference, recorded_by, notes, created_at`

export type ManualPaymentInput = {
  publicId: string
  method: string
  amountCents: number
  receivedOn: string
  reference: string
  notes: string
  /** One per rendered admin form, so a double submission records one payment. */
  idempotencyKey: string
  actor: string
}

export type VerifyResult =
  | { ok: true; record: EnrollmentRecord; payment: PaymentRecord; duplicate: boolean }
  | {
      ok: false
      reason:
        | "not_found"
        | "invalid_method"
        | "invalid_amount"
        | "amount_mismatch"
        | "invalid_date"
        | "reference_required"
        | "already_confirmed"
        | "not_payable"
        | "first_class_passed"
        | "full"
    }

export function validateManualPayment(input: ManualPaymentInput, tuitionCents: number, now: Date): VerifyResult | null {
  if (!isPaymentMethod(input.method)) return { ok: false, reason: "invalid_method" }
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0 || input.amountCents > 1_000_000)
    return { ok: false, reason: "invalid_amount" }
  if (input.amountCents !== tuitionCents) return { ok: false, reason: "amount_mismatch" }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.receivedOn) || Number.isNaN(Date.parse(`${input.receivedOn}T12:00:00Z`)))
    return { ok: false, reason: "invalid_date" }
  if (input.receivedOn > newYorkDate(now) || input.receivedOn < "2026-10-01") return { ok: false, reason: "invalid_date" }
  if ((input.method === "zelle" || input.method === "check") && !input.reference.trim()) return { ok: false, reason: "reference_required" }
  return null
}

/**
 * Records a verified full payment and confirms the seat in one transaction. Callers must have authenticated the
 * administrator. Capacity is rechecked when the hold has lapsed: the student is confirmed only if a seat is still free
 * without counting this registration. Re-submitting the same form (same idempotency key) returns the first result.
 */
export async function verifyManualPayment(
  pool: Pool,
  programKey: string,
  input: ManualPaymentInput,
  now = new Date(),
  capacity = SAT_INTENSIVE_CAPACITY,
): Promise<VerifyResult> {
  if (!isPublicId(input.publicId) || !input.idempotencyKey || !input.actor) return { ok: false, reason: "not_found" }

  return inProgramLock(pool, programKey, async (client) => {
    const previous = await client.query<PaymentRow>(
      `SELECT ${PAYMENT_COLUMNS} FROM sat_intensive_payments WHERE idempotency_key = $1`,
      [input.idempotencyKey],
    )
    if (previous.rows[0]) {
      const record = await getEnrollmentWith(client, previous.rows[0].enrollment_public_id)
      if (record) return { ok: true as const, record, payment: toPayment(previous.rows[0]), duplicate: true }
    }

    const { rows } = await client.query<Row>(
      `SELECT * FROM sat_intensive_enrollments WHERE program_key = $1 AND public_id = $2 FOR UPDATE`,
      [programKey, input.publicId],
    )
    const row = rows[0]
    if (!row) return { ok: false as const, reason: "not_found" as const }
    if (row.status === "confirmed") return { ok: false as const, reason: "already_confirmed" as const }
    if (row.status !== "pending_payment") return { ok: false as const, reason: "not_payable" as const }

    const invalid = validateManualPayment(input, row.tuition_cents, now)
    if (invalid) return invalid
    // Cash and checks are often handed over at the first class itself, so the first class day still counts.
    if (row.first_class_date < newYorkDate(now)) return { ok: false as const, reason: "first_class_passed" as const }

    const holdActive = row.hold_expires_at > now
    if (!holdActive) {
      const { confirmed, held } = await countSeats(client, programKey, now, row.public_id)
      if (confirmed + held >= capacity) {
        await audit(client, { publicId: row.public_id, actor: input.actor, action: "confirmation_refused_full", details: { confirmed, held, capacity } }, now)
        return { ok: false as const, reason: "full" as const }
      }
    }

    const payment = await client.query<PaymentRow>(
      `INSERT INTO sat_intensive_payments (
         enrollment_public_id, source, method, status, amount_cents, received_on, reference, idempotency_key,
         recorded_by, notes, created_at, updated_at
       ) VALUES ($1, 'manual', $2, 'verified', $3, $4, $5, $6, $7, $8, $9, $9)
       RETURNING ${PAYMENT_COLUMNS}`,
      [
        row.public_id,
        input.method,
        input.amountCents,
        input.receivedOn,
        input.reference.trim().slice(0, 80) || null,
        input.idempotencyKey,
        input.actor,
        input.notes.trim().slice(0, 500) || null,
        now,
      ],
    )
    const paymentRecord = toPayment(payment.rows[0])
    const updated = await client.query<Row>(
      `UPDATE sat_intensive_enrollments
       SET status = 'confirmed', confirmed_at = $2, updated_at = $2, payment_mode = 'manual', payment_method = $3,
           amount_paid_cents = $4, payment_reference = $5
       WHERE public_id = $1 RETURNING *`,
      [row.public_id, now, input.method, input.amountCents, paymentRecord.publicId],
    )
    await enqueueEmails(client, row.public_id, CONFIRMATION_EMAIL_KINDS, now)
    await audit(
      client,
      {
        publicId: row.public_id,
        paymentId: paymentRecord.publicId,
        actor: input.actor,
        action: "payment_verified",
        details: { method: input.method, amountCents: input.amountCents, receivedOn: input.receivedOn, holdActive },
      },
      now,
    )
    await audit(client, { publicId: row.public_id, paymentId: paymentRecord.publicId, actor: input.actor, action: "enrollment_confirmed" }, now)
    return { ok: true as const, record: toRecord(updated.rows[0]), payment: paymentRecord, duplicate: false }
  })
}

export type CancelResult = { ok: true; record: EnrollmentRecord } | { ok: false; reason: "not_found" | "not_cancelable" | "reason_required" }

/** Cancels an unpaid registration and releases its hold. Confirmed (paid) enrollments are not canceled here. */
export async function cancelRegistration(
  pool: Pool,
  programKey: string,
  publicId: string,
  reason: string,
  actor: string,
  now = new Date(),
): Promise<CancelResult> {
  if (!isPublicId(publicId) || !actor) return { ok: false, reason: "not_found" }
  const why = reason.trim().slice(0, 300)
  if (!why) return { ok: false, reason: "reason_required" }
  return inProgramLock(pool, programKey, async (client) => {
    const { rows } = await client.query<Row>(
      `UPDATE sat_intensive_enrollments SET status = 'canceled', canceled_at = $3, cancel_reason = $4, updated_at = $3
       WHERE program_key = $1 AND public_id = $2 AND status = 'pending_payment' RETURNING *`,
      [programKey, publicId, now, why],
    )
    if (!rows[0]) {
      const exists = await client.query(`SELECT 1 FROM sat_intensive_enrollments WHERE program_key = $1 AND public_id = $2`, [programKey, publicId])
      return { ok: false as const, reason: exists.rowCount ? ("not_cancelable" as const) : ("not_found" as const) }
    }
    await audit(client, { publicId, actor, action: "registration_canceled", details: { reason: why } }, now)
    return { ok: true as const, record: toRecord(rows[0]) }
  })
}

/** Lets an authenticated caller write an audit entry for actions handled elsewhere (for example an email resend). */
export async function recordAudit(pool: Pool, entry: { publicId: string | null; actor: string; action: string; details?: Record<string, unknown> }) {
  await pool.query(
    `INSERT INTO sat_intensive_audit_log (enrollment_public_id, actor, action, details) VALUES ($1, $2, $3, $4::jsonb)`,
    [entry.publicId, entry.actor, entry.action, JSON.stringify(entry.details ?? {})],
  )
}

async function getEnrollmentWith(client: PoolClient | Pool, publicId: string) {
  if (!isPublicId(publicId)) return null
  const { rows } = await client.query<Row>(`SELECT * FROM sat_intensive_enrollments WHERE public_id = $1`, [publicId])
  return rows[0] ? toRecord(rows[0]) : null
}

export const getEnrollment = (pool: Pool, publicId: string) => getEnrollmentWith(pool, publicId)

export async function getVerifiedPayment(pool: Pool, publicId: string) {
  const { rows } = await pool.query<PaymentRow>(
    `SELECT ${PAYMENT_COLUMNS} FROM sat_intensive_payments WHERE enrollment_public_id = $1 AND status = 'verified'`,
    [publicId],
  )
  return rows[0] ? toPayment(rows[0]) : null
}

export async function listEnrollments(pool: Pool, programKey: string) {
  const { rows } = await pool.query<Row>(
    `SELECT * FROM sat_intensive_enrollments WHERE program_key = $1 ORDER BY created_at DESC LIMIT 200`,
    [programKey],
  )
  return rows.map(toRecord)
}

export async function listPayments(pool: Pool, programKey: string) {
  const { rows } = await pool.query<PaymentRow>(
    `SELECT p.public_id, p.enrollment_public_id, p.source, p.method, p.status, p.amount_cents,
            to_char(p.received_on, 'YYYY-MM-DD') AS received_on, p.reference, p.recorded_by, p.notes, p.created_at
     FROM sat_intensive_payments p JOIN sat_intensive_enrollments e ON e.public_id = p.enrollment_public_id
     WHERE e.program_key = $1 ORDER BY p.created_at DESC`,
    [programKey],
  )
  return rows.map(toPayment)
}

export type AuditEntry = { enrollmentPublicId: string | null; actor: string; action: string; details: Record<string, unknown>; createdAt: Date }

export async function listAudit(pool: Pool, programKey: string, limit = 50): Promise<AuditEntry[]> {
  const { rows } = await pool.query(
    `SELECT a.enrollment_public_id, a.actor, a.action, a.details, a.created_at
     FROM sat_intensive_audit_log a JOIN sat_intensive_enrollments e ON e.public_id = a.enrollment_public_id
     WHERE e.program_key = $1 ORDER BY a.created_at DESC, a.id DESC LIMIT $2`,
    [programKey, limit],
  )
  return rows.map((r) => ({ enrollmentPublicId: r.enrollment_public_id, actor: r.actor, action: r.action, details: r.details, createdAt: r.created_at }))
}

export const newIdempotencyKey = () => `manual/${randomUUID()}`

export const isMissingTableError = (error: unknown) =>
  typeof error === "object" && error !== null && (error as { code?: string }).code === "42P01"

import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import type { Pool, PoolClient } from "pg"
import {
  PAYMENT_HOLD_MINUTES,
  SAT_INTENSIVE_CAPACITY,
  hasClassStarted,
  isClassDate,
  phoneDigits,
  quoteFor,
  studentKey,
  type RegistrationInput,
  type TuitionQuote,
} from "@/lib/sat-final-intensive"

/**
 * Seat holds and confirmations for the Digital SAT Final Intensive. Every write runs in a transaction that first takes a
 * per-program advisory lock, so two families submitting at the same moment are processed one after the other and the
 * 12-seat limit (confirmed + unexpired holds) cannot be exceeded. The pool is passed in so tests can use an isolated program key.
 */

export type EnrollmentStatus = "pending_payment" | "confirmed" | "expired" | "canceled"

export type EnrollmentRecord = {
  publicId: string
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
  previousScore: string | null
  targetScore: string | null
  satRegistrationStatus: string
  paymentReference: string | null
  holdExpiresAt: Date
  confirmedAt: Date | null
}

type Row = {
  public_id: string
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
  previous_score: string | null
  target_score: string | null
  sat_registration_status: string
  payment_reference: string | null
  payment_token_hash: string
  hold_expires_at: Date
  confirmed_at: Date | null
}

const toRecord = (r: Row): EnrollmentRecord => ({
  publicId: r.public_id,
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
  previousScore: r.previous_score,
  targetScore: r.target_score,
  satRegistrationStatus: r.sat_registration_status,
  paymentReference: r.payment_reference,
  holdExpiresAt: r.hold_expires_at,
  confirmedAt: r.confirmed_at,
})

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex")

function tokenMatches(token: string, expectedHash: string) {
  const a = Buffer.from(hashToken(token), "hex")
  const b = Buffer.from(expectedHash, "hex")
  return a.length === b.length && timingSafeEqual(a, b)
}

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

async function releaseExpiredHolds(client: PoolClient, programKey: string, now: Date) {
  await client.query(
    `UPDATE sat_intensive_enrollments SET status = 'expired', updated_at = $2
     WHERE program_key = $1 AND status = 'pending_payment' AND hold_expires_at <= $2`,
    [programKey, now],
  )
}

async function countSeats(client: PoolClient, programKey: string, now: Date, excludePublicId?: string) {
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

export async function getSeatSummary(pool: Pool, programKey: string, now = new Date()): Promise<SeatSummary> {
  const client = await pool.connect()
  try {
    const { confirmed, held } = await countSeats(client, programKey, now)
    return { capacity: SAT_INTENSIVE_CAPACITY, confirmed, held, available: Math.max(0, SAT_INTENSIVE_CAPACITY - confirmed - held) }
  } finally {
    client.release()
  }
}

export type ReserveResult =
  | { ok: true; publicId: string; paymentToken: string; holdExpiresAt: Date; quote: TuitionQuote; seatsLeftAfter: number }
  | { ok: false; reason: "invalid_date" | "class_started" | "already_enrolled" | "full" }

/** Input must already have passed validateRegistration on the server. Price is recomputed here from the date alone. */
export async function reserveSeat(
  pool: Pool,
  programKey: string,
  input: RegistrationInput,
  now = new Date(),
  capacity = SAT_INTENSIVE_CAPACITY,
): Promise<ReserveResult> {
  if (!isClassDate(input.firstClassDate)) return { ok: false, reason: "invalid_date" }
  if (hasClassStarted(input.firstClassDate, now)) return { ok: false, reason: "class_started" }
  const quote = quoteFor(input.firstClassDate)
  const key = studentKey(input.parentEmail, input.studentName)

  return inProgramLock(pool, programKey, async (client) => {
    await releaseExpiredHolds(client, programKey, now)

    const existing = await client.query(
      `SELECT 1 FROM sat_intensive_enrollments WHERE program_key = $1 AND student_key = $2 AND status = 'confirmed'`,
      [programKey, key],
    )
    if (existing.rowCount) return { ok: false as const, reason: "already_enrolled" as const }

    // A family that submits again (new tab, changed start date) replaces its own unpaid hold rather than taking a second seat.
    await client.query(
      `UPDATE sat_intensive_enrollments SET status = 'canceled', updated_at = $3
       WHERE program_key = $1 AND student_key = $2 AND status = 'pending_payment'`,
      [programKey, key, now],
    )

    const { confirmed, held } = await countSeats(client, programKey, now)
    if (confirmed + held >= capacity) return { ok: false as const, reason: "full" as const }

    const paymentToken = randomBytes(32).toString("base64url")
    const holdExpiresAt = new Date(now.getTime() + PAYMENT_HOLD_MINUTES * 60_000)
    const { rows } = await client.query<{ public_id: string }>(
      `INSERT INTO sat_intensive_enrollments (
         program_key, status, student_name, student_grade, parent_name, parent_email, parent_phone, student_key,
         first_class_date, remaining_classes, remaining_hours, tuition_cents, previous_score, target_score,
         sat_registration_status, policy_acknowledged_at, payment_token_hash, hold_expires_at, created_at, updated_at
       ) VALUES ($1, 'pending_payment', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $15, $15)
       RETURNING public_id`,
      [
        programKey,
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
        input.previousScore.trim() || null,
        input.targetScore.trim() || null,
        input.satRegistration,
        now,
        hashToken(paymentToken),
        holdExpiresAt,
      ],
    )
    return {
      ok: true as const,
      publicId: rows[0].public_id,
      paymentToken,
      holdExpiresAt,
      quote,
      seatsLeftAfter: capacity - confirmed - held - 1,
    }
  })
}

export type ConfirmResult =
  | { ok: true; record: EnrollmentRecord; alreadyConfirmed: boolean }
  | { ok: false; reason: "not_found" | "not_payable" | "class_started" | "full" }

/**
 * Records a verified payment. In Preview the only caller is the simulated checkout; a real provider must call this only
 * after its own server-side verification (for example a signed webhook), never on a redirect from the browser.
 */
export async function confirmPayment(
  pool: Pool,
  programKey: string,
  publicId: string,
  paymentToken: string,
  paymentReference: string,
  now = new Date(),
  capacity = SAT_INTENSIVE_CAPACITY,
): Promise<ConfirmResult> {
  if (!/^[0-9a-f-]{36}$/i.test(publicId) || !paymentToken) return { ok: false, reason: "not_found" }

  return inProgramLock(pool, programKey, async (client) => {
    const { rows } = await client.query<Row>(
      `SELECT * FROM sat_intensive_enrollments WHERE program_key = $1 AND public_id = $2 FOR UPDATE`,
      [programKey, publicId],
    )
    const row = rows[0]
    if (!row || !tokenMatches(paymentToken, row.payment_token_hash)) return { ok: false as const, reason: "not_found" as const }
    if (row.status === "confirmed") return { ok: true as const, record: toRecord(row), alreadyConfirmed: true }
    if (row.status !== "pending_payment" && row.status !== "expired") return { ok: false as const, reason: "not_payable" as const }
    if (!isClassDate(row.first_class_date) || hasClassStarted(row.first_class_date, now))
      return { ok: false as const, reason: "class_started" as const }

    // A late payment on a lapsed hold is accepted only if a seat is still free without counting this registration.
    if (row.status === "expired" || row.hold_expires_at <= now) {
      await releaseExpiredHolds(client, programKey, now)
      const { confirmed, held } = await countSeats(client, programKey, now, publicId)
      if (confirmed + held >= capacity) {
        await client.query(`UPDATE sat_intensive_enrollments SET status = 'expired', updated_at = $2 WHERE public_id = $1`, [publicId, now])
        return { ok: false as const, reason: "full" as const }
      }
    }

    const updated = await client.query<Row>(
      `UPDATE sat_intensive_enrollments
       SET status = 'confirmed', payment_reference = $2, confirmed_at = $3, updated_at = $3
       WHERE public_id = $1 RETURNING *`,
      [publicId, paymentReference, now],
    )
    return { ok: true as const, record: toRecord(updated.rows[0]), alreadyConfirmed: false }
  })
}

export async function setEmailStatus(pool: Pool, publicId: string, family: string, admin: string) {
  await pool.query(
    `UPDATE sat_intensive_enrollments SET family_email_status = $2, admin_email_status = $3, updated_at = now() WHERE public_id = $1`,
    [publicId, family, admin],
  )
}

export const isMissingTableError = (error: unknown) =>
  typeof error === "object" && error !== null && (error as { code?: string }).code === "42P01"

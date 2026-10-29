import "server-only"
import { pool } from "@/lib/db"
import {
  ASSESSMENT_STATUSES,
  ATTENDANCE_STATUSES,
  DIAGNOSTIC_HOLD_DAYS,
  decideFreeAccess,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  type AccessException,
  type FreeAccessDecision,
  type FreeAccessKind,
  type Identity,
  type UsageRecord,
} from "@/lib/free-access-policy"
import { describeDbError } from "@/lib/sunday-registrations"

export const FREE_ACCESS_MIGRATION = "0006_free_access_limits.sql"

let enforcedCache: { value: boolean; at: number } | null = null

/**
 * Limits are enforced only after the free-access migration has been applied and recorded. Until then every form
 * behaves exactly as before. Cached briefly so each submission does not query schema_migrations.
 */
export async function isFreeAccessEnforced() {
  if (enforcedCache && Date.now() - enforcedCache.at < 60_000) return enforcedCache.value
  let value = false
  try {
    const { rows } = await pool.query("SELECT 1 FROM schema_migrations WHERE name = $1", [FREE_ACCESS_MIGRATION])
    value = rows.length > 0
  } catch {
    value = false
  }
  enforcedCache = { value, at: Date.now() }
  return value
}

export function todayInNewYork(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: "America/New_York" })
}

const lookupParams = (who: Identity) => [normalizeEmail(who.parentEmail), normalizePhone(who.parentPhone) || null, normalizeName(who.studentName)]

const PHONE_SQL = (column: string) => `right(regexp_replace(${column}, '\\D', '', 'g'), 10)`

type Row = { id: string; key: string; student_name: string; parent_email: string; parent_phone: string; status: string | null; held_until: string | null }
const toRecord = (r: Row): UsageRecord => ({
  id: Number(r.id),
  key: r.key,
  studentName: r.student_name,
  parentEmail: r.parent_email,
  parentPhone: r.parent_phone,
  status: r.status,
  heldUntil: r.held_until,
})

async function loadRecords(kind: FreeAccessKind, who: Identity) {
  const params = lookupParams(who)
  const sql =
    kind === "sunday_class"
      ? `SELECT id, dedupe_key AS key, student_name, parent_email, parent_phone, attendance_status AS status,
                class_date::text AS held_until
         FROM sunday_class_registrations
         WHERE lower(parent_email) = $1 OR ${PHONE_SQL("parent_phone")} = $2 OR lower(student_name) = $3
         ORDER BY created_at DESC LIMIT 200`
      : `SELECT id, idempotency_key AS key, coalesce(student_name, '') AS student_name, contact_email AS parent_email,
                contact_phone AS parent_phone, assessment_status AS status,
                ((created_at AT TIME ZONE 'America/New_York')::date + ${DIAGNOSTIC_HOLD_DAYS})::text AS held_until
         FROM lead_submissions
         WHERE form_type = 'diagnostic'
           AND (lower(contact_email) = $1 OR ${PHONE_SQL("contact_phone")} = $2 OR lower(student_name) = $3)
         ORDER BY created_at DESC LIMIT 200`
  const { rows } = await pool.query<Row>(sql, params)
  return rows.map(toRecord)
}

async function loadExceptions(kind: FreeAccessKind, who: Identity): Promise<AccessException[]> {
  const [email, phone, name] = lookupParams(who)
  const { rows } = await pool.query<{ id: string; student_name: string; parent_email: string; parent_phone: string; extra_allowance: number }>(
    `SELECT id, student_name, parent_email, parent_phone, extra_allowance FROM free_access_exceptions
     WHERE kind = $1 AND revoked_at IS NULL
       AND (lower(parent_email) = $2 OR ${PHONE_SQL("parent_phone")} = $3 OR lower(student_name) = $4)`,
    [kind, email, phone, name],
  )
  return rows.map((r) => ({
    id: Number(r.id),
    studentName: r.student_name,
    parentEmail: r.parent_email,
    parentPhone: r.parent_phone,
    extraAllowance: r.extra_allowance,
  }))
}

export type FreeAccessCheck = { enforced: false } | { enforced: true; decision: FreeAccessDecision }

/**
 * Checks the student's existing free sessions before a booking is accepted. Fails open: if the lookup itself errors,
 * the booking proceeds as it does today (a real family is never turned away by a database hiccup) and it is logged.
 */
export async function checkFreeAccess(kind: FreeAccessKind, applicant: Identity, bookingKey: string): Promise<FreeAccessCheck> {
  if (!(await isFreeAccessEnforced())) return { enforced: false }
  try {
    const [records, exceptions] = await Promise.all([loadRecords(kind, applicant), loadExceptions(kind, applicant)])
    return { enforced: true, decision: decideFreeAccess({ kind, applicant, bookingKey, records, exceptions, today: todayInNewYork() }) }
  } catch (error) {
    console.error(`[free-access] ${kind} check skipped, booking allowed: ${describeDbError(error)}`)
    return { enforced: false }
  }
}

const TABLE: Record<FreeAccessKind, string> = { sunday_class: "sunday_class_registrations", diagnostic: "lead_submissions" }

export async function flagForReview(kind: FreeAccessKind, id: number, relatedIds: number[]) {
  const reason = `Possible duplicate student; related ${TABLE[kind]} #${relatedIds.join(", #")}`
  try {
    await pool.query(`UPDATE ${TABLE[kind]} SET review_status = 'needs_review', review_reason = $2, updated_at = now() WHERE id = $1`, [
      id,
      reason.slice(0, 500),
    ])
  } catch (error) {
    console.error(`[free-access] Could not flag ${TABLE[kind]} #${id} for review: ${describeDbError(error)}`)
  }
}

export function reviewEmailRow(decision: FreeAccessDecision): [string, string] {
  const usage = `${decision.used} used, ${decision.held} upcoming, allowance ${decision.allowance}`
  return decision.outcome === "review"
    ? ["Free-access check", `NEEDS REVIEW: possibly the same student as record(s) #${decision.relatedIds.join(", #")} (${usage}). Accepted.`]
    : ["Free-access check", usage]
}

/* ---------- Administrator tools (used only by /admin/free-access, behind a signed link) ---------- */

export type AdminSundayRow = {
  id: number
  classDate: string
  program: string
  studentName: string
  studentGrade: string
  parentName: string
  parentEmail: string
  parentPhone: string
  attendanceStatus: string
  reviewStatus: string
  reviewReason: string | null
}

export type AdminDiagnosticRow = {
  id: number
  createdAt: string
  program: string | null
  studentName: string | null
  parentName: string
  parentEmail: string
  parentPhone: string
  preferredDate: string | null
  assessmentStatus: string
  reviewStatus: string
  reviewReason: string | null
}

export type AdminExceptionRow = {
  id: number
  kind: FreeAccessKind
  studentName: string
  parentEmail: string
  extraAllowance: number
  reason: string
  grantedBy: string
  createdAt: string
}

/** Matches parent email, phone digits, or part of a student/parent name. Empty query lists items needing review. */
export async function searchFreeAccess(query: string) {
  const q = query.trim().toLowerCase().slice(0, 100)
  const phone = normalizePhone(q) || null
  const like = q ? `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : null

  const sundayWhere = like
    ? `lower(parent_email) LIKE $1 OR lower(student_name) LIKE $1 OR lower(parent_name) LIKE $1 OR ${PHONE_SQL("parent_phone")} = $2`
    : `review_status = 'needs_review'`
  const diagWhere = like
    ? `form_type = 'diagnostic' AND (lower(contact_email) LIKE $1 OR lower(coalesce(student_name, '')) LIKE $1
         OR lower(contact_name) LIKE $1 OR ${PHONE_SQL("contact_phone")} = $2)`
    : `form_type = 'diagnostic' AND review_status = 'needs_review'`
  const params = like ? [like, phone] : []

  const [sunday, diagnostic, exceptions] = await Promise.all([
    pool.query(
      `SELECT id, class_date::text AS class_date, program, student_name, student_grade, parent_name, parent_email, parent_phone,
              attendance_status, review_status, review_reason
       FROM sunday_class_registrations WHERE ${sundayWhere} ORDER BY class_date DESC, id DESC LIMIT 100`,
      params,
    ),
    pool.query(
      `SELECT id, (created_at AT TIME ZONE 'America/New_York')::date::text AS created_at, program, student_name, contact_name,
              contact_email, contact_phone, payload->>'preferredDate' AS preferred_date,
              coalesce(assessment_status, 'requested') AS assessment_status, review_status, review_reason
       FROM lead_submissions WHERE ${diagWhere} ORDER BY created_at DESC LIMIT 100`,
      params,
    ),
    like
      ? pool.query(
          `SELECT id, kind, student_name, parent_email, extra_allowance, reason, granted_by,
                  (created_at AT TIME ZONE 'America/New_York')::date::text AS created_at
           FROM free_access_exceptions
           WHERE revoked_at IS NULL AND (lower(parent_email) LIKE $1 OR lower(student_name) LIKE $1 OR ${PHONE_SQL("parent_phone")} = $2)
           ORDER BY created_at DESC LIMIT 50`,
          params,
        )
      : pool.query(
          `SELECT id, kind, student_name, parent_email, extra_allowance, reason, granted_by,
                  (created_at AT TIME ZONE 'America/New_York')::date::text AS created_at
           FROM free_access_exceptions WHERE revoked_at IS NULL ORDER BY created_at DESC LIMIT 50`,
        ),
  ])

  return {
    sunday: sunday.rows.map<AdminSundayRow>((r) => ({
      id: Number(r.id),
      classDate: r.class_date,
      program: r.program,
      studentName: r.student_name,
      studentGrade: r.student_grade,
      parentName: r.parent_name,
      parentEmail: r.parent_email,
      parentPhone: r.parent_phone,
      attendanceStatus: r.attendance_status,
      reviewStatus: r.review_status,
      reviewReason: r.review_reason,
    })),
    diagnostic: diagnostic.rows.map<AdminDiagnosticRow>((r) => ({
      id: Number(r.id),
      createdAt: r.created_at,
      program: r.program,
      studentName: r.student_name,
      parentName: r.contact_name,
      parentEmail: r.contact_email,
      parentPhone: r.contact_phone,
      preferredDate: r.preferred_date,
      assessmentStatus: r.assessment_status,
      reviewStatus: r.review_status,
      reviewReason: r.review_reason,
    })),
    exceptions: exceptions.rows.map<AdminExceptionRow>((r) => ({
      id: Number(r.id),
      kind: r.kind,
      studentName: r.student_name,
      parentEmail: r.parent_email,
      extraAllowance: r.extra_allowance,
      reason: r.reason,
      grantedBy: r.granted_by,
      createdAt: r.created_at,
    })),
  }
}

/** Each correction runs in one transaction with its audit entry, and records the previous value. */
async function inTransaction<T>(work: (query: typeof pool.query) => Promise<T>) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await work(client.query.bind(client) as typeof pool.query)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {})
    throw error
  } finally {
    client.release()
  }
}

export async function setSundayAttendance(admin: string, id: number, status: string) {
  if (!(ATTENDANCE_STATUSES as readonly string[]).includes(status)) throw new Error("Invalid attendance status")
  await inTransaction(async (query) => {
    const { rows } = await query(
      `UPDATE sunday_class_registrations AS r SET attendance_status = $2, attendance_updated_at = now(), updated_at = now()
       FROM (SELECT id, attendance_status AS previous FROM sunday_class_registrations WHERE id = $1 FOR UPDATE) AS old
       WHERE r.id = old.id RETURNING old.previous`,
      [id, status],
    )
    if (!rows.length) throw new Error("Registration not found")
    await auditWith(query, admin, "set_attendance", "sunday_class_registrations", id, { from: rows[0].previous, to: status })
  })
}

export async function setAssessmentStatus(admin: string, id: number, status: string) {
  if (!(ASSESSMENT_STATUSES as readonly string[]).includes(status)) throw new Error("Invalid assessment status")
  await inTransaction(async (query) => {
    const { rows } = await query(
      `UPDATE lead_submissions AS l SET assessment_status = $2, assessment_updated_at = now(), updated_at = now()
       FROM (SELECT id, coalesce(assessment_status, 'requested') AS previous FROM lead_submissions
             WHERE id = $1 AND form_type = 'diagnostic' FOR UPDATE) AS old
       WHERE l.id = old.id RETURNING old.previous`,
      [id, status],
    )
    if (!rows.length) throw new Error("Diagnostic request not found")
    await auditWith(query, admin, "set_assessment_status", "lead_submissions", id, { from: rows[0].previous, to: status })
  })
}

export async function clearReview(admin: string, kind: FreeAccessKind, id: number) {
  await inTransaction(async (query) => {
    const { rowCount } = await query(`UPDATE ${TABLE[kind]} SET review_status = 'cleared', updated_at = now() WHERE id = $1`, [id])
    if (!rowCount) throw new Error("Record not found")
    await auditWith(query, admin, "clear_review", TABLE[kind], id, {})
  })
}

export async function grantException(
  admin: string,
  input: { kind: FreeAccessKind; studentName: string; parentEmail: string; parentPhone: string; extraAllowance: number; reason: string },
) {
  await inTransaction(async (query) => {
    const { rows } = await query(
      `INSERT INTO free_access_exceptions (kind, student_name, parent_email, parent_phone, extra_allowance, reason, granted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [input.kind, input.studentName, input.parentEmail, input.parentPhone, input.extraAllowance, input.reason, admin],
    )
    await auditWith(query, admin, "grant_exception", "free_access_exceptions", Number(rows[0].id), input)
  })
}

export async function revokeException(admin: string, id: number) {
  await inTransaction(async (query) => {
    const { rowCount } = await query(`UPDATE free_access_exceptions SET revoked_at = now() WHERE id = $1 AND revoked_at IS NULL`, [id])
    if (!rowCount) throw new Error("Exception not found")
    await auditWith(query, admin, "revoke_exception", "free_access_exceptions", id, {})
  })
}

async function auditWith(
  query: typeof pool.query,
  admin: string,
  action: string,
  targetTable: string,
  targetId: number,
  detail: Record<string, unknown>,
) {
  await query(`INSERT INTO admin_audit_log (admin_email, action, target_table, target_id, detail) VALUES ($1, $2, $3, $4, $5::jsonb)`, [
    admin,
    action,
    targetTable,
    targetId,
    JSON.stringify(detail),
  ])
}

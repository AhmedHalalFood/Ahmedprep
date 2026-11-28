// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/sat-final-intensive-payments.test.mjs
// Database tests require the disposable local PostgreSQL instance reserved for Preview QA.
import { test, after } from "node:test"
import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import pg from "pg"
import { backoffMs, classifyResendResult, getEmailJobs, processEmailOutbox, requeueEmailForAdmin } from "../lib/sat-final-intensive-email-outbox.ts"
import {
  cancelRegistration,
  getEnrollment,
  getSeatSummary,
  reserveSeat,
  verifyManualPayment,
} from "../lib/sat-final-intensive-enrollment.ts"
import { CLASS_DATES, quoteFor, validateRegistration } from "../lib/sat-final-intensive.ts"

const qaUrl = process.env.SAT_INTENSIVE_QA_DATABASE_URL
const dbSkip = qaUrl === undefined ? "requires SAT_INTENSIVE_QA_DATABASE_URL" : false
let pool = null

if (!dbSkip) {
  const hasOverrides = Object.keys(process.env).some(
    (key) => key.startsWith("PG") || key === "DATABASE_URL" || key === "DATABASE_URL_UNPOOLED",
  )
  if (hasOverrides) throw new Error("Remove PostgreSQL connection overrides before running database QA")

  let target
  try {
    target = new URL(qaUrl)
  } catch {
    throw new Error("Invalid SAT_INTENSIVE_QA_DATABASE_URL")
  }
  if (
    target.protocol !== "postgresql:" ||
    target.host !== "127.0.0.1:55432" ||
    target.pathname !== "/sat_intensive_qa" ||
    target.username !== "sat_intensive_qa" ||
    !target.password ||
    target.href.includes("?") ||
    target.href.includes("#")
  ) {
    throw new Error("SAT_INTENSIVE_QA_DATABASE_URL must point to the reserved disposable QA database")
  }

  pool = new pg.Pool({
    host: target.hostname,
    port: Number(target.port),
    database: "sat_intensive_qa",
    user: "sat_intensive_qa",
    password: decodeURIComponent(target.password),
    ssl: false,
    max: 8,
    connectionTimeoutMillis: 5000,
  })
}
const PROGRAM = `qa-test-${randomUUID()}`
const NOW = new Date("2026-11-14T15:00:00Z")
const ADMIN = "qa-admin@example.test"

let counter = 0
function student(overrides = {}) {
  counter++
  return {
    studentName: `QA Student ${counter}`,
    studentGrade: "11th grade",
    parentName: "QA Parent",
    parentEmail: `qa-parent-${counter}@example.test`,
    parentPhone: "(347) 555-0100",
    firstClassDate: "2026-11-16",
    paymentMethod: "zelle",
    previousScore: "",
    targetScore: "",
    satRegistration: "registered",
    policyAcknowledged: true,
    ...overrides,
  }
}

function payment(publicId, overrides = {}) {
  return {
    publicId,
    method: "zelle",
    amountCents: 82_500,
    receivedOn: "2026-11-14",
    reference: "QA-ZELLE-1",
    notes: "",
    idempotencyKey: `qa/${randomUUID()}`,
    actor: ADMIN,
    ...overrides,
  }
}

function fakeClock(start = NOW) {
  let offset = 0
  return {
    now: () => new Date(start.getTime() + offset),
    sleep: async (ms) => {
      offset += ms
    },
  }
}

const countRows = async (table, publicId) =>
  Number((await pool.query(`SELECT count(*) FROM ${table} WHERE enrollment_public_id = $1`, [publicId])).rows[0].count)

after(async () => {
  if (!pool) return
  try {
    const ids = `SELECT public_id FROM sat_intensive_enrollments WHERE program_key = $1`
    await pool.query(
      `DELETE FROM sat_intensive_email_attempts WHERE outbox_id IN (SELECT id FROM sat_intensive_email_outbox WHERE enrollment_public_id IN (${ids}))`,
      [PROGRAM],
    )
    await pool.query(`DELETE FROM sat_intensive_email_outbox WHERE enrollment_public_id IN (${ids})`, [PROGRAM])
    await pool.query(`DELETE FROM sat_intensive_audit_log WHERE enrollment_public_id IN (${ids})`, [PROGRAM])
    await pool.query(`DELETE FROM sat_intensive_payments WHERE enrollment_public_id IN (${ids})`, [PROGRAM])
    await pool.query(`DELETE FROM sat_intensive_enrollments WHERE program_key = $1`, [PROGRAM])
    const left = await pool.query(`SELECT count(*) FROM sat_intensive_enrollments WHERE program_key = $1`, [PROGRAM])
    assert.equal(Number(left.rows[0].count), 0)
  } finally {
    await pool.end()
  }
})

// ---------- pure logic ----------

test("all 11 rolling start dates price at $75 per remaining class", () => {
  const expected = [82500, 75000, 67500, 60000, 52500, 45000, 37500, 30000, 22500, 15000, 7500]
  assert.equal(CLASS_DATES.length, 11)
  CLASS_DATES.forEach((d, i) => {
    const q = quoteFor(d)
    assert.equal(q.tuitionCents, expected[i])
    assert.equal(q.remainingClasses, 11 - i)
    assert.equal(q.remainingHours, (11 - i) * 3)
  })
  assert.ok(!CLASS_DATES.includes("2026-11-26"), "Thanksgiving is not a class date")
})

test("validation rejects a missing payment method, Thanksgiving, dates after the program, and started classes", () => {
  assert.ok(validateRegistration(student({ paymentMethod: "" }), NOW).paymentMethod)
  assert.ok(validateRegistration(student({ paymentMethod: "card" }), NOW).paymentMethod)
  assert.ok(validateRegistration(student({ firstClassDate: "2026-11-26" }), NOW).firstClassDate)
  assert.ok(validateRegistration(student({ firstClassDate: "2026-12-07" }), NOW).firstClassDate)
  // 7:00 PM Eastern on Nov 16: the first class is in progress.
  assert.ok(validateRegistration(student(), new Date("2026-11-17T00:00:00Z")).firstClassDate)
  assert.deepEqual(validateRegistration(student(), NOW), {})
})

test("Resend responses are classified: rate limits and 5xx retry, validation and quota errors do not", () => {
  assert.equal(classifyResendResult({ data: { id: "m1" } }).kind, "sent")
  assert.equal(classifyResendResult({ error: { name: "rate_limit_exceeded", statusCode: 429 } }).kind, "retry")
  assert.equal(classifyResendResult({ error: { name: "internal_server_error", statusCode: 500 } }).kind, "retry")
  assert.equal(classifyResendResult({ error: { name: "validation_error", statusCode: 422 } }).kind, "failed")
  assert.equal(classifyResendResult({ error: { name: "daily_quota_exceeded", statusCode: 429 } }).kind, "failed")
  assert.equal(classifyResendResult({ error: { name: "invalid_idempotent_request", statusCode: 409 } }).kind, "sent")
})

test("backoff grows exponentially, is jittered, and is capped at one hour", () => {
  assert.equal(backoffMs(1, () => 0.5), 2000)
  assert.equal(backoffMs(2, () => 0.5), 4000)
  assert.equal(backoffMs(3, () => 0), 4000)
  assert.equal(backoffMs(30, () => 0.5), 3_600_000)
})

// ---------- database ----------

for (const method of ["zelle", "cash", "check"]) {
  test(`registration with ${method} is pending, server-priced, and queues the pending + admin emails`, { skip: dbSkip }, async () => {
    const r = await reserveSeat(pool, PROGRAM, student({ paymentMethod: method, firstClassDate: "2026-11-18" }), NOW, 50)
    assert.equal(r.ok, true)
    assert.equal(r.record.status, "pending_payment")
    assert.equal(r.record.paymentMethod, method)
    assert.equal(r.record.tuitionCents, 67_500)
    assert.match(r.record.referenceCode, /^SAT-[0-9A-Z]{4}-[0-9A-Z]{4}$/)
    assert.equal(r.record.holdExpiresAt.getTime(), NOW.getTime() + 20 * 60_000)
    const kinds = (await getEmailJobs(pool, r.record.publicId)).map((j) => j.kind).sort()
    assert.deepEqual(kinds, ["admin_new_registration", "family_pending"])
    assert.equal(await countRows("sat_intensive_payments", r.record.publicId), 0, "registration records no payment")
  })
}

test("invalid method and started dates are refused by the store itself", { skip: dbSkip }, async () => {
  assert.equal((await reserveSeat(pool, PROGRAM, student({ paymentMethod: "card" }), NOW, 50)).reason, "invalid_method")
  assert.equal((await reserveSeat(pool, PROGRAM, student({ firstClassDate: "2026-11-26" }), NOW, 50)).reason, "invalid_date")
  const late = new Date("2026-11-17T00:00:00Z")
  assert.equal((await reserveSeat(pool, PROGRAM, student(), late, 50)).reason, "class_started")
})

test("duplicate student registrations are refused across capitalisation and whitespace", { skip: dbSkip }, async () => {
  const first = await reserveSeat(pool, PROGRAM, student({ studentName: "Dup Student", parentEmail: "dup@example.test" }), NOW, 50)
  assert.equal(first.ok, true)
  const again = await reserveSeat(pool, PROGRAM, student({ studentName: "  dup   STUDENT ", parentEmail: " DUP@Example.test " }), NOW, 50)
  assert.deepEqual(again, { ok: false, reason: "already_pending" })
  const paid = await verifyManualPayment(pool, PROGRAM, payment(first.record.publicId), NOW, 50)
  assert.equal(paid.ok, true)
  const afterPaid = await reserveSeat(pool, PROGRAM, student({ studentName: "dup student", parentEmail: "dup@example.test" }), NOW, 50)
  assert.deepEqual(afterPaid, { ok: false, reason: "already_enrolled" })
})

test("simultaneous registrations never exceed capacity", { skip: dbSkip }, async () => {
  const program = `${PROGRAM}-race`
  try {
    const results = await Promise.all(Array.from({ length: 16 }, () => reserveSeat(pool, program, student(), NOW, 12)))
    assert.equal(results.filter((r) => r.ok).length, 12)
    assert.ok(results.filter((r) => !r.ok).every((r) => r.reason === "full"))
    const seats = await getSeatSummary(pool, program, NOW, 12)
    assert.deepEqual(seats, { capacity: 12, confirmed: 0, held: 12, available: 0 })
  } finally {
    const ids = `SELECT public_id FROM sat_intensive_enrollments WHERE program_key = $1`
    await pool.query(`DELETE FROM sat_intensive_email_outbox WHERE enrollment_public_id IN (${ids})`, [program])
    await pool.query(`DELETE FROM sat_intensive_audit_log WHERE enrollment_public_id IN (${ids})`, [program])
    await pool.query(`DELETE FROM sat_intensive_enrollments WHERE program_key = $1`, [program])
  }
})

test("an expired hold releases its seat; late payment is confirmed only if a seat is still free", { skip: dbSkip }, async () => {
  const program = `${PROGRAM}-hold`
  try {
    const a = await reserveSeat(pool, program, student(), NOW, 1)
    assert.equal(a.ok, true)
    assert.equal((await reserveSeat(pool, program, student(), NOW, 1)).reason, "full")
    const later = new Date(NOW.getTime() + 21 * 60_000)
    const b = await reserveSeat(pool, program, student(), later, 1)
    assert.equal(b.ok, true, "the lapsed hold no longer counts")
    // A pays after the hold lapsed while B holds the only seat: refused, nothing recorded.
    const refused = await verifyManualPayment(pool, program, payment(a.record.publicId), later, 1)
    assert.deepEqual(refused, { ok: false, reason: "full" })
    assert.equal(await countRows("sat_intensive_payments", a.record.publicId), 0)
    // Once B's hold lapses too, A's late payment can be confirmed after the recheck.
    const muchLater = new Date(later.getTime() + 21 * 60_000)
    const ok = await verifyManualPayment(pool, program, payment(a.record.publicId), muchLater, 1)
    assert.equal(ok.ok, true)
    assert.equal(ok.record.status, "confirmed")
  } finally {
    const ids = `SELECT public_id FROM sat_intensive_enrollments WHERE program_key = $1`
    await pool.query(`DELETE FROM sat_intensive_email_outbox WHERE enrollment_public_id IN (${ids})`, [program])
    await pool.query(`DELETE FROM sat_intensive_audit_log WHERE enrollment_public_id IN (${ids})`, [program])
    await pool.query(`DELETE FROM sat_intensive_payments WHERE enrollment_public_id IN (${ids})`, [program])
    await pool.query(`DELETE FROM sat_intensive_enrollments WHERE program_key = $1`, [program])
  }
})

test("manual verification requires the exact tuition and a reference for Zelle and check", { skip: dbSkip }, async () => {
  const r = await reserveSeat(pool, PROGRAM, student({ paymentMethod: "check" }), NOW, 50)
  const id = r.record.publicId
  assert.equal((await verifyManualPayment(pool, PROGRAM, payment(id, { amountCents: 75_000 }), NOW, 50)).reason, "amount_mismatch")
  assert.equal((await verifyManualPayment(pool, PROGRAM, payment(id, { method: "check", reference: " " }), NOW, 50)).reason, "reference_required")
  assert.equal((await verifyManualPayment(pool, PROGRAM, payment(id, { receivedOn: "2026-11-20" }), NOW, 50)).reason, "invalid_date")
  assert.equal((await verifyManualPayment(pool, PROGRAM, payment(id, { method: "card" }), NOW, 50)).reason, "invalid_method")
  assert.equal(await countRows("sat_intensive_payments", id), 0)
  const cash = await verifyManualPayment(pool, PROGRAM, payment(id, { method: "cash", reference: "" }), NOW, 50)
  assert.equal(cash.ok, true, "cash needs no reference")
  assert.equal(cash.payment.status, "verified")
  assert.equal(cash.payment.source, "manual")
})

test("re-submitting a verification records one payment; a second key on a confirmed seat is refused", { skip: dbSkip }, async () => {
  const r = await reserveSeat(pool, PROGRAM, student(), NOW, 50)
  const id = r.record.publicId
  const input = payment(id)
  const [one, two] = await Promise.all([verifyManualPayment(pool, PROGRAM, input, NOW, 50), verifyManualPayment(pool, PROGRAM, input, NOW, 50)])
  assert.equal(one.ok && two.ok, true)
  assert.equal([one.duplicate, two.duplicate].filter(Boolean).length, 1)
  assert.equal(await countRows("sat_intensive_payments", id), 1)
  assert.equal((await verifyManualPayment(pool, PROGRAM, payment(id), NOW, 50)).reason, "already_confirmed")
  assert.equal(await countRows("sat_intensive_payments", id), 1)
  const audit = await pool.query(`SELECT action, actor FROM sat_intensive_audit_log WHERE enrollment_public_id = $1 ORDER BY id`, [id])
  assert.deepEqual(
    audit.rows.map((a) => a.action),
    ["registration_submitted", "payment_verified", "enrollment_confirmed"],
  )
  assert.equal(audit.rows[1].actor, ADMIN)
  const kinds = (await getEmailJobs(pool, id)).map((j) => j.kind).sort()
  assert.deepEqual(kinds, ["admin_new_registration", "family_confirmation", "family_pending"])
})

test("canceling an unpaid registration releases its seat; confirmed seats cannot be canceled here", { skip: dbSkip }, async () => {
  const r = await reserveSeat(pool, PROGRAM, student(), NOW, 50)
  const id = r.record.publicId
  assert.equal((await cancelRegistration(pool, PROGRAM, id, "  ", ADMIN, NOW)).reason, "reason_required")
  const c = await cancelRegistration(pool, PROGRAM, id, "QA: family withdrew", ADMIN, NOW)
  assert.equal(c.ok, true)
  assert.equal(c.record.status, "canceled")
  assert.equal((await verifyManualPayment(pool, PROGRAM, payment(id), NOW, 50)).reason, "not_payable")
  const p = await reserveSeat(pool, PROGRAM, student(), NOW, 50)
  await verifyManualPayment(pool, PROGRAM, payment(p.record.publicId), NOW, 50)
  assert.equal((await cancelRegistration(pool, PROGRAM, p.record.publicId, "QA", ADMIN, NOW)).reason, "not_cancelable")
  assert.equal((await cancelRegistration(pool, PROGRAM, randomUUID(), "QA", ADMIN, NOW)).reason, "not_found")
})

test("rate-limited emails retry with backoff and are sent once, with a stable idempotency key", { skip: dbSkip }, async () => {
  const r = await reserveSeat(pool, PROGRAM, student(), NOW, 50)
  const id = r.record.publicId
  const calls = []
  let limited = 2
  const send = async (payload, key) => {
    calls.push({ to: payload.to, subject: payload.subject, key })
    if (limited-- > 0) return { kind: "retry", errorName: "rate_limit_exceeded", statusCode: 429 }
    return { kind: "sent", messageId: `qa-${calls.length}` }
  }
  const clock = fakeClock()
  const summary = await processEmailOutbox(pool, { send, onlyPublicIds: [id], deadlineMs: 15_000, random: () => 0.5, ...clock })
  assert.equal(summary.sent, 2)
  assert.equal(summary.retried, 2)
  const jobs = await getEmailJobs(pool, id)
  assert.ok(jobs.every((j) => j.status === "sent"))
  const familyKeys = new Set(calls.filter((c) => c.key.includes("family_pending")).map((c) => c.key))
  assert.equal(familyKeys.size, 1, "retries reuse one idempotency key so Resend cannot deliver twice")
  assert.ok(calls.every((c) => !c.subject.toLowerCase().includes("confirmed")), "nothing claims the seat is confirmed")
})

test("admin resend re-queues one email with a new key, never touching payments or seats", { skip: dbSkip }, async () => {
  const r = await reserveSeat(pool, PROGRAM, student(), NOW, 50)
  const id = r.record.publicId
  await verifyManualPayment(pool, PROGRAM, payment(id), NOW, 50)
  const keys = []
  let failConfirmation = true
  const send = async (payload, key) => {
    keys.push(key)
    if (key.includes("family_confirmation") && failConfirmation) return { kind: "failed", errorName: "validation_error", statusCode: 422 }
    return { kind: "sent", messageId: "qa" }
  }
  const clock = fakeClock()
  await processEmailOutbox(pool, { send, onlyPublicIds: [id], deadlineMs: 15_000, ...clock })
  assert.equal((await getEmailJobs(pool, id)).find((j) => j.kind === "family_confirmation").status, "failed")

  assert.deepEqual(await requeueEmailForAdmin(pool, id, "family_pending", NOW), { ok: false, reason: "wrong_status" })
  assert.deepEqual(await requeueEmailForAdmin(pool, id, "family_confirmation", NOW), { ok: true })
  assert.deepEqual(await requeueEmailForAdmin(pool, id, "family_confirmation", NOW), { ok: false, reason: "in_progress" })
  failConfirmation = false
  await processEmailOutbox(pool, { send, onlyPublicIds: [id], deadlineMs: 15_000, ...fakeClock() })
  const job = (await getEmailJobs(pool, id)).find((j) => j.kind === "family_confirmation")
  assert.equal(job.status, "sent")
  assert.equal(job.generation, 2)
  const confirmationKeys = keys.filter((k) => k.includes("family_confirmation"))
  assert.deepEqual(confirmationKeys.map((k) => k.slice(-3)), ["/g1", "/g2"])
  assert.equal(await countRows("sat_intensive_payments", id), 1)
  assert.equal((await getEnrollment(pool, id)).status, "confirmed")
  assert.deepEqual(await requeueEmailForAdmin(pool, id, "family_confirmation", NOW), { ok: false, reason: "cooldown" })
})

test("a pending-only registration never receives a confirmation email", { skip: dbSkip }, async () => {
  const r = await reserveSeat(pool, PROGRAM, student(), NOW, 50)
  assert.deepEqual(await requeueEmailForAdmin(pool, r.record.publicId, "family_confirmation", NOW), { ok: false, reason: "wrong_status" })
})

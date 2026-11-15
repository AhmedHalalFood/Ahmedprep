// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/sat-final-intensive-payments.test.mjs
// Database tests run only against the Preview Neon branch, inside an isolated program key that is deleted afterwards.
import { test, after } from "node:test"
import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import pg from "pg"
import Stripe from "stripe"
import {
  backoffMs,
  classifyResendResult,
  getEmailJobs,
  processEmailOutbox,
  requeueEmailForAdmin,
} from "../lib/sat-final-intensive-email-outbox.ts"
import {
  attachCheckoutSession,
  confirmPayment,
  getEnrollment,
  getSeatSummary,
  prepareCheckoutHold,
  reserveSeat,
} from "../lib/sat-final-intensive-enrollment.ts"
import { handleStripeWebhook, isLiveKey, stripeSetup } from "../lib/sat-final-intensive-stripe.ts"

const PREVIEW_ENDPOINT = "ep-quiet-breeze-b8qi4eg2"
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
const endpoint = url ? new URL(url).hostname.split(".")[0].replace(/-pooler$/, "") : null
const dbSkip = endpoint === PREVIEW_ENDPOINT ? false : "needs the Preview database"
const pool = dbSkip ? null : new pg.Pool({ connectionString: url, max: 4 })
const PROGRAM = `test-${randomUUID()}`
const NOW = new Date("2026-11-14T15:00:00Z")

let counter = 0
function student(overrides = {}) {
  counter++
  return {
    studentName: `Test Student ${counter}`,
    studentGrade: "11th grade",
    parentName: "Test Parent",
    parentEmail: `parent${counter}@example.com`,
    parentPhone: "(347) 555-0123",
    firstClassDate: "2026-11-23",
    previousScore: "",
    targetScore: "1400",
    satRegistration: "registered",
    policyAcknowledged: true,
    ...overrides,
  }
}

/** A clock that only moves when the worker sleeps, so backoff is exercised without real waiting. */
function fakeClock() {
  let offset = 0
  return {
    now: () => new Date(Date.now() + offset),
    sleep: async (ms) => {
      offset += ms
    },
  }
}

async function confirmedEnrollment(capacity = 25) {
  const reserved = await reserveSeat(pool, PROGRAM, student(), NOW, capacity)
  assert.equal(reserved.ok, true)
  const confirmed = await confirmPayment(pool, PROGRAM, reserved.publicId, reserved.paymentToken, `sim-${randomUUID()}`, NOW, capacity)
  assert.equal(confirmed.ok, true)
  return reserved.publicId
}

after(async () => {
  if (!pool) return
  const ids = `SELECT public_id FROM sat_intensive_enrollments WHERE program_key = $1`
  await pool.query(
    `DELETE FROM sat_intensive_email_attempts WHERE outbox_id IN (SELECT id FROM sat_intensive_email_outbox WHERE enrollment_public_id IN (${ids}))`,
    [PROGRAM],
  )
  await pool.query(`DELETE FROM sat_intensive_email_outbox WHERE enrollment_public_id IN (${ids})`, [PROGRAM])
  await pool.query(`DELETE FROM sat_intensive_stripe_events WHERE enrollment_public_id IN (${ids})`, [PROGRAM])
  await pool.query(`DELETE FROM sat_intensive_enrollments WHERE program_key = $1`, [PROGRAM])
  await pool.end()
})

// ---------- pure logic ----------

test("Resend responses are classified: rate limits and 5xx retry, validation and quota errors do not", () => {
  assert.equal(classifyResendResult({ data: { id: "m1" } }).kind, "sent")
  assert.equal(classifyResendResult({ error: { name: "rate_limit_exceeded", statusCode: 429 } }).kind, "retry")
  assert.equal(classifyResendResult({ error: { name: "internal_server_error", statusCode: 500 } }).kind, "retry")
  assert.equal(classifyResendResult({ error: { name: "validation_error", statusCode: 422 } }).kind, "failed")
  assert.equal(classifyResendResult({ error: { name: "daily_quota_exceeded", statusCode: 429 } }).kind, "failed")
  // Same idempotency key already accepted means the earlier attempt delivered it.
  assert.equal(classifyResendResult({ error: { name: "invalid_idempotent_request", statusCode: 409 } }).kind, "sent")
})

test("backoff grows exponentially, is jittered within [0.5x, 1.5x), and is capped at one hour", () => {
  assert.equal(backoffMs(1, () => 0), 1_000)
  assert.equal(backoffMs(3, () => 0.5), 8_000)
  assert.ok(backoffMs(2, () => 0.999) < 6_000)
  assert.equal(backoffMs(40, () => 0.5), 60 * 60_000)
})

test("Stripe is inert without keys and refuses live keys outright", () => {
  assert.deepEqual(stripeSetup({}), { ok: false, reason: "not_configured" })
  assert.equal(stripeSetup({ STRIPE_SECRET_KEY: "sk_live_abc", STRIPE_WEBHOOK_SECRET: "whsec_x" }).reason, "live_key_refused")
  assert.equal(stripeSetup({ STRIPE_SECRET_KEY: "rk_live_abc", STRIPE_WEBHOOK_SECRET: "whsec_x" }).reason, "live_key_refused")
  assert.equal(stripeSetup({ STRIPE_SECRET_KEY: "pk_test_abc", STRIPE_WEBHOOK_SECRET: "whsec_x" }).reason, "live_key_refused")
  assert.equal(stripeSetup({ STRIPE_SECRET_KEY: "sk_test_abc", STRIPE_WEBHOOK_SECRET: "whsec_x" }).ok, true)
  assert.equal(isLiveKey("sk_test_abc"), false)
})

// ---------- email outbox ----------

test("a duplicated payment confirmation enqueues each email exactly once", { skip: dbSkip }, async () => {
  const reserved = await reserveSeat(pool, PROGRAM, student(), NOW)
  const first = await confirmPayment(pool, PROGRAM, reserved.publicId, reserved.paymentToken, "sim-a", NOW)
  const second = await confirmPayment(pool, PROGRAM, reserved.publicId, reserved.paymentToken, "sim-b", NOW)
  assert.equal(first.ok && first.alreadyConfirmed, false)
  assert.equal(second.ok && second.alreadyConfirmed, true)
  const jobs = await getEmailJobs(pool, reserved.publicId)
  assert.deepEqual(jobs.map((j) => [j.kind, j.status, j.generation]), [
    ["admin_notification", "pending", 1],
    ["family_confirmation", "pending", 1],
  ])
})

test("a rate-limited send is retried with the same idempotency key and then succeeds", { skip: dbSkip }, async () => {
  const publicId = await confirmedEnrollment()
  const calls = []
  let familyFailures = 0
  const send = async (payload, key) => {
    calls.push({ to: payload.to[0], key })
    if (key.includes("family_confirmation") && familyFailures++ < 2) {
      return { kind: "retry", errorName: "rate_limit_exceeded", statusCode: 429 }
    }
    return { kind: "sent", messageId: `msg-${calls.length}` }
  }
  const summary = await processEmailOutbox(pool, { send, onlyPublicIds: [publicId], random: () => 0, ...fakeClock() })
  assert.equal(summary.sent, 2)
  assert.equal(summary.retried, 2)

  const familyKeys = calls.filter((c) => c.key.includes("family_confirmation")).map((c) => c.key)
  assert.equal(familyKeys.length, 3)
  assert.equal(new Set(familyKeys).size, 1, "every retry reuses one key, so Resend cannot deliver twice")
  assert.equal(familyKeys[0], `sat-intensive/family_confirmation/${publicId}/g1`)

  const jobs = await getEmailJobs(pool, publicId)
  assert.ok(jobs.every((j) => j.status === "sent"))
  const { rows } = await pool.query(
    `SELECT a.outcome FROM sat_intensive_email_attempts a JOIN sat_intensive_email_outbox o ON o.id = a.outbox_id
     WHERE o.enrollment_public_id = $1 AND o.kind = 'family_confirmation' ORDER BY a.attempt`,
    [publicId],
  )
  assert.deepEqual(rows.map((r) => r.outcome), ["retry", "retry", "sent"])

  // A second run finds nothing to do: no duplicate sends.
  const again = await processEmailOutbox(pool, { send, onlyPublicIds: [publicId], ...fakeClock() })
  assert.equal(again.sent + again.retried + again.failed, 0)
})

test("transient failures stop after max attempts; permanent failures stop immediately", { skip: dbSkip }, async () => {
  const publicId = await confirmedEnrollment()
  const send = async (_payload, key) =>
    key.includes("family_confirmation")
      ? { kind: "retry", errorName: "internal_server_error", statusCode: 500 }
      : { kind: "failed", errorName: "validation_error", statusCode: 422 }
  // The fake clock jumps through backoff instantly; a long real deadline lets every attempt run.
  await processEmailOutbox(pool, { send, onlyPublicIds: [publicId], random: () => 0, deadlineMs: 24 * 3_600_000, ...fakeClock() })
  const jobs = Object.fromEntries((await getEmailJobs(pool, publicId)).map((j) => [j.kind, j]))
  assert.equal(jobs.admin_notification.status, "failed")
  assert.equal(jobs.admin_notification.attempts, 1)
  assert.equal(jobs.family_confirmation.status, "failed")
  assert.match(jobs.family_confirmation.lastError ?? jobs.family_confirmation.last_error ?? "", /retries exhausted/)
})

test("an administrator resend starts a new generation with a new key and is rate limited", { skip: dbSkip }, async () => {
  const publicId = await confirmedEnrollment()
  const keys = []
  const send = async (_payload, key) => {
    keys.push(key)
    return { kind: "sent", messageId: "m" }
  }
  await processEmailOutbox(pool, { send, onlyPublicIds: [publicId], ...fakeClock() })

  const resendAt = new Date()
  assert.deepEqual(await requeueEmailForAdmin(pool, publicId, "family_confirmation", resendAt), { ok: true })
  assert.deepEqual(await requeueEmailForAdmin(pool, publicId, "family_confirmation", resendAt), { ok: false, reason: "in_progress" })
  await processEmailOutbox(pool, { send, onlyPublicIds: [publicId], now: () => resendAt, sleep: async () => {} })

  // Once delivered, another resend inside the cooldown window is refused, and allowed after it.
  const soon = new Date(resendAt.getTime() + 30_000)
  assert.deepEqual(await requeueEmailForAdmin(pool, publicId, "family_confirmation", soon), { ok: false, reason: "cooldown" })
  const later = new Date(resendAt.getTime() + 3 * 60_000)
  assert.deepEqual(await requeueEmailForAdmin(pool, publicId, "family_confirmation", later), { ok: true })
  await processEmailOutbox(pool, { send, onlyPublicIds: [publicId], now: () => later, sleep: async () => {} })

  const familyKeys = keys.filter((k) => k.includes("family_confirmation"))
  assert.deepEqual(familyKeys, [
    `sat-intensive/family_confirmation/${publicId}/g1`,
    `sat-intensive/family_confirmation/${publicId}/g2`,
    `sat-intensive/family_confirmation/${publicId}/g3`,
  ])
  // The payment and seat are untouched by a resend.
  const record = await getEnrollment(pool, publicId)
  assert.equal(record.status, "confirmed")
})

test("a resend is refused for an enrollment that is not confirmed", { skip: dbSkip }, async () => {
  const reserved = await reserveSeat(pool, PROGRAM, student(), NOW)
  assert.deepEqual(await requeueEmailForAdmin(pool, reserved.publicId, "family_confirmation", NOW), { ok: false, reason: "not_confirmed" })
})

// ---------- Stripe webhook (test mode, signed locally) ----------

const WEBHOOK_SECRET = "whsec_test_local_only"
const stripe = new Stripe("sk_test_local_only")
const setup = { stripe, webhookSecret: WEBHOOK_SECRET }

function signedEvent(type, session, overrides = {}) {
  const payload = JSON.stringify({
    id: `evt_${randomUUID().replace(/-/g, "")}`,
    object: "event",
    type,
    livemode: false,
    created: Math.floor(NOW.getTime() / 1000),
    data: { object: { object: "checkout.session", ...session } },
    ...overrides,
  })
  return { payload, signature: stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET }) }
}

async function checkoutFor(capacity = 25) {
  const reserved = await reserveSeat(pool, PROGRAM, student(), NOW, capacity)
  const hold = await prepareCheckoutHold(pool, PROGRAM, reserved.publicId, reserved.paymentToken, NOW)
  assert.equal(hold.ok, true)
  const sessionId = `cs_test_${randomUUID().replace(/-/g, "")}`
  await attachCheckoutSession(pool, reserved.publicId, sessionId)
  const session = {
    id: sessionId,
    client_reference_id: reserved.publicId,
    metadata: { enrollment_id: reserved.publicId, program_key: PROGRAM },
    payment_status: "paid",
    payment_intent: `pi_test_${counter}`,
    amount_total: hold.record.tuitionCents,
    currency: "usd",
  }
  return { publicId: reserved.publicId, session }
}

test("checkout extends the hold past the Stripe session lifetime", { skip: dbSkip }, async () => {
  const reserved = await reserveSeat(pool, PROGRAM, student(), NOW)
  const hold = await prepareCheckoutHold(pool, PROGRAM, reserved.publicId, reserved.paymentToken, NOW)
  assert.equal(hold.ok, true)
  assert.ok(hold.record.holdExpiresAt.getTime() > hold.sessionExpiresAt.getTime())
  const wrongToken = await prepareCheckoutHold(pool, PROGRAM, reserved.publicId, "not-the-token", NOW)
  assert.equal(wrongToken.ok, false)
})

test("unsigned, tampered, and live-mode webhooks are rejected", { skip: dbSkip }, async () => {
  const { session } = await checkoutFor()
  const good = signedEvent("checkout.session.completed", session)
  assert.equal((await handleStripeWebhook(pool, PROGRAM, good.payload, null, setup, NOW)).status, 400)
  const tampered = good.payload.replace(`"amount_total":${session.amount_total}`, `"amount_total":1`)
  assert.equal((await handleStripeWebhook(pool, PROGRAM, tampered, good.signature, setup, NOW)).status, 400)
  const live = signedEvent("checkout.session.completed", session, { livemode: true })
  const liveResult = await handleStripeWebhook(pool, PROGRAM, live.payload, live.signature, setup, NOW)
  assert.deepEqual([liveResult.status, liveResult.outcome], [400, "live_event_refused"])
})

test("a paid checkout confirms once; replays and duplicate events change nothing", { skip: dbSkip }, async () => {
  const { publicId, session } = await checkoutFor()
  const event = signedEvent("checkout.session.completed", session)
  const first = await handleStripeWebhook(pool, PROGRAM, event.payload, event.signature, setup, NOW)
  assert.deepEqual([first.status, first.outcome], [200, "confirmed"])
  const replay = await handleStripeWebhook(pool, PROGRAM, event.payload, event.signature, setup, NOW)
  assert.equal(replay.outcome, "duplicate")
  const otherEvent = signedEvent("checkout.session.async_payment_succeeded", session)
  const second = await handleStripeWebhook(pool, PROGRAM, otherEvent.payload, otherEvent.signature, setup, NOW)
  assert.equal(second.outcome, "already_confirmed")

  const record = await getEnrollment(pool, publicId)
  assert.equal(record.status, "confirmed")
  assert.equal((await getEmailJobs(pool, publicId)).length, 2)
})

test("a wrong amount or currency is never confirmed and is flagged for review", { skip: dbSkip }, async () => {
  const { publicId, session } = await checkoutFor()
  const event = signedEvent("checkout.session.completed", { ...session, amount_total: session.amount_total - 100 })
  const result = await handleStripeWebhook(pool, PROGRAM, event.payload, event.signature, setup, NOW)
  assert.match(result.outcome, /^needs_review/)
  const record = await getEnrollment(pool, publicId)
  assert.equal(record.status, "needs_review")
  assert.equal((await getEmailJobs(pool, publicId)).length, 0)
})

test("an unpaid session waits, and an expired session releases its seat", { skip: dbSkip }, async () => {
  const { publicId, session } = await checkoutFor()
  const unpaid = signedEvent("checkout.session.completed", { ...session, payment_status: "unpaid" })
  assert.equal((await handleStripeWebhook(pool, PROGRAM, unpaid.payload, unpaid.signature, setup, NOW)).outcome, "awaiting_payment")
  assert.equal((await getEnrollment(pool, publicId)).status, "pending_payment")

  const heldBefore = (await getSeatSummary(pool, PROGRAM, NOW)).held
  const expired = signedEvent("checkout.session.expired", { ...session, payment_status: "unpaid" })
  assert.equal((await handleStripeWebhook(pool, PROGRAM, expired.payload, expired.signature, setup, NOW)).outcome, "hold_released")
  assert.equal((await getSeatSummary(pool, PROGRAM, NOW)).held, heldBefore - 1)
  assert.equal((await getEnrollment(pool, publicId)).status, "expired")
})

test("events for another program are ignored", { skip: dbSkip }, async () => {
  const { publicId, session } = await checkoutFor()
  const event = signedEvent("checkout.session.completed", { ...session, metadata: { enrollment_id: publicId, program_key: "other" } })
  assert.equal((await handleStripeWebhook(pool, PROGRAM, event.payload, event.signature, setup, NOW)).outcome, "not_this_program")
  assert.equal((await getEnrollment(pool, publicId)).status, "pending_payment")
})

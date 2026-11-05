// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { setEmailTransportForTests } from "../lib/email-sender.ts"
import { deliverLead } from "../lib/lead-delivery.ts"
import { inquiryReceivedMessage } from "../lib/enrollment-2027.ts"

const PARENT = "Sample Parent"
const FAMILY = "parent.confirm-test@example.com"
const ENV_KEYS = ["VERCEL_ENV", "RESEND_API_KEY", "RESEND_EMAIL_DOMAIN"]
const SENT_TEXT = `Thank you, ${PARENT}. We received your January 2027 Enrollment inquiry and sent a confirmation to ${FAMILY}.`
const UNCONFIRMED_TEXT = `Thank you, ${PARENT}. We received your January 2027 Enrollment inquiry, but we could not confirm that a confirmation email was sent to ${FAMILY}.`

let savedEnv
let attempts
let restoreConsole
const store = new Map()
const isConfirmation = (options) => String(options?.idempotencyKey ?? "").includes("-confirmation/")

// Mimics Resend, including its shared idempotency store. failConfirmation simulates a rejected parent email.
function fakeTransport({ failConfirmation = false } = {}) {
  return () => ({
    send: async (payload, options) => {
      attempts.push({ payload, options })
      if (failConfirmation && isConfirmation(options)) return { data: null, error: { name: "validation_error", message: "rejected" } }
      const key = options?.idempotencyKey
      if (key && store.has(key)) return { data: null, error: { name: "invalid_idempotent_request", message: "reused" } }
      const id = `fake_${attempts.length}`
      if (key) store.set(key, id)
      attempts.at(-1).delivered = true
      return { data: { id }, error: null }
    },
  })
}

function lead(events) {
  return {
    scope: "enrollment-2027",
    fromLocalPart: "consultations",
    heading: "New Enrollment Inquiry: January 2027 Enrollment",
    subject: "January 2027 Enrollment inquiry: test",
    replyTo: FAMILY,
    rows: [["Parent/Guardian Name", PARENT], ["Email", FAMILY]],
    dedupeKey: ["confirmation-test-key"],
    persisted: { label: "lead_submissions #1" },
    onDelivery: async (event) => void events.push(event),
    confirmation: { to: FAMILY, subject: "We received your inquiry", heading: "Enrollment inquiry received", paragraphs: [`Hello ${PARENT},`] },
  }
}

const deliveredConfirmations = () => attempts.filter((a) => isConfirmation(a.options) && a.delivered)

beforeEach(() => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]))
  delete process.env.VERCEL_ENV
  process.env.RESEND_API_KEY = "re_fake_test_key"
  process.env.RESEND_EMAIL_DOMAIN = "ahmedprep.com"
  attempts = []
  store.clear()
  const original = { log: console.log, warn: console.warn, error: console.error }
  for (const level of Object.keys(original)) console[level] = () => {}
  restoreConsole = () => Object.assign(console, original)
})

afterEach(() => {
  restoreConsole()
  setEmailTransportForTests(null)
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k]
    else process.env[k] = savedEnv[k]
  }
})

test("successful confirmation shows the existing confirmation message", async () => {
  setEmailTransportForTests(fakeTransport())
  const events = []
  const result = await (await deliverLead(lead(events))).json()

  assert.equal(result.success, true)
  assert.equal(result.confirmation, "sent")
  assert.equal(deliveredConfirmations().length, 1)
  assert.deepEqual(inquiryReceivedMessage(result, PARENT, FAMILY), { confirmed: true, text: SENT_TEXT })
})

test("failed confirmation keeps the saved inquiry and says the email could not be confirmed", async () => {
  setEmailTransportForTests(fakeTransport({ failConfirmation: true }))
  const events = []
  const result = await (await deliverLead(lead(events))).json()

  assert.equal(result.success, true, "the inquiry still counts as received")
  assert.equal(result.confirmation, "failed")
  assert.ok(events.some((e) => e.stage === "admin" && e.ok), "AhmedPrep was still notified, so the lead is kept")
  assert.ok(events.some((e) => e.stage === "confirmation" && e.status === "failed"), "the failure is recorded for follow-up")
  assert.equal(deliveredConfirmations().length, 0)
  assert.deepEqual(inquiryReceivedMessage(result, PARENT, FAMILY), { confirmed: false, text: UNCONFIRMED_TEXT })
})

test("confirmation not requested or unknown is never shown as sent", () => {
  for (const result of [{ success: true, confirmation: "not_requested" }, { success: true }, null, undefined, "sent"]) {
    assert.equal(inquiryReceivedMessage(result, PARENT, FAMILY).confirmed, false)
  }
})

test("duplicate submission sends no second email and is shown as unconfirmed", async () => {
  setEmailTransportForTests(fakeTransport())
  await deliverLead(lead([]))
  await deliverLead(lead([]))
  assert.equal(deliveredConfirmations().length, 1, "Resend idempotency allows only one confirmation")

  // A repeat the database recognises returns before any email is attempted.
  const storage = readFileSync(new URL("../lib/lead-storage.ts", import.meta.url), "utf8")
  const duplicateBranch = storage.slice(storage.indexOf('claim.kind === "duplicate"'), storage.indexOf("return deliverLead("))
  assert.match(duplicateBranch, /return NextResponse\.json\(\{ success: true, duplicate: true, saved: true \}\)/)

  const message = inquiryReceivedMessage({ success: true, duplicate: true, saved: true }, PARENT, FAMILY)
  assert.deepEqual(message, { confirmed: false, text: UNCONFIRMED_TEXT })
})

test("form uses the server result and offers contact details when unconfirmed", () => {
  const form = readFileSync(new URL("../components/enrollment-2027-form.tsx", import.meta.url), "utf8")
  assert.match(form, /inquiryReceivedMessage\(serverResult, submitted\.parentName, submitted\.email\)/)
  assert.doesNotMatch(form, /inquiry and sent a confirmation to \$\{submitted\.email\}/, "no hard-coded sent message")
  assert.match(form, /!received\.confirmed &&[\s\S]*BUSINESS\.phoneHref[\s\S]*BUSINESS\.email/)
})

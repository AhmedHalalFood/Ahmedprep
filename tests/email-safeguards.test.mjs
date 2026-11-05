// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  FAMILY_SENDER,
  INTERNAL_SENDER,
  SOURCE_CHECK_SENDER,
  TEST_INBOX,
  prepareSend,
  setEmailTransportForTests,
} from "../lib/email-sender.ts"
import { deliverLead, sendAdminAlert, sendConfirmationEmail } from "../lib/lead-delivery.ts"

const FAMILY = "parent.c1test@example.com"
const ADMIN = "Tariq@ahmedprep.com"
const ENV_KEYS = ["VERCEL_ENV", "RESEND_API_KEY", "RESEND_EMAIL_DOMAIN"]
let savedEnv
let sent
let logs
let restoreConsole

// Mimics Resend: one shared idempotency store for the whole account, like the real shared API key.
const store = new Map()
function fakeTransport() {
  return {
    send: async (payload, options) => {
      sent.push({ payload, options })
      const key = options?.idempotencyKey
      if (key && store.has(key)) return { data: null, error: { name: "invalid_idempotent_request", message: "reused" } }
      const id = `fake_${sent.length}`
      if (key) store.set(key, id)
      return { data: { id }, error: null }
    },
  }
}

function setEnv(env) {
  if (env === undefined) delete process.env.VERCEL_ENV
  else process.env.VERCEL_ENV = env
}

beforeEach(() => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]))
  process.env.RESEND_API_KEY = "re_fake_test_key"
  process.env.RESEND_EMAIL_DOMAIN = "ahmedprep.com"
  sent = []
  logs = []
  store.clear()
  setEmailTransportForTests(fakeTransport)
  const original = { log: console.log, warn: console.warn, error: console.error }
  for (const level of Object.keys(original)) console[level] = (...args) => logs.push(args.map(String).join(" "))
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

const lead = (overrides = {}) => ({
  scope: "enrollment-2027",
  fromLocalPart: "consultations",
  heading: "New 2027 enrollment inquiry",
  subject: "New 2027 enrollment inquiry",
  replyTo: FAMILY,
  rows: [
    ["Parent", "C1 Test Parent"],
    ["Email", FAMILY],
  ],
  confirmation: { to: FAMILY, subject: "We received your inquiry", heading: "Thank you", paragraphs: ["We will be in touch."] },
  ...overrides,
})

// Recipient redirection
for (const env of ["preview", "development", "", undefined]) {
  test(`VERCEL_ENV=${JSON.stringify(env)} redirects every recipient, drops CC/BCC, and marks the subject`, () => {
    setEnv(env)
    const { payload } = prepareSend({
      from: FAMILY_SENDER,
      to: [FAMILY, ADMIN],
      cc: ["cc@example.com"],
      bcc: ["bcc@example.com"],
      subject: "Hello",
      text: "x",
    })
    assert.deepEqual(payload.to, [TEST_INBOX])
    assert.equal(payload.cc, undefined)
    assert.equal(payload.bcc, undefined)
    assert.equal(payload.subject, "[PREVIEW] Hello")
  })
}

test("the [PREVIEW] marker is added only once", () => {
  setEnv("preview")
  const { payload } = prepareSend({ from: FAMILY_SENDER, to: [FAMILY], subject: "[PREVIEW] Hello", text: "x" })
  assert.equal(payload.subject, "[PREVIEW] Hello")
})

test("Production sends are unchanged, including recipients, CC/BCC, subject, and idempotency key", () => {
  setEnv("production")
  const input = { from: FAMILY_SENDER, to: [FAMILY], cc: ["cc@example.com"], subject: "Hello", text: "x" }
  const options = { idempotencyKey: "enrollment-2027/abc" }
  const out = prepareSend(input, options)
  assert.equal(out.payload, input)
  assert.equal(out.options, options)
})

test("a lookalike value such as 'Production' is not treated as Production", () => {
  setEnv("Production")
  assert.deepEqual(prepareSend({ from: FAMILY_SENDER, to: [FAMILY], subject: "s", text: "x" }).payload.to, [TEST_INBOX])
})

test("a full Preview lead delivery never addresses a real person", async () => {
  setEnv("preview")
  await deliverLead(lead())
  assert.equal(sent.length, 2)
  for (const { payload } of sent) {
    assert.deepEqual(payload.to, [TEST_INBOX])
    assert.ok(payload.subject.startsWith("[PREVIEW] "))
  }
})

// Sender names
test("Production admin notice uses the internal sender, and the confirmation uses the family sender", async () => {
  setEnv("production")
  await deliverLead(lead())
  assert.equal(sent[0].payload.from, INTERNAL_SENDER)
  assert.equal(sent[1].payload.from, FAMILY_SENDER)
})

test("standalone admin alerts use the internal sender, and admin resends use the family sender", async () => {
  setEnv("production")
  await sendAdminAlert({ scope: "s", fromLocalPart: "classes", subject: "Alert", text: "t", replyTo: FAMILY, idempotencyKey: "k1" })
  await sendConfirmationEmail({ to: FAMILY, subject: "Resent", heading: "h", paragraphs: ["p"] }, "classes", "k2")
  assert.equal(sent[0].payload.from, INTERNAL_SENDER)
  assert.equal(sent[1].payload.from, FAMILY_SENDER)
})

test("sender constants match the approved convention exactly", () => {
  assert.equal(FAMILY_SENDER, "AhmedPrep <noreply@ahmedprep.com>")
  assert.equal(INTERNAL_SENDER, "AhmedPrep Website <noreply@ahmedprep.com>")
  assert.equal(SOURCE_CHECK_SENDER, "AhmedPrep Source Check <noreply@ahmedprep.com>")
})

test("the source-check alert uses the Source Check sender and sets no Reply-To", () => {
  const route = readFileSync(new URL("../app/api/cron/check-official-sources/route.ts", import.meta.url), "utf8")
  assert.match(route, /from: SOURCE_CHECK_SENDER/)
  assert.doesNotMatch(route, /replyTo/i)
})

// Reply-To preservation
test("Reply-To: admin notices reply to the family, confirmations reply to Tariq", async () => {
  setEnv("production")
  await deliverLead(lead())
  assert.equal(sent[0].payload.replyTo, FAMILY)
  assert.equal(sent[1].payload.replyTo, ADMIN)
})

test("Reply-To is preserved outside Production too", async () => {
  setEnv("preview")
  await deliverLead(lead())
  assert.equal(sent[0].payload.replyTo, FAMILY)
  assert.equal(sent[1].payload.replyTo, ADMIN)
})

test("standalone alerts reply to the submitter, and admin resends reply to Tariq", async () => {
  setEnv("production")
  await sendAdminAlert({ scope: "s", fromLocalPart: "classes", subject: "Alert", text: "t", replyTo: FAMILY, idempotencyKey: "k1" })
  await sendConfirmationEmail({ to: FAMILY, subject: "Resent", heading: "h", paragraphs: ["p"] }, "classes", "k2")
  assert.equal(sent[0].payload.replyTo, FAMILY)
  assert.equal(sent[1].payload.replyTo, ADMIN)
})

// Missing environment settings
test("a missing VERCEL_ENV fails safe to the test inbox", async () => {
  setEnv(undefined)
  await deliverLead(lead())
  for (const { payload } of sent) assert.deepEqual(payload.to, [TEST_INBOX])
})

test("missing Resend settings send nothing", async () => {
  setEnv("preview")
  delete process.env.RESEND_API_KEY
  const response = await deliverLead(lead())
  assert.equal(sent.length, 0)
  assert.equal(response.status, 500)
})

// Duplicate-send behavior
test("Production passes idempotency keys through unchanged and still blocks a true duplicate", async () => {
  setEnv("production")
  await deliverLead(lead())
  assert.match(sent[0].options.idempotencyKey, /^enrollment-2027\/[0-9a-f]{64}$/)
  assert.match(sent[1].options.idempotencyKey, /^enrollment-2027-confirmation\/[0-9a-f]{64}$/)
  const body = await (await deliverLead(lead())).json()
  assert.equal(body.duplicate, true)
})

test("a Preview test with identical details cannot suppress the real Production email", async () => {
  setEnv("preview")
  await deliverLead(lead())
  const previewKeys = sent.map((s) => s.options.idempotencyKey)
  for (const key of previewKeys) assert.ok(key.startsWith("nonprod/preview/"))

  setEnv("production")
  sent = []
  const body = await (await deliverLead(lead())).json()
  assert.equal(body.duplicate, false)
  assert.equal(sent.length, 2)
  for (const { options } of sent) assert.ok(!options.idempotencyKey.startsWith("nonprod/"))
  assert.deepEqual(sent.map((s) => s.payload.to), [[ADMIN], [FAMILY]])
})

test("Development and Preview use separate namespaces", () => {
  setEnv("development")
  const dev = prepareSend({ from: FAMILY_SENDER, to: [FAMILY], subject: "s", text: "x" }, { idempotencyKey: "k" })
  setEnv("preview")
  const preview = prepareSend({ from: FAMILY_SENDER, to: [FAMILY], subject: "s", text: "x" }, { idempotencyKey: "k" })
  assert.equal(dev.options.idempotencyKey, "nonprod/development/k")
  assert.equal(preview.options.idempotencyKey, "nonprod/preview/k")
})

// Safe logging
test("redirect logs never contain email addresses, names, or the API key", async () => {
  setEnv("preview")
  await deliverLead(lead())
  const joined = logs.join("\n")
  assert.match(joined, /\[email\] preview: redirected 1 recipient\(s\) to the test inbox/)
  assert.doesNotMatch(joined, /@/)
  assert.doesNotMatch(joined, /C1 Test Parent/)
  assert.doesNotMatch(joined, /re_fake_test_key/)
})

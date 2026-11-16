// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  CLASS_DATES,
  availableStartDates,
  hasClassStarted,
  quoteFor,
  validateRegistration,
} from "../lib/sat-final-intensive.ts"

const EXPECTED = [
  ["2026-11-16", 11, 33, 82500],
  ["2026-11-17", 10, 30, 75000],
  ["2026-11-18", 9, 27, 67500],
  ["2026-11-19", 8, 24, 60000],
  ["2026-11-23", 7, 21, 52500],
  ["2026-11-24", 6, 18, 45000],
  ["2026-11-25", 5, 15, 37500],
  ["2026-11-30", 4, 12, 30000],
  ["2026-12-01", 3, 9, 22500],
  ["2026-12-02", 2, 6, 15000],
  ["2026-12-03", 1, 3, 7500],
]

test("schedule is the 11 approved dates with no Thanksgiving class", () => {
  assert.deepEqual([...CLASS_DATES], EXPECTED.map((r) => r[0]))
  assert.ok(!CLASS_DATES.includes("2026-11-26"))
})

test("rolling tuition matches the approved table", () => {
  for (const [date, classes, hours, cents] of EXPECTED) {
    const q = quoteFor(date)
    assert.equal(q.remainingClasses, classes, date)
    assert.equal(q.remainingHours, hours, date)
    assert.equal(q.tuitionCents, cents, date)
  }
})

test("a class closes at 6:00 PM New York time on its date (EST, UTC-5)", () => {
  assert.equal(hasClassStarted("2026-11-16", new Date("2026-11-16T22:59:00Z")), false)
  assert.equal(hasClassStarted("2026-11-16", new Date("2026-11-16T23:00:00Z")), true)
  assert.equal(availableStartDates(new Date("2026-11-16T23:00:00Z"))[0], "2026-11-17")
  assert.deepEqual(availableStartDates(new Date("2026-12-03T23:00:00Z")), [])
})

const valid = {
  studentName: "Sara Khan",
  studentGrade: "11th grade",
  parentName: "Amina Khan",
  parentEmail: "amina@example.com",
  parentPhone: "(347) 555-0123",
  firstClassDate: "2026-11-23",
  previousScore: "",
  targetScore: "1400",
  satRegistration: "registered",
  paymentMethod: "zelle",
  policyAcknowledged: true,
}
const before = new Date("2026-11-14T12:00:00Z")

test("valid registration passes", () => {
  assert.deepEqual(validateRegistration(valid, before), {})
})

test("required fields, policy acknowledgment, and started classes are rejected", () => {
  const e = validateRegistration({ ...valid, parentEmail: "bad", parentPhone: "12", policyAcknowledged: false, studentName: "" }, before)
  for (const k of ["parentEmail", "parentPhone", "policyAcknowledged", "studentName"]) assert.ok(e[k], k)
  assert.ok(validateRegistration({ ...valid, firstClassDate: "2026-11-26" }, before).firstClassDate)
  assert.ok(validateRegistration(valid, new Date("2026-11-24T00:00:00Z")).firstClassDate)
})

test("the launched page is public and indexable; it submits inquiries, never payments", () => {
  const page = readFileSync("app/digital-sat-final-intensive-december-2026/page.tsx", "utf8")
  assert.doesNotMatch(page, /internalPreviewAllowed|notFound\(\)/)
  assert.doesNotMatch(page, /index: false/)
  const form = readFileSync("components/sat-intensive/registration.tsx", "utf8")
  assert.match(form, /\/api\/sat-final-intensive\/inquiry/)
  assert.doesNotMatch(form, /\/api\/sat-final-intensive\/(register|simulate-payment)/)
})

test("seat-hold and simulated-payment APIs stay Preview-only (404 on Production)", () => {
  const src = readFileSync("app/api/sat-final-intensive/register/route.ts", "utf8")
  assert.match(src, /if \(!internalPreviewAllowed\(\)[^)]*\)\s*(return )?[\s\S]{0,20}NextResponse\.json\(\{ error: "Not found" \}, \{ status: 404 \}\)/)
  assert.throws(() => readFileSync("app/api/sat-final-intensive/simulate-payment/route.ts"), "no simulated-payment route exists")
})

test("the migration stays out of the automatic migration runner", () => {
  assert.throws(() => readFileSync("db/migrations/0008_sat_final_intensive_enrollments.sql"))
})

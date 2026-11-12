// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { ENROLLMENT_2027 } from "../lib/enrollment-2027.ts"
import {
  CLASSES,
  FOUNDING_POLICY,
  MAX_CLASS_SIZE,
  REGULAR_DUE_LABEL,
  TUITION,
  checkoutEligibility,
  deadlinesForClass,
  endOfDayEasternIso,
  isEarlyWindowOpen,
  isFoundingWindowOpen,
  paymentOptionsFor,
} from "../lib/enrollment-catalog.ts"
import { GROUP_CAPACITY, TUITION_TIERS } from "../lib/seat-availability-preview.ts"

const WINTER_2027_FILES = [
  "lib/enrollment-2027.ts",
  "lib/enrollment-catalog.ts",
  "lib/seat-availability-preview.ts",
  "app/page.tsx",
  "app/enroll-2027/page.tsx",
  "app/enroll/page.tsx",
  "app/api/enrollment-2027/route.ts",
  "components/enroll/choice-steps.tsx",
  "components/enroll/tuition-step.tsx",
  "components/enroll/checkout-preview.tsx",
  "components/landing/enrollment-2027.tsx",
]

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("tuition amounts are unchanged", () => {
  assert.equal(TUITION.regularCents, 144_000)
  assert.equal(TUITION.earlyCents, 129_600)
  assert.equal(TUITION.foundingCents, 108_000)
  assert.equal(ENROLLMENT_2027.tuition.regular.total, "$1,440")
  assert.equal(ENROLLMENT_2027.tuition.early.total, "$1,296")
  assert.equal(ENROLLMENT_2027.tuition.founding.total, "$1,080")
})

// Winter 2027: one founding-family deadline (December 12, 2026, 11:59 PM ET) and no early-payment tier.
const WINTER_FOUNDING = ["2026-12-12", "2026-12-13T04:59:59Z"]
const WINTER_CLASS_IDS = ["2027-01-shsat-weekday", "2027-01-shsat-weekend", "2027-01-dsat-weekday", "2027-01-dsat-weekend"]

test("checkout uses the single Winter founding-family deadline and no Winter early tier", () => {
  for (const classId of WINTER_CLASS_IDS) {
    const d = deadlinesForClass(classId)
    assert.deepEqual([d.founding.dateIso, d.founding.deadlineIso], WINTER_FOUNDING, `${classId} founding`)
    assert.equal(d.early, null, `${classId} early`)
  }
  assert.equal(deadlinesForClass("not-a-class"), null)
})

test("Eastern end-of-day cutoffs are DST-aware", () => {
  assert.equal(endOfDayEasternIso("2026-11-28"), "2026-11-29T04:59:59Z")
  assert.equal(endOfDayEasternIso("2027-07-01"), "2027-07-02T03:59:59Z")
  assert.equal(endOfDayEasternIso("2026-11-01"), "2026-11-02T04:59:59Z")
})

test("discount windows open and close to the second, per class", () => {
  const f = Date.parse(WINTER_FOUNDING[1])
  for (const classId of WINTER_CLASS_IDS) {
    assert.equal(isFoundingWindowOpen(classId, new Date(f)), true, classId)
    assert.equal(isFoundingWindowOpen(classId, new Date(f + 1000)), false, classId)
    assert.equal(isEarlyWindowOpen(classId, new Date("2026-11-01T12:00:00Z")), false, `${classId} has no early tier`)
  }
})

test("server eligibility enforces deadlines and the 5-seat founding cap", () => {
  const base = { classId: "2027-01-shsat-weekend", fullyPaidFoundingCount: 0 }
  const beforeFounding = new Date("2026-12-13T04:59:59Z")
  const afterFounding = new Date("2026-12-13T05:00:00Z")

  assert.deepEqual(checkoutEligibility({ ...base, payment: "founding-full", now: beforeFounding }), {
    ok: true,
    classId: base.classId,
    payment: "founding-full",
    amountCents: 108_000,
  })
  assert.equal(checkoutEligibility({ ...base, payment: "founding-full", now: afterFounding }).reason, "founding-closed")
  assert.equal(
    checkoutEligibility({ ...base, payment: "founding-full", now: beforeFounding, fullyPaidFoundingCount: 4 }).ok,
    true,
  )
  assert.equal(
    checkoutEligibility({ ...base, payment: "founding-full", now: beforeFounding, fullyPaidFoundingCount: 5 }).reason,
    "founding-full",
  )
  // Winter has no early-payment tier at any time.
  assert.equal(checkoutEligibility({ ...base, payment: "early-full", now: beforeFounding }).reason, "early-closed")
  assert.equal(checkoutEligibility({ ...base, payment: "early-full", now: afterFounding }).reason, "early-closed")
  assert.equal(checkoutEligibility({ ...base, payment: "regular-full", now: afterFounding }).amountCents, 144_000)
  assert.equal(checkoutEligibility({ ...base, payment: "regular-full", now: new Date("2027-01-09T05:00:00Z") }).reason, "class-started")
  assert.equal(checkoutEligibility({ ...base, payment: "half-off", now: beforeFounding }).reason, "unknown-payment")
  assert.equal(checkoutEligibility({ ...base, classId: "made-up", payment: "regular-full", now: beforeFounding }).reason, "unknown-class")
})

test("checkout copy shows the approved discount rules", () => {
  assert.equal(FOUNDING_POLICY.seatsPerClass, 5)
  for (const classId of WINTER_CLASS_IDS) {
    assert.match(paymentOptionsFor(classId)["founding-full"].detail, /December 12, 2026, at 11:59 PM ET/)
    assert.match(paymentOptionsFor(classId)["early-full"].detail, /Not offered for Winter 2027/)
  }
  assert.match(ENROLLMENT_2027.tuition.founding.summary, /December 12, 2026 at 11:59 PM ET/)
  assert.match(ENROLLMENT_2027.tuition.early.summary, /at least 30 calendar days before the selected cohort begins/)
  assert.match(TUITION_TIERS.find((t) => t.id === "founding").condition, /December 12, 2026, at 11:59 PM ET/)
  assert.match(TUITION_TIERS.find((t) => t.id === "early").condition, /at least 30 calendar days before the cohort begins/)
  const action = read("app/enroll/actions.ts")
  assert.match(action, /^"use server"/)
  assert.match(action, /now: new Date\(\)/)
  assert.match(read("components/enroll/checkout-preview.tsx"), /verifyCheckoutEligibility\(offering\.id, payment\)/)
})

test("regular tuition is due before the first scheduled class, with no installments", () => {
  assert.equal(REGULAR_DUE_LABEL, "before the student’s first scheduled class")
  assert.match(paymentOptionsFor("2027-01-shsat-weekday")["regular-full"].detail, /before the student’s first scheduled class/)
  assert.match(ENROLLMENT_2027.tuition.regular.summary, /before the student’s first scheduled class/)
  assert.match(TUITION_TIERS.find((t) => t.id === "regular").condition, /before the student’s first scheduled class/)
  assert.equal(
    ENROLLMENT_2027.tuition.rules,
    "Only one discount applies. Payment and installment terms will be confirmed before payment is requested.",
  )
})

test("planned start dates match the approved Winter 2027 schedule", () => {
  const starts = Object.fromEntries(CLASSES.map((c) => [c.id, c.plannedStart]))
  assert.deepEqual(starts, {
    "2027-01-shsat-weekday": "Monday, January 11, 2027",
    "2027-01-shsat-weekend": "Saturday, January 9, 2027",
    "2027-01-dsat-weekday": "Tuesday, January 12, 2027",
    "2027-01-dsat-weekend": "Saturday, January 9, 2027",
  })
  const landing = ENROLLMENT_2027.programs.flatMap((p) => p.schedules.map((s) => `${p.id} ${s.label}: ${s.start}`))
  assert.deepEqual(landing, [
    "shsat Weekday group: Monday, January 11, 2027",
    "shsat Weekend group: Saturday, January 9, 2027",
    "digital-sat Weekday group: Tuesday, January 12, 2027",
    "digital-sat Weekend group: Saturday, January 9, 2027",
  ])
  assert.equal(ENROLLMENT_2027.datesStatus, "confirmed")
})

test("class hours are preserved", () => {
  const times = Object.fromEntries(CLASSES.map((c) => [c.id, `${c.days} ${c.time}`]))
  assert.deepEqual(times, {
    "2027-01-shsat-weekday": "Monday & Wednesday 5:30–8:30 PM ET",
    "2027-01-shsat-weekend": "Saturday & Sunday 10 AM–1 PM ET",
    "2027-01-dsat-weekday": "Tuesday & Thursday 5:30–8:30 PM ET",
    "2027-01-dsat-weekend": "Saturday & Sunday 2–5 PM ET",
  })
})

test("class capacity stays at 12 everywhere", () => {
  assert.equal(MAX_CLASS_SIZE, 12)
  assert.equal(ENROLLMENT_2027.maxClassSize, 12)
  assert.equal(GROUP_CAPACITY, 12)
  assert.match(ENROLLMENT_2027.availabilityStatus, /12 per class/)
})

test("program length uses the scheduled-hours wording", () => {
  assert.equal(ENROLLMENT_2027.hours, 72)
  assert.equal(ENROLLMENT_2027.hoursLabel, "72 hours of scheduled live instruction")
  assert.match(ENROLLMENT_2027.launchNote, /72 hours of scheduled live instruction/)
  assert.match(read("lib/enrollment-2027-inquiry.ts"), /\$\{cohort\.hours\} hours of scheduled live instruction/)
})

test("no obsolete Winter 2027 policy or hours wording remains", () => {
  const obsolete = [
    /January 16/,
    /December 26/,
    /January 5, 2027/,
    /instructional hours/i,
    /hours of instruction/i,
    /installment plans for any option/,
    /\$\{E\.hours\} hours/,
    /72 hours ·/,
    /2026-12-27T04:59:59Z/,
    /December 5, 2026/,
    /December 20, 2026/,
    /2026-12-06T04:59:59Z/,
    /2026-12-21T04:59:59Z/,
  ]
  for (const file of WINTER_2027_FILES) {
    const source = read(file)
    for (const pattern of obsolete) assert.doesNotMatch(source, pattern, `${file} still matches ${pattern}`)
  }
})

test("no public page links to the seat-availability demo", () => {
  for (const file of WINTER_2027_FILES) assert.doesNotMatch(read(file), /seats-preview/, file)
  assert.match(read("app/enroll/seats-preview/page.tsx"), /index: false/)
})

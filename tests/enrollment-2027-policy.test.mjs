// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { ENROLLMENT_2027 } from "../lib/enrollment-2027.ts"
import {
  CLASSES,
  EARLY_POLICY,
  FOUNDING_POLICY,
  MAX_CLASS_SIZE,
  PAYMENT_OPTIONS,
  REGULAR_DUE_LABEL,
  TUITION,
  isEarlyWindowOpen,
  isFoundingWindowOpen,
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

test("founding-family policy is preserved: 5 seats per class, December 5, 2026", () => {
  assert.equal(FOUNDING_POLICY.seatsPerClass, 5)
  assert.equal(FOUNDING_POLICY.deadlineLabel, "December 5, 2026")
  assert.equal(isFoundingWindowOpen(new Date("2026-12-06T04:59:59Z")), true)
  assert.equal(isFoundingWindowOpen(new Date("2026-12-06T05:00:00Z")), false)
})

test("early full payment closes December 20, 2026 at 11:59:59 PM Eastern", () => {
  assert.equal(EARLY_POLICY.deadlineLabel, "December 20, 2026")
  assert.equal(EARLY_POLICY.deadlineIso, "2026-12-21T04:59:59Z")
  assert.equal(isEarlyWindowOpen(new Date("2026-12-21T04:59:59Z")), true)
  assert.equal(isEarlyWindowOpen(new Date("2026-12-21T05:00:00Z")), false)
  assert.match(PAYMENT_OPTIONS["early-full"].detail, /December 20, 2026, at 11:59:59 PM ET/)
  assert.match(
    ENROLLMENT_2027.tuition.early.summary,
    /December 12 \(weekend SHSAT or Digital SAT\), December 14 \(weekday SHSAT\), or December 15 \(weekday Digital SAT\), 2026/,
  )
  assert.match(TUITION_TIERS.find((t) => t.id === "early").condition, /December 20, 2026/)
})

test("regular tuition is due before the first scheduled class, with no installments", () => {
  assert.equal(REGULAR_DUE_LABEL, "before the student’s first scheduled class")
  assert.match(PAYMENT_OPTIONS["regular-full"].detail, /before the student’s first scheduled class/)
  assert.match(ENROLLMENT_2027.tuition.regular.summary, /before the student’s first scheduled class/)
  assert.match(TUITION_TIERS.find((t) => t.id === "regular").condition, /before the student’s first scheduled class/)
  assert.equal(
    ENROLLMENT_2027.tuition.rules,
    "Discounts cannot be combined. Payment and installment terms will be confirmed before payment is requested.",
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

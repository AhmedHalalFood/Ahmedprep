// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { EARLY_DAYS_AFTER_FOUNDING, TERMS_2027, addDays, deadlinesFor } from "../lib/cohorts-2027.ts"

const APPROVED = {
  winter: { "SHSAT Weekend": ["2026-11-28", "2026-12-19"], "Digital SAT Weekend": ["2026-11-28", "2026-12-19"], "SHSAT Weekday": ["2026-11-30", "2026-12-21"], "Digital SAT Weekday": ["2026-12-01", "2026-12-22"] },
  spring: { "SHSAT Weekend": ["2027-02-20", "2027-03-13"], "Digital SAT Weekend": ["2027-02-20", "2027-03-13"], "SHSAT Weekday": ["2027-02-22", "2027-03-15"], "Digital SAT Weekday": ["2027-02-23", "2027-03-16"] },
  summer: { "SHSAT Weekend": ["2027-05-22", "2027-06-12"], "Digital SAT Weekend": ["2027-05-22", "2027-06-12"], "SHSAT Weekday": ["2027-05-25", "2027-06-15"], "Digital SAT Weekday": ["2027-05-25", "2027-06-15"] },
}

test("early-payment deadline is exactly 21 days after founding for all 12 cohorts, before each start", () => {
  assert.equal(EARLY_DAYS_AFTER_FOUNDING, 21)
  let count = 0
  for (const term of TERMS_2027) {
    const expected = APPROVED[term.id]
    assert.ok(expected, `unexpected term ${term.id}`)
    for (const c of term.cohorts) {
      const key = `${c.program} ${c.label.startsWith("Weekday") ? "Weekday" : "Weekend"}`
      const [founding, early] = expected[key] ?? []
      const d = deadlinesFor(c)
      assert.equal(d.foundingIso, founding, `${term.id} ${key} founding`)
      assert.equal(d.earlyIso, early, `${term.id} ${key} early`)
      assert.equal(addDays(d.foundingIso, 21), d.earlyIso)
      assert.ok(d.earlyIso < c.firstIso, `${term.id} ${key} early deadline precedes start`)
      count++
    }
  }
  assert.equal(count, 12)
})

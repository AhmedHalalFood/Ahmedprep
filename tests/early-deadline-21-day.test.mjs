// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  EARLY_DAYS_AFTER_FOUNDING,
  EARLY_DAYS_BEFORE_SPRING_SUMMER,
  TERMS_2027,
  addDays,
  deadlinesFor,
  priceFor,
} from "../lib/cohorts-2027.ts"

// [founding deadline, early-payment deadline]; Spring and Summer have no founding-family deadline.
const APPROVED = {
  winter: { "SHSAT Weekend": ["2026-11-28", "2026-12-19"], "Digital SAT Weekend": ["2026-11-28", "2026-12-19"], "SHSAT Weekday": ["2026-11-30", "2026-12-21"], "Digital SAT Weekday": ["2026-12-01", "2026-12-22"] },
  spring: { "SHSAT Weekend": [null, "2027-03-06"], "Digital SAT Weekend": [null, "2027-03-06"], "SHSAT Weekday": [null, "2027-03-08"], "Digital SAT Weekday": [null, "2027-03-09"] },
  summer: { "SHSAT Weekend": [null, "2027-06-05"], "Digital SAT Weekend": [null, "2027-06-05"], "SHSAT Weekday": [null, "2027-06-08"], "Digital SAT Weekday": [null, "2027-06-08"] },
}

test("Winter keeps approved founding + early deadlines (early = founding + 21 days)", () => {
  assert.equal(EARLY_DAYS_AFTER_FOUNDING, 21)
  const winter = TERMS_2027.find((t) => t.id === "winter")
  for (const c of winter.cohorts) {
    const key = `${c.program} ${c.label.startsWith("Weekday") ? "Weekday" : "Weekend"}`
    const [founding, early] = APPROVED.winter[key]
    const d = deadlinesFor(c)
    assert.equal(d.foundingIso, founding, `winter ${key} founding`)
    assert.equal(d.earlyIso, early, `winter ${key} early`)
    assert.equal(addDays(d.foundingIso, 21), d.earlyIso)
    assert.ok(d.earlyIso < c.firstIso)
  }
})

test("Spring and Summer: no founding deadline; early ends 28 days before the first class", () => {
  assert.equal(EARLY_DAYS_BEFORE_SPRING_SUMMER, 28)
  let count = 0
  for (const term of TERMS_2027) {
    for (const c of term.cohorts) {
      const key = `${c.program} ${c.label.startsWith("Weekday") ? "Weekday" : "Weekend"}`
      const [founding, early] = APPROVED[term.id][key]
      const d = deadlinesFor(c)
      assert.equal(d.foundingIso, founding, `${term.id} ${key} founding`)
      assert.equal(d.earlyIso, early, `${term.id} ${key} early`)
      if (term.id !== "winter") assert.equal(addDays(c.firstIso, -28), d.earlyIso, `${term.id} ${key} 28 days`)
      count++
    }
  }
  assert.equal(count, 12)
})

test("approved tuition per cohort type", () => {
  const byTerm = Object.fromEntries(TERMS_2027.map((t) => [t.id, t.cohorts]))
  for (const c of byTerm.winter) assert.deepEqual(priceFor(c), { regular: 1440, early: 1296, founding: 1080 })
  for (const c of byTerm.spring) assert.deepEqual(priceFor(c), { regular: 1440, early: 1296, founding: null })
  for (const c of byTerm.summer) {
    const expected = c.hours === 96 ? { regular: 1920, early: 1728, founding: null } : { regular: 960, early: 864, founding: null }
    assert.equal([96, 48].includes(c.hours), true)
    assert.deepEqual(priceFor(c), expected)
  }
})

// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  EARLY_DAYS_BEFORE_SPRING_SUMMER,
  WINTER_FOUNDING_DEADLINE_ISO,
  TERMS_2027,
  addDays,
  deadlinesFor,
  discountDeadlineFor,
  priceFor,
} from "../lib/cohorts-2027.ts"

test("Winter: one founding-family deadline (Dec 12, 2026) and no early-payment tier", () => {
  assert.equal(WINTER_FOUNDING_DEADLINE_ISO, "2026-12-12")
  const winter = TERMS_2027.find((t) => t.id === "winter")
  assert.ok(winter.cohorts.length > 0)
  for (const c of winter.cohorts) {
    const d = deadlinesFor(c)
    assert.equal(d.foundingIso, "2026-12-12", `${c.id} founding`)
    assert.equal(d.earlyIso, null, `${c.id} has no early tier`)
    assert.equal(discountDeadlineFor(c), "2026-12-12")
    assert.ok(d.foundingIso < c.firstIso)
  }
})

test("Spring and Summer: no founding tier; early payment ends 30 calendar days before the first class", () => {
  assert.equal(EARLY_DAYS_BEFORE_SPRING_SUMMER, 30)
  let count = 0
  for (const term of TERMS_2027.filter((t) => t.id !== "winter")) {
    for (const c of term.cohorts) {
      const d = deadlinesFor(c)
      assert.equal(d.foundingIso, null, `${c.id} founding`)
      assert.equal(d.earlyIso, addDays(c.firstIso, -30), `${c.id} early`)
      assert.equal(discountDeadlineFor(c), d.earlyIso)
      count++
    }
  }
  assert.ok(count > 0)
})

test("approved tuition per cohort type; only one discount ever applies", () => {
  const byTerm = Object.fromEntries(TERMS_2027.map((t) => [t.id, t.cohorts]))
  for (const c of byTerm.winter) assert.deepEqual(priceFor(c), { regular: 1440, early: null, founding: 1080 })
  for (const c of byTerm.spring) assert.deepEqual(priceFor(c), { regular: 1440, early: 1296, founding: null })
  for (const c of byTerm.summer) {
    const expected = c.hours === 96 ? { regular: 1920, early: 1728, founding: null } : { regular: 960, early: 864, founding: null }
    assert.equal([96, 48].includes(c.hours), true)
    assert.deepEqual(priceFor(c), expected)
  }
})

// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  BIWEEKLY_2027_TIMES,
  SCHEDULE_2027_FIRST_SUNDAY,
  getSessionByDate,
  getUpcomingSundays,
  scheduleForDate,
  scheduleSummary,
} from "../lib/free-class.ts"

test("2026 weekly schedule runs through Dec 27, 2026", () => {
  assert.equal(scheduleForDate("2026-12-27"), "weekly_2026")
  assert.equal(getSessionByDate("2026-12-27", "shsat")?.timeLabel ?? getSessionByDate("2026-12-27", "digital_sat")?.timeLabel, "4:00–5:00 PM ET")
})

test("no January 2027 date is published until it is confirmed", () => {
  assert.equal(SCHEDULE_2027_FIRST_SUNDAY, null)
  for (const d of ["2027-01-03", "2027-01-10", "2027-01-17", "2027-01-24"]) {
    assert.equal(scheduleForDate(d), null)
    assert.equal(getSessionByDate(d, "shsat"), undefined)
  }
})

test("2027 session times: SHSAT 6:00–6:45 PM ET, Digital SAT 7:00–7:45 PM ET", () => {
  assert.deepEqual([BIWEEKLY_2027_TIMES.shsat.start, BIWEEKLY_2027_TIMES.shsat.end], [18 * 60, 18 * 60 + 45])
  assert.deepEqual([BIWEEKLY_2027_TIMES.digital_sat.start, BIWEEKLY_2027_TIMES.digital_sat.end], [19 * 60, 19 * 60 + 45])
})

test("late December 2026 lists only the last 2026 class, then nothing bookable", () => {
  const days = getUpcomingSundays(3, new Date("2026-12-26T15:00:00Z"))
  assert.deepEqual(days.map((d) => d.isoDate), ["2026-12-27"])
})

test("after the 2026 schedule ends, the summary says the date will be announced", () => {
  const summary = scheduleSummary(new Date("2026-12-28T15:00:00Z"))
  assert.equal(summary.cadence, "Every other Sunday")
  assert.match(summary.upcomingChange ?? "", /announced/)
})

test("historical 2026 registrations still rebuild their original session", () => {
  const s = getSessionByDate("2026-11-01", "shsat")
  assert.ok(s)
  assert.equal(s.schedule, "weekly_2026")
})

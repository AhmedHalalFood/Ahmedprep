// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import { getSessionByDate, getUpcomingSundays, scheduleForDate } from "../lib/free-class.ts"

test("2026 weekly schedule runs through Dec 27, 2026", () => {
  assert.equal(scheduleForDate("2026-12-27"), "weekly_2026")
  assert.equal(scheduleForDate("2027-01-03"), null)
})

test("2027 biweekly schedule starts Jan 10, 2027 and skips alternate Sundays", () => {
  assert.equal(scheduleForDate("2027-01-10"), "biweekly_2027")
  assert.equal(scheduleForDate("2027-01-17"), null)
  assert.equal(scheduleForDate("2027-01-24"), "biweekly_2027")
})

test("2027 Sundays have separate SHSAT 6:00 and Digital SAT 7:00 sessions", () => {
  const shsat = getSessionByDate("2027-01-10", "shsat")
  const dsat = getSessionByDate("2027-01-10", "digital_sat")
  assert.ok(shsat && dsat)
  assert.notEqual(shsat.id, dsat.id)
  assert.equal(shsat.startMinutes, 18 * 60)
  assert.equal(shsat.endMinutes, 18 * 60 + 45)
  assert.equal(dsat.startMinutes, 19 * 60)
  assert.equal(dsat.endMinutes, 19 * 60 + 45)
})

test("late December 2026 lists the last 2026 class, then Jan 10 with both sessions", () => {
  const days = getUpcomingSundays(3, new Date("2026-12-26T15:00:00Z"))
  assert.deepEqual(
    days.map((d) => d.isoDate),
    ["2026-12-27", "2027-01-10", "2027-01-24"],
  )
  assert.equal(days[0].sessions.length, 1)
  assert.deepEqual(
    days[1].sessions.map((s) => s.type),
    ["shsat", "digital_sat"],
  )
})

test("SHSAT session rolls off after 6:45 PM ET; Digital SAT stays until 7:45 PM ET", () => {
  const at = new Date("2027-01-10T23:50:00Z") // 6:50 PM ET
  const [day] = getUpcomingSundays(1, at)
  assert.equal(day.isoDate, "2027-01-10")
  assert.deepEqual(day.sessions.map((s) => s.type), ["digital_sat"])
})

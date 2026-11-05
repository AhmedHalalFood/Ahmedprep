// Run with: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/*.test.mjs
// Every "now" below is a simulated instant; nothing here touches the database or sends email.
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  BIWEEKLY_2027_TIMES,
  PAUSE_ANNOUNCEMENT,
  findUpcomingSession,
  getSessionByDate,
  getUpcomingSundays,
  isPausedClassDate,
  scheduleSummary,
} from "../lib/free-class.ts"

const PAUSE_START = new Date("2026-11-05T15:00:00Z")
const DEC_12_LAST_MINUTE_ET = new Date("2026-12-13T04:59:00Z")
const DEC_13_MIDNIGHT_ET = new Date("2026-12-13T05:00:00Z")
const PROGRAMS = ["shsat", "digital_sat"]

test("Nov 8, Nov 22, Dec 27 and Jan 3 cannot be booked at any point", () => {
  for (const now of [PAUSE_START, new Date("2026-11-21T15:00:00Z"), DEC_13_MIDNIGHT_ET, new Date("2026-12-26T15:00:00Z")]) {
    for (const date of ["2026-11-08", "2026-11-22", "2026-12-27", "2027-01-03"]) {
      for (const program of PROGRAMS) assert.equal(findUpcomingSession(date, program, 8, now), undefined, `${date} ${program}`)
    }
  }
})

test("nothing is bookable during the pause before RSVPs open", () => {
  assert.deepEqual(getUpcomingSundays(8, PAUSE_START), [])
  assert.deepEqual(getUpcomingSundays(8, DEC_12_LAST_MINUTE_ET), [])
})

test("January registration is blocked before Dec 13 ET and allowed from Dec 13 ET", () => {
  for (const program of PROGRAMS) {
    assert.equal(findUpcomingSession("2027-01-10", program, 4, DEC_12_LAST_MINUTE_ET), undefined)
    assert.ok(findUpcomingSession("2027-01-10", program, 4, DEC_13_MIDNIGHT_ET))
    assert.ok(findUpcomingSession("2027-01-24", program, 4, DEC_13_MIDNIGHT_ET))
  }
})

test("January 10 and 24 carry the approved session times; Jan 17 and 31 are not class dates", () => {
  for (const date of ["2027-01-10", "2027-01-24"]) {
    assert.equal(getSessionByDate(date, "shsat")?.timeLabel, BIWEEKLY_2027_TIMES.shsat.label)
    assert.equal(getSessionByDate(date, "digital_sat")?.timeLabel, BIWEEKLY_2027_TIMES.digital_sat.label)
  }
  assert.equal(BIWEEKLY_2027_TIMES.shsat.label, "6:00–6:45 PM ET")
  assert.equal(BIWEEKLY_2027_TIMES.digital_sat.label, "7:00–7:45 PM ET")
  for (const date of ["2027-01-17", "2027-01-31"]) {
    for (const program of PROGRAMS) {
      assert.equal(getSessionByDate(date, program), undefined)
      assert.equal(findUpcomingSession(date, program, 8, DEC_13_MIDNIGHT_ET), undefined)
    }
  }
})

test("each 2027 class is a separate session, so each needs its own RSVP", () => {
  const [day] = getUpcomingSundays(1, DEC_13_MIDNIGHT_ET)
  assert.equal(day.isoDate, "2027-01-10")
  assert.deepEqual(day.sessions.map((s) => s.type), ["shsat", "digital_sat"])
})

test("historical registrations stay readable, and canceled dates are flagged for admin resend", () => {
  const nov1 = getSessionByDate("2026-11-01", "shsat")
  assert.ok(nov1)
  assert.equal(isPausedClassDate("2026-11-01"), false)
  for (const date of ["2026-11-08", "2026-11-22"]) {
    assert.ok(getSessionByDate(date, "digital_sat"), `${date} still rebuilds`)
    assert.equal(isPausedClassDate(date), true)
  }
  assert.equal(isPausedClassDate("2027-01-10"), false)
})

test("site summary shows the pause announcement until Dec 13 ET", () => {
  assert.equal(PAUSE_ANNOUNCEMENT, "Free Sunday Zoom Classes Resume January 10, 2027. RSVPs open December 13.")
  assert.equal(scheduleSummary(PAUSE_START).paused, true)
  assert.equal(scheduleSummary(DEC_12_LAST_MINUTE_ET).paused, true)
  assert.equal(scheduleSummary(DEC_13_MIDNIGHT_ET).paused, false)
})

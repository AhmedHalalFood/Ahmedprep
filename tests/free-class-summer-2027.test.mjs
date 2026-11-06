import { test } from "node:test"
import assert from "node:assert/strict"
import {
  SCHEDULE_2027_LAST_SUNDAY,
  getSessionByDate,
  getUpcomingSundays,
  scheduleForDate,
  scheduleSummary,
} from "../lib/free-class.ts"

test("free Sunday Zoom classes run Winter/Spring 2027 only and are suspended July–August", () => {
  assert.equal(SCHEDULE_2027_LAST_SUNDAY, "2027-06-27")
  assert.equal(scheduleForDate("2027-06-27"), "biweekly_2027")
  for (const sunday of ["2027-07-11", "2027-07-25", "2027-08-08", "2027-08-22", "2027-09-05"]) {
    assert.equal(scheduleForDate(sunday), null, `${sunday} has no free class`)
  }
})

test("no summer or unapproved fall date can be listed or booked", () => {
  const fromMidJune = getUpcomingSundays(8, new Date("2027-06-14T16:00:00Z")).map((d) => d.isoDate)
  assert.deepEqual(fromMidJune, ["2027-06-27"])
  assert.deepEqual(getUpcomingSundays(8, new Date("2027-07-10T16:00:00Z")), [])
  assert.equal(getSessionByDate("2027-07-11", "shsat"), undefined)
})

test("site-wide wording announces the suspension without promising a fall date", () => {
  const summary = scheduleSummary(new Date("2027-07-10T16:00:00Z"))
  assert.equal(summary.paused, true)
  assert.match(summary.upcomingChange ?? "", /suspended during July and August 2027/)
  assert.match(summary.upcomingChange ?? "", /Fall 2027 dates have not been announced/)
})

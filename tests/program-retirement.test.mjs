import { test } from "node:test"
import assert from "node:assert/strict"
import { ALL_COHORTS, findCohort, cohortSpan } from "../lib/cohorts-2027.ts"
import { nyCalendarDate, isCohortActive, activeCohorts, activeTermIds, isAnnualShsatOfferActive } from "../lib/program-retirement.ts"

test("New York calendar boundaries ignore the server timezone", () => {
  assert.equal(nyCalendarDate(new Date("2027-11-05T03:59:00Z")), "2027-11-04")
  assert.equal(nyCalendarDate(new Date("2027-11-05T04:00:00Z")), "2027-11-05")
  assert.equal(nyCalendarDate(new Date("2027-04-02T03:59:00Z")), "2027-04-01")
})
test("cohorts are visible through their final class day and disappear the next day", () => {
  const cohort = findCohort("fall-shsat-intensive")
  assert.ok(cohort)
  assert.equal(cohortSpan(cohort).endIso, "2027-11-04")
  assert.equal(isCohortActive(cohort, new Date("2027-11-05T03:59:00Z")), true)
  assert.equal(isCohortActive(cohort, new Date("2027-11-05T04:00:00Z")), false)
})
test("Summer closes before Fall, and Fall SAT ends before Fall SHSAT", () => {
  assert.deepEqual(activeCohorts(new Date("2027-08-29T16:00:00Z")).filter((c) => c.term === "summer"), [])
  const endOfFallSat = activeCohorts(new Date("2027-11-01T04:00:00Z")).filter((c) => c.term === "fall")
  assert.deepEqual(endOfFallSat.map((c) => c.id), ["fall-shsat-intensive"])
  assert.deepEqual(activeCohorts(new Date("2027-11-05T04:00:00Z")), [])
  assert.deepEqual(activeTermIds(new Date("2027-11-05T04:00:00Z")), [])
})
test("annual SHSAT enrollment offer expires on January 9 at New York midnight", () => {
  assert.equal(isAnnualShsatOfferActive(new Date("2027-01-09T04:59:00Z")), true)
  assert.equal(isAnnualShsatOfferActive(new Date("2027-01-09T05:00:00Z")), false)
})
test("all twelve planned cohorts remain in the internal catalog after retirement", () => {
  assert.equal(ALL_COHORTS.length, 12)
})

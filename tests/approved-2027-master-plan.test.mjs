// Approved AhmedPrep November 23, 2026 Complete Readiness Master Plan, owner-approved Nov 25.
// Run: node --experimental-strip-types --import ./tests/alias-loader.mjs --test tests/approved-2027-master-plan.test.mjs
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  ALL_COHORTS, MAX_CLASS_SIZE, ANNUAL_SHSAT_2027, EARLY_DAYS_BEFORE_SPRING_SUMMER,
  WINTER_FOUNDING_DEADLINE_ISO, addDays, cohortSpan, deadlinesFor, findCohort,
  isOnlineCohort, priceFor, sessionCalendar, winterFoundingOfferActive,
} from "../lib/cohorts-2027.ts"

test("2027 catalog has twelve approved cohorts, across four terms", () => {
  assert.equal(MAX_CLASS_SIZE, 12)
  assert.equal(ALL_COHORTS.length, 12)
  assert.deepEqual(Object.fromEntries(["winter","spring","summer","fall"].map((term) => [
    term, ALL_COHORTS.filter((c) => c.term === term).length,
  ])), { winter:4, spring:4, summer:2, fall:2 })
  const online = ALL_COHORTS.filter(isOnlineCohort).map((c) => c.id).sort()
  assert.deepEqual(online, ["spring-dsat-weekday","winter-dsat-weekday"])
})

test("each approved class delivers its contracted meetings and hourly-rate tuition", () => {
  const expected = {
    "winter-shsat-weekday": [24,72,"2027-01-11","2027-03-31"],
    "winter-shsat-weekend": [24,72,"2027-01-09","2027-03-28"],
    "winter-dsat-weekday": [24,72,"2027-01-12","2027-04-01"],
    "winter-dsat-weekend": [24,72,"2027-01-09","2027-03-28"],
    "spring-shsat-weekday": [24,72,"2027-04-05","2027-06-23"],
    "spring-shsat-weekend": [24,72,"2027-04-03","2027-06-20"],
    "spring-dsat-weekday": [24,72,"2027-04-06","2027-06-24"],
    "spring-dsat-weekend": [24,72,"2027-04-03","2027-06-20"],
    "summer-shsat-intensive": [32,96,"2027-07-01","2027-08-26"],
    "summer-dsat-weekend": [16,72,"2027-07-03","2027-08-28"],
    "fall-shsat-intensive": [32,96,"2027-09-13","2027-11-04"],
    "fall-dsat-weekend": [16,72,"2027-09-11","2027-10-31"],
  }
  for (const [id, [meetings,hours,first,last]] of Object.entries(expected)) {
    const c=findCohort(id)
    assert.ok(c, id)
    assert.equal(c.sessions,meetings,id)
    assert.equal(c.hours,hours,id)
    assert.equal(c.firstIso,first,id)
    assert.equal(cohortSpan(c).endIso,last,id)
    assert.equal(sessionCalendar(c).length,meetings,id)
    assert.equal(priceFor(c).regular, hours * 20,id)
    assert.equal(priceFor(c).founding, c.term==="winter" ? 1080 : null,id)
    assert.equal(priceFor(c).early, c.term==="winter" ? null : Math.round(hours*20*.9),id)
  }
})
test("Summer and Fall Digital SAT weekends include a 30-minute uncharged break", () => {
  for (const id of ["summer-dsat-weekend","fall-dsat-weekend"]) {
    const c=findCohort(id)
    assert.equal(c.breakMinutes,30)
    assert.equal(c.time,"10 AM–3 PM")
    assert.equal(c.sessions,16)
    assert.equal(c.hours,72)
  }
})
test("founding closes on Dec 12 at New York midnight; early-pay is 30 days", () => {
  assert.equal(WINTER_FOUNDING_DEADLINE_ISO,"2026-12-12")
  assert.equal(EARLY_DAYS_BEFORE_SPRING_SUMMER,30)
  assert.equal(winterFoundingOfferActive(new Date("2026-12-13T04:59:59Z")),true)
  assert.equal(winterFoundingOfferActive(new Date("2026-12-13T05:00:00Z")),false)
  for (const c of ALL_COHORTS) {
    const d=deadlinesFor(c)
    if (c.term==="winter") {
      assert.equal(d.foundingIso,"2026-12-12")
      assert.equal(d.earlyIso,null)
    } else {
      assert.equal(d.foundingIso,null)
      assert.equal(d.earlyIso,addDays(c.firstIso,-30))
    }
  }
})
test("Complete SHSAT annual package matches the four-stage approved plan", () => {
  assert.deepEqual(ANNUAL_SHSAT_2027, {
    hours:336, regular:6720, standard:5712, founding:5040, foundingSeats:5,
    paymentDeadlineIso:"2027-01-08",
  })
})

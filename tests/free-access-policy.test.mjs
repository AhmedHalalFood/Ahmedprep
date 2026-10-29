// Run with: node --test tests/
import { test } from "node:test"
import assert from "node:assert/strict"
import { compareNames, decideFreeAccess, matchIdentity, normalizePhone } from "../lib/free-access-policy.ts"

const TODAY = "2027-01-10"
const parent = { studentName: "Amina Rahman", parentEmail: "Parent@Example.com", parentPhone: "(347) 555-0101" }
let nextId = 1
const rec = (status, heldUntil = "2026-12-01", identity = parent, key = `k${nextId}`) => ({ id: nextId++, key, status, heldUntil, ...identity })
const decide = (kind, records, extra = {}) =>
  decideFreeAccess({ kind, applicant: parent, bookingKey: "new-booking", records, exceptions: [], today: TODAY, ...extra })

test("phone and name normalization", () => {
  assert.equal(normalizePhone("+1 347.555.0101"), "3475550101")
  assert.equal(normalizePhone("555-0101"), "")
  assert.equal(compareNames("  AMINA  rahman ", "Amina Rahman"), "same")
  assert.equal(compareNames("Amina", "Amina Rahman"), "similar")
  assert.equal(compareNames("Amina Rahmen", "Amina Rahman"), "similar")
  assert.equal(compareNames("Yusuf Rahman", "Amina Rahman"), "different")
})

test("new student is allowed", () => {
  const d = decide("sunday_class", [])
  assert.equal(d.outcome, "allow")
  assert.equal(d.remaining, 2)
})

test("only attended sessions count; cancellations, no-shows and past unmarked registrations do not", () => {
  const d = decide("sunday_class", [rec("attended"), rec("cancelled"), rec("no_show"), rec("registered", "2026-12-20")])
  assert.equal(d.outcome, "allow")
  assert.equal(d.used, 1)
  assert.equal(d.held, 0)
})

test("two attended sessions block a third, across SHSAT and Digital SAT", () => {
  const d = decide("sunday_class", [rec("attended"), rec("attended")])
  assert.equal(d.outcome, "block")
  assert.equal(d.reason, "limit_reached")
})

test("upcoming registrations reserve slots so a family cannot book beyond the limit in advance", () => {
  const d = decide("sunday_class", [rec("attended"), rec("registered", "2027-01-24")])
  assert.equal(d.outcome, "block")
  assert.equal(d.reason, "upcoming_bookings")
})

test("repeating an existing booking is allowed so the existing dedupe handles it", () => {
  const existing = rec("registered", "2027-01-24", parent, "new-booking")
  assert.equal(decide("sunday_class", [rec("attended"), rec("attended"), existing]).outcome, "allow")
})

test("diagnostics: completed counts, recent requests hold, stale requests expire", () => {
  assert.equal(decide("diagnostic", [rec("completed"), rec("completed")]).outcome, "block")
  assert.equal(decide("diagnostic", [rec("completed"), rec(null, "2027-02-01")]).reason, "upcoming_bookings")
  assert.equal(decide("diagnostic", [rec("completed"), rec(null, "2026-12-31")]).outcome, "allow")
})

test("same contact + similar name, or same full name under new contact, is flagged not rejected", () => {
  const sibling = { ...parent, studentName: "Amina" }
  const otherParent = { studentName: "Amina Rahman", parentEmail: "dad@example.com", parentPhone: "718 555 0199" }
  assert.equal(matchIdentity(parent, sibling), "uncertain")
  assert.equal(matchIdentity(parent, otherParent), "uncertain")
  const d = decide("sunday_class", [rec("attended"), rec("attended", null, otherParent)])
  assert.equal(d.outcome, "review")
  assert.equal(d.relatedIds.length, 1)
})

test("a different child in the same family is unaffected", () => {
  const brother = { ...parent, studentName: "Yusuf Rahman" }
  assert.equal(decide("sunday_class", [rec("attended", null, brother), rec("attended", null, brother)]).outcome, "allow")
})

test("first-name-only matches under different contact details are ignored", () => {
  const stranger = { studentName: "Amina", parentEmail: "x@y.com", parentPhone: "2125550000" }
  assert.equal(matchIdentity({ ...parent, studentName: "Amina" }, stranger), "different")
})

test("administrator exceptions raise the allowance for that student only", () => {
  const records = [rec("attended"), rec("attended")]
  const exceptions = [{ id: 1, extraAllowance: 1, ...parent }]
  const d = decide("sunday_class", records, { exceptions })
  assert.equal(d.outcome, "allow")
  assert.equal(d.allowance, 3)
  const otherChild = [{ id: 2, extraAllowance: 1, ...parent, studentName: "Yusuf Rahman" }]
  assert.equal(decide("sunday_class", records, { exceptions: otherChild }).outcome, "block")
})

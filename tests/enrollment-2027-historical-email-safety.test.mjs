import { test } from "node:test"
import assert from "node:assert/strict"
import { ALL_COHORTS, findCohort, findHistoricalCohort, priceFor } from "../lib/cohorts-2027.ts"
import { resolveSelection, buildInquiryEmails } from "../lib/enrollment-2027-inquiry.ts"
import { prepareSend } from "../lib/email-sender.ts"

test("superseded 2027 Summer cohorts stay out of active catalog but remain readable in stored records", () => {
  for (const [id, program, hours] of [
    ["summer-dsat-intensive", "Digital SAT", 96],
    ["summer-shsat-weekend", "SHSAT", 48],
  ]) {
    assert.equal(findCohort(id), undefined)
    assert.equal(ALL_COHORTS.some(c => c.id === id), false)
    const old = findHistoricalCohort(id)
    assert.ok(old)
    assert.equal(old.hours, hours)
    assert.equal(priceFor(old).regular, hours * 20)
    const payload = { program, term: "summer", cohortId: id }
    assert.equal(resolveSelection(payload), null, "never reopen superseded class for new inquiries")
    const archived = resolveSelection(payload, { includeCompleted: true })
    assert.equal(archived?.cohort?.id, id, "must rebuild prior confirmation emails")
    const family = buildInquiryEmails({
      parentName: "Preview Test", email: "delivered@resend.dev", phone: "2125550101",
      studentName: "Preview Student", studentGrade: "8th grade", foundingInterest: "", message: "",
    }, archived)
    assert.match(family.confirmation.subject, /inquiry/)
    assert.ok(family.confirmation.paragraphs.join(" ").includes(`${hours} instructional hours`))
  }
})

test("Preview email transport never sends messages to real recipients", () => {
  const before = process.env.VERCEL_ENV
  try {
    process.env.VERCEL_ENV = "preview"
    const toParent = prepareSend({
      from: "AhmedPrep <noreply@ahmedprep.com>",
      to: ["parent@example.com"],
      cc: ["other-parent@example.com"],
      subject: "Your enrollment inquiry",
      text: "Sample test",
    }, {idempotencyKey:"enrollment-2027/test-key"})
    assert.deepEqual(toParent.payload.to, ["delivered@resend.dev"])
    assert.equal(toParent.payload.cc, undefined)
    assert.match(toParent.payload.subject, /^\[PREVIEW\]/)
    assert.match(toParent.options.idempotencyKey, /^nonprod\/preview\//)
  } finally {
    if (before === undefined) delete process.env.VERCEL_ENV
    else process.env.VERCEL_ENV = before
  }
})

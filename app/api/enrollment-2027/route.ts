import { createLeadResendLink } from "@/lib/admin-links"
import { clean, fail, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"
import { buildInquiryEmails, inquiryFieldsValid, resolveSelection, waitlistIdentity } from "@/lib/enrollment-2027-inquiry"
import { termName } from "@/lib/cohorts-2027"
import { isCohortFull } from "@/lib/cohort-capacity"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, "enrollment-2027")
  if (blocked) return blocked

  const fields = {
    parentName: clean(body.parentName),
    email: clean(body.email),
    phone: clean(body.phone, 30),
    studentName: clean(body.studentName),
    studentGrade: clean(body.studentGrade, 50),
    foundingInterest: clean(body.foundingInterest, 120),
    message: clean(body.message, 2000),
  }
  // New forms send program + term + cohortId; older January pages send program + schedule. Both are validated
  // against lib/cohorts-2027.ts, so a tampered or mismatched cohort is rejected.
  const selection = resolveSelection({
    program: clean(body.program, 60),
    term: clean(body.term, 20),
    cohortId: clean(body.cohortId, 60),
    schedule: clean(body.schedule, 120),
  })

  if (!selection || !inquiryFieldsValid(fields, selection.term)) return fail(400, "Please complete all required fields.")

  // Waitlist requests are accepted only for an exact cohort that the server itself considers full.
  const intent = clean(body.intent, 20) === "waitlist" ? "waitlist" : "inquiry"
  if (intent === "waitlist") {
    const full = selection.kind === "cohort" && isCohortFull(selection.cohort.id, { previewFull: clean(body.previewFull, 5) === "1" })
    if (!full) return fail(409, "This class is not full, so a waitlist request is not needed. Please submit an enrollment inquiry instead.")
  }

  const emails = buildInquiryEmails(fields, selection, intent)
  const payload: Record<string, string> = {
    ...fields,
    intent,
    program: selection.program,
    term: selection.term,
    termName: termName(selection.term),
    cohortId: selection.cohort?.id ?? "",
    ...(selection.kind === "legacy" ? { schedule: selection.schedule, formVersion: "january-2027-v1" } : {}),
  }
  const origin = new URL(request.url).origin

  return saveAndDeliverLead({
    formType: "enrollment_2027",
    submissionId: body.submissionId,
    identity: intent === "waitlist" && selection.cohort ? waitlistIdentity(selection.cohort.id, fields.email) : undefined,
    record: {
      contactName: fields.parentName,
      contactEmail: fields.email,
      contactPhone: fields.phone,
      studentName: fields.studentName,
      program: emails.programColumn,
      payload,
    },
    failureAlertNoteFor: (leadId) => {
      const link = createLeadResendLink(origin, leadId)
      return link
        ? `To resend the family's confirmation after fixing the problem, open this admin-only link (valid 30 days): ${link}`
        : undefined
    },
    email: {
      scope: "enrollment-2027",
      fromLocalPart: "consultations",
      heading: emails.heading,
      subject: emails.subject,
      replyTo: fields.email,
      rows: emails.rows,
      confirmation: emails.confirmation,
    },
  })
}

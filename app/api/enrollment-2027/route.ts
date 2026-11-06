import { createLeadResendLink } from "@/lib/admin-links"
import { clean, fail, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"
import { buildInquiryEmails, inquiryFieldsValid, resolveSelection } from "@/lib/enrollment-2027-inquiry"
import { termName } from "@/lib/cohorts-2027"

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

  if (!selection || !inquiryFieldsValid(fields)) return fail(400, "Please complete all required fields.")

  const emails = buildInquiryEmails(fields, selection)
  const payload: Record<string, string> = {
    ...fields,
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

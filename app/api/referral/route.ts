import { EMAIL_PATTERN, PROGRAMS, clean, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, "referral")
  if (blocked) return blocked

  const data = {
    referrerName: clean(body.referrerName),
    referrerPhone: clean(body.referrerPhone, 30),
    referrerEmail: clean(body.referrerEmail),
    studentName: clean(body.studentName),
    parentContact: clean(body.parentContact, 500),
    program: clean(body.program, 30),
  }

  if (
    !data.referrerName ||
    !hasPhoneDigits(data.referrerPhone) ||
    !EMAIL_PATTERN.test(data.referrerEmail) ||
    !data.studentName ||
    !data.parentContact ||
    !PROGRAMS.has(data.program)
  ) {
    return fail(400, "Please complete all required fields.")
  }

  return saveAndDeliverLead({
    formType: "referral",
    submissionId: body.submissionId,
    record: {
      contactName: data.referrerName,
      contactEmail: data.referrerEmail,
      contactPhone: data.referrerPhone,
      studentName: data.studentName,
      program: data.program,
      payload: data,
    },
    email: {
      scope: "referral",
      fromLocalPart: "referrals",
      heading: "New student referral",
      subject: `New referral: ${data.program} (${data.studentName})`,
      replyTo: data.referrerEmail,
      rows: [
        ["Referred by", data.referrerName],
        ["Referrer Phone", data.referrerPhone],
        ["Referrer Email", data.referrerEmail],
        ["Student Being Referred", data.studentName],
        ["Parent Contact Information", data.parentContact],
        ["Program", data.program],
      ],
    },
  })
}

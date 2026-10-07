import { EMAIL_PATTERN, clean, deliverLead, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"
import { INTENSIVE_NAME, PAYMENT_OPTIONS } from "@/lib/shsat-intensive"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, "shsat-intensive")
  if (blocked) return blocked

  const data = {
    parentName: clean(body.parentName),
    studentName: clean(body.studentName),
    studentGrade: clean(body.studentGrade, 50),
    phone: clean(body.phone, 30),
    email: clean(body.email),
    currentSchool: clean(body.currentSchool),
    paymentOption: clean(body.paymentOption, 60),
    message: clean(body.message, 2000),
  }

  if (
    !data.parentName ||
    !data.studentName ||
    !data.studentGrade ||
    !hasPhoneDigits(data.phone) ||
    !EMAIL_PATTERN.test(data.email) ||
    !data.currentSchool ||
    !(PAYMENT_OPTIONS as readonly string[]).includes(data.paymentOption)
  ) {
    return fail(400, "Please complete all required fields.")
  }

  return deliverLead({
    scope: "shsat-intensive",
    fromLocalPart: "consultations",
    heading: `New Enrollment Inquiry: ${INTENSIVE_NAME}`,
    subject: `${INTENSIVE_NAME} enrollment inquiry (${data.studentName})`,
    replyTo: data.email,
    rows: [
      ["Inquiry", INTENSIVE_NAME],
      ["Parent/Guardian Name", data.parentName],
      ["Student Name", data.studentName],
      ["Student Grade", data.studentGrade],
      ["Phone", data.phone],
      ["Email", data.email],
      ["Current School", data.currentSchool],
      ["Preferred Payment Option", data.paymentOption],
      ["Message", data.message || "Not provided"],
    ],
  })
}

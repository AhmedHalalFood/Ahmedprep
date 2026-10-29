import { EMAIL_PATTERN, clean, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"
import {
  ENROLLMENT_2027,
  ENROLLMENT_2027_NAME,
  ENROLLMENT_DISCLAIMER,
  FOUNDING_INTEREST_OPTIONS,
  GRADES_2027,
  programByName,
  scheduleOptionsFor,
} from "@/lib/enrollment-2027"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, "enrollment-2027")
  if (blocked) return blocked

  const data = {
    parentName: clean(body.parentName),
    email: clean(body.email),
    phone: clean(body.phone, 30),
    studentName: clean(body.studentName),
    studentGrade: clean(body.studentGrade, 50),
    program: clean(body.program, 60),
    schedule: clean(body.schedule, 120),
    foundingInterest: clean(body.foundingInterest, 120),
    message: clean(body.message, 2000),
  }

  const program = programByName(data.program)
  if (
    !data.parentName ||
    !EMAIL_PATTERN.test(data.email) ||
    !hasPhoneDigits(data.phone) ||
    !data.studentName ||
    !GRADES_2027.includes(data.studentGrade) ||
    !program ||
    !scheduleOptionsFor(data.program).includes(data.schedule) ||
    !(FOUNDING_INTEREST_OPTIONS as readonly string[]).includes(data.foundingInterest)
  ) {
    return fail(400, "Please complete all required fields.")
  }

  const { founding, early, regular, rules } = ENROLLMENT_2027.tuition
  const tuitionLine = [founding, early, regular].map((t) => `${t.label} ${t.total}: ${t.summary}`).join(" ") + ` ${rules}`

  return saveAndDeliverLead({
    formType: "enrollment_2027",
    submissionId: body.submissionId,
    record: {
      contactName: data.parentName,
      contactEmail: data.email,
      contactPhone: data.phone,
      studentName: data.studentName,
      program: `${ENROLLMENT_2027_NAME}: ${program.name}`,
      payload: data,
    },
    email: {
      scope: "enrollment-2027",
      fromLocalPart: "consultations",
      heading: `New Enrollment Inquiry: ${ENROLLMENT_2027_NAME}`,
      subject: `${ENROLLMENT_2027_NAME} inquiry: ${program.name} (${data.studentName})`,
      replyTo: data.email,
      rows: [
        ["Inquiry", ENROLLMENT_2027_NAME],
        ["Parent/Guardian Name", data.parentName],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Student Name", data.studentName],
        ["Current Grade", data.studentGrade],
        ["Program", program.name],
        ["Preferred Schedule", data.schedule],
        ["Founding-Family Tuition Interest", data.foundingInterest],
        ["Comments", data.message || "Not provided"],
      ],
      confirmation: {
        to: data.email,
        subject: `We received your ${ENROLLMENT_2027_NAME} inquiry`,
        heading: "Enrollment inquiry received",
        paragraphs: [
          `Hello ${data.parentName},`,
          `Thank you for your interest in ${program.name} for ${data.studentName}. This email confirms we received your inquiry for AhmedPrep's January 2027 program.`,
          ENROLLMENT_DISCLAIMER,
          `Program: ${program.name}\nPreferred schedule: ${data.schedule}\nFounding-family tuition interest: ${data.foundingInterest}`,
          `Program details: ${ENROLLMENT_2027.weeks} weeks, ${ENROLLMENT_2027.hours} instructional hours, no more than ${ENROLLMENT_2027.maxClassSize} students per class. ${tuitionLine}`,
          "Questions? Simply reply to this email.",
        ],
      },
    },
  })
}

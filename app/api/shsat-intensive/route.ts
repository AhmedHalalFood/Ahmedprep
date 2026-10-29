import { EMAIL_PATTERN, clean, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"
import {
  CLASS_DAYS,
  CLASS_TIME,
  INTENSIVE_NAME,
  PAYMENT_OPTIONS,
  PROGRAM_FORMAT,
  PROGRAM_LOCATION,
  START_DATE_UNSURE,
  TUITION_PER_CLASS,
  acceptedStartDates,
  classSession,
  formatClassDate,
  formatUsd,
  isIntensivePromoActive,
  quoteFor,
} from "@/lib/shsat-intensive"

export async function POST(request: Request) {
  if (!isIntensivePromoActive()) {
    return fail(410, `Enrollment for the ${INTENSIVE_NAME} has closed. Please call or text 347-479-5020 about our January 2027 programs.`)
  }

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
    startDate: clean(body.startDate, 80),
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
    !data.startDate ||
    !(PAYMENT_OPTIONS as readonly string[]).includes(data.paymentOption)
  ) {
    return fail(400, "Please complete all required fields.")
  }

  const unsure = data.startDate === START_DATE_UNSURE
  if (!unsure && !acceptedStartDates().includes(data.startDate)) {
    return fail(400, "That class date is no longer available. Please choose another first class.")
  }

  // Tuition is always recomputed from the class calendar here. Any price sent by the browser is ignored.
  const quote = unsure ? null : quoteFor(data.startDate)
  const firstClass = quote ? `${formatClassDate(quote.date, "long")}, 2026 (${classSession(quote.date).label})` : "Not sure yet"
  const tuitionRows: [string, string][] = quote
    ? [
        ["First Class Your Child Will Attend", firstClass],
        ["Remaining Classes (incl. first class)", String(quote.classes)],
        ["Instructional Hours", String(quote.hours)],
        ["Tuition Rate", `${formatUsd(quote.rate)} per three-hour class`],
        ["Total Tuition", formatUsd(quote.tuition)],
      ]
    : [
        ["First Class Your Child Will Attend", "Not sure yet (family needs help choosing)"],
        ["Tuition Rate", `${formatUsd(TUITION_PER_CLASS)} per three-hour class`],
      ]

  const detailLines = quote
    ? [
        `First class: ${firstClass}`,
        `Remaining classes (including the first class): ${quote.classes}`,
        `Instructional hours: ${quote.hours}`,
        `Tuition rate: ${formatUsd(quote.rate)} per three-hour class`,
        `Total tuition: ${formatUsd(quote.tuition)}`,
      ]
    : [
        "First class: Not sure yet. We will help you choose a start date.",
        `Tuition rate: ${formatUsd(TUITION_PER_CLASS)} per three-hour class remaining`,
      ]

  // Stored with the submission so the dashboard shows exactly what the family was quoted.
  const storedPayload: Record<string, string> = {
    ...data,
    firstClassDate: quote ? quote.date : "",
    remainingClasses: quote ? String(quote.classes) : "",
    instructionalHours: quote ? String(quote.hours) : "",
    tuitionRateUsd: String(quote ? quote.rate : TUITION_PER_CLASS),
    totalTuitionUsd: quote ? String(quote.tuition) : "",
  }

  return saveAndDeliverLead({
    formType: "shsat_intensive",
    submissionId: body.submissionId,
    record: {
      contactName: data.parentName,
      contactEmail: data.email,
      contactPhone: data.phone,
      studentName: data.studentName,
      program: INTENSIVE_NAME,
      payload: storedPayload,
    },
    email: {
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
        ...tuitionRows,
        ["Class Schedule", `${CLASS_DAYS}, ${CLASS_TIME} (beginning Oct. 22, 2026)`],
        ["Format / Location", `${PROGRAM_FORMAT}, ${PROGRAM_LOCATION}`],
        ["Preferred Payment Option", data.paymentOption],
        ["Message", data.message || "Not provided"],
      ],
      confirmation: {
        to: data.email,
        subject: `We received your ${INTENSIVE_NAME} enrollment inquiry`,
        heading: "Enrollment inquiry received",
        paragraphs: [
          `Hello ${data.parentName},`,
          `Thank you for your enrollment inquiry for ${data.studentName} in the ${INTENSIVE_NAME}. This email confirms we received your inquiry. It is not a payment receipt or an enrollment confirmation. AhmedPrep will contact you to confirm enrollment and payment details.`,
          detailLines.join("\n"),
          `Schedule: ${CLASS_DAYS}, ${CLASS_TIME}. ${PROGRAM_FORMAT} at ${PROGRAM_LOCATION}.`,
          `Preferred payment option: ${data.paymentOption}`,
          "Questions? Simply reply to this email.",
        ],
      },
    },
  })
}

import { NextResponse } from "next/server"
import { BUSINESS } from "@/lib/business"
import { clean, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"
import {
  CLASS_TIME_LABEL,
  INQUIRY_PAYMENT_STATEMENT,
  INQUIRY_RECEIVED_STATEMENT,
  PAYMENT_METHOD_LABELS,
  SAT_INTENSIVE_NAME,
  formatClassDate,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  validateInquiry,
  type ClassDate,
  type InquiryInput,
  type PaymentMethod,
} from "@/lib/sat-final-intensive"

export const dynamic = "force-dynamic"

/**
 * Launch registration for the Digital SAT Final Intensive: an inquiry only. It reuses the existing, Production-proven
 * contact-lead pipeline (lead_submissions, form_type "contact", program "Digital SAT"), so no new tables are needed.
 * No seat is reserved and no payment is taken or confirmed.
 */
export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 })

  const blocked = screenSubmission(request, body, "sat-intensive-inquiry")
  if (blocked) return blocked

  const input: InquiryInput = {
    studentName: clean(body.studentName, 120),
    studentGrade: clean(body.studentGrade, 50),
    parentName: clean(body.parentName, 120),
    parentEmail: clean(body.parentEmail, 200),
    parentPhone: clean(body.parentPhone, 30),
    firstClassDate: clean(body.firstClassDate, 10),
    paymentMethod: clean(body.paymentMethod, 10),
  }
  const errors = validateInquiry(input, new Date())
  if (Object.keys(errors).length) {
    return NextResponse.json({ success: false, error: "Please check the highlighted fields.", errors }, { status: 400 })
  }

  // Tuition shown in the notification is recomputed here from the start date; nothing price-related is read from the browser.
  const quote = quoteFor(input.firstClassDate as ClassDate)
  const method = PAYMENT_METHOD_LABELS[input.paymentMethod as PaymentMethod]
  const startLabel = formatClassDateLong(quote.firstClassDate)
  const tuition = formatUsd(quote.tuitionCents)

  return saveAndDeliverLead({
    formType: "contact",
    submissionId: body.submissionId,
    record: {
      contactName: input.parentName,
      contactEmail: input.parentEmail,
      contactPhone: input.parentPhone,
      studentName: input.studentName,
      program: "Digital SAT",
      payload: {
        source: "sat-final-intensive-dec-2026",
        ...input,
        remainingClasses: String(quote.remainingClasses),
        remainingHours: String(quote.remainingHours),
        tuition,
      },
    },
    email: {
      scope: "sat-intensive-inquiry",
      fromLocalPart: "consultations",
      heading: "New Digital SAT Final Intensive registration request",
      subject: `SAT Final Intensive request: ${input.studentName}, starting ${formatClassDate(quote.firstClassDate)}`,
      replyTo: input.parentEmail,
      rows: [
        ["Program", SAT_INTENSIVE_NAME],
        ["Student name", input.studentName],
        ["Student grade", input.studentGrade],
        ["Parent / guardian", input.parentName],
        ["Parent email", input.parentEmail],
        ["Phone", input.parentPhone],
        ["Preferred start date", startLabel],
        ["Remaining classes / hours", `${quote.remainingClasses} classes · ${quote.remainingHours} hours`],
        ["Tuition for remaining classes", tuition],
        ["Preferred payment method", method],
        ["Status", "Inquiry only. No seat reserved, no payment taken. Contact the family to confirm availability and payment."],
      ],
      confirmation: {
        to: input.parentEmail,
        subject: "We received your Digital SAT Final Intensive registration request",
        heading: "Registration request received",
        paragraphs: [
          `Thank you, ${input.parentName}. ${INQUIRY_RECEIVED_STATEMENT}`,
          "Your request does not reserve or confirm a seat yet. Please do not send any payment until AhmedPrep contacts you directly with instructions.",
          `Student: ${input.studentName}\nPreferred start: ${startLabel}, ${CLASS_TIME_LABEL}\nRemaining classes: ${quote.remainingClasses} (${quote.remainingHours} hours)\nTuition for remaining classes: ${tuition}\nPreferred payment method: ${method}`,
          INQUIRY_PAYMENT_STATEMENT,
          `Classes are in person at ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}. Questions? Call or text ${BUSINESS.phoneDisplay}.`,
        ],
      },
    },
  })
}

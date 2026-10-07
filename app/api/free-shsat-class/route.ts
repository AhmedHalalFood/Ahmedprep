import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS } from "@/lib/business"
import { FREE_CLASS, FREE_CLASS_GRADES, getNextClass, getZoomAccess } from "@/lib/free-class"
import { EMAIL_PATTERN, clean, deliverLead, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"

const GRADES = new Set(FREE_CLASS_GRADES)
const HEADING = `Your seat is reserved for AhmedPrep's ${FREE_CLASS.name}`

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, "free-shsat-class")
  if (blocked) return blocked

  const data = {
    studentName: clean(body.studentName),
    studentGrade: clean(body.studentGrade, 50),
    parentName: clean(body.parentName),
    parentEmail: clean(body.parentEmail),
    parentPhone: clean(body.parentPhone, 30),
    consent: clean(body.consent, 10),
  }

  if (
    !data.studentName ||
    !GRADES.has(data.studentGrade) ||
    !data.parentName ||
    !EMAIL_PATTERN.test(data.parentEmail) ||
    !hasPhoneDigits(data.parentPhone) ||
    data.consent !== "yes"
  ) {
    return fail(400, "Please complete all required fields.")
  }

  const nextClass = getNextClass()
  const zoom = getZoomAccess()
  if (!zoom) console.warn("[free-shsat-class] FREE_CLASS_ZOOM_URL is not set; confirmation sent without Zoom access details")

  const zoomParagraph = zoom
    ? [
        "Zoom access information",
        `Join link: ${zoom.url}`,
        zoom.meetingId && `Meeting ID: ${zoom.meetingId}`,
        zoom.passcode && `Passcode: ${zoom.passcode}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "Zoom access information\nAhmedPrep will email the Zoom join link to this address before class begins."

  return deliverLead({
    scope: "free-shsat-class",
    fromLocalPart: "classes",
    heading: "New Free Live SHSAT Class RSVP",
    subject: `Free SHSAT Class RSVP: ${data.studentName} (${nextClass.shortLabel})`,
    replyTo: data.parentEmail,
    rows: [
      ["Class", `${FREE_CLASS.name}, live online via Zoom`],
      ["Class date", nextClass.label],
      ["Class time", `${FREE_CLASS.timeLabel} Eastern Time`],
      ["Student Name", data.studentName],
      ["Student Grade", data.studentGrade],
      ["Parent/Guardian Name", data.parentName],
      ["Parent Email", data.parentEmail],
      ["Parent Phone", data.parentPhone],
      ["Class communications", "Agreed to receive registration information, Zoom access, and reminders for this class"],
      [
        "Zoom access",
        zoom
          ? "Sent automatically in the parent's confirmation email."
          : "NOT SENT. FREE_CLASS_ZOOM_URL is not configured. Please email the Zoom link to the parent.",
      ],
    ],
    confirmation: {
      to: data.parentEmail,
      subject: HEADING,
      heading: HEADING,
      paragraphs: [
        `Hi ${data.parentName},`,
        `Thank you for registering ${data.studentName}. Here are the class details:`,
        `Date: ${nextClass.label}\nTime: ${FREE_CLASS.timeLabel} Eastern Time\nFormat: Live Online via Zoom\nInstructor: ${FREE_CLASS.instructor}, ${FREE_CLASS.instructorRole}`,
        zoomParagraph,
        "This Zoom information is for your family only. Please do not share it publicly. Please have a pencil and scratch paper ready for practice questions.",
        `AhmedPrep\n${ADDRESS_LINE_1}\n${ADDRESS_LINE_2}\nCall or text: ${BUSINESS.phoneDisplay}\nEmail: ${BUSINESS.email}`,
        "Questions? Simply reply to this email.",
      ],
      link: zoom ? { label: "Join the Zoom Class", href: zoom.url, afterParagraph: 3 } : undefined,
    },
  })
}

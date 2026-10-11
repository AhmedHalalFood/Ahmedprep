import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS } from "@/lib/business"
import {
  CLASS_TYPES,
  FREE_CLASS,
  FREE_CLASS_GRADES,
  RSVP_PROGRAMS,
  classMatchesProgram,
  findUpcomingClass,
  getZoomAccess,
  type RsvpProgram,
} from "@/lib/free-class"
import { EMAIL_PATTERN, clean, deliverLead, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"

const GRADES = new Set(FREE_CLASS_GRADES)
const PROGRAMS = new Set<string>(RSVP_PROGRAMS.map((p) => p.value))
const SCOPE = "free-sunday-class"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, SCOPE)
  if (blocked) return blocked

  const data = {
    studentName: clean(body.studentName),
    studentGrade: clean(body.studentGrade, 50),
    parentName: clean(body.parentName),
    parentEmail: clean(body.parentEmail),
    parentPhone: clean(body.parentPhone, 30),
    classType: clean(body.classType, 20),
    classDate: clean(body.classDate, 10),
    currentSchool: clean(body.currentSchool),
    consent: clean(body.consent, 10),
  }

  // A class that started earlier today drops out of the list at 5 PM, so allow one extra week of lookahead.
  const session = findUpcomingClass(data.classDate, 5)

  if (
    !data.studentName ||
    !GRADES.has(data.studentGrade) ||
    !data.parentName ||
    !EMAIL_PATTERN.test(data.parentEmail) ||
    !hasPhoneDigits(data.parentPhone) ||
    !PROGRAMS.has(data.classType) ||
    !session ||
    !classMatchesProgram(session, data.classType) ||
    data.consent !== "yes"
  ) {
    return fail(400, "Please complete all required fields.")
  }

  const program = data.classType as RsvpProgram
  const programLabel = CLASS_TYPES[program].label
  const classTitle = session.type === "workshop" ? `${session.title} (${programLabel} family)` : session.title
  const zoom = getZoomAccess(program)
  if (!zoom) console.warn(`[${SCOPE}] No Zoom URL configured for ${program}; confirmation sent without access details`)

  const zoomParagraph = zoom
    ? [
        "Live class access information",
        `Join link: ${zoom.url}`,
        zoom.meetingId && `Meeting ID: ${zoom.meetingId}`,
        zoom.passcode && `Passcode: ${zoom.passcode}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "Live class access information\nAhmedPrep will email the live class link to this address before the session begins."

  const heading = "Your free class seat is reserved"

  return deliverLead({
    scope: SCOPE,
    fromLocalPart: "classes",
    heading: `New Free Sunday Class RSVP (${programLabel})`,
    subject: `Free Sunday ${programLabel} RSVP: ${data.studentName} (${session.shortLabel})`,
    replyTo: data.parentEmail,
    rows: [
      ["Class", `${classTitle}, live online`],
      ["Topic", session.topic],
      ["Class date", session.label],
      ["Class time", FREE_CLASS.timeLabel],
      ["Student Name", data.studentName],
      ["Grade", data.studentGrade],
      ["Parent/Guardian Name", data.parentName],
      ["Parent Email", data.parentEmail],
      ["Phone Number", data.parentPhone],
      ["Current School", data.currentSchool || "Not provided"],
      ["Class communications", "Agreed to receive registration information, live class access, and reminders for this class"],
      [
        "Live class access",
        zoom
          ? "Sent automatically in the parent's confirmation email."
          : "NOT SENT. No Zoom URL is configured. Please email the live class link to the parent.",
      ],
    ],
    confirmation: {
      to: data.parentEmail,
      subject: `${heading}: ${session.title}, ${session.shortLabel}`,
      heading,
      paragraphs: [
        `Hi ${data.parentName},`,
        `Your free class seat is reserved for ${data.studentName}. Here are the class details:`,
        `Class: ${classTitle}\nTopic: ${session.topic}\nDate: ${session.label}\nTime: ${FREE_CLASS.timeLabel}\nFormat: Live Online\nInstructor: ${FREE_CLASS.instructor}, ${FREE_CLASS.instructorRole}`,
        zoomParagraph,
        "This access information is for your family only. Please do not share it publicly. Please have a pencil and scratch paper ready for practice questions.",
        `AhmedPrep\n${ADDRESS_LINE_1}\n${ADDRESS_LINE_2}\nCall or text: ${BUSINESS.phoneDisplay}\nEmail: ${BUSINESS.email}`,
        "Questions? Simply reply to this email.",
      ],
      link: zoom ? { label: "Join the Live Class", href: zoom.url, afterParagraph: 3 } : undefined,
    },
  })
}

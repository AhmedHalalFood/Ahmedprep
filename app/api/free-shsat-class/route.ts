import { BUSINESS } from "@/lib/business"
import { FREE_CLASS, FREE_CLASS_GRADES, getNextClass } from "@/lib/free-class"
import { EMAIL_PATTERN, clean, deliverLead, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"

const GRADES = new Set(FREE_CLASS_GRADES)

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
  const classTime = `${nextClass.label}, ${FREE_CLASS.timeLabel} (New York time)`

  return deliverLead({
    scope: "free-shsat-class",
    fromLocalPart: "classes",
    heading: "New Free Live SHSAT Class RSVP",
    subject: `Free SHSAT Class RSVP: ${data.studentName} (${nextClass.shortLabel})`,
    replyTo: data.parentEmail,
    rows: [
      ["Class", `${FREE_CLASS.name} (live via Zoom)`],
      ["Upcoming class", classTime],
      ["Student Name", data.studentName],
      ["Student Grade", data.studentGrade],
      ["Parent/Guardian Name", data.parentName],
      ["Parent Email", data.parentEmail],
      ["Parent Phone", data.parentPhone],
      ["Consent", "Agreed to receive information about this registered class"],
      ["Action needed", "Send the Zoom meeting details privately to the parent email above."],
    ],
    confirmation: {
      to: data.parentEmail,
      subject: `Your seat is reserved: ${FREE_CLASS.name}`,
      heading: `${data.studentName}'s seat is reserved`,
      paragraphs: [
        `Hi ${data.parentName},`,
        `Thank you for registering ${data.studentName} for AhmedPrep's ${FREE_CLASS.name}. The seat is reserved for the upcoming class:`,
        `${classTime}\nLive online via Zoom\nTaught by ${FREE_CLASS.instructor}, ${FREE_CLASS.instructorRole}`,
        "The Zoom meeting details will be sent privately to this email address before the class. Please do not share the link outside your family.",
        "The 60-minute class includes live instruction, guided practice, SHSAT strategies, and time for students to ask questions. Having a pencil and scratch paper ready is helpful.",
        `Questions? Reply to this email, or call or text AhmedPrep at ${BUSINESS.phoneDisplay}.`,
        "AhmedPrep\nSHSAT & Digital SAT Prep in Astoria, Queens",
      ],
    },
  })
}

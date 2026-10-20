import "server-only"

import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS } from "@/lib/business"
import { CLASS_TYPES, FREE_CLASS, type RsvpProgram, type SundayClass } from "@/lib/free-class"
import type { Confirmation } from "@/lib/lead-delivery"

type Recipient = { parentName: string; parentEmail: string; studentName: string }

/** The parent's private confirmation email. Shared by the RSVP route and the admin resend so both send identical content. */
export function buildSundayConfirmation(session: SundayClass, program: RsvpProgram, recipient: Recipient) {
  const programLabel = CLASS_TYPES[program].label
  const classTitle = session.type === "workshop" ? `${session.title} (${programLabel} family)` : session.title
  // The private Zoom link is delivered only by the class-day reminder emails, never in the confirmation.
  const zoomParagraph =
    "Live class access information\nYour private Zoom link will be emailed to this address on class day at 10:00 AM Eastern, with a second reminder at 3:30 PM Eastern. If you registered on class day after 10:00 AM, the link is on its way now."

  const heading = "Your free class seat is reserved"
  const confirmation: Confirmation = {
    to: recipient.parentEmail,
    subject: `${heading}: ${session.title}, ${session.shortLabel}`,
    heading,
    paragraphs: [
      `Hi ${recipient.parentName},`,
      `A free Sunday class seat is reserved for ${recipient.studentName}. Here are the class details:`,
      `Student: ${recipient.studentName}\nProgram: ${programLabel}\nClass: ${classTitle}\nTopic: ${session.topic}\nDate: ${session.label}\nTime: 4:00–5:00 PM Eastern\nFormat: Live on Zoom\nInstructor: ${FREE_CLASS.instructor}, ${FREE_CLASS.instructorRole}`,
      zoomParagraph,
      "The Zoom link is for your family only. Please do not share it publicly. Please have a pencil and scratch paper ready for practice questions.",
      `AhmedPrep\n${ADDRESS_LINE_1}\n${ADDRESS_LINE_2}\nCall or text: ${BUSINESS.phoneDisplay}\nEmail: ${BUSINESS.email}`,
      "Questions? Simply reply to this email.",
    ],
  }

  return { confirmation, classTitle, programLabel }
}

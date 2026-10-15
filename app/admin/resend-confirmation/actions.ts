"use server"

import { verifyResendToken } from "@/lib/admin-links"
import { getClassByDate, type RsvpProgram } from "@/lib/free-class"
import { sendConfirmationEmail } from "@/lib/lead-delivery"
import { buildSundayConfirmation } from "@/lib/sunday-confirmation"
import { claimResendAttempt, getRegistration, setConfirmationStatus } from "@/lib/sunday-registrations"

export type ResendState = { status: "idle" | "sent" | "error"; message: string }

export async function resendConfirmation(_prev: ResendState, formData: FormData): Promise<ResendState> {
  const id = verifyResendToken(formData.get("id"), formData.get("exp"), formData.get("sig"))
  if (!id) return { status: "error", message: "This link is invalid or has expired." }

  const registration = await getRegistration(id)
  const session = registration && getClassByDate(registration.classDate)
  if (!registration || !session) return { status: "error", message: "Registration not found." }

  const attempt = await claimResendAttempt(id)
  if (attempt === null) {
    return { status: "error", message: "A resend was just attempted. Please wait two minutes before trying again." }
  }

  const { confirmation } = buildSundayConfirmation(session, registration.program as RsvpProgram, registration)
  const result = await sendConfirmationEmail(confirmation, "classes", `free-sunday-class-resend/${id}/${attempt}`)
  await setConfirmationStatus(id, result.ok ? "sent" : "failed")

  return result.ok
    ? { status: "sent", message: `Confirmation resent to ${registration.parentEmail}.` }
    : { status: "error", message: `The email could not be sent (${result.error}). Please try again later.` }
}

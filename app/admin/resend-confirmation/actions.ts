"use server"

import { verifyResendToken } from "@/lib/admin-links"
import { getClassByDate, type RsvpProgram } from "@/lib/free-class"
import { sendConfirmationEmail } from "@/lib/lead-delivery"
import { buildSundayConfirmation } from "@/lib/sunday-confirmation"
import {
  claimResendAttempt,
  describeDbError,
  getRegistration,
  setConfirmationStatus,
  withDbRetry,
} from "@/lib/sunday-registrations"

export type ResendState = { status: "idle" | "sent" | "error"; message: string }

export async function resendConfirmation(_prev: ResendState, formData: FormData): Promise<ResendState> {
  const id = verifyResendToken(formData.get("id"), formData.get("exp"), formData.get("sig"))
  if (!id) return { status: "error", message: "This link is invalid or has expired." }

  let registration: Awaited<ReturnType<typeof getRegistration>>
  let attempt: number | null
  try {
    registration = await getRegistration(id)
    if (!registration || !getClassByDate(registration.classDate)) return { status: "error", message: "Registration not found." }
    attempt = await claimResendAttempt(id)
  } catch (error) {
    console.error("[confirmation-resend] Database unavailable:", describeDbError(error))
    return { status: "error", message: "The registration database is unavailable. Nothing was sent; please try again later." }
  }
  if (attempt === null) {
    return { status: "error", message: "A resend was just attempted. Please wait two minutes before trying again." }
  }

  const session = getClassByDate(registration.classDate)!
  const { confirmation } = buildSundayConfirmation(session, registration.program as RsvpProgram, registration)
  const result = await sendConfirmationEmail(confirmation, "classes", `free-sunday-class-resend/${id}/${attempt}`)
  try {
    await withDbRetry(() => setConfirmationStatus(id, result.ok ? "sent" : "failed", result.ok ? null : `resend: ${result.error}`))
  } catch (error) {
    console.error("[confirmation-resend] Email result could not be recorded:", describeDbError(error))
  }

  return result.ok
    ? { status: "sent", message: `Confirmation resent to ${registration.parentEmail}.` }
    : { status: "error", message: `The email could not be sent (${result.error}). Please try again later.` }
}

"use server"

import { verifyLeadResendToken } from "@/lib/admin-links"
import { buildInquiryEmails } from "@/lib/enrollment-2027-inquiry"
import { sendConfirmationEmail } from "@/lib/lead-delivery"
import { claimLeadResendAttempt, getLead, setLeadConfirmation } from "@/lib/lead-storage"
import { describeDbError, withDbRetry } from "@/lib/sunday-registrations"
import { storedInquiry } from "./stored-inquiry"

export type LeadResendState = { status: "idle" | "sent" | "error"; message: string }

export async function resendEnrollmentConfirmation(_prev: LeadResendState, formData: FormData): Promise<LeadResendState> {
  const id = verifyLeadResendToken(formData.get("id"), formData.get("exp"), formData.get("sig"))
  if (!id) return { status: "error", message: "This link is invalid or has expired." }

  let inquiry: ReturnType<typeof storedInquiry>
  let attempt: number | null
  try {
    inquiry = storedInquiry(await getLead(id))
    if (!inquiry) return { status: "error", message: "Enrollment inquiry not found." }
    attempt = await claimLeadResendAttempt(id)
  } catch (error) {
    console.error("[enrollment-resend] Database unavailable:", describeDbError(error))
    return { status: "error", message: "The inquiry database is unavailable. Nothing was sent; please try again later." }
  }
  if (attempt === null) return { status: "error", message: "A resend was just attempted. Please wait two minutes before trying again." }

  // Rebuilt from the stored row with the same builder the API route uses, so the family receives identical details.
  const { confirmation } = buildInquiryEmails(inquiry.fields, inquiry.selection)
  const result = await sendConfirmationEmail(confirmation, "consultations", `enrollment-2027-resend/${id}/${attempt}`)
  try {
    await withDbRetry(() => setLeadConfirmation(id, result.ok ? "sent" : "failed", result.ok ? null : `resend: ${result.error}`))
  } catch (error) {
    console.error("[enrollment-resend] Email result could not be recorded:", describeDbError(error))
  }

  return result.ok
    ? { status: "sent", message: `Confirmation resent to ${inquiry.fields.email}.` }
    : { status: "error", message: `The email could not be sent (${result.error}). Please try again later.` }
}

/** Shared by the RSVP API routes and the RSVP form so the server contract and the parent-facing copy stay in sync. */

const PROGRAM_LABELS: Record<string, string> = { shsat: "SHSAT", digital_sat: "Digital SAT" }

export const duplicateMessage = (program?: unknown) =>
  `Your seat is already reserved for AhmedPrep\u2019s free Sunday ${PROGRAM_LABELS[String(program)] ?? "SHSAT"} class, 4:00 PM to 5:00 PM Eastern. No need to register again!`

export const RSVP_MESSAGES = {
  duplicateTitle: "You\u2019re already registered!",
  invalid: "Please complete all required fields.",
  notSaved: "Your registration could not be saved. Please try again in a few minutes.",
  tooMany: "Too many attempts. Please wait a few minutes and try again.",
  generic: "We couldn\u2019t complete your registration. Please try again.",
  resendAccepted:
    "Our email service accepted your confirmation and Zoom details for delivery. It usually arrives within a few minutes; if not, please check your spam or junk folder.",
  resendFailed: "We couldn\u2019t send the email right now. Your seat is still reserved. Please try again in a few minutes.",
  resendWait: "A confirmation was just sent. Please wait two minutes before requesting another.",
  resendLimit: "We\u2019ve already resent this confirmation several times. Please call or text us and we\u2019ll send your class details.",
  resendExpired: "This resend option has expired. Please submit the form again to get a new one.",
} as const

export type ConfirmationState = "sent" | "failed" | "pending"

export type RsvpOutcome =
  | { kind: "success"; confirmation: ConfirmationState; resendToken: string | null }
  | { kind: "duplicate"; title: string; message: string; confirmation: ConfirmationState; resendToken: string | null }
  | { kind: "error"; message: string }

const confirmationState = (value: unknown): ConfirmationState => (value === "sent" || value === "failed" ? value : "pending")
const token = (value: unknown) => (typeof value === "string" && value ? value : null)

/** Maps an API response (or a network failure, `status === 0`) to what the parent should see. */
export function interpretRsvpResponse(status: number, body: unknown): RsvpOutcome {
  const result = body && typeof body === "object" ? (body as Record<string, unknown>) : null

  if (result?.code === "duplicate" || (status === 409 && result?.duplicate === true)) {
    return {
      kind: "duplicate",
      title: RSVP_MESSAGES.duplicateTitle,
      message: duplicateMessage(result?.program),
      confirmation: confirmationState(result?.confirmation),
      resendToken: token(result?.resendToken),
    }
  }

  if (status >= 200 && status < 300 && result?.success === true) {
    return { kind: "success", confirmation: confirmationState(result.confirmation), resendToken: token(result.resendToken) }
  }

  if (status === 429) return { kind: "error", message: RSVP_MESSAGES.tooMany }
  const message = typeof result?.message === "string" && result.message ? result.message : RSVP_MESSAGES.generic
  return { kind: "error", message }
}

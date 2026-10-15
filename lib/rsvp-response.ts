/** Shared by the RSVP API route and the RSVP form so the server contract and the parent-facing copy stay in sync. */

export const RSVP_MESSAGES = {
  duplicateTitle: "You\u2019re already registered!",
  duplicate:
    "We already have a registration for this student and class. Please check your email for the original confirmation and Zoom details.",
  invalid: "Please complete all required fields.",
  notSaved: "Your registration could not be saved. Please try again in a few minutes.",
  savedEmailFailed:
    "Your registration was saved, but we couldn\u2019t send your confirmation email right now. Please call or text us and we\u2019ll send your class details.",
  tooMany: "Too many attempts. Please wait a few minutes and try again.",
  generic: "We couldn\u2019t complete your registration. Please try again.",
} as const

export type RsvpOutcome =
  | { kind: "success"; confirmation: "sent" | "failed" | "not_requested" }
  | { kind: "duplicate"; title: string; message: string }
  | { kind: "error"; message: string }

/** Maps an API response (or a network failure, `status === 0`) to what the parent should see. */
export function interpretRsvpResponse(status: number, body: unknown): RsvpOutcome {
  const result = body && typeof body === "object" ? (body as Record<string, unknown>) : null

  if (result?.code === "duplicate" || (status === 409 && result?.duplicate === true)) {
    return { kind: "duplicate", title: RSVP_MESSAGES.duplicateTitle, message: RSVP_MESSAGES.duplicate }
  }

  if (status >= 200 && status < 300 && result?.success === true) {
    const c = result.confirmation
    return { kind: "success", confirmation: c === "sent" || c === "failed" ? c : "not_requested" }
  }

  if (status === 429) return { kind: "error", message: RSVP_MESSAGES.tooMany }
  const message = typeof result?.message === "string" && result.message ? result.message : RSVP_MESSAGES.generic
  return { kind: "error", message }
}

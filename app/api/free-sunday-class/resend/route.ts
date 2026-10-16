import { NextResponse } from "next/server"
import { verifyParentResendToken } from "@/lib/admin-links"
import { findUpcomingClass, type RsvpProgram } from "@/lib/free-class"
import { rateLimit, readBody, sendConfirmationEmail } from "@/lib/lead-delivery"
import { RSVP_MESSAGES } from "@/lib/rsvp-response"
import { buildSundayConfirmation } from "@/lib/sunday-confirmation"
import {
  PARENT_RESEND_LIMIT,
  claimResendAttempt,
  describeDbError,
  getRegistration,
  setConfirmationStatus,
  withDbRetry,
} from "@/lib/sunday-registrations"

const SCOPE = "free-sunday-class-resend"

/**
 * Re-sends the confirmation and Zoom details for an existing registration. It requires the signed token returned by the
 * RSVP endpoint, only ever emails the address already stored on the registration, and never creates a registration.
 * Limited per IP (3 per 10 minutes), per registration (one every 2 minutes, at most 5 in total).
 */
export async function POST(request: Request) {
  const limited = rateLimit(request, SCOPE, { max: 3, windowMs: 10 * 60 * 1000 })
  if (limited) return reply(429, "rate_limited", RSVP_MESSAGES.tooMany)

  const body = await readBody(request)
  const id = verifyParentResendToken(body?.token)
  if (!id) return reply(400, "expired", RSVP_MESSAGES.resendExpired)

  let registration: Awaited<ReturnType<typeof getRegistration>>
  let attempt: number | null
  try {
    registration = await withDbRetry(() => getRegistration(id))
    if (!registration || !findUpcomingClass(registration.classDate, 5)) return reply(400, "expired", RSVP_MESSAGES.resendExpired)
    attempt = await claimResendAttempt(id, PARENT_RESEND_LIMIT)
  } catch (error) {
    console.error(`[${SCOPE}] Database unavailable:`, describeDbError(error))
    return reply(503, "db_unavailable", RSVP_MESSAGES.resendFailed)
  }
  if (attempt === null) {
    const limitReached = registration.confirmationResendCount >= PARENT_RESEND_LIMIT
    console.warn(`[${SCOPE}] Resend for registration ${id} refused: ${limitReached ? "limit reached" : "too soon"}`)
    return limitReached ? reply(429, "limit", RSVP_MESSAGES.resendLimit) : reply(429, "wait", RSVP_MESSAGES.resendWait)
  }

  const session = findUpcomingClass(registration.classDate, 5)!
  const { confirmation } = buildSundayConfirmation(session, registration.program as RsvpProgram, registration)
  // Shares the attempt counter with the admin resend, so the two can never reuse a Resend idempotency key.
  const result = await sendConfirmationEmail(confirmation, "classes", `free-sunday-class-resend/${id}/${attempt}`)
  try {
    await withDbRetry(() => setConfirmationStatus(id, result.ok ? "sent" : "failed", result.ok ? null : `resend: ${result.error}`))
  } catch (error) {
    console.error(`[${SCOPE}] Email result could not be recorded:`, describeDbError(error))
  }

  console.log(`[${SCOPE}] Registration ${id} resend attempt ${attempt}: ${result.ok ? "accepted" : `failed (${result.error})`}`)
  return result.ok
    ? NextResponse.json({ success: true, confirmation: "sent", message: RSVP_MESSAGES.resendAccepted })
    : reply(502, "email_failed", RSVP_MESSAGES.resendFailed)
}

function reply(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, code, message }, { status })
}

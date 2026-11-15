import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import { SAT_INTENSIVE_PROGRAM_KEY } from "@/lib/sat-final-intensive"
import { attachCheckoutSession, isMissingTableError, prepareCheckoutHold } from "@/lib/sat-final-intensive-enrollment"
import { createCheckoutSession, stripeSetup } from "@/lib/sat-final-intensive-stripe"

export const dynamic = "force-dynamic"

const REASON_MESSAGES = {
  not_found: "We could not find this registration. Please register again.",
  not_payable: "This registration can no longer be paid. Please register again.",
  class_started: "The selected first class has already started. Please register again with an upcoming date.",
  expired: "Your 20-minute seat hold has expired. Please register again.",
  already_confirmed: "This enrollment is already paid and confirmed.",
} as const

/** Starts a Stripe Checkout session (test mode only). Disabled on Production until live payments are approved. */
export async function POST(request: Request) {
  if (!internalPreviewAllowed() || process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const setup = stripeSetup()
  if (!setup.ok) {
    return NextResponse.json({ error: "Online card payment is not available yet.", reason: setup.reason }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
  const enrollmentId = typeof body.enrollmentId === "string" ? body.enrollmentId : ""
  const paymentToken = typeof body.paymentToken === "string" ? body.paymentToken : ""

  try {
    const hold = await prepareCheckoutHold(pool, SAT_INTENSIVE_PROGRAM_KEY, enrollmentId, paymentToken)
    if (!hold.ok) return NextResponse.json({ error: REASON_MESSAGES[hold.reason], reason: hold.reason }, { status: 422 })

    const session = await createCheckoutSession(setup.stripe, hold.record, new URL(request.url).origin, hold.sessionExpiresAt)
    await attachCheckoutSession(pool, hold.record.publicId, session.id)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ error: "Enrollment storage is not set up in this environment yet." }, { status: 503 })
    }
    console.error("[sat-intensive] checkout failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Checkout could not be started. Please try again." }, { status: 500 })
  }
}

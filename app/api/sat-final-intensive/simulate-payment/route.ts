import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import { SAT_INTENSIVE_PROGRAM_KEY } from "@/lib/sat-final-intensive"
import { confirmPayment, isMissingTableError } from "@/lib/sat-final-intensive-enrollment"
import { drainOutboxAfterResponse } from "@/lib/sat-final-intensive-outbox-runner"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const REASON_MESSAGES = {
  not_found: "We could not find this registration. Please register again.",
  not_payable: "This registration can no longer be paid. Please register again.",
  class_started: "The selected first class has already started. Please register again with an upcoming date.",
  full: "Your seat hold expired and all 12 seats have since been taken. Call (347) 479-5020 to ask about openings.",
} as const

/**
 * SIMULATED payment for Preview testing. No money moves and no card data is collected. It never runs on Production.
 * Confirmation emails are queued in the same transaction as the seat and delivered by the outbox after the response.
 */
export async function POST(request: Request) {
  if (!internalPreviewAllowed() || process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
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
    const reference = `SIM-${randomBytes(4).toString("hex").toUpperCase()}`
    const result = await confirmPayment(pool, SAT_INTENSIVE_PROGRAM_KEY, enrollmentId, paymentToken, reference)
    if (!result.ok) {
      return NextResponse.json({ error: REASON_MESSAGES[result.reason], reason: result.reason }, { status: result.reason === "full" ? 409 : 422 })
    }
    drainOutboxAfterResponse()

    const r = result.record
    return NextResponse.json({
      status: r.status,
      paymentReference: r.paymentReference,
      studentName: r.studentName,
      parentEmail: r.parentEmail,
      firstClassDate: r.firstClassDate,
      remainingClasses: r.remainingClasses,
      remainingHours: r.remainingHours,
      tuitionCents: r.tuitionCents,
      emails: { family: "queued", admin: "queued" },
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ error: "Enrollment storage is not set up in this environment yet." }, { status: 503 })
    }
    console.error("[sat-intensive] payment failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Payment could not be recorded. Please try again." }, { status: 500 })
  }
}

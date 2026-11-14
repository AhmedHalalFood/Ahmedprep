import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import { SAT_INTENSIVE_PROGRAM_KEY, validateRegistration, type RegistrationInput } from "@/lib/sat-final-intensive"
import { isMissingTableError, reserveSeat } from "@/lib/sat-final-intensive-enrollment"

export const dynamic = "force-dynamic"

const str = (v: unknown) => (typeof v === "string" ? v : "")

const REASON_MESSAGES = {
  invalid_date: "Please choose one of the scheduled class dates.",
  class_started: "That class has already started. Please choose an upcoming class date.",
  already_enrolled: "This student is already enrolled in the Digital SAT Final Intensive. Call (347) 479-5020 with any questions.",
  full: "All 12 seats are currently taken. Call (347) 479-5020 to ask about openings.",
} as const

export async function POST(request: Request) {
  // Preview-only program: the endpoint does not exist on Production until the owner approves launch and payments.
  if (!internalPreviewAllowed()) return NextResponse.json({ error: "Not found" }, { status: 404 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
  if (str(body.website)) return NextResponse.json({ error: "Invalid request." }, { status: 400 })

  const input: RegistrationInput = {
    studentName: str(body.studentName),
    studentGrade: str(body.studentGrade),
    parentName: str(body.parentName),
    parentEmail: str(body.parentEmail),
    parentPhone: str(body.parentPhone),
    firstClassDate: str(body.firstClassDate),
    previousScore: str(body.previousScore),
    targetScore: str(body.targetScore),
    satRegistration: str(body.satRegistration),
    policyAcknowledged: body.policyAcknowledged === true,
  }

  const now = new Date()
  const errors = validateRegistration(input, now)
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please correct the highlighted fields.", errors }, { status: 422 })

  try {
    const result = await reserveSeat(pool, SAT_INTENSIVE_PROGRAM_KEY, input, now)
    if (!result.ok) {
      const status = result.reason === "full" || result.reason === "already_enrolled" ? 409 : 422
      return NextResponse.json(
        { error: REASON_MESSAGES[result.reason], reason: result.reason, ...(status === 422 ? { errors: { firstClassDate: REASON_MESSAGES[result.reason] } } : {}) },
        { status },
      )
    }
    return NextResponse.json({
      enrollmentId: result.publicId,
      paymentToken: result.paymentToken,
      holdExpiresAt: result.holdExpiresAt.toISOString(),
      firstClassDate: result.quote.firstClassDate,
      remainingClasses: result.quote.remainingClasses,
      remainingHours: result.quote.remainingHours,
      tuitionCents: result.quote.tuitionCents,
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ error: "Enrollment storage is not set up in this environment yet." }, { status: 503 })
    }
    console.error("[sat-intensive] register failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "We could not save your registration. Please try again or call (347) 479-5020." }, { status: 500 })
  }
}

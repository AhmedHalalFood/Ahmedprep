import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import { SAT_INTENSIVE_PROGRAM_KEY, validateRegistration, type RegistrationInput } from "@/lib/sat-final-intensive"
import { isMissingTableError, reserveSeat } from "@/lib/sat-final-intensive-enrollment"
import { drainOutboxAfterResponse } from "@/lib/sat-final-intensive-outbox-runner"

export const dynamic = "force-dynamic"

const str = (v: unknown) => (typeof v === "string" ? v : "")

const REASON_MESSAGES = {
  invalid_date: "Please choose one of the scheduled class dates.",
  class_started: "That class has already started. Please choose an upcoming class date.",
  invalid_method: "Please choose Zelle, cash, or check.",
  already_enrolled: "This student is already enrolled in the Digital SAT Final Intensive. Call (347) 479-5020 with any questions.",
  already_pending:
    "We already have a registration for this student that is waiting for payment verification. Call or text (347) 479-5020 or email tariq@ahmedprep.com and we will help.",
  full: "All 12 seats are currently taken or held. Call or text (347) 479-5020 or email tariq@ahmedprep.com to join the waitlist.",
} as const

const FIELD_REASONS = new Set(["invalid_date", "class_started", "invalid_method"])

export async function POST(request: Request) {
  // Preview-only program: the endpoint does not exist on Production until the owner approves launch.
  if (!internalPreviewAllowed()) return NextResponse.json({ error: "Not found" }, { status: 404 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
  if (str(body.website)) return NextResponse.json({ error: "Invalid request." }, { status: 400 })

  // Any price or amount the browser sends is ignored; tuition is recomputed from the start date on the server.
  const input: RegistrationInput = {
    studentName: str(body.studentName),
    studentGrade: str(body.studentGrade),
    parentName: str(body.parentName),
    parentEmail: str(body.parentEmail),
    parentPhone: str(body.parentPhone),
    firstClassDate: str(body.firstClassDate),
    paymentMethod: str(body.paymentMethod),
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
      const field = FIELD_REASONS.has(result.reason)
      const fieldName = result.reason === "invalid_method" ? "paymentMethod" : "firstClassDate"
      return NextResponse.json(
        { error: REASON_MESSAGES[result.reason], reason: result.reason, ...(field ? { errors: { [fieldName]: REASON_MESSAGES[result.reason] } } : {}) },
        { status: field ? 422 : 409 },
      )
    }
    drainOutboxAfterResponse()
    const { record, quote } = result
    return NextResponse.json({
      referenceCode: record.referenceCode,
      status: record.status,
      studentName: record.studentName,
      paymentMethod: record.paymentMethod,
      holdExpiresAt: record.holdExpiresAt.toISOString(),
      firstClassDate: quote.firstClassDate,
      remainingDates: quote.remainingDates,
      remainingClasses: quote.remainingClasses,
      remainingHours: quote.remainingHours,
      tuitionCents: quote.tuitionCents,
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ error: "Enrollment storage is not set up in this environment yet." }, { status: 503 })
    }
    console.error("[sat-intensive] register failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "We could not save your registration. Please try again or call (347) 479-5020." }, { status: 500 })
  }
}

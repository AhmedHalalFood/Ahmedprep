import { NextResponse } from "next/server"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { getUpcomingClasses, classMatchesProgram } from "@/lib/free-class"
import { RSVP_MESSAGES, interpretRsvpResponse } from "@/lib/rsvp-response"

const db = vi.hoisted(() => ({
  claimRegistration: vi.fn(),
  markAdminNotified: vi.fn(),
  markAdminFailed: vi.fn(),
  setConfirmationStatus: vi.fn(),
}))
const mail = vi.hoisted(() => ({ deliverLead: vi.fn(), sendAdminAlert: vi.fn() }))

vi.mock("@/lib/sunday-registrations", () => ({
  ...db,
  describeDbError: (e: unknown) => (e instanceof Error ? e.message : String(e)),
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}))
vi.mock("@/lib/lead-delivery", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/lead-delivery")>()),
  ...mail,
}))
vi.mock("@/lib/admin-links", () => ({ createResendLink: () => "https://example.test/resend" }))
vi.mock("@/lib/zoom-access", () => ({ getZoomAccess: () => ({ url: "https://zoom.us/j/123", meetingId: "123", passcode: "abc" }) }))

let POST: typeof import("@/app/api/free-sunday-class/route").POST
beforeAll(async () => {
  ;({ POST } = await import("@/app/api/free-sunday-class/route"))
})

const session = getUpcomingClasses(4).find((c) => classMatchesProgram(c, "shsat"))!
let ip = 0

function rsvp(overrides: Record<string, string> = {}) {
  ip += 1
  return new Request("https://ahmedprep.test/api/free-sunday-class", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${ip}` },
    body: JSON.stringify({
      studentName: "Test Student",
      studentGrade: "7th grade",
      parentName: "Test Parent",
      parentEmail: "parent@resend.dev",
      parentPhone: "212-555-0100",
      classType: "shsat",
      classDate: session.isoDate,
      currentSchool: "",
      consent: "yes",
      website: "",
      elapsedMs: 5000,
      ...overrides,
    }),
  })
}

async function call(req: Request) {
  const res = await POST(req)
  return { status: res.status, body: await res.json() }
}

beforeEach(() => {
  vi.clearAllMocks()
  mail.deliverLead.mockResolvedValue(NextResponse.json({ success: true, duplicate: false, confirmation: "sent" }))
})

describe("POST /api/free-sunday-class", () => {
  it("saves a new registration, sends emails, and reports success", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "new", id: 42 })
    const { status, body } = await call(rsvp())
    expect(status).toBe(200)
    expect(body).toMatchObject({ success: true, confirmation: "sent" })
    expect(db.claimRegistration).toHaveBeenCalledTimes(1)
    expect(mail.deliverLead).toHaveBeenCalledTimes(1)
    expect(interpretRsvpResponse(status, body)).toEqual({ kind: "success", confirmation: "sent" })
  })

  it("returns 409 for a duplicate, sends no emails, and never reports it as a new seat", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "duplicate", confirmation: "sent" })
    const { status, body } = await call(rsvp())
    expect(status).toBe(409)
    expect(body).toMatchObject({ success: false, duplicate: true, code: "duplicate" })
    expect(JSON.stringify(body)).not.toMatch(/zoom\.us|https?:\/\/|passcode|meeting id/i)
    expect(mail.deliverLead).not.toHaveBeenCalled()
    expect(mail.sendAdminAlert).not.toHaveBeenCalled()
    expect(interpretRsvpResponse(status, body)).toEqual({
      kind: "duplicate",
      title: "You\u2019re already registered!",
      message:
        "We already have a registration for this student and class. Please check your email for the original confirmation and Zoom details.",
    })
  })

  it("returns 503 with a retry message when the database is unavailable, and sends no confirmation", async () => {
    db.claimRegistration.mockRejectedValue(new Error("connection refused"))
    const { status, body } = await call(rsvp())
    expect(status).toBe(503)
    expect(mail.deliverLead).not.toHaveBeenCalled()
    expect(mail.sendAdminAlert).toHaveBeenCalledTimes(1)
    expect(interpretRsvpResponse(status, body)).toEqual({ kind: "error", message: RSVP_MESSAGES.notSaved })
  })

  it("tells the parent the registration was saved when email delivery fails", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "new", id: 7 })
    mail.deliverLead.mockResolvedValue(NextResponse.json({ success: false, error: "Delivery failed." }, { status: 502 }))
    const { status, body } = await call(rsvp())
    expect(status).toBe(502)
    expect(interpretRsvpResponse(status, body)).toEqual({ kind: "error", message: RSVP_MESSAGES.savedEmailFailed })
  })

  it("rejects incomplete submissions without touching the database", async () => {
    const { status, body } = await call(rsvp({ consent: "" }))
    expect(status).toBe(400)
    expect(db.claimRegistration).not.toHaveBeenCalled()
    expect(interpretRsvpResponse(status, body)).toEqual({ kind: "error", message: RSVP_MESSAGES.invalid })
  })
})

describe("interpretRsvpResponse", () => {
  it("treats a network failure as a generic error", () => {
    expect(interpretRsvpResponse(0, null)).toEqual({ kind: "error", message: RSVP_MESSAGES.generic })
  })
  it("maps rate limiting to a friendly message", () => {
    expect(interpretRsvpResponse(429, { success: false, error: "Too many requests." })).toEqual({
      kind: "error",
      message: RSVP_MESSAGES.tooMany,
    })
  })
  it("reports a saved registration whose confirmation email failed as success with confirmation=failed", () => {
    expect(interpretRsvpResponse(200, { success: true, confirmation: "failed" })).toEqual({ kind: "success", confirmation: "failed" })
  })
})

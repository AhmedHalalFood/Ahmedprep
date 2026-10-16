import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { getUpcomingClasses, classMatchesProgram } from "@/lib/free-class"
import { registrationKey } from "@/lib/rsvp-identity"
import { RSVP_MESSAGES, duplicateMessage, interpretRsvpResponse } from "@/lib/rsvp-response"

const db = vi.hoisted(() => ({
  claimRegistration: vi.fn(),
  markAdminNotified: vi.fn(),
  markAdminFailed: vi.fn(),
  setConfirmationStatus: vi.fn(),
  getRegistration: vi.fn(),
  claimResendAttempt: vi.fn(),
}))
const mail = vi.hoisted(() => ({ sendAdminNotification: vi.fn(), sendConfirmationEmail: vi.fn(), sendAdminAlert: vi.fn() }))

vi.mock("@/lib/sunday-registrations", () => ({
  ...db,
  PARENT_RESEND_LIMIT: 5,
  describeDbError: (e: unknown) => (e instanceof Error ? e.message : String(e)),
  withDbRetry: <T,>(fn: () => Promise<T>) => fn(),
}))
vi.mock("@/lib/lead-delivery", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/lead-delivery")>()),
  ...mail,
}))
vi.mock("@/lib/admin-links", () => ({
  createResendLink: () => "https://example.test/resend",
  createParentResendToken: (id: number) => `token-${id}`,
  verifyParentResendToken: (token: unknown) => (typeof token === "string" && token.startsWith("token-") ? Number(token.slice(6)) : null),
}))
vi.mock("@/lib/zoom-access", () => ({ getZoomAccess: () => ({ url: "https://zoom.us/j/123", meetingId: "123", passcode: "abc" }) }))

let POST: typeof import("@/app/api/free-sunday-class/route").POST
let RESEND: typeof import("@/app/api/free-sunday-class/resend/route").POST
beforeAll(async () => {
  ;({ POST } = await import("@/app/api/free-sunday-class/route"))
  ;({ POST: RESEND } = await import("@/app/api/free-sunday-class/resend/route"))
})

const session = getUpcomingClasses(4).find((c) => classMatchesProgram(c, "shsat"))!
let ip = 0

function rsvp(overrides: Record<string, string> = {}) {
  ip += 1
  return new Request("https://ahmedprep.test/api/free-sunday-class", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.${Math.floor(ip / 250)}.${ip % 250}` },
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

function resend(token: unknown, fromIp = `10.9.0.${++ip % 250}`) {
  return new Request("https://ahmedprep.test/api/free-sunday-class/resend", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": fromIp },
    body: JSON.stringify({ token }),
  })
}

async function call(handler: (r: Request) => Promise<Response>, req: Request) {
  const res = await handler(req)
  return { status: res.status, body: await res.json() }
}

const savedKeys = () => db.claimRegistration.mock.calls.map(([r]) => r.dedupeKey as string)

beforeEach(() => {
  vi.clearAllMocks()
  mail.sendAdminNotification.mockResolvedValue({ ok: true, id: "admin_1" })
  mail.sendConfirmationEmail.mockResolvedValue({ ok: true, id: "parent_1" })
})

describe("POST /api/free-sunday-class", () => {
  it("saves a new registration, sends both emails, and returns a resend token", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "new", id: 42 })
    const { status, body } = await call(POST, rsvp())
    expect(status).toBe(200)
    expect(body).toMatchObject({ success: true, confirmation: "sent", resendToken: "token-42" })
    expect(db.claimRegistration).toHaveBeenCalledTimes(1)
    expect(mail.sendAdminNotification).toHaveBeenCalledTimes(1)
    expect(mail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
    expect(mail.sendConfirmationEmail.mock.calls[0][0].to).toBe("parent@resend.dev")
    expect(db.markAdminNotified).toHaveBeenCalledWith(42)
    expect(db.setConfirmationStatus).toHaveBeenCalledWith(42, "sent", null)
  })

  it("sends the parent confirmation even when the admin notification fails", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "new", id: 5 })
    mail.sendAdminNotification.mockResolvedValue({ ok: false, error: "validation_error" })
    const { status, body } = await call(POST, rsvp())
    expect(status).toBe(200)
    expect(body).toMatchObject({ success: true, confirmation: "sent" })
    expect(mail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
    expect(db.markAdminFailed).toHaveBeenCalledWith(5, "validation_error")
    expect(db.setConfirmationStatus).toHaveBeenCalledWith(5, "sent", null)
  })

  it("keeps the seat and offers a retry when only the parent confirmation fails", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "new", id: 7 })
    mail.sendConfirmationEmail.mockResolvedValue({ ok: false, error: "rate_limit_exceeded" })
    const { status, body } = await call(POST, rsvp())
    expect(status).toBe(200)
    expect(body).toMatchObject({ success: true, confirmation: "failed", resendToken: "token-7" })
    expect(db.markAdminNotified).toHaveBeenCalledWith(7)
    expect(db.setConfirmationStatus).toHaveBeenCalledWith(7, "failed", "confirmation: rate_limit_exceeded")
    expect(mail.sendAdminAlert).toHaveBeenCalledTimes(1)
    expect(interpretRsvpResponse(status, body)).toEqual({ kind: "success", confirmation: "failed", resendToken: "token-7" })
  })

  it("answers a duplicate with 409 and 'already registered', without new emails or a new seat", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "existing", id: 42, adminNotified: true, confirmation: "sent" })
    const { status, body } = await call(POST, rsvp())
    expect(status).toBe(409)
    expect(body).toMatchObject({ success: false, duplicate: true, code: "duplicate", resendToken: "token-42" })
    expect(JSON.stringify(body)).not.toMatch(/zoom\.us|https?:\/\/|passcode|meeting id/i)
    expect(mail.sendAdminNotification).not.toHaveBeenCalled()
    expect(mail.sendConfirmationEmail).not.toHaveBeenCalled()
    expect(mail.sendAdminAlert).not.toHaveBeenCalled()
    expect(interpretRsvpResponse(status, body)).toEqual({
      kind: "duplicate",
      title: "You\u2019re already registered!",
      message: duplicateMessage("shsat"),
      confirmation: "sent",
      resendToken: "token-42",
    })
  })

  it("retries only a missing admin notification on a duplicate, with the original idempotency key", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "new", id: 9 })
    await call(POST, rsvp())
    const firstKey = mail.sendAdminNotification.mock.calls[0][0].idempotencyKey
    db.claimRegistration.mockResolvedValue({ kind: "existing", id: 9, adminNotified: false, confirmation: "sent" })
    const { status } = await call(POST, rsvp())
    expect(status).toBe(409)
    expect(mail.sendAdminNotification).toHaveBeenCalledTimes(2)
    expect(mail.sendAdminNotification.mock.calls[1][0].idempotencyKey).toBe(firstKey)
    expect(mail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
  })

  it("treats email case, spacing, and name spacing variants as the same registration", async () => {
    db.claimRegistration.mockResolvedValue({ kind: "new", id: 1 })
    await call(POST, rsvp())
    await call(POST, rsvp({ parentEmail: "  PARENT@Resend.DEV ", studentName: "  test   STUDENT " }))
    const [a, b] = savedKeys()
    expect(a).toBe(b)
  })

  it("lets siblings register separately with the same parent email", async () => {
    db.claimRegistration.mockResolvedValueOnce({ kind: "new", id: 1 }).mockResolvedValueOnce({ kind: "new", id: 2 })
    const first = await call(POST, rsvp({ studentName: "Amina Khan" }))
    const second = await call(POST, rsvp({ studentName: "Yusuf Khan" }))
    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    const [a, b] = savedKeys()
    expect(a).not.toBe(b)
    expect(mail.sendConfirmationEmail).toHaveBeenCalledTimes(2)
  })

  it("returns 503 with a retry message when the database is unavailable, and sends no confirmation", async () => {
    db.claimRegistration.mockRejectedValue(new Error("connection refused"))
    const { status, body } = await call(POST, rsvp())
    expect(status).toBe(503)
    expect(mail.sendConfirmationEmail).not.toHaveBeenCalled()
    expect(mail.sendAdminNotification).not.toHaveBeenCalled()
    expect(mail.sendAdminAlert).toHaveBeenCalledTimes(1)
    expect(interpretRsvpResponse(status, body)).toEqual({ kind: "error", message: RSVP_MESSAGES.notSaved })
  })

  it("rejects incomplete submissions without touching the database", async () => {
    const { status, body } = await call(POST, rsvp({ consent: "" }))
    expect(status).toBe(400)
    expect(db.claimRegistration).not.toHaveBeenCalled()
    expect(interpretRsvpResponse(status, body)).toEqual({ kind: "error", message: RSVP_MESSAGES.invalid })
  })
})

describe("registrationKey", () => {
  const base = { parentEmail: "parent@example.com", studentName: "Amina Khan", isoDate: "2026-10-18", program: "shsat" }

  it("differs for a different Sunday or a different program", () => {
    expect(registrationKey({ ...base, isoDate: "2026-10-25" })).not.toBe(registrationKey(base))
    expect(registrationKey({ ...base, program: "digital_sat" })).not.toBe(registrationKey(base))
  })
  it("matches the key format stored before this change, so existing rows still block repeats", async () => {
    const { createHash } = await import("node:crypto")
    const legacy = createHash("sha256")
      .update([" Parent@Example.com", "Amina Khan ", base.isoDate, base.program].map((v) => v.trim().toLowerCase()).join("|"))
      .digest("hex")
    expect(registrationKey({ ...base, parentEmail: " Parent@Example.com", studentName: "Amina Khan " })).toBe(legacy)
  })
})

describe("POST /api/free-sunday-class/resend", () => {
  const stored = {
    id: 42,
    classDate: session.isoDate,
    program: "shsat",
    studentName: "Test Student",
    parentName: "Test Parent",
    parentEmail: "stored@resend.dev",
    confirmationResendCount: 0,
  }

  it("resends to the stored email only, using a fresh idempotency key per attempt", async () => {
    db.getRegistration.mockResolvedValue(stored)
    db.claimResendAttempt.mockResolvedValue(1)
    const { status, body } = await call(RESEND, resend("token-42"))
    expect(status).toBe(200)
    expect(body).toMatchObject({ success: true, message: RSVP_MESSAGES.resendAccepted })
    expect(mail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
    const [confirmation, , key] = mail.sendConfirmationEmail.mock.calls[0]
    expect(confirmation.to).toBe("stored@resend.dev")
    expect(key).toBe("free-sunday-class-resend/42/1")
    expect(db.claimRegistration).not.toHaveBeenCalled()
    expect(db.setConfirmationStatus).toHaveBeenCalledWith(42, "sent", null)
  })

  it("rejects an invalid token without touching the database", async () => {
    const { status, body } = await call(RESEND, resend("forged"))
    expect(status).toBe(400)
    expect(body.message).toBe(RSVP_MESSAGES.resendExpired)
    expect(db.getRegistration).not.toHaveBeenCalled()
    expect(mail.sendConfirmationEmail).not.toHaveBeenCalled()
  })

  it("refuses a resend within two minutes of the previous one", async () => {
    db.getRegistration.mockResolvedValue({ ...stored, confirmationResendCount: 1 })
    db.claimResendAttempt.mockResolvedValue(null)
    const { status, body } = await call(RESEND, resend("token-42"))
    expect(status).toBe(429)
    expect(body.message).toBe(RSVP_MESSAGES.resendWait)
    expect(mail.sendConfirmationEmail).not.toHaveBeenCalled()
  })

  it("stops after the per-registration limit", async () => {
    db.getRegistration.mockResolvedValue({ ...stored, confirmationResendCount: 5 })
    db.claimResendAttempt.mockResolvedValue(null)
    const { status, body } = await call(RESEND, resend("token-42"))
    expect(status).toBe(429)
    expect(body.message).toBe(RSVP_MESSAGES.resendLimit)
  })

  it("limits each IP to 3 requests per 10 minutes", async () => {
    db.getRegistration.mockResolvedValue(stored)
    db.claimResendAttempt.mockResolvedValue(null)
    const statuses = []
    for (let i = 0; i < 4; i++) statuses.push((await RESEND(resend("token-42", "10.200.0.1"))).status)
    expect(statuses[3]).toBe(429)
    expect(db.getRegistration).toHaveBeenCalledTimes(3)
  })

  it("reports a failed send and records it", async () => {
    db.getRegistration.mockResolvedValue(stored)
    db.claimResendAttempt.mockResolvedValue(2)
    mail.sendConfirmationEmail.mockResolvedValue({ ok: false, error: "application_error" })
    const { status, body } = await call(RESEND, resend("token-42"))
    expect(status).toBe(502)
    expect(body.message).toBe(RSVP_MESSAGES.resendFailed)
    expect(db.setConfirmationStatus).toHaveBeenCalledWith(42, "failed", "resend: application_error")
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
})

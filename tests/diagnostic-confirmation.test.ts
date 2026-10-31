import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Every Resend call and database query is mocked: these tests never send email or touch a real database.
const { send, query } = vi.hoisted(() => ({ send: vi.fn(), query: vi.fn() }))

vi.mock("resend", () => ({
  Resend: class {
    emails = { send }
  },
}))
vi.mock("@/lib/db", () => ({ pool: { query }, db: {} }))

import { POST } from "@/app/api/diagnostic/route"
import { formatPreferredDate } from "@/lib/diagnostic-confirmation"

const ADMIN = "Tariq@ahmedprep.com"
const PARENT_EMAIL = "parent@example.test"

let ipCounter = 0
function submit(overrides: Record<string, unknown> = {}) {
  ipCounter += 1
  return POST(
    new Request("https://preview.test/api/diagnostic", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${ipCounter}` },
      body: JSON.stringify({
        studentName: "Test Student",
        studentGrade: "7th",
        parentName: "Test Parent",
        parentPhone: "(555) 010-0000",
        parentEmail: PARENT_EMAIL,
        program: "SHSAT",
        preferredDate: "2026-11-07",
        submissionId: "3f2b8c1e-4a5d-4e6f-8a7b-9c0d1e2f3a4b",
        elapsedMs: 5000,
        website: "",
        ...overrides,
      }),
    }),
  )
}

/** The claim query returns whether this request owns delivery and whether the row is a new submission. */
function mockDatabase({ owns = true, fresh = true } = {}) {
  query.mockImplementation(async (sql: string) =>
    sql.includes("INSERT INTO lead_submissions") ? { rows: [{ id: "42", owns, fresh }] } : { rows: [], rowCount: 1 },
  )
}

const sent = () => send.mock.calls.map(([message, options]) => ({ message, options }))
const ok = (id: string) => ({ data: { id }, error: null })
const resendError = (name: string) => ({ data: null, error: { name, message: name } })

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test_mocked")
  vi.stubEnv("RESEND_EMAIL_DOMAIN", "ahmedprep.com")
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  send.mockReset()
  query.mockReset()
})

describe("diagnostic parent confirmation", () => {
  it("sends the admin notification first, then the parent acknowledgment", async () => {
    mockDatabase()
    send.mockResolvedValueOnce(ok("admin-1")).mockResolvedValueOnce(ok("confirm-1"))

    const res = await submit()
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ success: true, duplicate: false, confirmation: "sent" })

    const [admin, confirmation] = sent()
    expect(sent()).toHaveLength(2)

    expect(admin.message).toMatchObject({
      from: "AhmedPrep Website <diagnostics@ahmedprep.com>",
      to: [ADMIN],
      replyTo: PARENT_EMAIL,
      subject: "New AhmedPrep Diagnostic Request: SHSAT (Test Student)",
    })

    expect(confirmation.message).toMatchObject({
      from: "AhmedPrep <noreply@ahmedprep.com>",
      to: [PARENT_EMAIL],
      replyTo: ADMIN,
      subject: "We received your free SHSAT diagnostic request",
    })
    const { text, html } = confirmation.message
    expect(text).toContain("Student: Test Student")
    expect(text).toContain("Program: SHSAT")
    expect(text).toContain("Preferred date: Saturday, November 7, 2026 (requested, not yet confirmed)")
    expect(text).toContain("NOT confirmed yet")
    expect(text).toContain("AhmedPrep will contact you")
    expect(html).toContain("NOT confirmed yet")
    expect(confirmation.options.idempotencyKey).toMatch(/^diagnostic-confirmation\//)

    // The lead is marked notified in the database before the confirmation is attempted.
    expect(query.mock.calls.some(([sql]) => String(sql).includes("delivery_status = 'notified'"))).toBe(true)
  })

  it("keeps the request and alerts AhmedPrep when the parent acknowledgment fails", async () => {
    mockDatabase()
    send
      .mockResolvedValueOnce(ok("admin-1"))
      .mockResolvedValueOnce(resendError("validation_error"))
      .mockResolvedValueOnce(ok("alert-1"))

    const res = await submit()
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ success: true, confirmation: "failed" })

    const [admin, confirmation, alert] = sent()
    expect(sent()).toHaveLength(3)
    expect(admin.message.to).toEqual([ADMIN])
    expect(confirmation.message.to).toEqual([PARENT_EMAIL])
    expect(alert.message).toMatchObject({ to: [ADMIN], replyTo: PARENT_EMAIL })
    expect(alert.message.subject).toBe(`ACTION NEEDED: confirmation email not delivered (${PARENT_EMAIL})`)
    expect(alert.message.text).toContain("validation_error")
    expect(alert.options.idempotencyKey).toMatch(/^diagnostic-confirmation-alert\//)
  })

  it("treats a Resend response with no message id as a failed acknowledgment", async () => {
    mockDatabase()
    send
      .mockResolvedValueOnce(ok("admin-1"))
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce(ok("alert-1"))

    const res = await submit()
    expect(await res.json()).toMatchObject({ success: true, confirmation: "failed" })
    expect(sent()[2].message.subject).toMatch(/^ACTION NEEDED: confirmation email not delivered/)
  })

  it("does not attempt the parent acknowledgment when the admin notification fails", async () => {
    mockDatabase()
    send.mockResolvedValueOnce(resendError("application_error")).mockResolvedValueOnce(ok("alert-1"))

    const res = await submit()
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ success: true, saved: true, notified: false, confirmation: "failed" })

    expect(sent()).toHaveLength(2)
    expect(sent().every(({ message }) => message.to[0] === ADMIN)).toBe(true)
    expect(sent()[1].message.subject).toBe(
      "ACTION NEEDED: New AhmedPrep Diagnostic Request saved, but the notification email failed",
    )
  })

  it("sends nothing for a repeat of an already-delivered request", async () => {
    mockDatabase({ owns: false })
    const res = await submit()
    expect(await res.json()).toMatchObject({ success: true, duplicate: true })
    expect(send).not.toHaveBeenCalled()
  })

  it("never emails the family when an older saved request is retried", async () => {
    mockDatabase({ owns: true, fresh: false })
    send.mockResolvedValueOnce(ok("admin-1"))

    const res = await submit()
    expect(await res.json()).toMatchObject({ success: true, confirmation: "not_requested" })
    expect(sent()).toHaveLength(1)
    expect(sent()[0].message.to).toEqual([ADMIN])
  })

  it("rejects invalid submissions without sending anything", async () => {
    const res = await submit({ preferredDate: "next week" })
    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
    expect(query).not.toHaveBeenCalled()
  })

  it("routes Resend test addresses to Resend's sink, never a real inbox", async () => {
    mockDatabase()
    send.mockResolvedValueOnce(ok("admin-1")).mockResolvedValueOnce(ok("confirm-1"))
    await submit({ parentEmail: "delivered@resend.dev" })
    expect(sent().map(({ message }) => message.to[0])).toEqual(["delivered@resend.dev", "delivered@resend.dev"])
  })
})

describe("formatPreferredDate", () => {
  it("keeps the calendar day regardless of time zone", () => {
    expect(formatPreferredDate("2026-11-07")).toBe("Saturday, November 7, 2026")
    expect(formatPreferredDate("2026-01-01")).toBe("Thursday, January 1, 2026")
  })
})

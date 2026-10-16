import { afterEach, describe, expect, it, vi } from "vitest"
import { addressEmail } from "@/lib/lead-delivery"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("addressEmail", () => {
  it("sends production mail to the real recipient, even if a test inbox is set", () => {
    vi.stubEnv("VERCEL_ENV", "production")
    vi.stubEnv("EMAIL_TEST_RECIPIENT", "tester@example.com")
    expect(addressEmail("parent@example.com", "Your seat")).toEqual({ to: ["parent@example.com"], subject: "Your seat" })
  })

  it("redirects preview mail to the approved test inbox and marks it [TEST]", () => {
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("EMAIL_TEST_RECIPIENT", "tester@example.com")
    expect(addressEmail("parent@example.com", "Your seat")).toEqual({
      to: ["tester@example.com"],
      subject: "[TEST] Your seat",
    })
    expect(addressEmail("Tariq@ahmedprep.com", "[TEST] New RSVP").subject).toBe("[TEST] New RSVP")
  })

  it("falls back to Resend's sink in preview when no test inbox is configured", () => {
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("EMAIL_TEST_RECIPIENT", "")
    expect(addressEmail("parent@example.com", "Your seat").to).toEqual(["delivered@resend.dev"])
  })
})

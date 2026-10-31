import type { Confirmation } from "@/lib/lead-delivery"

export const DIAGNOSTIC_CONFIRMATION_SENDER = "AhmedPrep <noreply@ahmedprep.com>"

/** "2026-11-07" -> "Saturday, November 7, 2026". Read as a calendar date so the day never shifts by time zone. */
export function formatPreferredDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/** Acknowledgment to the parent. It confirms receipt only; AhmedPrep confirms the appointment separately. */
export function diagnosticConfirmation(data: {
  parentEmail: string
  parentName: string
  studentName: string
  program: string
  preferredDate: string
}): Confirmation {
  return {
    to: data.parentEmail,
    from: DIAGNOSTIC_CONFIRMATION_SENDER,
    subject: `We received your free ${data.program} diagnostic request`,
    heading: "Diagnostic request received",
    paragraphs: [
      `Hello ${data.parentName},`,
      `Thank you for requesting a free ${data.program} diagnostic for ${data.studentName}. This email confirms that AhmedPrep received your request.`,
      [
        `Student: ${data.studentName}`,
        `Program: ${data.program}`,
        `Preferred date: ${formatPreferredDate(data.preferredDate)} (requested, not yet confirmed)`,
      ].join("\n"),
      "Please note: your diagnostic appointment is NOT confirmed yet. AhmedPrep will contact you to confirm the date and time. Please wait to hear from us before coming in.",
      "Questions? Simply reply to this email.",
    ],
  }
}

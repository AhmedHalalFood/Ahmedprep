import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, DIRECTIONS_URL, SITE_URL } from "@/lib/business"
import { FAMILY_SENDER, INTERNAL_SENDER, createEmailClient } from "@/lib/email-sender"
import {
  CLASS_TIME_LABEL,
  SAT_INTENSIVE_NAME,
  SAT_INTENSIVE_PATH,
  SAT_TEST_DATE_LABEL,
  WHAT_TO_BRING,
  formatClassDate,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  type ClassDate,
} from "@/lib/sat-final-intensive"
import type { EnrollmentRecord } from "@/lib/sat-final-intensive-enrollment"

export const ADMIN_NOTIFICATION_TO = "tariq@ahmedprep.com"

export type EmailContent = { subject: string; html: string; text: string }

const esc = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

const formatPhone = (digits: string) =>
  digits.length === 10 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : digits

const NAVY = "#0b2e52"
const GOLD = "#e8ba3f"
const INK = "#132d4b"
const MUTED = "#556779"
const LINE = "#d8e0e7"

function shell(preheader: string, body: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#edf3f7;font-family:Arial,Helvetica,sans-serif;color:${INK}">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf3f7;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff">
<tr><td style="background:${NAVY};padding:24px 28px;border-bottom:4px solid ${GOLD}">
<div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">Ahmed<span style="color:${GOLD}">Prep</span></div>
<div style="margin-top:4px;font-size:11px;font-weight:700;letter-spacing:2px;color:#c9d6e3;text-transform:uppercase">SHSAT &amp; Digital SAT Prep · Astoria, Queens</div>
</td></tr>
${body}
<tr><td style="padding:20px 28px;background:#f0f5fa;font-size:12px;line-height:1.6;color:${MUTED}">
${esc(BUSINESS.name)} · ${esc(ADDRESS_LINE_1)}, ${esc(ADDRESS_LINE_2)}<br>
${esc(BUSINESS.phoneDisplay)} · <a href="mailto:${ADMIN_NOTIFICATION_TO}" style="color:${MUTED}">${ADMIN_NOTIFICATION_TO}</a><br>
AhmedPrep is an independent test preparation provider and is not affiliated with or endorsed by the College Board.
</td></tr></table></td></tr></table></body></html>`
}

const detailRow = (label: string, value: string) =>
  `<tr><td style="padding:8px 0;border-bottom:1px solid ${LINE};font-size:13px;color:${MUTED};width:42%">${esc(label)}</td><td style="padding:8px 0;border-bottom:1px solid ${LINE};font-size:14px;font-weight:700;color:${INK}">${value}</td></tr>`

export function familyConfirmationEmail(record: EnrollmentRecord): EmailContent {
  const quote = quoteFor(record.firstClassDate as ClassDate)
  const tuition = formatUsd(record.tuitionCents)
  const subject = `Enrollment confirmed: ${record.studentName}, Digital SAT Final Intensive`
  const dates = quote.remainingDates
    .map(
      (d, i) =>
        `<tr><td style="padding:6px 10px;font-size:13px;color:${MUTED};border-bottom:1px solid ${LINE};width:56px">Class ${i + 1}</td><td style="padding:6px 10px;font-size:14px;font-weight:700;color:${INK};border-bottom:1px solid ${LINE}">${esc(formatClassDateLong(d))}</td></tr>`,
    )
    .join("")
  const bring = WHAT_TO_BRING.map((item) => `<li style="margin:0 0 6px">${esc(item)}</li>`).join("")

  const html = shell(
    `${record.studentName} is enrolled. First class: ${formatClassDateLong(record.firstClassDate)}.`,
    `<tr><td style="padding:28px 28px 8px">
<div style="font-size:11px;font-weight:800;letter-spacing:2px;color:#8a6812;text-transform:uppercase">${esc(SAT_TEST_DATE_LABEL)} SAT</div>
<h1 style="margin:8px 0 0;font-size:26px;line-height:1.2;color:${NAVY}">You&#39;re enrolled in the Digital SAT Final Intensive</h1>
<p style="margin:14px 0 0;font-size:15px;line-height:1.6">Dear ${esc(record.parentName)},</p>
<p style="margin:10px 0 0;font-size:15px;line-height:1.6">Thank you. Payment has been received and <strong>${esc(record.studentName)}</strong>&#39;s seat is confirmed. Here are the details for your records.</p>
</td></tr>
<tr><td style="padding:16px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${detailRow("Student", esc(record.studentName))}
${detailRow("First class", esc(formatClassDateLong(record.firstClassDate)))}
${detailRow("Class time", esc(CLASS_TIME_LABEL))}
${detailRow("Classes / hours", `${record.remainingClasses} classes · ${record.remainingHours} hours`)}
${detailRow("Tuition paid", `<span style="color:#2b6a54">${esc(tuition)}</span>`)}
${detailRow("Confirmation #", esc(record.paymentReference ?? record.publicId))}
</table></td></tr>
<tr><td style="padding:24px 28px 0"><h2 style="margin:0 0 8px;font-size:16px;color:${NAVY}">Your class dates</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf3f7">${dates}</table>
<p style="margin:8px 0 0;font-size:12px;color:${MUTED}">No class Thursday, November 26 (Thanksgiving). Official SAT: ${esc(SAT_TEST_DATE_LABEL)}.</p></td></tr>
<tr><td style="padding:24px 28px 0"><h2 style="margin:0 0 8px;font-size:16px;color:${NAVY}">Classroom</h2>
<p style="margin:0;font-size:14px;line-height:1.6">${esc(ADDRESS_LINE_1)}<br>${esc(ADDRESS_LINE_2)}<br>
<a href="${DIRECTIONS_URL}" style="color:#1769aa;font-weight:700">Get directions</a></p>
<p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:${MUTED}">Classes are in person only. Please arrive 5–10 minutes early.</p></td></tr>
<tr><td style="padding:24px 28px 0"><h2 style="margin:0 0 8px;font-size:16px;color:${NAVY}">What to bring</h2>
<ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.6">${bring}</ul></td></tr>
<tr><td style="padding:24px 28px 28px"><p style="margin:0;font-size:14px;line-height:1.6">Questions? Reply to this email, call or text <a href="${BUSINESS.phoneHref}" style="color:#1769aa;font-weight:700">${esc(BUSINESS.phoneDisplay)}</a>, or email <a href="mailto:${ADMIN_NOTIFICATION_TO}" style="color:#1769aa;font-weight:700">${ADMIN_NOTIFICATION_TO}</a>.</p>
<p style="margin:14px 0 0;font-size:14px;line-height:1.6">We look forward to working with ${esc(record.studentName)}.<br><strong>Tariq Ahmed</strong>, AhmedPrep</p></td></tr>`,
  )

  const text = [
    `You're enrolled in the ${SAT_INTENSIVE_NAME}`,
    "",
    `Dear ${record.parentName},`,
    `Payment has been received and ${record.studentName}'s seat is confirmed.`,
    "",
    `Student: ${record.studentName}`,
    `First class: ${formatClassDateLong(record.firstClassDate)}`,
    `Class time: ${CLASS_TIME_LABEL}`,
    `Classes / hours: ${record.remainingClasses} classes, ${record.remainingHours} hours`,
    `Tuition paid: ${tuition}`,
    `Confirmation #: ${record.paymentReference ?? record.publicId}`,
    "",
    "Your class dates:",
    ...quote.remainingDates.map((d, i) => `  Class ${i + 1}: ${formatClassDateLong(d)}`),
    "No class Thursday, November 26 (Thanksgiving).",
    `Official SAT: ${SAT_TEST_DATE_LABEL}.`,
    "",
    `Classroom: ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2} (in person only)`,
    "",
    "What to bring:",
    ...WHAT_TO_BRING.map((item) => `  - ${item}`),
    "",
    `Questions? Call or text ${BUSINESS.phoneDisplay} or email ${ADMIN_NOTIFICATION_TO}.`,
    "",
    "Tariq Ahmed, AhmedPrep",
  ].join("\n")

  return { subject, html, text }
}

const SAT_REGISTRATION_LABEL: Record<string, string> = {
  registered: "Registered for Dec 5 SAT",
  not_yet: "Not registered yet",
  unsure: "Not sure",
}

export function adminNotificationEmail(
  record: EnrollmentRecord,
  seatsConfirmed: number,
  capacity: number,
  emailAdminLink: string | null = null,
): EmailContent {
  const subject = `New SAT Intensive enrollment: ${record.studentName} (${formatClassDate(record.firstClassDate)}, ${formatUsd(record.tuitionCents)})`
  const rows: [string, string][] = [
    ["Student", record.studentName],
    ["Grade", record.studentGrade],
    ["Parent / guardian", record.parentName],
    ["Parent email", record.parentEmail],
    ["Parent phone", formatPhone(record.parentPhone)],
    ["First class", formatClassDateLong(record.firstClassDate)],
    ["Classes / hours", `${record.remainingClasses} classes · ${record.remainingHours} hours`],
    ["Tuition paid", formatUsd(record.tuitionCents)],
    ["Previous SAT/PSAT", record.previousScore ?? "Not provided"],
    ["Target SAT", record.targetScore ?? "Not provided"],
    ["Dec 5 SAT registration", SAT_REGISTRATION_LABEL[record.satRegistrationStatus] ?? record.satRegistrationStatus],
    ["Payment reference", record.paymentReference ?? "n/a"],
    ["Seats confirmed", `${seatsConfirmed} of ${capacity}`],
  ]
  const html = shell(
    `${record.studentName} enrolled starting ${formatClassDate(record.firstClassDate)}.`,
    `<tr><td style="padding:28px 28px 8px"><h1 style="margin:0;font-size:22px;color:${NAVY}">New Digital SAT Final Intensive enrollment</h1>
<p style="margin:8px 0 0;font-size:14px;color:${MUTED}">Payment verified. ${seatsConfirmed} of ${capacity} seats are now confirmed.</p></td></tr>
<tr><td style="padding:12px 28px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${rows.map(([l, v]) => detailRow(l, esc(v))).join("")}</table>
<p style="margin:16px 0 0;font-size:13px"><a href="${SITE_URL}${SAT_INTENSIVE_PATH}" style="color:#1769aa">Program page</a>${
      emailAdminLink ? ` · <a href="${esc(emailAdminLink)}" style="color:#1769aa">Email delivery status and resend</a>` : ""
    }</p></td></tr>`,
  )
  const text = [
    `New Digital SAT Final Intensive enrollment`,
    "",
    ...rows.map(([l, v]) => `${l}: ${v}`),
    ...(emailAdminLink ? ["", `Email delivery status and resend: ${emailAdminLink}`] : []),
  ].join("\n")
  return { subject, html, text }
}

export type DeliveryStatus = "sent" | "test_inbox" | "skipped" | "failed"

/**
 * Sends both emails through the shared Resend client. Outside Production that client redirects every message to
 * Resend's test inbox, so no family or staff mailbox receives Preview emails.
 */
export async function sendEnrollmentEmails(record: EnrollmentRecord, seatsConfirmed: number, capacity: number) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !process.env.RESEND_EMAIL_DOMAIN) return { family: "skipped" as DeliveryStatus, admin: "skipped" as DeliveryStatus }
  const client = createEmailClient(apiKey)
  const redirected = process.env.VERCEL_ENV !== "production"

  const send = async (payload: Parameters<typeof client.emails.send>[0], key: string): Promise<DeliveryStatus> => {
    try {
      const { data, error } = await client.emails.send(payload, { idempotencyKey: key })
      if (data?.id || error?.name === "invalid_idempotent_request") return redirected ? "test_inbox" : "sent"
      console.error("[sat-intensive] email failed:", error?.name)
      return "failed"
    } catch {
      return "failed"
    }
  }

  const family = familyConfirmationEmail(record)
  const admin = adminNotificationEmail(record, seatsConfirmed, capacity)
  const [familyStatus, adminStatus] = await Promise.all([
    send(
      { from: FAMILY_SENDER, to: [record.parentEmail], replyTo: ADMIN_NOTIFICATION_TO, ...family },
      `sat-intensive/family/${record.publicId}`,
    ),
    send({ from: INTERNAL_SENDER, to: [ADMIN_NOTIFICATION_TO], replyTo: record.parentEmail, ...admin }, `sat-intensive/admin/${record.publicId}`),
  ])
  return { family: familyStatus, admin: adminStatus }
}

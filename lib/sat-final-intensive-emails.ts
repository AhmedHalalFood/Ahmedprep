import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, DIRECTIONS_URL } from "@/lib/business"
import {
  CLASS_TIME_LABEL,
  PAYMENT_METHOD_INSTRUCTIONS,
  PAYMENT_METHOD_LABELS,
  POLICY_PENDING_NOTE,
  SAT_INTENSIVE_NAME,
  SAT_TEST_DATE_LABEL,
  WHAT_TO_BRING,
  formatClassDate,
  formatClassDateLong,
  formatUsd,
  isPaymentMethod,
  quoteFor,
  type ClassDate,
} from "@/lib/sat-final-intensive"
import type { EnrollmentRecord, PaymentRecord } from "@/lib/sat-final-intensive-enrollment"

export const ADMIN_NOTIFICATION_TO = "tariq@ahmedprep.com"

export type EmailContent = { subject: string; html: string; text: string }

const esc = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

export const formatPhone = (digits: string) =>
  digits.length === 10 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}` : digits

/** "Saturday, November 14 at 3:42 PM ET" */
export const formatEasternDateTime = (date: Date) =>
  `${new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric" }).format(date)} at ${new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }).format(date)} ET`

const methodLabel = (method: string | null) => (method && isPaymentMethod(method) ? PAYMENT_METHOD_LABELS[method] : "Not selected")

const NAVY = "#0b2e52"
const GOLD = "#e8ba3f"
const INK = "#132d4b"
const MUTED = "#556779"
const LINE = "#d8e0e7"
const LINK = "#1769aa"

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

const section = (title: string, inner: string) =>
  `<tr><td style="padding:24px 28px 0"><h2 style="margin:0 0 8px;font-size:16px;color:${NAVY}">${esc(title)}</h2>${inner}</td></tr>`

const p = (html: string, extra = "") => `<p style="margin:0 0 8px;font-size:14px;line-height:1.6;${extra}">${html}</p>`

function datesTable(record: EnrollmentRecord) {
  const quote = quoteFor(record.firstClassDate as ClassDate)
  const rows = quote.remainingDates
    .map(
      (d, i) =>
        `<tr><td style="padding:6px 10px;font-size:13px;color:${MUTED};border-bottom:1px solid ${LINE};width:56px">Class ${i + 1}</td><td style="padding:6px 10px;font-size:14px;font-weight:700;color:${INK};border-bottom:1px solid ${LINE}">${esc(formatClassDateLong(d))}</td></tr>`,
    )
    .join("")
  return {
    html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf3f7">${rows}</table>
<p style="margin:8px 0 0;font-size:12px;color:${MUTED}">No class Thursday, November 26 (Thanksgiving). Official SAT: ${esc(SAT_TEST_DATE_LABEL)}.</p>`,
    text: [
      ...quote.remainingDates.map((d, i) => `  Class ${i + 1}: ${formatClassDateLong(d)}`),
      "No class Thursday, November 26 (Thanksgiving).",
      `Official SAT: ${SAT_TEST_DATE_LABEL}.`,
    ],
  }
}

const contactHtml = () =>
  p(
    `Questions? Reply to this email, call or text <a href="${BUSINESS.phoneHref}" style="color:${LINK};font-weight:700">${esc(BUSINESS.phoneDisplay)}</a>, or email <a href="mailto:${ADMIN_NOTIFICATION_TO}" style="color:${LINK};font-weight:700">${ADMIN_NOTIFICATION_TO}</a>.`,
  )
const contactText = `Questions? Call or text ${BUSINESS.phoneDisplay} or email ${ADMIN_NOTIFICATION_TO}.`

/** Sent when the form is submitted. States plainly that the seat is not yet confirmed. */
export function familyPendingEmail(record: EnrollmentRecord): EmailContent {
  const tuition = formatUsd(record.tuitionCents)
  const method = record.paymentMethod
  const instructions = method ? PAYMENT_METHOD_INSTRUCTIONS[method] : "Contact AhmedPrep to arrange payment."
  const holdUntil = formatEasternDateTime(record.holdExpiresAt)
  const subject = `Registration received (payment pending): ${record.studentName}, Digital SAT Final Intensive`
  const dates = datesTable(record)

  const html = shell(
    `Registration received. ${record.studentName}'s seat is not confirmed until tuition is verified.`,
    `<tr><td style="padding:28px 28px 8px">
<div style="font-size:11px;font-weight:800;letter-spacing:2px;color:#8a6812;text-transform:uppercase">Payment pending</div>
<h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;color:${NAVY}">Registration received. Your seat is not confirmed yet.</h1>
<p style="margin:14px 0 0;font-size:15px;line-height:1.6">Dear ${esc(record.parentName)},</p>
<p style="margin:10px 0 0;font-size:15px;line-height:1.6">Thank you for registering <strong>${esc(record.studentName)}</strong>. Your registration is pending payment verification. <strong>${esc(record.studentName)}&#39;s seat will be confirmed only after AhmedPrep verifies full tuition payment.</strong></p>
</td></tr>
<tr><td style="padding:16px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${detailRow("Registration #", esc(record.referenceCode))}
${detailRow("Student", esc(record.studentName))}
${detailRow("First class", esc(formatClassDateLong(record.firstClassDate)))}
${detailRow("Classes / hours", `${record.remainingClasses} classes · ${record.remainingHours} hours`)}
${detailRow("Tuition due (in full)", esc(tuition))}
${detailRow("Payment method", esc(methodLabel(method)))}
${detailRow("Status", `<span style="color:#8a4b00">Payment pending, seat not confirmed</span>`)}
${detailRow("Temporary hold until", esc(holdUntil))}
</table></td></tr>
${section(
  "How to pay",
  p(esc(instructions)) +
    p(`Full tuition of ${esc(tuition)} for all remaining classes is due before enrollment is confirmed. There is no installment plan and individual drop-in classes are not offered.`) +
    p(`A temporary seat hold lasts until ${esc(holdUntil)}. After it lapses your registration stays on file, but a seat is guaranteed only once payment is verified and a seat is still available.`, `color:${MUTED}`),
)}
${section("Selected class dates", dates.html)}
${section("Policies", p(esc(POLICY_PENDING_NOTE), `color:${MUTED}`))}
<tr><td style="padding:24px 28px 28px">${contactHtml()}<p style="margin:14px 0 0;font-size:14px;line-height:1.6"><strong>Tariq Ahmed</strong>, AhmedPrep</p></td></tr>`,
  )

  const text = [
    "Registration received. Your seat is not confirmed yet.",
    "",
    `Dear ${record.parentName},`,
    `Thank you for registering ${record.studentName}. Your registration is pending payment verification. The seat will be confirmed only after AhmedPrep verifies full tuition payment.`,
    "",
    `Registration #: ${record.referenceCode}`,
    `Student: ${record.studentName}`,
    `First class: ${formatClassDateLong(record.firstClassDate)}`,
    `Classes / hours: ${record.remainingClasses} classes, ${record.remainingHours} hours`,
    `Tuition due (in full): ${tuition}`,
    `Payment method: ${methodLabel(method)}`,
    "Status: Payment pending, seat not confirmed",
    `Temporary hold until: ${holdUntil}`,
    "",
    "How to pay:",
    instructions,
    `Full tuition of ${tuition} for all remaining classes is due before enrollment is confirmed. No installment plan; no individual drop-in classes.`,
    "",
    "Selected class dates:",
    ...dates.text,
    "",
    POLICY_PENDING_NOTE,
    "",
    contactText,
    "",
    "Tariq Ahmed, AhmedPrep",
  ].join("\n")
  return { subject, html, text }
}

/** Sent only after an administrator has verified full payment. */
export function familyConfirmationEmail(record: EnrollmentRecord, payment: PaymentRecord | null): EmailContent {
  const tuition = formatUsd(payment?.amountCents ?? record.tuitionCents)
  const subject = `Enrollment confirmed: ${record.studentName}, Digital SAT Final Intensive`
  const dates = datesTable(record)
  const bring = WHAT_TO_BRING.map((item) => `<li style="margin:0 0 6px">${esc(item)}</li>`).join("")
  const paidVia = payment ? `${tuition} by ${methodLabel(payment.method)}` : tuition
  const firstClass = formatClassDateLong(record.firstClassDate)

  const html = shell(
    `${record.studentName} is enrolled. First class: ${firstClass}.`,
    `<tr><td style="padding:28px 28px 8px">
<div style="font-size:11px;font-weight:800;letter-spacing:2px;color:#2b6a54;text-transform:uppercase">Payment verified</div>
<h1 style="margin:8px 0 0;font-size:26px;line-height:1.2;color:${NAVY}">You&#39;re enrolled in the Digital SAT Final Intensive</h1>
<p style="margin:14px 0 0;font-size:15px;line-height:1.6">Dear ${esc(record.parentName)},</p>
<p style="margin:10px 0 0;font-size:15px;line-height:1.6">AhmedPrep has verified your tuition payment and <strong>${esc(record.studentName)}</strong>&#39;s seat is confirmed.</p>
</td></tr>
<tr><td style="padding:16px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${detailRow("Registration #", esc(record.referenceCode))}
${detailRow("Student", esc(record.studentName))}
${detailRow("First class", esc(firstClass))}
${detailRow("Class time", esc(CLASS_TIME_LABEL))}
${detailRow("Classes / hours", `${record.remainingClasses} classes · ${record.remainingHours} hours`)}
${detailRow("Tuition paid", `<span style="color:#2b6a54">${esc(paidVia)}</span>`)}
${detailRow("Status", `<span style="color:#2b6a54">Confirmed</span>`)}
</table></td></tr>
${section("Your class dates", dates.html)}
${section(
  "First class",
  p(`Please arrive 5–10 minutes before 6:00 PM on <strong>${esc(firstClass)}</strong>. Classes are in person only.`) +
    p(`${esc(ADDRESS_LINE_1)}<br>${esc(ADDRESS_LINE_2)}<br><a href="${DIRECTIONS_URL}" style="color:${LINK};font-weight:700">Get directions</a>`),
)}
${section("What to bring", `<ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.6">${bring}</ul>`)}
<tr><td style="padding:24px 28px 28px">${contactHtml()}
<p style="margin:14px 0 0;font-size:14px;line-height:1.6">We look forward to working with ${esc(record.studentName)}.<br><strong>Tariq Ahmed</strong>, AhmedPrep</p></td></tr>`,
  )

  const text = [
    `You're enrolled in the ${SAT_INTENSIVE_NAME}`,
    "",
    `Dear ${record.parentName},`,
    `AhmedPrep has verified your tuition payment and ${record.studentName}'s seat is confirmed.`,
    "",
    `Registration #: ${record.referenceCode}`,
    `Student: ${record.studentName}`,
    `First class: ${firstClass}`,
    `Class time: ${CLASS_TIME_LABEL}`,
    `Classes / hours: ${record.remainingClasses} classes, ${record.remainingHours} hours`,
    `Tuition paid: ${paidVia}`,
    "",
    "Your class dates:",
    ...dates.text,
    "",
    `First class: please arrive 5-10 minutes before 6:00 PM on ${firstClass}. In person only.`,
    `Classroom: ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`,
    "",
    "What to bring:",
    ...WHAT_TO_BRING.map((item) => `  - ${item}`),
    "",
    contactText,
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

/** Internal alert on every new registration. No payment has been verified at this point. */
export function adminNewRegistrationEmail(
  record: EnrollmentRecord,
  seats: { confirmed: number; held: number; capacity: number },
  consoleUrl: string | null,
): EmailContent {
  const subject = `SAT Intensive registration (payment pending): ${record.studentName}, ${formatClassDate(record.firstClassDate)}, ${formatUsd(record.tuitionCents)} by ${methodLabel(record.paymentMethod)}`
  const rows: [string, string][] = [
    ["Registration #", record.referenceCode],
    ["Status", "Payment pending, seat not confirmed"],
    ["Student", record.studentName],
    ["Grade", record.studentGrade],
    ["Parent / guardian", record.parentName],
    ["Parent email", record.parentEmail],
    ["Parent phone", formatPhone(record.parentPhone)],
    ["First class", formatClassDateLong(record.firstClassDate)],
    ["Classes / hours", `${record.remainingClasses} classes · ${record.remainingHours} hours`],
    ["Tuition due", formatUsd(record.tuitionCents)],
    ["Preferred payment", methodLabel(record.paymentMethod)],
    ["Hold expires", formatEasternDateTime(record.holdExpiresAt)],
    ["Previous SAT/PSAT", record.previousScore ?? "Not provided"],
    ["Target SAT", record.targetScore ?? "Not provided"],
    ["Dec 5 SAT registration", SAT_REGISTRATION_LABEL[record.satRegistrationStatus] ?? record.satRegistrationStatus],
    ["Seats", `${seats.confirmed} confirmed · ${seats.held} held · ${seats.capacity} total`],
  ]
  const html = shell(
    `${record.studentName} registered starting ${formatClassDate(record.firstClassDate)}. Payment pending.`,
    `<tr><td style="padding:28px 28px 8px"><h1 style="margin:0;font-size:22px;color:${NAVY}">New registration: payment pending</h1>
<p style="margin:8px 0 0;font-size:14px;color:${MUTED}">No payment has been verified. Confirm the seat in the admin console only after full tuition is received.</p></td></tr>
<tr><td style="padding:12px 28px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${rows.map(([l, v]) => detailRow(l, esc(v))).join("")}</table>
${consoleUrl ? `<p style="margin:16px 0 0;font-size:13px"><a href="${esc(consoleUrl)}" style="color:${LINK}">Open the enrollment admin console</a> (sign-in required)</p>` : ""}</td></tr>`,
  )
  const text = [
    "New registration: payment pending",
    "No payment has been verified. Confirm the seat only after full tuition is received.",
    "",
    ...rows.map(([l, v]) => `${l}: ${v}`),
    ...(consoleUrl ? ["", `Admin console (sign-in required): ${consoleUrl}`] : []),
  ].join("\n")
  return { subject, html, text }
}

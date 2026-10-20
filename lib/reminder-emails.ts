import { BUSINESS } from "@/lib/business"
import { CLASS_TYPES, FREE_CLASS, type RsvpProgram, type SundayClass } from "@/lib/free-class"
import type { ReminderSlot } from "@/lib/reminder-schedule"

export type ZoomDetails = { zoomUrl: string; meetingId: string | null; passcode: string | null }

export type ReminderInput = {
  slot: ReminderSlot
  session: SundayClass
  program: RsvpProgram
  parentName: string
  studentName: string
  zoom: ZoomDetails
  /** Set in test mode: shown at the top so the test inbox can see who the real email would have gone to. */
  testNote?: string
}

const NAVY = "#0b2e52"
const GOLD = "#e8ba3f"
const MUTED = "#556779"
const LINE = "#d8e0e7"

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name.trim()

/** Only real https Zoom links are ever placed in an email. */
export function isValidZoomUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && (url.hostname === "zoom.us" || url.hostname.endsWith(".zoom.us")) && !url.username && !url.password
  } catch {
    return false
  }
}

function button(href: string, label: string, large: boolean) {
  const size = large ? "font-size:18px;padding:16px 28px" : "font-size:16px;padding:12px 22px"
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px${large ? ";width:100%" : ""}"><tr><td align="center" bgcolor="${GOLD}" style="background:${GOLD}">
<a href="${escapeHtml(href)}" style="display:${large ? "block" : "inline-block"};${size};color:${NAVY};font-weight:800;text-decoration:none;text-align:center">${escapeHtml(label)}</a>
</td></tr></table>`
}

export function buildReminderEmail(input: ReminderInput) {
  const { slot, session, program, zoom } = input
  const programLabel = CLASS_TYPES[program].label
  const classPhrase = session.type === "workshop" ? `free ${session.title} (${programLabel} family)` : `free live ${programLabel} class`
  const parent = firstName(input.parentName)
  const student = firstName(input.studentName)
  const morning = slot === "morning"

  const subject = morning
    ? `Today at 4:00 PM ET: ${student}'s ${classPhrase} and Zoom link`
    : `Starting in 30 minutes: ${student}'s ${classPhrase}`
  const heading = morning ? `See you today at 4:00 PM, ${student}!` : "Class starts in 30 minutes"
  const intro = morning
    ? `We're excited to welcome ${student} to AhmedPrep's ${classPhrase} today!`
    : `${student}'s ${classPhrase} starts in 30 minutes, at 4:00 PM Eastern. Use the button below to join.`

  const details: [string, string][] = [
    ["Date", session.label],
    ["Time", "4:00–5:00 PM Eastern"],
    ["Topic", session.topic],
    ["Instructor", FREE_CLASS.instructor],
  ]
  const access: [string, string][] = [
    ...(zoom.meetingId ? ([["Meeting ID", zoom.meetingId]] as [string, string][]) : []),
    ...(zoom.passcode ? ([["Passcode", zoom.passcode]] as [string, string][]) : []),
  ]
  const tips = "Please join 5 minutes early and have a pencil, paper, and calculator ready."
  const privacy = "This Zoom link is for your family only. Please do not share it."
  const signature = ["Warm regards,", "Tariq Ahmed", FREE_CLASS.instructorRole, "AhmedPrep", BUSINESS.phoneDisplay, "www.ahmedprep.com"]

  const rows = (items: [string, string][]) =>
    items
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:${MUTED};white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td></tr>`,
      )
      .join("")

  const joinBlock = morning
    ? `<p style="margin:0 0 10px;font-weight:700">Join your Zoom class:</p>${button(zoom.zoomUrl, "Join Zoom Class", false)}`
    : button(zoom.zoomUrl, "Join Zoom Class", true)

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:${NAVY};line-height:1.6;max-width:560px;border-top:4px solid ${GOLD}">
${input.testNote ? `<p style="margin:0;padding:10px 12px;background:#fff4d6;font-size:13px;color:${NAVY}"><strong>TEST REMINDER.</strong> ${escapeHtml(input.testNote)}</p>` : ""}
<p style="margin:0;padding:16px 0 4px;font-size:20px;font-weight:800;letter-spacing:-0.02em"><a href="https://ahmedprep.com" style="color:${NAVY};text-decoration:none">AhmedPrep<span style="color:#1769aa">.com</span></a></p>
<h2 style="margin:0 0 16px;font-size:22px">${escapeHtml(heading)}</h2>
<p style="margin:0 0 14px">Hi ${escapeHtml(parent)},</p>
<p style="margin:0 0 18px">${escapeHtml(intro)}</p>
${morning ? "" : joinBlock}
<p style="margin:0 0 6px;font-weight:700">Class details</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border-collapse:collapse">${rows(details)}</table>
${morning ? joinBlock : ""}
<p style="margin:0 0 6px;font-size:14px;color:${MUTED}">If the button doesn't work, copy this link into your browser:<br><a href="${escapeHtml(zoom.zoomUrl)}" style="color:#1769aa;word-break:break-all">${escapeHtml(zoom.zoomUrl)}</a></p>
${access.length ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border-collapse:collapse">${rows(access)}</table>` : ""}
<p style="margin:0 0 14px">${escapeHtml(tips)}</p>
<p style="margin:0 0 18px">We look forward to seeing you!</p>
<p style="margin:0 0 18px">${signature.map((line, i) => (i === 1 ? `<strong>${escapeHtml(line)}</strong>` : escapeHtml(line))).join("<br>")}</p>
<p style="margin:0;padding-top:12px;border-top:1px solid ${LINE};font-size:12px;color:${MUTED}">${escapeHtml(privacy)} Questions? Reply to this email or call or text ${escapeHtml(BUSINESS.phoneDisplay)}.</p>
</div>`

  const text = [
    input.testNote ? `TEST REMINDER. ${input.testNote}` : null,
    `Hi ${parent},`,
    intro,
    morning ? null : `Join Zoom Class: ${zoom.zoomUrl}`,
    `Class details\n${details.map(([l, v]) => `${l}: ${v}`).join("\n")}`,
    morning ? `Join your Zoom class: ${zoom.zoomUrl}` : null,
    access.length ? access.map(([l, v]) => `${l}: ${v}`).join("\n") : null,
    tips,
    "We look forward to seeing you!",
    signature.join("\n"),
    `${privacy} Questions? Reply to this email or call or text ${BUSINESS.phoneDisplay}.`,
  ]
    .filter(Boolean)
    .join("\n\n")

  return { subject: input.testNote ? `[TEST] ${subject}` : subject, html, text }
}

import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { createResendLink } from "@/lib/admin-links"
import {
  claimRegistration,
  describeDbError,
  markAdminFailed,
  markAdminNotified,
  setConfirmationStatus,
  withDbRetry,
} from "@/lib/sunday-registrations"
import { buildSundayConfirmation } from "@/lib/sunday-confirmation"
import { RSVP_MESSAGES } from "@/lib/rsvp-response"
import {
  FREE_CLASS,
  FREE_CLASS_GRADES,
  RSVP_PROGRAMS,
  classMatchesProgram,
  findUpcomingClass,
  type RsvpProgram,
} from "@/lib/free-class"
import { EMAIL_PATTERN, clean, deliverLead, fail, hasPhoneDigits, readBody, screenSubmission, sendAdminAlert } from "@/lib/lead-delivery"

const GRADES = new Set(FREE_CLASS_GRADES)
const PROGRAMS = new Set<string>(RSVP_PROGRAMS.map((p) => p.value))
const SCOPE = "free-sunday-class"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, SCOPE)
  if (blocked) return blocked

  const data = {
    studentName: clean(body.studentName),
    studentGrade: clean(body.studentGrade, 50),
    parentName: clean(body.parentName),
    parentEmail: clean(body.parentEmail),
    parentPhone: clean(body.parentPhone, 30),
    classType: clean(body.classType, 20),
    classDate: clean(body.classDate, 10),
    currentSchool: clean(body.currentSchool),
    consent: clean(body.consent, 10),
  }

  // A class that started earlier today drops out of the list at 5 PM, so allow one extra week of lookahead.
  const session = findUpcomingClass(data.classDate, 5)

  if (
    !data.studentName ||
    !GRADES.has(data.studentGrade) ||
    !data.parentName ||
    !EMAIL_PATTERN.test(data.parentEmail) ||
    !hasPhoneDigits(data.parentPhone) ||
    !PROGRAMS.has(data.classType) ||
    !session ||
    !classMatchesProgram(session, data.classType) ||
    data.consent !== "yes"
  ) {
    return rsvpFail(400, "invalid", RSVP_MESSAGES.invalid)
  }

  const program = data.classType as RsvpProgram
  const { confirmation, classTitle, programLabel, hasZoom } = buildSundayConfirmation(session, program, data)
  if (!hasZoom) console.warn(`[${SCOPE}] No valid Zoom URL configured for ${program}; confirmation sent without access details`)

  const dedupeKey = [data.parentEmail, data.studentName, session.isoDate, program]
  const fingerprint = createHash("sha256").update(dedupeKey.map((v) => v.trim().toLowerCase()).join("|")).digest("hex")

  const rows: [string, string][] = [
    ["Class", `${classTitle}, live online`],
    ["Topic", session.topic],
    ["Class date", session.label],
    ["Class time", FREE_CLASS.timeLabel],
    ["Student Name", data.studentName],
    ["Grade", data.studentGrade],
    ["Parent/Guardian Name", data.parentName],
    ["Parent Email", data.parentEmail],
    ["Phone Number", data.parentPhone],
    ["Current School", data.currentSchool || "Not provided"],
  ]

  // Resend's idempotency only covers 24 hours, so the stored registration is what blocks later repeats.
  // A registration is only confirmed once it is saved: if the database is still unreachable after one retry, the
  // parent is told to try again, no confirmation is sent, and AhmedPrep gets an alert so the lead is not lost.
  let registrationId: number
  try {
    const claim = await withDbRetry(() => claimRegistration({
      dedupeKey: fingerprint,
      classDate: session.isoDate,
      program,
      studentName: data.studentName,
      studentGrade: data.studentGrade,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      currentSchool: data.currentSchool || null,
      topic: session.topic,
    }))
    if (claim.kind === "duplicate") {
      console.warn(`[${SCOPE}] Duplicate RSVP for ${session.isoDate}; original registration kept, no emails sent`)
      // 409 (not 200/success) so the form shows "already registered" instead of treating it as a new seat.
      return NextResponse.json(
        { success: false, duplicate: true, code: "duplicate", error: RSVP_MESSAGES.duplicate, message: RSVP_MESSAGES.duplicate },
        { status: 409 },
      )
    }
    registrationId = claim.id
  } catch (error) {
    const reason = describeDbError(error)
    console.error(`[${SCOPE}] Registration NOT saved, parent asked to retry: ${reason}`)
    await sendAdminAlert({
      scope: SCOPE,
      fromLocalPart: "classes",
      replyTo: data.parentEmail,
      subject: `ACTION NEEDED: Sunday ${programLabel} RSVP could not be saved (${data.studentName}, ${session.shortLabel})`,
      text: [
        `A parent tried to register, but the registration database was unavailable (${reason}).`,
        "The parent was shown an error and asked to try again. No confirmation email was sent.",
        "If a normal RSVP notification for this student arrives later, no action is needed. Otherwise, please contact the parent.",
        "",
        ...rows.map(([label, value]) => `${label}: ${value}`),
      ].join("\n"),
      idempotencyKey: `${SCOPE}-unsaved/${fingerprint}`,
    })
    return rsvpFail(503, "db_unavailable", RSVP_MESSAGES.notSaved)
  }

  const resendLink = createResendLink(new URL(request.url).origin, registrationId)

  const delivered = await deliverLead({
    dedupeKey,
    scope: SCOPE,
    fromLocalPart: "classes",
    heading: `New Free Sunday Class RSVP (${programLabel})`,
    subject: `Free Sunday ${programLabel} RSVP: ${data.studentName} (${session.shortLabel})`,
    replyTo: data.parentEmail,
    rows: [
      ...rows,
      ["Class communications", "Agreed to receive registration information, live class access, and reminders for this class"],
      [
        "Live class access",
        hasZoom
          ? "Sent automatically in the parent's confirmation email."
          : "NOT SENT. No Zoom URL is configured. Please email the live class link to the parent.",
      ],
    ],
    confirmation,
    failureAlertNote: `To resend the confirmation once the problem is fixed, open this private link (valid 30 days, do not forward):\n${resendLink}`,
    onDelivery: async (event) => {
      if (event.stage === "admin") {
        await withDbRetry(() => (event.ok ? markAdminNotified(registrationId) : markAdminFailed(registrationId, event.error)))
      } else {
        await withDbRetry(() => setConfirmationStatus(registrationId, event.status, event.error ?? null))
      }
    },
  })

  // The row is already saved at this point, so a failed email must not tell the parent to start over.
  if (!delivered.ok) return rsvpFail(delivered.status, "email_failed", RSVP_MESSAGES.savedEmailFailed)
  return delivered
}

function rsvpFail(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, code, error: message, message }, { status })
}

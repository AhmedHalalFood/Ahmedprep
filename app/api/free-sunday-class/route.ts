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
import { FREE_CLASS_GRADES, RSVP_PROGRAMS, findUpcomingSession, type RsvpProgram } from "@/lib/free-class"
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

  // The session must exist on that date for that program (2026: one class per Sunday; 2027: SHSAT and Digital SAT).
  // A session stays bookable until it ends; one extra class Sunday of lookahead covers a list that just rolled over.
  const session = findUpcomingSession(data.classDate, data.classType, 5)

  if (
    !data.studentName ||
    !GRADES.has(data.studentGrade) ||
    !data.parentName ||
    !EMAIL_PATTERN.test(data.parentEmail) ||
    !hasPhoneDigits(data.parentPhone) ||
    !PROGRAMS.has(data.classType) ||
    !session ||
    data.consent !== "yes"
  ) {
    return fail(400, "Please complete all required fields.")
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
    ["Class time", session.timeLabel],
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
      return NextResponse.json({ success: true, duplicate: true, confirmation: claim.confirmation })
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
    return fail(503, "Your registration could not be saved. Please try again in a few minutes.")
  }

  const resendLink = createResendLink(new URL(request.url).origin, registrationId)

  return deliverLead({
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
    // The registration is already saved, so an email failure tells the parent it was received rather than showing an error.
    persisted: { label: `sunday_class_registrations #${registrationId}` },
    failureAlertNote: `To resend the confirmation once the problem is fixed, open this private link (valid 30 days, do not forward):\n${resendLink}`,
    onDelivery: async (event) => {
      if (event.stage === "admin") {
        await withDbRetry(() => (event.ok ? markAdminNotified(registrationId) : markAdminFailed(registrationId, event.error)))
      } else {
        await withDbRetry(() => setConfirmationStatus(registrationId, event.status, event.error ?? null))
      }
    },
  })
}

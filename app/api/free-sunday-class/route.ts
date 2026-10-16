import { NextResponse } from "next/server"
import { createParentResendToken, createResendLink } from "@/lib/admin-links"
import {
  claimRegistration,
  describeDbError,
  markAdminFailed,
  markAdminNotified,
  setConfirmationStatus,
  withDbRetry,
} from "@/lib/sunday-registrations"
import { buildSundayConfirmation } from "@/lib/sunday-confirmation"
import { RSVP_MESSAGES, duplicateMessage } from "@/lib/rsvp-response"
import { registrationKey, sessionId } from "@/lib/rsvp-identity"
import {
  FREE_CLASS,
  FREE_CLASS_GRADES,
  RSVP_PROGRAMS,
  classMatchesProgram,
  findUpcomingClass,
  type RsvpProgram,
} from "@/lib/free-class"
import {
  EMAIL_PATTERN,
  clean,
  fail,
  hasPhoneDigits,
  readBody,
  screenSubmission,
  sendAdminAlert,
  sendAdminNotification,
  sendConfirmationEmail,
} from "@/lib/lead-delivery"

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
  const session_id = sessionId(session.isoDate, program)
  const { confirmation, classTitle, programLabel, hasZoom } = buildSundayConfirmation(session, program, data)
  if (!hasZoom) console.warn(`[${SCOPE}] No valid Zoom URL configured for ${program}; confirmation sent without access details`)

  const fingerprint = registrationKey({
    parentEmail: data.parentEmail,
    studentName: data.studentName,
    isoDate: session.isoDate,
    program,
  })

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
  const adminRows: [string, string][] = [
    ...rows,
    ["Class communications", "Agreed to receive registration information, live class access, and reminders for this class"],
    [
      "Live class access",
      hasZoom
        ? "Sent automatically in the parent's confirmation email."
        : "NOT SENT. No Zoom URL is configured. Please email the live class link to the parent.",
    ],
  ]
  const notifyAdmin = () =>
    sendAdminNotification({
      scope: SCOPE,
      fromLocalPart: "classes",
      heading: `New Free Sunday Class RSVP (${programLabel})`,
      subject: `Free Sunday ${programLabel} RSVP: ${data.studentName} (${session.shortLabel})`,
      replyTo: data.parentEmail,
      rows: adminRows,
      // Same key on every attempt for this registration, so AhmedPrep is never notified twice within Resend's 24h window.
      idempotencyKey: `${SCOPE}/${fingerprint}`,
    })

  // The stored registration (unique dedupe_key) is what blocks repeats; Resend idempotency only covers 24 hours.
  // A registration is only confirmed once it is saved: if the database is still unreachable after one retry, the
  // parent is told to try again, no confirmation is sent, and AhmedPrep gets an alert so the lead is not lost.
  let claim: Awaited<ReturnType<typeof claimRegistration>>
  try {
    claim = await withDbRetry(() =>
      claimRegistration({
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
      }),
    )
  } catch (error) {
    const reason = describeDbError(error)
    console.error(`[${SCOPE}] Registration NOT saved for ${session_id}, parent asked to retry: ${reason}`)
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

  const registrationId = claim.id
  const resendToken = createParentResendToken(registrationId)

  if (claim.kind === "existing") {
    // Never a new row, never a new seat, never an automatic second confirmation (the original request may still be
    // sending it). If AhmedPrep's notification never went out, retry just that; Resend's idempotency key prevents a repeat.
    console.warn(`[${SCOPE}] Duplicate RSVP for ${session_id} (registration ${registrationId}); no new registration created`)
    if (!claim.adminNotified) await recordAdmin(registrationId, await notifyAdmin())
    return NextResponse.json(
      {
        success: false,
        duplicate: true,
        code: "duplicate",
        program,
        confirmation: claim.confirmation,
        resendToken,
        error: duplicateMessage(program),
        message: duplicateMessage(program),
      },
      { status: 409 },
    )
  }

  // AhmedPrep's notification and the parent's confirmation are independent: a failure of one never blocks the other.
  const [admin, parent] = await Promise.all([
    notifyAdmin(),
    sendConfirmationEmail(confirmation, "classes", `${SCOPE}-confirmation/${fingerprint}`),
  ])
  await recordAdmin(registrationId, admin)
  await record(`confirmation status for ${registrationId}`, () =>
    setConfirmationStatus(registrationId, parent.ok ? "sent" : "failed", parent.ok ? null : `confirmation: ${parent.error}`),
  )

  if (!parent.ok) {
    const resendLink = createResendLink(new URL(request.url).origin, registrationId)
    await sendAdminAlert({
      scope: SCOPE,
      fromLocalPart: "classes",
      replyTo: data.parentEmail,
      subject: `ACTION NEEDED: confirmation email not delivered (${data.parentEmail})`,
      text: [
        `The registration below was saved, but the confirmation email to ${data.parentEmail} could not be sent (${parent.error}).`,
        "The parent was shown a retry button.",
        resendLink
          ? `To resend it yourself, open this private link (valid 30 days, do not forward):\n${resendLink}`
          : "Please send the class details manually.",
        "",
        ...rows.map(([label, value]) => `${label}: ${value}`),
      ].join("\n"),
      idempotencyKey: `${SCOPE}-confirmation-alert/${fingerprint}`,
    })
  }

  console.log(
    `[${SCOPE}] Registration ${registrationId} saved for ${session_id}; admin=${admin.ok ? "accepted" : "failed"}, confirmation=${parent.ok ? "accepted" : "failed"}`,
  )
  return NextResponse.json({ success: true, confirmation: parent.ok ? "sent" : "failed", resendToken })
}

async function recordAdmin(id: number, result: Awaited<ReturnType<typeof sendAdminNotification>>) {
  await record(`admin status for ${id}`, () => (result.ok ? markAdminNotified(id) : markAdminFailed(id, result.error)))
}

/** Email results are recorded best-effort: the registration already exists, so a failed write must not fail the request. */
async function record(what: string, write: () => Promise<void>) {
  try {
    await withDbRetry(write)
  } catch (error) {
    console.error(`[${SCOPE}] Could not record ${what}:`, describeDbError(error))
  }
}

function rsvpFail(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, code, error: message, message }, { status })
}

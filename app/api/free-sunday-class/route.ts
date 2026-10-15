import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { createResendLink } from "@/lib/admin-links"
import { claimRegistration, markRegistrationDelivered } from "@/lib/sunday-registrations"
import { buildSundayConfirmation } from "@/lib/sunday-confirmation"
import {
  FREE_CLASS,
  FREE_CLASS_GRADES,
  RSVP_PROGRAMS,
  classMatchesProgram,
  findUpcomingClass,
  type RsvpProgram,
} from "@/lib/free-class"
import { EMAIL_PATTERN, clean, deliverLead, type ConfirmationStatus, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"

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
    return fail(400, "Please complete all required fields.")
  }

  const program = data.classType as RsvpProgram
  const { confirmation, classTitle, programLabel, hasZoom } = buildSundayConfirmation(session, program, data)
  if (!hasZoom) console.warn(`[${SCOPE}] No valid Zoom URL configured for ${program}; confirmation sent without access details`)

  const dedupeKey = [data.parentEmail, data.studentName, session.isoDate, program]

  // Resend's idempotency only covers 24 hours, so the stored registration is what blocks later repeats.
  // If the database is unreachable the RSVP still goes through, with Resend's 24-hour protection as the fallback.
  let registrationId: number | null = null
  try {
    const claim = await claimRegistration({
      dedupeKey: createHash("sha256").update(dedupeKey.map((v) => v.trim().toLowerCase()).join("|")).digest("hex"),
      classDate: session.isoDate,
      program,
      studentName: data.studentName,
      studentGrade: data.studentGrade,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      currentSchool: data.currentSchool || null,
      topic: session.topic,
    })
    if (claim.kind === "duplicate") {
      console.warn(`[${SCOPE}] Duplicate RSVP for ${session.isoDate}; original registration kept, no emails sent`)
      return NextResponse.json({ success: true, duplicate: true, confirmation: claim.confirmation })
    }
    registrationId = claim.id
  } catch (error) {
    console.error(`[${SCOPE}] Could not record registration:`, error instanceof Error ? error.message : error)
  }

  const resendLink = registrationId !== null ? createResendLink(new URL(request.url).origin, registrationId) : null

  const response = await deliverLead({
    dedupeKey,
    scope: SCOPE,
    fromLocalPart: "classes",
    heading: `New Free Sunday Class RSVP (${programLabel})`,
    subject: `Free Sunday ${programLabel} RSVP: ${data.studentName} (${session.shortLabel})`,
    replyTo: data.parentEmail,
    rows: [
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
      ["Class communications", "Agreed to receive registration information, live class access, and reminders for this class"],
      [
        "Live class access",
        hasZoom
          ? "Sent automatically in the parent's confirmation email."
          : "NOT SENT. No Zoom URL is configured. Please email the live class link to the parent.",
      ],
    ],
    confirmation,
    failureAlertNote: resendLink
      ? `To resend the confirmation once the problem is fixed, open this private link (valid 30 days, do not forward):\n${resendLink}`
      : undefined,
  })

  if (registrationId !== null && response.ok) {
    try {
      const result = (await response.clone().json()) as { confirmation: ConfirmationStatus }
      await markRegistrationDelivered(registrationId, result.confirmation)
    } catch (error) {
      console.error(`[${SCOPE}] Could not mark registration delivered:`, error instanceof Error ? error.message : error)
    }
  }

  return response
}

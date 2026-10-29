import { EMAIL_PATTERN, PROGRAMS, clean, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"
import { NextResponse } from "next/server"
import { createFreeAccessAdminLink } from "@/lib/admin-links"
import { checkFreeAccess, flagForReview, reviewEmailRow } from "@/lib/free-access"
import { limitMessage } from "@/lib/free-access-policy"
import { leadIdempotencyKey, saveAndDeliverLead } from "@/lib/lead-storage"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = screenSubmission(request, body, "diagnostic")
  if (blocked) return blocked

  const data = {
    studentName: clean(body.studentName),
    studentGrade: clean(body.studentGrade, 50),
    parentName: clean(body.parentName),
    parentPhone: clean(body.parentPhone, 30),
    parentEmail: clean(body.parentEmail),
    program: clean(body.program, 30),
    preferredDate: clean(body.preferredDate, 20),
    currentScore: clean(body.currentScore),
    target: clean(body.target),
    notes: clean(body.notes, 2000),
  }

  if (
    !data.studentName ||
    !data.studentGrade ||
    !data.parentName ||
    !hasPhoneDigits(data.parentPhone) ||
    !EMAIL_PATTERN.test(data.parentEmail) ||
    !PROGRAMS.has(data.program) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate) ||
    Number.isNaN(Date.parse(data.preferredDate))
  ) {
    return fail(400, "Please complete all required fields.")
  }

  const applicant = { studentName: data.studentName, parentEmail: data.parentEmail, parentPhone: data.parentPhone }
  const bookingKey = leadIdempotencyKey("diagnostic", clean(body.submissionId, 64), data)
  const access = await checkFreeAccess("diagnostic", applicant, bookingKey)
  if (access.enforced && access.decision.outcome === "block") {
    console.warn(`[diagnostic] Free-diagnostic limit reached (${access.decision.reason}); request declined, nothing saved`)
    return NextResponse.json({ success: false, limitReached: true, error: limitMessage("diagnostic", access.decision.reason) }, { status: 409 })
  }
  const accessRows: [string, string][] = []
  if (access.enforced) {
    accessRows.push(reviewEmailRow(access.decision))
    const adminLink = createFreeAccessAdminLink(new URL(request.url).origin, data.parentEmail)
    if (adminLink) accessRows.push(["Assessment & free-access record", adminLink])
  }

  return saveAndDeliverLead({
    formType: "diagnostic",
    submissionId: body.submissionId,
    onSaved:
      access.enforced && access.decision.outcome === "review"
        ? (id) => flagForReview("diagnostic", id, access.decision.relatedIds)
        : undefined,
    record: {
      contactName: data.parentName,
      contactEmail: data.parentEmail,
      contactPhone: data.parentPhone,
      studentName: data.studentName,
      program: data.program,
      payload: data,
    },
    email: {
      scope: "diagnostic",
      fromLocalPart: "diagnostics",
      heading: "New AhmedPrep Diagnostic Request",
      subject: `New AhmedPrep Diagnostic Request: ${data.program} (${data.studentName})`,
      replyTo: data.parentEmail,
      rows: [
        ["Program", data.program],
        ["Student Name", data.studentName],
        ["Student Grade", data.studentGrade],
        ["Parent/Guardian Name", data.parentName],
        ["Parent Phone", data.parentPhone],
        ["Parent Email", data.parentEmail],
        ["Preferred Date", data.preferredDate],
        ["Current Score", data.currentScore || "Not provided"],
        ["Target School or SAT Score", data.target || "Not provided"],
        ["Additional Notes", data.notes || "Not provided"],
        ...accessRows,
      ],
    },
  })
}

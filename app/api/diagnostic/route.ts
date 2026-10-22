import { EMAIL_PATTERN, PROGRAMS, clean, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  const blocked = await screenSubmission(request, body, "diagnostic")
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

  return saveAndDeliverLead({
    formType: "diagnostic",
    submissionId: body.submissionId,
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
      ],
    },
  })
}

import { EMAIL_PATTERN, PROGRAMS, clean, fail, hasPhoneDigits, readBody, screenSubmission } from "@/lib/lead-delivery"
import { saveAndDeliverLead } from "@/lib/lead-storage"

export async function POST(request: Request) {
  const body = await readBody(request)
  if (!body) return fail(400, "Invalid request.")

  // Hidden honeypot field, implausibly fast submissions, and a per-IP rate limit.
  const blocked = screenSubmission(request, body, "contact")
  if (blocked) return blocked

  const data = {
    name: clean(body.name),
    grade: clean(body.grade, 50),
    email: clean(body.email),
    phone: clean(body.phone, 30),
    program: clean(body.program, 30),
    level: clean(body.level),
    goal: clean(body.goal),
    message: clean(body.message, 2000),
  }

  if (!data.name || !data.grade || !EMAIL_PATTERN.test(data.email) || !PROGRAMS.has(data.program) || !hasPhoneDigits(data.phone)) {
    return fail(400, "Please complete all required fields.")
  }

  return saveAndDeliverLead({
    formType: "contact",
    submissionId: body.submissionId,
    record: {
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      program: data.program,
      payload: data,
    },
    email: {
      scope: "contact",
      fromLocalPart: "consultations",
      heading: "New consultation request",
      subject: `New consultation request: ${data.program} (${data.name})`,
      replyTo: data.email,
      rows: [
        ["Parent / Student Name", data.name],
        ["Student Grade", data.grade],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Program", data.program],
        ["Current score or starting level", data.level || "Not provided"],
        ["Target score or goal", data.goal || "Not provided"],
        ["Message", data.message || "Not provided"],
      ],
    },
  })
}

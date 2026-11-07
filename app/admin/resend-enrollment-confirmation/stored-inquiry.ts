import { resolveSelection, type InquiryFields } from "@/lib/enrollment-2027-inquiry"
import { CONFIRMATION_KEYS, type StoredLead } from "@/lib/lead-storage"

/** Rebuilds a 2027 inquiry from its stored row (current or original January payload), or null if it can't be. */
export function storedInquiry(lead: StoredLead | null) {
  if (!lead || lead.formType !== "enrollment_2027") return null
  const p = lead.payload ?? {}
  const selection = resolveSelection({ program: p.program, term: p.term, cohortId: p.cohortId, schedule: p.schedule })
  if (!selection) return null
  const fields: InquiryFields = {
    parentName: p.parentName ?? "",
    email: p.email || lead.contactEmail,
    phone: p.phone ?? "",
    studentName: p.studentName ?? "",
    studentGrade: p.studentGrade ?? "",
    foundingInterest: p.foundingInterest ?? "",
    message: p.message ?? "",
  }
  return {
    fields,
    selection,
    confirmationStatus: p[CONFIRMATION_KEYS.status] || "not recorded",
    confirmationError: p[CONFIRMATION_KEYS.error] || "",
  }
}

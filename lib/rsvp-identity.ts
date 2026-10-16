import { createHash } from "node:crypto"

/** Case, surrounding spaces, and Unicode look-alikes (e.g. full-width characters) never make a new registration. */
export const normalizeEmail = (email: string) => email.normalize("NFKC").trim().toLowerCase()

/** "  Ahmed   Khan " and "ahmed khan" are the same student; "Ahmed" and "Ahmed K." are not, so siblings stay distinct. */
export const normalizeStudentName = (name: string) => name.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase()

/** One Sunday session: the class date plus program, e.g. "2026-10-18:shsat". */
export const sessionId = (isoDate: string, program: string) => `${isoDate}:${program}`

/**
 * The value stored in sunday_class_registrations.dedupe_key (unique). One row per parent email + student + session.
 * Field order and separator match the original key, so rows saved before this change still block repeats.
 */
export function registrationKey(input: { parentEmail: string; studentName: string; isoDate: string; program: string }) {
  const parts = [normalizeEmail(input.parentEmail), normalizeStudentName(input.studentName), input.isoDate, input.program]
  return createHash("sha256").update(parts.join("|")).digest("hex")
}

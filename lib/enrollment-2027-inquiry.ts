import {
  type Cohort,
  type ProgramId,
  type TermId,
  MAX_CLASS_SIZE,
  FOUNDING_SEATS_PER_COHORT,
  cohortSchedule,
  cohortSpan,
  cohortTitle,
  deadlinesFor,
  dollars,
  findCohort,
  formatDate,
  formatLongDate,
  isProgramId,
  isTermId,
  priceFor,
  termName,
} from "@/lib/cohorts-2027"
import {
  ENROLLMENT_DISCLAIMER,
  FOUNDING_INTEREST_OPTIONS,
  GRADES_2027,
  SCHEDULE_UNSURE,
  programByName,
  scheduleOptionsFor,
} from "@/lib/enrollment-2027"
import type { Confirmation } from "@/lib/lead-delivery"

/**
 * Shared by the form, the API route, and the admin confirmation resend, so all three agree on what a valid
 * selection is and what the family is told. Contains no server-only code, so it is unit tested directly.
 */

export type Selection =
  | { kind: "cohort"; cohort: Cohort; program: ProgramId; term: TermId }
  /** Submitted from the original January form (program + schedule wording, no cohort id). */
  | { kind: "legacy"; cohort: Cohort | null; program: ProgramId; term: "winter"; schedule: string }

const LEGACY_PROGRAM: Record<string, { program: ProgramId; slug: "shsat" | "dsat" }> = {
  "SHSAT Prep": { program: "SHSAT", slug: "shsat" },
  "Digital SAT Prep": { program: "Digital SAT", slug: "dsat" },
}

/**
 * Returns the validated selection, or null. New submissions send program + term + cohortId, and all three must
 * agree with the catalog. Older January payloads (cached pages, stored records) still resolve to their Winter cohort.
 */
export function resolveSelection(input: { program?: string; term?: string; cohortId?: string; schedule?: string }): Selection | null {
  const program = input.program ?? ""
  if (input.cohortId) {
    const cohort = findCohort(input.cohortId)
    if (!cohort || !isProgramId(program) || !isTermId(input.term ?? "")) return null
    if (cohort.program !== program || cohort.term !== input.term) return null
    return { kind: "cohort", cohort, program, term: cohort.term }
  }
  const legacy = LEGACY_PROGRAM[program]
  const schedule = input.schedule ?? ""
  if (!legacy || !programByName(program) || !scheduleOptionsFor(program).includes(schedule)) return null
  const cohort = schedule === SCHEDULE_UNSURE ? null : findCohort(`winter-${legacy.slug}-${schedule.startsWith("Weekday") ? "weekday" : "weekend"}`) ?? null
  return { kind: "legacy", cohort, program: legacy.program, term: "winter", schedule }
}

export type InquiryFields = {
  parentName: string
  email: string
  phone: string
  studentName: string
  studentGrade: string
  foundingInterest: string
  message: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function inquiryFieldsValid(d: InquiryFields) {
  return (
    Boolean(d.parentName) &&
    EMAIL_PATTERN.test(d.email) &&
    d.phone.replace(/\D/g, "").length >= 10 &&
    Boolean(d.studentName) &&
    GRADES_2027.includes(d.studentGrade) &&
    (FOUNDING_INTEREST_OPTIONS as readonly string[]).includes(d.foundingInterest)
  )
}

/** "Winter 2027 SHSAT enrollment" — used in the on-page acknowledgment and email subject. */
export const inquiryName = (s: Selection) => `${termName(s.term)} ${s.program} enrollment`

/** One line for the cohort, or the legacy wording when the family chose "Not sure yet" on the old form. */
export const selectionLabel = (s: Selection) =>
  s.cohort ? `${cohortTitle(s.cohort)}: ${cohortSchedule(s.cohort)}` : `${termName(s.term)} ${s.program}: schedule not chosen yet`

/** The facts every family email and admin notification repeats for the chosen cohort. */
export function cohortFacts(cohort: Cohort) {
  const price = priceFor(cohort)
  const { foundingIso, earlyIso } = deadlinesFor(cohort)
  const { startIso, endIso } = cohortSpan(cohort)
  return {
    schedule: cohortSchedule(cohort),
    dates: `${formatLongDate(startIso)} to ${formatLongDate(endIso)}`,
    instruction: `${cohort.sessions} three-hour sessions, ${cohort.hours} hours of scheduled live instruction`,
    tuition: [
      `Regular tuition: ${dollars(price.regular)}, paid in full before the first class.`,
      `Early full payment: ${dollars(price.early)} (10% off) if paid in full by ${formatDate(earlyIso)}.`,
      `Founding-family tuition: ${dollars(price.founding)} (25% off) for the first ${FOUNDING_SEATS_PER_COHORT} fully paid enrollments in this cohort, if paid in full by ${formatDate(foundingIso)} and while founding-family seats remain.`,
      "Discounts cannot be combined.",
    ].join("\n"),
  }
}

/** Admin rows and the parent confirmation for one inquiry. Deterministic, so a repeat send reuses Resend's key. */
export function buildInquiryEmails(d: InquiryFields, s: Selection) {
  const name = inquiryName(s)
  const label = selectionLabel(s)
  const facts = s.cohort ? cohortFacts(s.cohort) : null

  const rows: [string, string][] = [
    ["Inquiry", name],
    ["Parent/Guardian Name", d.parentName],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Student Name", d.studentName],
    ["Current Grade", d.studentGrade],
    ["Program", s.program],
    ["Term", termName(s.term)],
    ["Cohort", label],
    ["Cohort ID", s.cohort?.id ?? "Not chosen"],
    ...(facts ? ([["Dates", facts.dates]] as [string, string][]) : []),
    ["Founding-Family Tuition Interest", d.foundingInterest],
    ["Comments", d.message || "Not provided"],
    ...(s.kind === "legacy" ? ([["Form version", `Original January form (schedule: ${s.schedule})`]] as [string, string][]) : []),
  ]

  const confirmation: Confirmation = {
    to: d.email,
    subject: `We received your ${name} inquiry`,
    heading: "Enrollment inquiry received",
    paragraphs: [
      `Hello ${d.parentName},`,
      `Thank you for your interest in AhmedPrep's ${termName(s.term)} ${s.program} program for ${d.studentName}. This email confirms that we received your inquiry. It is not a confirmed enrollment.`,
      ENROLLMENT_DISCLAIMER,
      facts
        ? `Your selected cohort: ${cohortTitle(s.cohort!)}\nSchedule: ${facts.schedule}\nDates: ${facts.dates}\nInstruction: ${facts.instruction}\nClass size: no more than ${MAX_CLASS_SIZE} students\nLocation: Astoria, Queens (in person)`
        : `Your selection: ${label}. We will help you choose a schedule.`,
      ...(facts ? [`Tuition for this cohort:\n${facts.tuition}\nSubmitting this inquiry does not reserve a seat or lock in a discounted price.`] : []),
      `Founding-family tuition interest: ${d.foundingInterest}`,
      "Next step: AhmedPrep will contact you to confirm seat availability and send payment instructions. Your seat is confirmed only after full payment is verified.",
      "Questions? Reply to this email or call (347) 479-5020.",
    ],
  }

  return {
    name,
    rows,
    confirmation,
    subject: `${name} inquiry: ${label} (${d.studentName})`,
    heading: `New Enrollment Inquiry: ${name}`,
    /** Stored in lead_submissions.program for quick scanning. Older rows keep "January 2027 Enrollment: ...". */
    programColumn: `2027 Enrollment: ${s.cohort ? cohortTitle(s.cohort) : `${termName(s.term)} ${s.program}`}`,
  }
}

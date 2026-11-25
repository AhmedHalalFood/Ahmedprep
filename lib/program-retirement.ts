/** Public retirement rules: programs leave active listings after their final scheduled class day.
 * All comparisons use the America/New_York calendar so hosting time zone cannot shift the cutoff.
 * The full historical catalog remains available internally for records and reports.
 */
import { ALL_COHORTS, cohortSpan, type Cohort, type ProgramId, type Term, type TermId, TERM_IDS } from "@/lib/cohorts-2027"

export function nyCalendarDate(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now)
  const get = (key: string) => parts.find((p) => p.type === key)?.value ?? ""
  return `${get("year")}-${get("month")}-${get("day")}`
}

/** A completed course is removed at midnight New York time immediately after the last class day. */
export function isCohortActive(cohort: Cohort, now: Date = new Date()): boolean {
  return nyCalendarDate(now) <= cohortSpan(cohort).endIso
}
export function activeCohorts(now: Date = new Date(), program?: ProgramId): Cohort[] {
  return ALL_COHORTS.filter((cohort) => isCohortActive(cohort, now) && (!program || cohort.program === program))
}
export function activeTerms<T extends Term>(terms: readonly T[], now: Date = new Date()): (T & { cohorts: Cohort[] })[] {
  return terms.map((term) => ({ ...term, cohorts: term.cohorts.filter((c) => isCohortActive(c, now)) })).filter((term) => term.cohorts.length > 0)
}
export function isTermActive(term: TermId, now: Date = new Date()): boolean {
  return activeCohorts(now).some((c) => c.term === term)
}
export function activeTermIds(now: Date = new Date()): TermId[] {
  return TERM_IDS.filter((id) => isTermActive(id, now))
}

/** Permanent category pages stay visible, while cohort-level promotions/enrollment expire. */
export function isAnnualShsatOfferActive(now: Date = new Date()) {
  return nyCalendarDate(now) <= "2027-01-08"
}

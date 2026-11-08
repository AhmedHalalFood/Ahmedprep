import { ALL_COHORTS, MAX_CLASS_SIZE, type Cohort } from "@/lib/cohorts-2027"

/**
 * Seat capacity and waitlist rules for the 12 cohorts (12 students each).
 *
 * BLOCKER: the database has no confirmed, fully paid enrollment records (only free inquiries in lead_submissions),
 * so real seat counts cannot be calculated. Inquiries and waitlist requests are never counted as enrollments, and
 * no seat availability is displayed. A cohort switches to "Join Waitlist" only when AhmedPrep lists it below after
 * confirming it is full. See db/proposed/0007_cohort_enrollments_waitlist.sql.disabled for the proposed tables.
 */
export const CONFIRMED_FULL_COHORT_IDS: readonly string[] = []

export const COHORT_CAPACITY = MAX_CLASS_SIZE

/**
 * Preview-only: `?previewFull=1` lets reviewers exercise the waitlist flow on non-production deployments. It is
 * ignored on production, so it can never turn a live cohort into a waitlist.
 */
export const previewFullAllowed = () => process.env.VERCEL_ENV !== "production"

export function isCohortFull(cohortId: string, options: { previewFull?: boolean } = {}) {
  if (CONFIRMED_FULL_COHORT_IDS.includes(cohortId)) return true
  return Boolean(options.previewFull) && previewFullAllowed()
}

export type EnrollAction = { kind: "enroll" | "waitlist"; label: "Enroll" | "Join Waitlist"; href: string }

/** The cohort card action. Both kinds keep the exact cohort id; the waitlist adds intent=waitlist. */
export function enrollActionFor(cohort: Cohort, full: boolean): EnrollAction {
  const params = new URLSearchParams({ program: cohort.program, term: cohort.term, cohort: cohort.id })
  if (full) params.set("intent", "waitlist")
  return { kind: full ? "waitlist" : "enroll", label: full ? "Join Waitlist" : "Enroll", href: `/enroll-2027?${params}` }
}

export const WAITLIST_DISCLAIMER =
  "Joining the waitlist is free and does not guarantee a seat. No payment is taken, and your child is not enrolled or charged automatically. If a seat opens in this cohort, AhmedPrep will contact families in the order requests were received."

/** All cohort ids, so tests can confirm every cohort has its own independent waitlist key. */
export const WAITLIST_COHORT_IDS = ALL_COHORTS.map((c) => c.id)

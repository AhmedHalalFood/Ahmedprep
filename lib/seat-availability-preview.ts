/**
 * PHASE 1 DESIGN PREVIEW ONLY.
 * Every seat count below is a DEMONSTRATION value, not real enrollment data. Nothing here reads
 * from or writes to the database. In Phase 2 these numbers come from a server-side query that
 * counts only administrator-approved enrollments with verified full payment.
 */

export const GROUP_CAPACITY = 12

export const FOUNDING_RULES = {
  seatsPerGroup: 5,
  deadlineLabel: "December 5, 2026",
} as const

export type TuitionTier = {
  id: "founding" | "early" | "regular"
  name: string
  amount: string
  condition: string
}

export const TUITION_TIERS: TuitionTier[] = [
  {
    id: "founding",
    name: "Founding-family tuition",
    amount: "$1,080",
    condition: `Full payment by ${FOUNDING_RULES.deadlineLabel}, or until the first ${FOUNDING_RULES.seatsPerGroup} qualifying seats per group are filled, whichever comes first.`,
  },
  {
    id: "early",
    name: "Early payment",
    amount: "$1,296",
    condition: "Full payment by December 26, 2026.",
  },
  {
    id: "regular",
    name: "Regular tuition",
    amount: "$1,440",
    condition: "Full payment due January 5, 2027.",
  },
]

export const TUITION_STACKING_NOTE = "Discounts cannot be combined."

/** Only Astoria is published. Jamaica stays unpublished while that location is under discussion. */
export const PUBLISHED_LOCATION = "Astoria"

export type DemoGroup = {
  id: string
  program: string
  label: string
  schedule: string
  /** DEMO: approved + verified fully paid enrollments. */
  demoConfirmed: number
  /** DEMO: of those, how many qualified for founding-family tuition. */
  demoFounding: number
}

export const DEMO_GROUPS: DemoGroup[] = [
  {
    id: "2027-01-shsat-weekday",
    program: "SHSAT",
    label: "Weekday group",
    schedule: "Mon & Wed, 5–8 PM ET",
    demoConfirmed: 4,
    demoFounding: 3,
  },
  {
    id: "2027-01-shsat-weekend",
    program: "SHSAT",
    label: "Weekend group",
    schedule: "Sat & Sun, 10 AM–1 PM ET",
    demoConfirmed: 9,
    demoFounding: 5,
  },
  {
    id: "2027-01-dsat-weekday",
    program: "Digital SAT",
    label: "Weekday group",
    schedule: "Tue & Thu, 5–8 PM ET",
    demoConfirmed: 12,
    demoFounding: 5,
  },
  {
    id: "2027-01-dsat-weekend",
    program: "Digital SAT",
    label: "Weekend group",
    schedule: "Sat & Sun, 2–5 PM ET",
    demoConfirmed: 1,
    demoFounding: 1,
  },
]

export type GroupStatus = "open" | "limited" | "full"

export function availabilityFor(group: DemoGroup) {
  const seatsRemaining = Math.max(0, GROUP_CAPACITY - group.demoConfirmed)
  const foundingRemaining = Math.min(
    seatsRemaining,
    Math.max(0, FOUNDING_RULES.seatsPerGroup - group.demoFounding),
  )
  const status: GroupStatus = seatsRemaining === 0 ? "full" : seatsRemaining <= 3 ? "limited" : "open"
  return { seatsRemaining, foundingRemaining, status }
}

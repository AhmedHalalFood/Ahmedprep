/**
 * PROPOSED catalog for the permanent /enroll flow (design preview).
 * Amounts are in cents so a future server-side checkout can use this module as the single
 * source of truth for prices, instead of trusting anything the browser submits.
 * New cohorts (e.g. a future summer program) are added as new entries in COHORTS.
 */

export type ProgramId = "shsat" | "digital-sat"
export type PaymentOption = "founding-full" | "early-full" | "regular-full"

export type Program = {
  id: ProgramId
  name: string
  summary: string
}

export type ClassOffering = {
  id: string
  cohortId: string
  programId: ProgramId
  label: string
  days: string
  time: string
  plannedStart: string
}

export type Cohort = {
  id: string
  name: string
  /** "planned" dates are always labelled as not guaranteed. */
  datesStatus: "planned" | "confirmed"
  enrollmentOpen: boolean
}

export const PROGRAMS: Program[] = [
  {
    id: "shsat",
    name: "SHSAT Preparation",
    summary: "Math and ELA preparation for the NYC Specialized High Schools Admissions Test.",
  },
  {
    id: "digital-sat",
    name: "Digital SAT Preparation",
    summary: "Reading & Writing and Math preparation for the adaptive Digital SAT, including Desmos and pacing.",
  },
]

export const COHORTS: Cohort[] = [
  { id: "2027-01", name: "January 2027", datesStatus: "planned", enrollmentOpen: true },
]

export const CLASSES: ClassOffering[] = [
  {
    id: "2027-01-shsat-weekday",
    cohortId: "2027-01",
    programId: "shsat",
    label: "SHSAT Weekdays",
    days: "Monday & Wednesday",
    time: "5:30–8:30 PM ET",
    plannedStart: "Monday, January 11, 2027",
  },
  {
    id: "2027-01-shsat-weekend",
    cohortId: "2027-01",
    programId: "shsat",
    label: "SHSAT Weekends",
    days: "Saturday & Sunday",
    time: "10 AM–1 PM ET",
    plannedStart: "Saturday, January 16, 2027",
  },
  {
    id: "2027-01-dsat-weekday",
    cohortId: "2027-01",
    programId: "digital-sat",
    label: "Digital SAT Weekdays",
    days: "Tuesday & Thursday",
    time: "5:30–8:30 PM ET",
    plannedStart: "Tuesday, January 12, 2027",
  },
  {
    id: "2027-01-dsat-weekend",
    cohortId: "2027-01",
    programId: "digital-sat",
    label: "Digital SAT Weekends",
    days: "Saturday & Sunday",
    time: "2–5 PM ET",
    plannedStart: "Saturday, January 16, 2027",
  },
]

export const MAX_CLASS_SIZE = 12

export const TUITION = {
  regularCents: 144_000,
  earlyCents: 129_600,
  foundingCents: 108_000,
  savingsCents: 36_000,
  earlySavingsCents: 14_400,
} as const

export const FOUNDING_POLICY = {
  seatsPerClass: 5,
  /** December 5, 2026, 11:59:59 PM Eastern (EST, UTC−5). */
  deadlineIso: "2026-12-06T04:59:59Z",
  deadlineLabel: "December 5, 2026",
} as const

export const EARLY_POLICY = {
  /** December 26, 2026, 11:59:59 PM Eastern (EST, UTC−5). */
  deadlineIso: "2026-12-27T04:59:59Z",
  deadlineLabel: "December 26, 2026",
} as const

export const REGULAR_DUE_LABEL = "January 5, 2027"

export const PAYMENT_OPTIONS: Record<PaymentOption, { title: string; amountCents: number; detail: string }> = {
  "founding-full": {
    title: "Founding-Family tuition",
    amountCents: TUITION.foundingCents,
    detail: `Full payment of $1,080 by ${FOUNDING_POLICY.deadlineLabel}, or before all ${FOUNDING_POLICY.seatsPerClass} founding-family seats are filled, whichever comes first.`,
  },
  "early-full": {
    title: "Early Full Payment",
    amountCents: TUITION.earlyCents,
    detail: `10% discount. Full payment of $1,296 must be received by ${EARLY_POLICY.deadlineLabel}.`,
  },
  "regular-full": {
    title: "Regular Tuition",
    amountCents: TUITION.regularCents,
    detail: `Full payment of $1,440 must be received by ${REGULAR_DUE_LABEL}.`,
  },
}

export const formatUsd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100)

export const isFoundingWindowOpen = (now: Date = new Date()) => now.getTime() <= Date.parse(FOUNDING_POLICY.deadlineIso)

export const isEarlyWindowOpen = (now: Date = new Date()) => now.getTime() <= Date.parse(EARLY_POLICY.deadlineIso)

export const openCohorts = () => COHORTS.filter((c) => c.enrollmentOpen)

export const classesFor = (programId: ProgramId) => {
  const open = new Set(openCohorts().map((c) => c.id))
  return CLASSES.filter((c) => c.programId === programId && open.has(c.cohortId))
}

export const cohortById = (id: string) => COHORTS.find((c) => c.id === id)

export const startLabelFor = (offering: ClassOffering) =>
  cohortById(offering.cohortId)?.datesStatus === "confirmed"
    ? `Starts ${offering.plannedStart}`
    : `Planned start: ${offering.plannedStart} (not guaranteed)`

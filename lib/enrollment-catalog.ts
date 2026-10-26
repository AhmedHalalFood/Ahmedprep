/**
 * PROPOSED catalog for the permanent /enroll flow (design preview).
 * Amounts are in cents so a future server-side checkout can use this module as the single
 * source of truth for prices, instead of trusting anything the browser submits.
 * New cohorts (e.g. a future summer program) are added as new entries in COHORTS.
 */

export type ProgramId = "shsat" | "digital-sat"
export type PaymentOption = "regular-full" | "regular-installments" | "founding-full"

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
    time: "5–8 PM ET",
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
    time: "5–8 PM ET",
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

export const TUITION = {
  regularCents: 144_000,
  installmentCount: 3,
  installmentCents: 48_000,
  foundingCents: 108_000,
  savingsCents: 36_000,
} as const

export const FOUNDING_POLICY = {
  seatsPerClass: 5,
  /** November 30, 2026, 11:59:59 PM Eastern (EST, UTC−5). */
  deadlineIso: "2026-12-01T04:59:59Z",
  deadlineLabel: "November 30, 2026, 11:59 PM Eastern",
} as const

export const PAYMENT_OPTIONS: Record<PaymentOption, { title: string; amountCents: number; detail: string }> = {
  "regular-full": {
    title: "Regular tuition, paid in full",
    amountCents: TUITION.regularCents,
    detail: "One payment of $1,440.",
  },
  "regular-installments": {
    title: "Regular tuition, 3 installments",
    amountCents: TUITION.installmentCents,
    detail: "Three payments of $480, subject to an approved payment schedule.",
  },
  "founding-full": {
    title: "Founding-family tuition, paid in full",
    amountCents: TUITION.foundingCents,
    detail: "One payment of $1,080. Full payment only.",
  },
}

export const formatUsd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100)

export const isFoundingWindowOpen = (now: Date = new Date()) => now.getTime() <= Date.parse(FOUNDING_POLICY.deadlineIso)

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

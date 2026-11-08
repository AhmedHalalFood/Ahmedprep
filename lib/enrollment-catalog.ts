/**
 * PROPOSED catalog for the permanent /enroll flow (design preview).
 * Amounts are in cents so a future server-side checkout can use this module as the single
 * source of truth for prices, instead of trusting anything the browser submits.
 * New cohorts (e.g. a future summer program) are added as new entries in COHORTS.
 */

import { addDays, deadlinesFor, findCohort, formatDate } from "@/lib/cohorts-2027"

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
    plannedStart: "Saturday, January 9, 2027",
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
    plannedStart: "Saturday, January 9, 2027",
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

/** First five fully paid enrollments in each class qualify, and only while that class's founding deadline is open. */
export const FOUNDING_POLICY = { seatsPerClass: 5 } as const

export const REGULAR_DUE_LABEL = "before the student’s first scheduled class"

/** Each checkout class maps to its approved 2027 cohort, which owns the start date and therefore the deadlines. */
const COHORT_2027_FOR_CLASS: Record<string, string> = {
  "2027-01-shsat-weekday": "winter-shsat-weekday",
  "2027-01-shsat-weekend": "winter-shsat-weekend",
  "2027-01-dsat-weekday": "winter-dsat-weekday",
  "2027-01-dsat-weekend": "winter-dsat-weekend",
}

/** Offset of America/New_York from UTC, in minutes, at the given instant (−300 in EST, −240 in EDT). */
const easternOffsetMinutes = (utcMs: number) => {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "shortOffset" })
      .formatToParts(new Date(utcMs))
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT-5"
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name)
  if (!match) return -300
  const minutes = Number(match[2]) * 60 + Number(match[3] ?? 0)
  return match[1] === "-" ? -minutes : minutes
}

/** 11:59:59 PM Eastern on the given calendar date, as a UTC instant (DST-aware). */
export const endOfDayEasternIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  const nextMidnightUtc = Date.UTC(y, m - 1, d + 1)
  const offset = easternOffsetMinutes(nextMidnightUtc + 12 * 3_600_000)
  return new Date(nextMidnightUtc - offset * 60_000 - 1000).toISOString().replace(".000Z", "Z")
}

export type ClassDeadline = { dateIso: string; deadlineIso: string; label: string }
export type ClassDeadlines = { founding: ClassDeadline; early: ClassDeadline }

const toDeadline = (dateIso: string): ClassDeadline => ({
  dateIso,
  deadlineIso: endOfDayEasternIso(dateIso),
  label: formatDate(dateIso),
})

export function deadlinesForClass(classId: string): ClassDeadlines | null {
  const cohort = findCohort(COHORT_2027_FOR_CLASS[classId] ?? "")
  if (!cohort) return null
  const { foundingIso, earlyIso } = deadlinesFor(cohort)
  // The (inactive) checkout catalog sells Winter tuition only; Spring/Summer have no founding option and stay closed here.
  if (!foundingIso) return null
  return { founding: toDeadline(foundingIso), early: toDeadline(earlyIso) }
}

export const isFoundingWindowOpen = (classId: string, now: Date = new Date()) => {
  const d = deadlinesForClass(classId)
  return !!d && now.getTime() <= Date.parse(d.founding.deadlineIso)
}

export const isEarlyWindowOpen = (classId: string, now: Date = new Date()) => {
  const d = deadlinesForClass(classId)
  return !!d && now.getTime() <= Date.parse(d.early.deadlineIso)
}

export type PaymentOptionDetail = { title: string; amountCents: number; detail: string }

export function paymentOptionsFor(classId: string): Record<PaymentOption, PaymentOptionDetail> {
  const d = deadlinesForClass(classId)
  const founding = d ? `${d.founding.label}, at 11:59:59 PM ET` : "the cohort’s founding-family deadline"
  const early = d ? `${d.early.label}, at 11:59:59 PM ET` : "the cohort’s early deadline"
  return {
    "founding-full": {
      title: "Founding-Family tuition",
      amountCents: TUITION.foundingCents,
      detail: `Full payment of $1,080 by ${founding}, for the first ${FOUNDING_POLICY.seatsPerClass} fully paid enrollments in this class, while founding-family seats remain.`,
    },
    "early-full": {
      title: "Early Full Payment",
      amountCents: TUITION.earlyCents,
      detail: `10% discount. Full payment of $1,296 must be received by ${early}.`,
    },
    "regular-full": {
      title: "Regular Tuition",
      amountCents: TUITION.regularCents,
      detail: `Full payment of $1,440 is required ${REGULAR_DUE_LABEL}.`,
    },
  }
}

export const PAYMENT_OPTION_IDS: readonly PaymentOption[] = ["founding-full", "early-full", "regular-full"]

export type CheckoutEligibility =
  | { ok: true; classId: string; payment: PaymentOption; amountCents: number }
  | { ok: false; reason: "unknown-class" | "unknown-payment" | "founding-closed" | "founding-full" | "early-closed" | "class-started"; message: string }

/**
 * The authoritative tuition rule. Call it on the server with the server's clock and a server-side count of verified,
 * fully paid founding-family enrollments for the class; never trust a price, date, or count sent by the browser.
 */
export function checkoutEligibility(input: {
  classId: string
  payment: string
  now: Date
  fullyPaidFoundingCount: number
}): CheckoutEligibility {
  const offering = CLASSES.find((c) => c.id === input.classId)
  const open = offering && cohortById(offering.cohortId)?.enrollmentOpen
  const deadlines = deadlinesForClass(input.classId)
  if (!offering || !open || !deadlines) {
    return { ok: false, reason: "unknown-class", message: "That class is not open for enrollment." }
  }
  if (!(PAYMENT_OPTION_IDS as readonly string[]).includes(input.payment)) {
    return { ok: false, reason: "unknown-payment", message: "Please choose a tuition option." }
  }
  const payment = input.payment as PaymentOption
  const cohort = findCohort(COHORT_2027_FOR_CLASS[input.classId])
  if (cohort && input.now.getTime() > Date.parse(endOfDayEasternIso(addDays(cohort.firstIso, -1)))) {
    return { ok: false, reason: "class-started", message: "Online checkout for this class has closed. Please contact AhmedPrep." }
  }
  const now = input.now.getTime()
  if (payment === "founding-full") {
    if (now > Date.parse(deadlines.founding.deadlineIso)) {
      return { ok: false, reason: "founding-closed", message: `Founding-Family tuition for this class closed on ${deadlines.founding.label}.` }
    }
    if (input.fullyPaidFoundingCount >= FOUNDING_POLICY.seatsPerClass) {
      return { ok: false, reason: "founding-full", message: "All founding-family seats in this class have been filled." }
    }
  }
  if (payment === "early-full" && now > Date.parse(deadlines.early.deadlineIso)) {
    return { ok: false, reason: "early-closed", message: `Early Full Payment for this class closed on ${deadlines.early.label}.` }
  }
  return { ok: true, classId: input.classId, payment, amountCents: paymentOptionsFor(input.classId)[payment].amountCents }
}

export const formatUsd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100)

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

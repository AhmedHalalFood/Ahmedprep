export const INTENSIVE_NAME = "SHSAT Final Intensive 2026"

export const INTENSIVE_PATH = "/shsat-final-intensive-2026"

export const INTENSIVE_ENROLL_ANCHOR = "shsat-intensive-enroll"

export const PAYMENT_OPTIONS = ["Prorated tuition paid in full", "2 equal payments", "Not sure yet"] as const

export const HOURS_PER_CLASS = 3
export const TUITION_PER_CLASS = 50
export const ORIGINAL_TUITION = 1000
export const ORIGINAL_HOURS = 60
export const ENROLLMENT_STATUS = "Late Enrollment Open \u2014 Join Classes in Progress"
export const CLASS_DAYS = "Monday through Thursday"
export const ORIGINAL_DATES = "October 12\u2013November 12, 2026"
export const PROGRAM_FORMAT = "In person only"
export const PROGRAM_LOCATION = "20-65 47th Street, Astoria, NY 11105"

/** First class held at the new time. Classes before this date keep their original time in every record. */
export const SCHEDULE_CHANGE_DATE = "2026-10-22"
export const ORIGINAL_CLASS_TIME = "6:00 PM\u20139:00 PM Eastern"
export const CLASS_TIME = "5:00 PM\u20138:00 PM Eastern"
export const SCHEDULE_CHANGE_NOTE = "Beginning Thursday, October 22, 2026 (classes through October 21 met 6:00\u20139:00 PM)"

const ORIGINAL_SESSION = { start: "18:00", end: "21:00", label: ORIGINAL_CLASS_TIME }
const CURRENT_SESSION = { start: "17:00", end: "20:00", label: CLASS_TIME }

/** Start/end (24h, Eastern) and label for the class held on a given date. Both schedules are exactly 3 hours. */
export function classSession(date: string) {
  return date < SCHEDULE_CHANGE_DATE ? ORIGINAL_SESSION : CURRENT_SESSION
}

const WEEK_STARTS = ["2026-10-12", "2026-10-19", "2026-10-26", "2026-11-02", "2026-11-09"]

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** Every scheduled class (Mon–Thu), as YYYY-MM-DD. */
export const CLASS_DATES = WEEK_STARTS.flatMap((start) => [0, 1, 2, 3].map((offset) => addDays(start, offset)))

/** The single tuition formula: $50 for each remaining scheduled 3-hour class, counted from the first class attended. */
export function tuitionFrom(startDate: string) {
  const classes = CLASS_DATES.filter((date) => date >= startDate).length
  return { classes, hours: classes * HOURS_PER_CLASS, tuition: classes * TUITION_PER_CLASS }
}

function newYorkClock(now: Date) {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now)
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now)
  return { date, time }
}

/** A class stops being joinable once it starts (6:00 PM through Oct. 21, 5:00 PM from Oct. 22). */
export function remainingClassDates(now = new Date()) {
  const { date: today, time } = newYorkClock(now)
  return CLASS_DATES.filter((date) => date > today || (date === today && time < classSession(date).start))
}

/** Full calendar with the time each class was (or will be) held, for records and the schedule list. */
export const CLASS_SCHEDULE = CLASS_DATES.map((date) => ({ date, ...classSession(date) }))

export type EnrollmentSnapshot = {
  nextClass: string | null
  remainingDates: string[]
  classesHeld: number
  classes: number
  hours: number
  tuition: number
}

/** What a family receives when enrolling right now. Every page, the form, and the confirmation read from this. */
export function enrollmentSnapshot(now = new Date()): EnrollmentSnapshot {
  const remainingDates = remainingClassDates(now)
  const nextClass = remainingDates[0] ?? null
  const totals = nextClass ? tuitionFrom(nextClass) : { classes: 0, hours: 0, tuition: 0 }
  return { nextClass, remainingDates, classesHeld: CLASS_DATES.length - remainingDates.length, ...totals }
}

/** Remaining class dates grouped by week, for the schedule list. */
export function remainingWeeks(remainingDates: string[]) {
  return WEEK_STARTS.map((start) => ({
    start,
    dates: remainingDates.filter((date) => date >= start && date < addDays(start, 7)),
  })).filter((week) => week.dates.length > 0)
}

export function formatUsd(amount: number) {
  return `$${amount.toLocaleString("en-US")}`
}

export function formatClassDate(iso: string, style: "short" | "long" = "short") {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: style === "long" ? "long" : "short",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  }).format(new Date(`${iso}T12:00:00Z`))
}


export const SCHEDULE_STATEMENT =
  "Monday\u2013Thursday, 5:00\u20138:00 PM Eastern, beginning October 22, 2026. In-person only at 20-65 47th Street, Astoria, NY 11105."

export const TUITION_SCHEDULE_ID = "tuition-schedule"

export type TuitionRow = { date: string; classes: number; hours: number; tuition: number }

/** One row per class that can still be a first class. Held classes and non-class days never appear. */
export function tuitionScheduleRows(remainingDates: string[]): TuitionRow[] {
  return remainingDates.map((date) => ({ date, ...tuitionFrom(date) }))
}

export const START_DATE_UNSURE = "Not sure yet"

export function todayInNewYork(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now)
}

/** First New York calendar day the 2026 Intensive is no longer promoted or accepting enrollments (12:00 AM ET). */
export const INTENSIVE_PROMO_ENDS_ON = "2026-11-13"

export function isIntensivePromoActive(now = new Date()) {
  return todayInNewYork(now) < INTENSIVE_PROMO_ENDS_ON
}

/** Dropdown label for a first-class choice: date and the time that class meets. No price, the summary shows it. */
export function startDateLabel(iso: string) {
  return `${formatClassDate(iso, "long")} \u00b7 ${classSession(iso).label}`
}

/** Form choices: classes that have not started yet (value is YYYY-MM-DD), plus the "not sure" option. */
export function upcomingStartOptions(now = new Date()) {
  return [
    ...remainingClassDates(now).map((date) => ({ value: date, label: startDateLabel(date) })),
    { value: START_DATE_UNSURE, label: START_DATE_UNSURE },
  ]
}

/**
 * Server-side acceptance list. Keeps today's class valid for the whole day so a parent who opened the
 * form shortly before class time is not rejected on submit; staff confirm the actual first class.
 */
export function acceptedStartDates(now = new Date()) {
  const today = todayInNewYork(now)
  return CLASS_DATES.filter((date) => date >= today)
}

export type StartQuote = { date: string; classes: number; hours: number; rate: number; tuition: number }

/** Tuition quote for a chosen first class, from the same calendar formula as the tuition schedule. */
export function quoteFor(date: string): StartQuote {
  return { date, rate: TUITION_PER_CLASS, ...tuitionFrom(date) }
}

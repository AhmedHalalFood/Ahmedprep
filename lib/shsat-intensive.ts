export const INTENSIVE_NAME = "SHSAT Final Intensive 2026"

export const INTENSIVE_PATH = "/shsat-final-intensive-2026"

export const INTENSIVE_ENROLL_ANCHOR = "shsat-intensive-enroll"

export const PAYMENT_OPTIONS = ["Prorated tuition paid in full", "2 equal payments", "Not sure yet"] as const

export const HOURS_PER_CLASS = 3
export const TUITION_PER_CLASS = 50
export const ORIGINAL_TUITION = 1000
export const ORIGINAL_HOURS = 60
export const CLASS_START_TIME_ET = "18:00"
export const ENROLLMENT_STATUS = "Late Enrollment Open \u2014 Join Classes in Progress"
export const CLASS_DAYS = "Monday through Thursday"
export const CLASS_TIME = "6:00 PM\u20139:00 PM Eastern"
export const ORIGINAL_DATES = "October 12\u2013November 12, 2026"
export const PROGRAM_FORMAT = "In person at our Astoria location"

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

/** A class stops being joinable once it starts at 6:00 PM Eastern on its date. */
export function remainingClassDates(now = new Date()) {
  const { date: today, time } = newYorkClock(now)
  return CLASS_DATES.filter((date) => date > today || (date === today && time < CLASS_START_TIME_ET))
}

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

export function startOptionLabel(iso: string) {
  const { hours, tuition } = tuitionFrom(iso)
  return `${formatClassDate(iso)} · ${hours} hours · ${formatUsd(tuition)}`
}

export const START_DATE_UNSURE = "Not sure yet"

export function todayInNewYork(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now)
}

/** Form choices: classes that have not started yet, plus the "not sure" option. */
export function upcomingStartOptions(now = new Date()) {
  return [...remainingClassDates(now).map(startOptionLabel), START_DATE_UNSURE]
}

/**
 * Server-side acceptance list. Keeps today's class valid for the whole day so a parent who opened the
 * form shortly before 6:00 PM is not rejected on submit; staff confirm the actual first class.
 */
export function acceptedStartOptions(now = new Date()) {
  const today = todayInNewYork(now)
  return [...CLASS_DATES.filter((date) => date >= today).map(startOptionLabel), START_DATE_UNSURE]
}

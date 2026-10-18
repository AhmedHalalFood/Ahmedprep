export const INTENSIVE_NAME = "2026 SHSAT Final 5-Week Intensive"

export const INTENSIVE_PATH = "/shsat-final-intensive-2026"

export const INTENSIVE_ENROLL_ANCHOR = "shsat-intensive-enroll"

export const PAYMENT_OPTIONS = ["Prorated tuition paid in full", "2 equal payments", "Not sure yet"] as const

export const HOURS_PER_CLASS = 3
export const TUITION_PER_CLASS = 50
export const ORIGINAL_TUITION = 1000
export const ORIGINAL_HOURS = 60
export const LATE_ENROLLMENT_START = "2026-10-19"

const WEEK_STARTS = ["2026-10-12", "2026-10-19", "2026-10-26", "2026-11-02", "2026-11-09"]

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** Every scheduled class (Mon–Thu), as YYYY-MM-DD. */
export const CLASS_DATES = WEEK_STARTS.flatMap((start) => [0, 1, 2, 3].map((offset) => addDays(start, offset)))

export const LATE_START_DATES = CLASS_DATES.filter((date) => date >= LATE_ENROLLMENT_START)

export function tuitionFrom(startDate: string) {
  const classes = CLASS_DATES.filter((date) => date >= startDate).length
  return { classes, hours: classes * HOURS_PER_CLASS, tuition: classes * TUITION_PER_CLASS }
}

export const PRORATED_SCHEDULE = WEEK_STARTS.filter((start) => start >= LATE_ENROLLMENT_START).map((start) => ({
  start,
  ...tuitionFrom(start),
}))

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

/** Start dates that have not passed yet (New York time), plus the "not sure" option. */
export function upcomingStartOptions(today = todayInNewYork()) {
  return [...LATE_START_DATES.filter((date) => date >= today).map(startOptionLabel), START_DATE_UNSURE]
}

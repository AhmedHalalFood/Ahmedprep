import { DIGITAL_SAT_TOPICS, SHSAT_TOPICS, WORKSHOP_TOPICS } from "@/lib/sunday-class-topics"

export const FREE_CLASS = {
  path: "/free-sunday-classes",
  name: "Free Sunday Test Prep Series",
  timeZone: "America/New_York",
  startHour: 16,
  endHour: 17,
  timeLabel: "4:00–5:00 PM ET",
  timeLabelShort: "4–5 PM ET",
  instructor: "Tariq Ahmed",
  instructorRole: "Founder & Lead Instructor",
} as const

export const FREE_CLASS_GRADES = ["5th grade", "6th grade", "7th grade", "8th grade", "9th grade", "10th grade", "11th grade", "12th grade", "Other"]

export type ClassType = "shsat" | "digital_sat" | "workshop"
export type RsvpProgram = Exclude<ClassType, "workshop">

export const CLASS_TYPES: Record<ClassType, { label: string; title: string; focus: string }> = {
  shsat: { label: "SHSAT", title: "Free Live SHSAT Class", focus: "Math & ELA Strategies" },
  digital_sat: {
    label: "Digital SAT",
    title: "Free Live Digital SAT Class",
    focus: "Math, Reading & Writing, Desmos & Test Strategy",
  },
  workshop: { label: "Special Workshop", title: "Free Special Workshop", focus: "Diagnostic, Strategy & Parent Q&A" },
}

export const RSVP_PROGRAMS: { value: RsvpProgram; label: string }[] = [
  { value: "shsat", label: "SHSAT" },
  { value: "digital_sat", label: "Digital SAT" },
]

export type SundayClass = {
  isoDate: string
  type: ClassType
  typeLabel: string
  title: string
  focus: string
  topic: string
  startDate: string
  endDate: string
  label: string
  shortLabel: string
  compactLabel: string
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Wall-clock date and time in New York for a given instant, independent of the server's time zone. */
function newYorkWallClock(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: FREE_CLASS.timeZone,
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    weekday: WEEKDAYS.indexOf(parts.weekday),
  }
}

/** New York's UTC offset (e.g. "-04:00" in summer, "-05:00" in winter) at a given instant. */
function newYorkOffset(date: Date) {
  const label =
    new Intl.DateTimeFormat("en-US", { timeZone: FREE_CLASS.timeZone, timeZoneName: "longOffset" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? ""
  const match = label.match(/GMT([+-]\d{2}:\d{2})/)
  return match ? match[1] : "-05:00"
}

/** Which program a Sunday belongs to, from its position in the month (1st–5th Sunday). */
function classTypeFor(day: number): ClassType {
  const nth = Math.ceil(day / 7)
  if (nth === 1 || nth === 3) return "shsat"
  if (nth === 2 || nth === 4) return "digital_sat"
  return "workshop"
}

/** Topics advance one step per class of the same type, so every month continues where the last one left off. */
function topicFor(type: ClassType, year: number, month: number, day: number) {
  const monthIndex = year * 12 + (month - 1)
  const secondOfMonth = Math.ceil(day / 7) > 2 ? 1 : 0
  if (type === "workshop") return WORKSHOP_TOPICS[monthIndex % WORKSHOP_TOPICS.length]
  const list = type === "shsat" ? SHSAT_TOPICS : DIGITAL_SAT_TOPICS
  return list[(monthIndex * 2 + secondOfMonth) % list.length]
}

function buildClass(classDay: Date): SundayClass {
  const isoDate = classDay.toISOString().slice(0, 10)
  const year = classDay.getUTCFullYear()
  const month = classDay.getUTCMonth() + 1
  const day = classDay.getUTCDate()
  const type = classTypeFor(day)
  // 21:00 UTC is always inside the 4–5 PM class hour (EDT or EST), so the offset matches the class itself.
  const offset = newYorkOffset(new Date(`${isoDate}T21:00:00Z`))
  const pad = (h: number) => String(h).padStart(2, "0")
  const format = (options: Intl.DateTimeFormatOptions) => classDay.toLocaleDateString("en-US", { timeZone: "UTC", ...options })

  return {
    isoDate,
    type,
    typeLabel: CLASS_TYPES[type].label,
    title: CLASS_TYPES[type].title,
    focus: CLASS_TYPES[type].focus,
    topic: topicFor(type, year, month, day),
    startDate: `${isoDate}T${pad(FREE_CLASS.startHour)}:00:00${offset}`,
    endDate: `${isoDate}T${pad(FREE_CLASS.endHour)}:00:00${offset}`,
    label: format({ weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    shortLabel: format({ weekday: "long", month: "long", day: "numeric" }),
    compactLabel: format({ month: "short", day: "numeric" }),
  }
}

/**
 * Upcoming Sunday classes in New York time. Today's class stays first until it ends at 5:00 PM ET,
 * then the following Sunday takes over.
 */
export function getUpcomingClasses(count = 4, now = new Date()): SundayClass[] {
  const ny = newYorkWallClock(now)
  let daysAhead = (7 - ny.weekday) % 7
  if (daysAhead === 0 && ny.hour >= FREE_CLASS.endHour) daysAhead = 7
  return Array.from({ length: count }, (_, i) =>
    // Noon UTC keeps the calendar date stable while adding days and formatting.
    buildClass(new Date(Date.UTC(ny.year, ny.month - 1, ny.day + daysAhead + i * 7, 12))),
  )
}

export function getNextClass(now = new Date()) {
  return getUpcomingClasses(1, now)[0]
}

export function isTodayInNewYork(isoDate: string, now = new Date()) {
  const ny = newYorkWallClock(now)
  return isoDate === `${ny.year}-${String(ny.month).padStart(2, "0")}-${String(ny.day).padStart(2, "0")}`
}

export function rsvpHref(c: SundayClass) {
  const program = c.type === "workshop" ? "" : `class=${c.type}&`
  return `${FREE_CLASS.path}?${program}date=${c.isoDate}#rsvp`
}

/** Looks up an upcoming class by date, so stale or tampered dates are rejected. */
export function findUpcomingClass(isoDate: string | undefined, count = 4, now = new Date()) {
  if (!isoDate || !ISO_DATE.test(isoDate)) return undefined
  return getUpcomingClasses(count, now).find((c) => c.isoDate === isoDate)
}

/** Workshops are open to both programs; regular classes only match their own program. */
export function classMatchesProgram(c: SundayClass, program: string) {
  return c.type === "workshop" || c.type === program
}

/**
 * Zoom access details, read only on the server so they never reach the browser.
 * The recurring meeting comes from SUNDAY_CLASS_ZOOM_URL. The older FREE_CLASS_ZOOM_URL* variables remain as fallbacks.
 */
export function getZoomAccess(program: RsvpProgram) {
  const suffix = program === "shsat" ? "SHSAT" : "DIGITAL_SAT"
  const pick = (key: string) => process.env[`${key}_${suffix}`]?.trim() || process.env[key]?.trim() || ""
  const url = process.env.SUNDAY_CLASS_ZOOM_URL?.trim() || pick("FREE_CLASS_ZOOM_URL")
  if (!url || !/^https:\/\//i.test(url)) return null
  return { url, meetingId: pick("FREE_CLASS_ZOOM_MEETING_ID"), passcode: pick("FREE_CLASS_ZOOM_PASSCODE") }
}

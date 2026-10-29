import { DIGITAL_SAT_TOPICS, SHSAT_TOPICS, WORKSHOP_TOPICS } from "@/lib/sunday-class-topics"

export const FREE_CLASS = {
  path: "/free-sunday-classes",
  name: "Free Sunday Test Prep Series",
  timeZone: "America/New_York",
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

/**
 * Two schedules, chosen by class date (never by today's date), so every stored registration keeps the time it was
 * booked under:
 * - weekly_2026: every Sunday through Dec 27, 2026, one class 4:00–5:00 PM ET, program by the Sunday's place in the month.
 * - biweekly_2027: every other Sunday from Jan 10, 2027, SHSAT 6:00–6:45 PM ET then Digital SAT 7:00–7:45 PM ET.
 * Jan 3, 2027 and the off-weeks of the 2027 schedule have no class.
 */
export type ScheduleId = "weekly_2026" | "biweekly_2027"
export const SCHEDULE_2026_LAST_SUNDAY = "2026-12-27"
export const SCHEDULE_2027_FIRST_SUNDAY = "2027-01-10"
const BIWEEKLY_INTERVAL_DAYS = 14

type SessionTime = { start: number; end: number; label: string; short: string }
const hm = (h: number, m = 0) => h * 60 + m

const WEEKLY_2026_TIME: SessionTime = { start: hm(16), end: hm(17), label: "4:00–5:00 PM ET", short: "4–5 PM ET" }
export const BIWEEKLY_2027_TIMES: Record<RsvpProgram, SessionTime> = {
  shsat: { start: hm(18), end: hm(18, 45), label: "6:00–6:45 PM ET", short: "6–6:45 PM ET" },
  digital_sat: { start: hm(19), end: hm(19, 45), label: "7:00–7:45 PM ET", short: "7–7:45 PM ET" },
}

export const SCHEDULE_2027_ANNOUNCEMENT =
  "Starting Sunday, January 10, 2027, free classes meet every other Sunday: SHSAT 6:00–6:45 PM ET, then Digital SAT 7:00–7:45 PM ET. RSVP separately for each class, or for both."

/** One class session: a single program at a single time. Sundays on the 2027 schedule have two. */
export type SundayClass = {
  id: string
  isoDate: string
  schedule: ScheduleId
  type: ClassType
  typeLabel: string
  title: string
  focus: string
  topic: string
  startDate: string
  endDate: string
  startMinutes: number
  endMinutes: number
  timeLabel: string
  timeLabelShort: string
  label: string
  shortLabel: string
  compactLabel: string
}

export type ClassDay = {
  isoDate: string
  schedule: ScheduleId
  label: string
  shortLabel: string
  compactLabel: string
  sessions: SundayClass[]
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const DAY_MS = 86_400_000

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
      minute: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
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

export function scheduleForDate(isoDate: string): ScheduleId | null {
  if (isoDate <= SCHEDULE_2026_LAST_SUNDAY) return "weekly_2026"
  if (isoDate < SCHEDULE_2027_FIRST_SUNDAY) return null
  const days = Math.round((Date.parse(isoDate) - Date.parse(SCHEDULE_2027_FIRST_SUNDAY)) / DAY_MS)
  return days % BIWEEKLY_INTERVAL_DAYS === 0 ? "biweekly_2027" : null
}

/** 2026: program from the Sunday's position in the month (1st/3rd SHSAT, 2nd/4th Digital SAT, 5th workshop). */
function weeklyTypeFor(day: number): ClassType {
  const nth = Math.ceil(day / 7)
  if (nth === 1 || nth === 3) return "shsat"
  if (nth === 2 || nth === 4) return "digital_sat"
  return "workshop"
}

/** 2026 topics advance one step per class of the same type, so every month continues where the last one left off. */
function weeklyTopicFor(type: ClassType, year: number, month: number, day: number) {
  const monthIndex = year * 12 + (month - 1)
  const secondOfMonth = Math.ceil(day / 7) > 2 ? 1 : 0
  if (type === "workshop") return WORKSHOP_TOPICS[monthIndex % WORKSHOP_TOPICS.length]
  const list = type === "shsat" ? SHSAT_TOPICS : DIGITAL_SAT_TOPICS
  return list[(monthIndex * 2 + secondOfMonth) % list.length]
}

/** 2027 topics advance one step per class Sunday, independently for each program. */
function biweeklyTopicFor(type: RsvpProgram, isoDate: string) {
  const n = Math.round((Date.parse(isoDate) - Date.parse(SCHEDULE_2027_FIRST_SUNDAY)) / DAY_MS / BIWEEKLY_INTERVAL_DAYS)
  const list = type === "shsat" ? SHSAT_TOPICS : DIGITAL_SAT_TOPICS
  return list[n % list.length]
}

function buildDay(classDay: Date): ClassDay | undefined {
  const isoDate = classDay.toISOString().slice(0, 10)
  const schedule = scheduleForDate(isoDate)
  if (!schedule) return undefined

  const format = (options: Intl.DateTimeFormatOptions) => classDay.toLocaleDateString("en-US", { timeZone: "UTC", ...options })
  const labels = {
    label: format({ weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    shortLabel: format({ weekday: "long", month: "long", day: "numeric" }),
    compactLabel: format({ month: "short", day: "numeric" }),
  }
  // 20:00 UTC is mid-afternoon in New York, after any 2 AM daylight-saving switch, so it matches the evening classes.
  const offset = newYorkOffset(new Date(`${isoDate}T20:00:00Z`))
  const clock = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`

  const session = (type: ClassType, time: SessionTime, topic: string): SundayClass => ({
    id: `${isoDate}-${type}`,
    isoDate,
    schedule,
    type,
    typeLabel: CLASS_TYPES[type].label,
    title: CLASS_TYPES[type].title,
    focus: CLASS_TYPES[type].focus,
    topic,
    startDate: `${isoDate}T${clock(time.start)}:00${offset}`,
    endDate: `${isoDate}T${clock(time.end)}:00${offset}`,
    startMinutes: time.start,
    endMinutes: time.end,
    timeLabel: time.label,
    timeLabelShort: time.short,
    ...labels,
  })

  if (schedule === "weekly_2026") {
    const day = classDay.getUTCDate()
    const type = weeklyTypeFor(day)
    const topic = weeklyTopicFor(type, classDay.getUTCFullYear(), classDay.getUTCMonth() + 1, day)
    return { isoDate, schedule, ...labels, sessions: [session(type, WEEKLY_2026_TIME, topic)] }
  }
  return {
    isoDate,
    schedule,
    ...labels,
    sessions: RSVP_PROGRAMS.map(({ value }) => session(value, BIWEEKLY_2027_TIMES[value], biweeklyTopicFor(value, isoDate))),
  }
}

/**
 * Upcoming class Sundays in New York time. On a class Sunday, each session drops off once it ends, so after 6:45 PM
 * on a 2027 Sunday only the Digital SAT session remains, and after the last session the next class Sunday takes over.
 */
export function getUpcomingSundays(count = 4, now = new Date()): ClassDay[] {
  const ny = newYorkWallClock(now)
  const todayIso = `${ny.year}-${String(ny.month).padStart(2, "0")}-${String(ny.day).padStart(2, "0")}`
  const firstSunday = ny.day + ((7 - ny.weekday) % 7)
  const days: ClassDay[] = []
  // Bounded search; at most every other Sunday is skipped, so this always finds `count` class days.
  for (let week = 0; days.length < count && week < count * 2 + 8; week++) {
    // Noon UTC keeps the calendar date stable while adding days and formatting.
    const day = buildDay(new Date(Date.UTC(ny.year, ny.month - 1, firstSunday + week * 7, 12)))
    if (!day) continue
    if (day.isoDate === todayIso) {
      day.sessions = day.sessions.filter((s) => ny.minutes < s.endMinutes)
      if (!day.sessions.length) continue
    }
    days.push(day)
  }
  return days
}

/** Every session on the next `dayCount` class Sundays, in time order. */
export function getUpcomingClasses(dayCount = 4, now = new Date()): SundayClass[] {
  return getUpcomingSundays(dayCount, now).flatMap((d) => d.sessions)
}

export function getNextClass(now = new Date()) {
  return getUpcomingClasses(1, now)[0]
}

export function getNextClassDay(now = new Date()) {
  return getUpcomingSundays(1, now)[0]
}

export function isTodayInNewYork(isoDate: string, now = new Date()) {
  const ny = newYorkWallClock(now)
  return isoDate === `${ny.year}-${String(ny.month).padStart(2, "0")}-${String(ny.day).padStart(2, "0")}`
}

export function rsvpHref(c: SundayClass) {
  const program = c.type === "workshop" ? "" : `class=${c.type}&`
  return `${FREE_CLASS.path}?${program}date=${c.isoDate}#rsvp`
}

export function rsvpDayHref(day: ClassDay) {
  return day.sessions.length === 1 ? rsvpHref(day.sessions[0]) : `${FREE_CLASS.path}?date=${day.isoDate}#rsvp`
}

/** Looks up an upcoming class Sunday by date, so stale or tampered dates are rejected. */
export function findUpcomingSunday(isoDate: string | undefined, count = 4, now = new Date()) {
  if (!isoDate || !ISO_DATE.test(isoDate)) return undefined
  return getUpcomingSundays(count, now).find((d) => d.isoDate === isoDate)
}

/** The upcoming session a parent may book for this date and program (workshops are open to both programs). */
export function findUpcomingSession(isoDate: string | undefined, program: string, count = 4, now = new Date()) {
  return findUpcomingSunday(isoDate, count, now)?.sessions.find((s) => classMatchesProgram(s, program))
}

/** Rebuilds the booked session for any stored date and program (past or future), e.g. to resend a confirmation. */
export function getSessionByDate(isoDate: string, program: string) {
  if (!ISO_DATE.test(isoDate)) return undefined
  const [year, month, day] = isoDate.split("-").map(Number)
  const classDay = new Date(Date.UTC(year, month - 1, day, 12))
  if (classDay.getUTCDay() !== 0 || classDay.toISOString().slice(0, 10) !== isoDate) return undefined
  return buildDay(classDay)?.sessions.find((s) => classMatchesProgram(s, program))
}

/** Workshops are open to both programs; regular classes only match their own program. */
export function classMatchesProgram(c: SundayClass, program: string) {
  return c.type === "workshop" || c.type === program
}

/** Site-wide wording for whichever schedule the next class Sunday is on. */
export function scheduleSummary(now = new Date()) {
  const next = getNextClassDay(now)
  if (next.schedule === "weekly_2026") {
    return {
      schedule: next.schedule,
      cadence: "Every Sunday",
      times: WEEKLY_2026_TIME.label,
      timesShort: WEEKLY_2026_TIME.short,
      format: "SHSAT and Digital SAT classes alternate weekly",
      upcomingChange: SCHEDULE_2027_ANNOUNCEMENT,
    }
  }
  return {
    schedule: next.schedule,
    cadence: "Every other Sunday",
    times: `SHSAT ${BIWEEKLY_2027_TIMES.shsat.label.replace(" ET", "")} · Digital SAT ${BIWEEKLY_2027_TIMES.digital_sat.label}`,
    timesShort: "SHSAT 6 PM · Digital SAT 7 PM ET",
    format: "SHSAT and Digital SAT are both taught on every class Sunday, one after the other",
    upcomingChange: null,
  }
}

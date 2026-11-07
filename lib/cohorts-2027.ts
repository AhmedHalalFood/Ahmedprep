/**
 * The single source of truth for the 12 approved 2027 cohorts (AhmedPrep 2027 Master Plan, approved November 6, 2026).
 * Pages, the enrollment form, the API route, confirmation emails, and syllabi all read from here, so a cohort id is
 * canonical everywhere. Session calendars are generated from the weekday pattern, closures, and makeups below and
 * are checked against the approved session counts in tests/cohorts-2027.test.mjs.
 */

export type ProgramId = "SHSAT" | "Digital SAT"
export type TermId = "winter" | "spring" | "summer"

export const PROGRAMS_2027: readonly ProgramId[] = ["SHSAT", "Digital SAT"] as const
export const TERM_IDS: readonly TermId[] = ["winter", "spring", "summer"] as const

/** A closure removes a regularly scheduled date. Its instruction is preserved by a makeup session. */
export type Closure = { iso: string; reason: string }
/**
 * An extra session that preserves the approved hours. `approved: false` means the specific assignment is still a
 * proposal and must be shown as such (Master Plan section 4).
 */
export type Makeup = {
  iso: string
  time: string
  replaces: string
  approved: boolean
  /**
   * True when `replaces` was never a scheduled class (e.g. the July 5 holiday before a July 6 start): the session is an
   * additional scheduled instructional session that completes the approved hours, not a makeup for a lost class.
   */
  additional?: boolean
}

export type Cohort = {
  id: string
  term: TermId
  program: ProgramId
  label: "Weekday" | "Weekend" | "Weekday Intensive"
  days: string
  time: string
  /** Short date summary, kept for older displays. */
  dates: string
  sessions: number
  hours: number
  /** Day-of-week numbers (0 = Sunday) for regular sessions. */
  weekdays: readonly number[]
  firstIso: string
  /** Last regularly scheduled date (makeups may fall after it). */
  regularEndIso: string
  closures: readonly Closure[]
  makeups: readonly Makeup[]
}

export type Term = {
  id: TermId
  name: string
  cohorts: readonly Cohort[]
  deadlines: readonly { group: string; founding: string; early: string }[]
}

export const HOURLY_RATE = 20
export const SESSION_HOURS = 3
export const FOUNDING_DAYS_BEFORE = 42
export const EARLY_DAYS_BEFORE = 28
export const FOUNDING_SEATS_PER_COHORT = 5
export const MAX_CLASS_SIZE = 12
export const SUMMER_BREAK_BEGINS_ISO = "2027-08-30"
const EVENING_MAKEUP = "5:30–8:30 PM"

const WINTER_WEEKEND = { weekdays: [6, 0], firstIso: "2027-01-09", regularEndIso: "2027-03-28", closures: [], makeups: [] }
const SPRING_WEEKEND = { weekdays: [6, 0], firstIso: "2027-04-03", regularEndIso: "2027-06-20", closures: [], makeups: [] }
const SUMMER_INTENSIVE = {
  weekdays: [1, 2, 3, 4],
  firstIso: "2027-07-06",
  regularEndIso: "2027-08-26",
  closures: [],
}
const SUMMER_WEEKEND = {
  weekdays: [6, 0],
  firstIso: "2027-07-03",
  regularEndIso: "2027-08-22",
  closures: [{ iso: "2027-07-04", reason: "Independence Day closure" }],
}

const COHORTS: readonly Cohort[] = [
  {
    id: "winter-shsat-weekday", term: "winter", program: "SHSAT", label: "Weekday",
    days: "Monday and Wednesday", time: "5:30–8:30 PM", dates: "January 11 – March 31", sessions: 24, hours: 72,
    weekdays: [1, 3], firstIso: "2027-01-11", regularEndIso: "2027-03-31",
    closures: [
      { iso: "2027-01-18", reason: "Martin Luther King Jr. Day closure" },
      { iso: "2027-02-15", reason: "Presidents' Day closure" },
    ],
    makeups: [
      { iso: "2027-01-16", time: EVENING_MAKEUP, replaces: "2027-01-18", approved: false },
      { iso: "2027-02-13", time: EVENING_MAKEUP, replaces: "2027-02-15", approved: false },
    ],
  },
  {
    id: "winter-dsat-weekday", term: "winter", program: "Digital SAT", label: "Weekday",
    days: "Tuesday and Thursday", time: "5:30–8:30 PM", dates: "January 12 – April 1", sessions: 24, hours: 72,
    weekdays: [2, 4], firstIso: "2027-01-12", regularEndIso: "2027-04-01",
    closures: [{ iso: "2027-03-09", reason: "Holiday closure (calendar verification pending)" }],
    makeups: [{ iso: "2027-03-06", time: EVENING_MAKEUP, replaces: "2027-03-09", approved: false }],
  },
  {
    id: "winter-shsat-weekend", term: "winter", program: "SHSAT", label: "Weekend",
    days: "Saturday and Sunday", time: "10 AM–1 PM", dates: "January 9 – March 28", sessions: 24, hours: 72,
    ...WINTER_WEEKEND,
  },
  {
    id: "winter-dsat-weekend", term: "winter", program: "Digital SAT", label: "Weekend",
    days: "Saturday and Sunday", time: "2–5 PM", dates: "January 9 – March 28", sessions: 24, hours: 72,
    ...WINTER_WEEKEND,
  },
  {
    id: "spring-shsat-weekday", term: "spring", program: "SHSAT", label: "Weekday",
    days: "Monday and Wednesday", time: "5:30–8:30 PM", dates: "April 5 – June 23", sessions: 24, hours: 72,
    weekdays: [1, 3], firstIso: "2027-04-05", regularEndIso: "2027-06-23",
    closures: [
      { iso: "2027-05-17", reason: "Holiday closure (calendar verification pending)" },
      { iso: "2027-05-31", reason: "Memorial Day closure" },
    ],
    makeups: [
      { iso: "2027-05-15", time: EVENING_MAKEUP, replaces: "2027-05-17", approved: false },
      { iso: "2027-05-29", time: EVENING_MAKEUP, replaces: "2027-05-31", approved: false },
    ],
  },
  {
    id: "spring-dsat-weekday", term: "spring", program: "Digital SAT", label: "Weekday",
    days: "Tuesday and Thursday", time: "5:30–8:30 PM", dates: "April 6 – June 24", sessions: 24, hours: 72,
    weekdays: [2, 4], firstIso: "2027-04-06", regularEndIso: "2027-06-24", closures: [], makeups: [],
  },
  {
    id: "spring-shsat-weekend", term: "spring", program: "SHSAT", label: "Weekend",
    days: "Saturday and Sunday", time: "10 AM–1 PM", dates: "April 3 – June 20", sessions: 24, hours: 72,
    ...SPRING_WEEKEND,
  },
  {
    id: "spring-dsat-weekend", term: "spring", program: "Digital SAT", label: "Weekend",
    days: "Saturday and Sunday", time: "2–5 PM", dates: "April 3 – June 20", sessions: 24, hours: 72,
    ...SPRING_WEEKEND,
  },
  {
    id: "summer-shsat-intensive", term: "summer", program: "SHSAT", label: "Weekday Intensive",
    days: "Monday–Thursday", time: "10 AM–1 PM", dates: "July 6 – August 26; final session August 29", sessions: 32, hours: 96,
    ...SUMMER_INTENSIVE,
    // Owner approved Sunday, August 29, 2027 as the required final instructional session for both intensive cohorts.
    makeups: [{ iso: "2027-08-29", time: "10 AM–1 PM", replaces: "2027-07-05", approved: true, additional: true }],
  },
  {
    id: "summer-dsat-intensive", term: "summer", program: "Digital SAT", label: "Weekday Intensive",
    days: "Monday–Thursday", time: "2–5 PM", dates: "July 6 – August 26; final session August 29", sessions: 32, hours: 96,
    ...SUMMER_INTENSIVE,
    makeups: [{ iso: "2027-08-29", time: "2–5 PM", replaces: "2027-07-05", approved: true, additional: true }],
  },
  {
    id: "summer-shsat-weekend", term: "summer", program: "SHSAT", label: "Weekend",
    days: "Saturday and Sunday", time: "10 AM–1 PM", dates: "July 3 – August 22; July 4 closure made up August 28", sessions: 16, hours: 48,
    ...SUMMER_WEEKEND,
    makeups: [{ iso: "2027-08-28", time: "10 AM–1 PM", replaces: "2027-07-04", approved: false }],
  },
  {
    id: "summer-dsat-weekend", term: "summer", program: "Digital SAT", label: "Weekend",
    days: "Saturday and Sunday", time: "2–5 PM", dates: "July 3 – August 22; July 4 closure made up August 28", sessions: 16, hours: 48,
    ...SUMMER_WEEKEND,
    makeups: [{ iso: "2027-08-28", time: "2–5 PM", replaces: "2027-07-04", approved: false }],
  },
]

const TERM_NAMES: Record<TermId, string> = { winter: "Winter 2027", spring: "Spring 2027", summer: "Summer 2027" }

// ---------- Dates (pure ISO arithmetic at noon UTC, so results never depend on the server's time zone) ----------

const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`)
const toIso = (d: Date) => d.toISOString().slice(0, 10)
export const addDays = (iso: string, days: number) => toIso(new Date(toDate(iso).getTime() + days * 86_400_000))
export const weekdayOf = (iso: string) => toDate(iso).getUTCDay()

/** "November 28, 2026" */
export const formatDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" })
/** "Sat, Jan 9" */
export const formatShortDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" })
/** "Saturday, January 9, 2027" */
export const formatLongDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" })

export type ScheduledSession = {
  number: number
  iso: string
  time: string
  kind: "regular" | "makeup"
  /** For a makeup: the date whose instruction it preserves. */
  replaces?: string
  approved: boolean
  additional?: boolean
  }

/** Every instructional session of a cohort, in date order, numbered 1..n. */
export function sessionCalendar(cohort: Cohort): ScheduledSession[] {
  const closed = new Set(cohort.closures.map((c) => c.iso))
  const entries: Omit<ScheduledSession, "number">[] = []
  for (let iso = cohort.firstIso; iso <= cohort.regularEndIso; iso = addDays(iso, 1)) {
    if (cohort.weekdays.includes(weekdayOf(iso)) && !closed.has(iso)) {
      entries.push({ iso, time: cohort.time, kind: "regular", approved: true })
    }
  }
  for (const m of cohort.makeups) entries.push({ iso: m.iso, time: m.time, kind: "makeup", replaces: m.replaces, approved: m.approved, additional: m.additional })
  return entries
    .sort((a, b) => (a.iso === b.iso ? a.time.localeCompare(b.time) : a.iso.localeCompare(b.iso)))
    .map((s, i) => ({ ...s, number: i + 1 }))
}

/** First and last instructional dates, including makeups. */
export function cohortSpan(cohort: Cohort) {
  const calendar = sessionCalendar(cohort)
  return { startIso: calendar[0].iso, endIso: calendar[calendar.length - 1].iso }
}

// ---------- Tuition ----------

/** $20 per scheduled instructional hour; early is 10% off, founding-family 25% off. Discounts never combine. */
export const priceFor = (cohort: Pick<Cohort, "hours">) => {
  const regular = cohort.hours * HOURLY_RATE
  return { regular, early: Math.round(regular * 0.9), founding: Math.round(regular * 0.75) }
}

/** Full-payment deadlines, counted back from the first scheduled class. */
export const deadlinesFor = (cohort: Pick<Cohort, "firstIso">) => ({
  foundingIso: addDays(cohort.firstIso, -FOUNDING_DAYS_BEFORE),
  earlyIso: addDays(cohort.firstIso, -EARLY_DAYS_BEFORE),
})

export const dollars = (n: number) => "$" + n.toLocaleString("en-US")

// ---------- Catalog ----------

const groupName = (c: Cohort) => (c.label === "Weekday" ? `Weekday ${c.program}` : c.label === "Weekend" ? "Weekend SHSAT and Digital SAT" : "Weekday Intensive SHSAT and Digital SAT")

export const TERMS_2027: readonly Term[] = TERM_IDS.map((id) => {
  const cohorts = COHORTS.filter((c) => c.term === id)
  const groups = new Map<string, { group: string; founding: string; early: string }>()
  for (const c of cohorts) {
    const { foundingIso, earlyIso } = deadlinesFor(c)
    groups.set(groupName(c), { group: groupName(c), founding: formatDate(foundingIso), early: formatDate(earlyIso) })
  }
  return { id, name: TERM_NAMES[id], cohorts, deadlines: [...groups.values()] }
})

export const ALL_COHORTS: readonly Cohort[] = COHORTS
export const termName = (id: TermId) => TERM_NAMES[id]
export const findCohort = (id: string) => COHORTS.find((c) => c.id === id)
export const isTermId = (v: string): v is TermId => (TERM_IDS as readonly string[]).includes(v)
export const isProgramId = (v: string): v is ProgramId => (PROGRAMS_2027 as readonly string[]).includes(v)
export const cohortsFor = (program: string, term: string) => COHORTS.filter((c) => c.program === program && c.term === term)

/** "Winter 2027 SHSAT Weekday" */
export const cohortTitle = (c: Cohort) => `${TERM_NAMES[c.term]} ${c.program} ${c.label}`
/** "Monday and Wednesday, 5:30–8:30 PM ET" */
export const cohortSchedule = (c: Cohort) => `${c.days}, ${c.time} ET`

/** Inquiry form link with this cohort already selected. */
export const cohortInquiryHref = (c: Cohort) =>
  `/enroll-2027?${new URLSearchParams({ program: c.program, term: c.term, cohort: c.id })}`

/** Date span, hour range, regular-tuition range and earliest discount deadlines for one term. */
export function termSummary(term: Term) {
  const spans = term.cohorts.map(cohortSpan)
  const hours = term.cohorts.map((c) => c.hours)
  const regular = term.cohorts.map((c) => priceFor(c).regular)
  const deadlines = term.cohorts.map(deadlinesFor)
  const range = (values: number[], fmt: (n: number) => string) => {
    const lo = Math.min(...values)
    const hi = Math.max(...values)
    return lo === hi ? fmt(lo) : `${fmt(lo)}–${fmt(hi)}`
  }
  return {
    startIso: spans.map((s) => s.startIso).sort()[0],
    endIso: spans.map((s) => s.endIso).sort().at(-1)!,
    hoursLabel: range(hours, String) + " hours",
    regularLabel: range(regular, dollars),
    firstFoundingIso: deadlines.map((d) => d.foundingIso).sort()[0],
    firstEarlyIso: deadlines.map((d) => d.earlyIso).sort()[0],
  }
}

export const FREE_CLASS = {
  path: "/free-shsat-class",
  name: "Free Live SHSAT Class",
  timeZone: "America/New_York",
  startHour: 16,
  endHour: 17,
  dayLabel: "Sundays",
  timeLabel: "4:00 PM–5:00 PM",
  timeLabelShort: "4–5 PM",
  instructor: "Tariq Ahmed",
  instructorRole: "Founder & Lead Instructor",
} as const

export const FREE_CLASS_GRADES = ["5th grade", "6th grade", "7th grade", "8th grade", "9th grade", "Other"]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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

/**
 * The upcoming Sunday class in New York time. Today's class stays "next" until it ends at 5:00 PM ET,
 * then the following Sunday takes over.
 */
export function getNextClass(now = new Date()) {
  const ny = newYorkWallClock(now)
  let daysAhead = (7 - ny.weekday) % 7
  if (daysAhead === 0 && ny.hour >= FREE_CLASS.endHour) daysAhead = 7

  // Noon UTC keeps the calendar date stable while adding days and formatting.
  const classDay = new Date(Date.UTC(ny.year, ny.month - 1, ny.day + daysAhead, 12))
  const isoDate = classDay.toISOString().slice(0, 10)
  // 21:00 UTC is always inside the 4–5 PM class hour (EDT or EST), so the offset matches the class itself.
  const offset = newYorkOffset(new Date(`${isoDate}T21:00:00Z`))
  const pad = (h: number) => String(h).padStart(2, "0")
  const format = (options: Intl.DateTimeFormatOptions) => classDay.toLocaleDateString("en-US", { timeZone: "UTC", ...options })

  return {
    isoDate,
    startDate: `${isoDate}T${pad(FREE_CLASS.startHour)}:00:00${offset}`,
    endDate: `${isoDate}T${pad(FREE_CLASS.endHour)}:00:00${offset}`,
    label: format({ weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    shortLabel: format({ weekday: "long", month: "long", day: "numeric" }),
  }
}

/** Zoom access details, read only on the server from environment variables so they never reach the browser. */
export function getZoomAccess() {
  const url = process.env.FREE_CLASS_ZOOM_URL?.trim()
  if (!url || !/^https:\/\//i.test(url)) return null
  return {
    url,
    meetingId: process.env.FREE_CLASS_ZOOM_MEETING_ID?.trim() || "",
    passcode: process.env.FREE_CLASS_ZOOM_PASSCODE?.trim() || "",
  }
}

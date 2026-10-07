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

function utcOffset(date: Date) {
  const label =
    new Intl.DateTimeFormat("en-US", { timeZone: FREE_CLASS.timeZone, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT-5"
  const match = label.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  if (!match) return "-05:00"
  return `${match[1]}${match[2].padStart(2, "0")}:${match[3] ?? "00"}`
}

/** The upcoming Sunday class in New York time. Once a class has started, the next one is a week later. */
export function getNextClass(now = new Date()) {
  const nyNow = new Date(now.toLocaleString("en-US", { timeZone: FREE_CLASS.timeZone }))
  let daysAhead = (7 - nyNow.getDay()) % 7
  if (daysAhead === 0 && nyNow.getHours() >= FREE_CLASS.startHour) daysAhead = 7
  const classDay = new Date(nyNow)
  classDay.setDate(nyNow.getDate() + daysAhead)

  const isoDate = [
    classDay.getFullYear(),
    String(classDay.getMonth() + 1).padStart(2, "0"),
    String(classDay.getDate()).padStart(2, "0"),
  ].join("-")
  const offset = utcOffset(new Date(`${isoDate}T12:00:00Z`))
  const pad = (h: number) => String(h).padStart(2, "0")

  return {
    isoDate,
    startDate: `${isoDate}T${pad(FREE_CLASS.startHour)}:00:00${offset}`,
    endDate: `${isoDate}T${pad(FREE_CLASS.endHour)}:00:00${offset}`,
    label: classDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    shortLabel: classDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
  }
}

import { FREE_CLASS } from "@/lib/free-class"

export type ReminderSlot = "morning" | "afternoon"
export const REMINDER_SLOTS: ReminderSlot[] = ["morning", "afternoon"]

/**
 * When each reminder may be sent, in New York minutes after midnight on the class Sunday (end exclusive).
 * The scheduler triggers at 10:00 and 15:30, but the site checks New York time itself, so a job fired at the wrong
 * hour (for example around a daylight saving change) does nothing instead of emailing families early or late.
 */
export const REMINDER_WINDOWS: Record<ReminderSlot, { start: number; end: number; label: string }> = {
  morning: { start: 10 * 60, end: 15 * 60 + 30, label: "10:00 AM ET" },
  afternoon: { start: 15 * 60 + 30, end: FREE_CLASS.endHour * 60, label: "3:30 PM ET" },
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** New York calendar date, weekday (0 = Sunday), and minutes after midnight for an instant. Handles EDT and EST. */
export function newYorkClock(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: FREE_CLASS.timeZone,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return {
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: WEEKDAYS.indexOf(parts.weekday),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

export function isSlotOpen(slot: ReminderSlot, now = new Date()) {
  const ny = newYorkClock(now)
  const window = REMINDER_WINDOWS[slot]
  return ny.weekday === 0 && ny.minutes >= window.start && ny.minutes < window.end
}

/** The reminder that is due right now for a class on `classDate`, if any. Used to send a late registrant's access at once. */
export function dueSlotFor(classDate: string, now = new Date()): ReminderSlot | null {
  if (newYorkClock(now).isoDate !== classDate) return null
  return REMINDER_SLOTS.find((slot) => isSlotOpen(slot, now)) ?? null
}

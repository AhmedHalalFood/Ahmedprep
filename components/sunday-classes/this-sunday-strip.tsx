import { ArrowUpRight, CalendarDays, Clock, Video } from "lucide-react"
import { ClassTypeBadge } from "@/components/sunday-classes/class-type-badge"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { FREE_CLASS, PAUSE_ANNOUNCEMENT, getNextClassDay, isTodayInNewYork, rsvpDayHref, scheduleSummary } from "@/lib/free-class"

/** Compact "next free class" banner. Pages using it should revalidate hourly so it rolls over after each class. */
export function ThisSundayStrip({ location }: { location: string }) {
  const day = getNextClassDay()
  if (!day) return scheduleSummary().paused ? <PausedStrip location={location} /> : null
  const first = day.sessions[0]
  const single = day.sessions.length === 1
  const headingId = `this-sunday-${location}`
  return (
    <section aria-labelledby={headingId} className="border-y border-line bg-warm py-8">
      <div className="container flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <p id={headingId} className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep">
              {isTodayInNewYork(day.isoDate) ? "Today" : "Next class Sunday"} at AhmedPrep
            </p>
            {day.sessions.map((s) => (
              <ClassTypeBadge key={s.id} type={s.type} />
            ))}
          </div>
          <p className="text-pretty text-xl font-extrabold leading-snug text-navy">
            {single ? `Free ${first.typeLabel} class: ${first.topic}` : "Free SHSAT Math & Digital SAT Math classes, back to back"}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-semibold text-ink">
            <li className="flex items-center gap-1.5">
              <CalendarDays size={16} aria-hidden="true" className="text-brand" />
              <time dateTime={first.startDate}>{day.shortLabel}</time>
            </li>
            {day.sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-1.5">
                <Clock size={16} aria-hidden="true" className="text-brand" />
                {single ? s.timeLabelShort : `${s.typeLabel} ${s.timeLabelShort}`}
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <Video size={16} aria-hidden="true" className="text-brand" />
              Live Online
            </li>
          </ul>
        </div>
        <TrackedLink
          href={rsvpDayHref(day)}
          event={EVENTS.sundayClassCtaClick}
          eventProps={{ location: `this_sunday_strip_${location}`, class_type: single ? first.type : "both", class_date: day.isoDate }}
          className="button button-gold button-lg shrink-0 justify-center"
        >
          RSVP Free <ArrowUpRight size={17} aria-hidden="true" />
        </TrackedLink>
      </div>
    </section>
  )
}

function PausedStrip({ location }: { location: string }) {
  const headingId = `this-sunday-${location}`
  return (
    <section aria-labelledby={headingId} className="border-y border-line bg-warm py-8">
      <div className="container flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <p id={headingId} className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep">
            Free Sunday classes at AhmedPrep
          </p>
          <p className="text-pretty text-xl font-extrabold leading-snug text-navy">{PAUSE_ANNOUNCEMENT}</p>
          <p className="text-sm font-semibold text-ink">SHSAT Math 6:00–6:45 PM ET · Digital SAT Math 7:00–7:45 PM ET · Every other Sunday</p>
        </div>
        <TrackedLink
          href={FREE_CLASS.path}
          event={EVENTS.sundayClassCtaClick}
          eventProps={{ location: `this_sunday_strip_${location}`, class_date: "paused" }}
          className="button button-outline shrink-0 justify-center"
        >
          See the January Schedule <ArrowUpRight size={17} aria-hidden="true" />
        </TrackedLink>
      </div>
    </section>
  )
}

import { ArrowUpRight, CalendarDays, Video } from "lucide-react"
import { ClassTypeBadge } from "@/components/sunday-classes/class-type-badge"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { isTodayInNewYork, rsvpHref, type ClassDay } from "@/lib/free-class"

/** Shown when no class Sunday is bookable yet, e.g. after Dec 27, 2026 until the first 2027 date is confirmed. */
export function NextDatePendingCard() {
  return (
    <article
      aria-labelledby="this-sunday-title"
      className="flex flex-col gap-4 border border-line border-t-4 border-t-gold bg-white p-6 text-ink shadow-xl shadow-navy/20 sm:p-8"
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep">January 2027</p>
      <h2 id="this-sunday-title" className="text-balance text-2xl font-extrabold leading-tight text-navy">
        First class date announced soon
      </h2>
      <p className="text-pretty leading-relaxed text-subtle">
        Every other Sunday: SHSAT 6:00–6:45 PM ET, then Digital SAT 7:00–7:45 PM ET. RSVP opens once the first date is confirmed.
      </p>
    </article>
  )
}

export function ThisSundayCard({ day }: { day: ClassDay }) {
  const today = isTodayInNewYork(day.isoDate)
  const single = day.sessions.length === 1 ? day.sessions[0] : null
  return (
    <article
      aria-labelledby="this-sunday-title"
      className="flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-6 text-ink shadow-xl shadow-navy/20 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep">{today ? "Today" : "Next class Sunday"}</p>
        {single && <ClassTypeBadge type={single.type} />}
      </div>
      <div>
        <h2 id="this-sunday-title" className="text-balance text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
          {single ? single.title : "Free SHSAT & Digital SAT Classes"}
        </h2>
        {single && <p className="mt-1 font-semibold text-brand">{single.focus}</p>}
      </div>
      <p className="flex items-start gap-2 text-sm font-semibold text-navy">
        <CalendarDays size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
        {day.shortLabel}
      </p>
      <ul className="flex flex-col gap-3">
        {day.sessions.map((s) => (
          <li key={s.id} className="flex flex-col gap-3 border-l-4 border-gold bg-warm px-4 py-3 text-sm leading-relaxed">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-extrabold text-navy">{s.timeLabel}</span>
              {!single && <ClassTypeBadge type={s.type} />}
            </div>
            <p>
              <span className="block text-xs font-bold uppercase tracking-widest text-subtle">Topic</span>
              <span className="font-bold text-navy">{s.topic}</span>
            </p>
            {!single && (
              <TrackedLink
                href={rsvpHref(s)}
                event={EVENTS.sundayClassCtaClick}
                eventProps={{ location: "this_sunday_card", class_type: s.type, class_date: s.isoDate }}
                className="text-link self-start"
                aria-label={`Reserve a free seat in the ${s.typeLabel} class, ${s.shortLabel}, ${s.timeLabel}`}
              >
                Reserve {s.typeLabel} seat <ArrowUpRight size={15} aria-hidden="true" />
              </TrackedLink>
            )}
          </li>
        ))}
      </ul>
      <p className="flex items-start gap-2 text-sm font-semibold text-navy">
        <Video size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
        <span>
          Live Online <span aria-hidden="true">•</span> {single ? "RSVP Required" : "Separate RSVP for each class"}
        </span>
      </p>
      {single && (
        <TrackedLink
          href={rsvpHref(single)}
          event={EVENTS.sundayClassCtaClick}
          eventProps={{ location: "this_sunday_card", class_type: single.type, class_date: single.isoDate }}
          className="button button-gold button-lg w-full justify-center"
        >
          Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
        </TrackedLink>
      )}
    </article>
  )
}

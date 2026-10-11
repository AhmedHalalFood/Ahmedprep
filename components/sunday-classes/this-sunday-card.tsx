import { ArrowUpRight, CalendarDays, Video } from "lucide-react"
import { ClassTypeBadge } from "@/components/sunday-classes/class-type-badge"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { FREE_CLASS, isTodayInNewYork, rsvpHref, type SundayClass } from "@/lib/free-class"

export function ThisSundayCard({ session }: { session: SundayClass }) {
  const today = isTodayInNewYork(session.isoDate)
  return (
    <article
      aria-labelledby="this-sunday-title"
      className="flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-6 text-ink shadow-xl shadow-navy/20 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep">{today ? "Today" : "This Sunday"}</p>
        <ClassTypeBadge type={session.type} />
      </div>
      <div>
        <h2 id="this-sunday-title" className="text-balance text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
          {session.title}
        </h2>
        <p className="mt-1 font-semibold text-brand">{session.focus}</p>
      </div>
      <p className="border-l-4 border-gold bg-warm px-4 py-3 text-sm leading-relaxed">
        <span className="block text-xs font-bold uppercase tracking-widest text-subtle">Topic</span>
        <span className="font-bold text-navy">{session.topic}</span>
      </p>
      <ul className="flex flex-col gap-2 text-sm font-semibold text-navy">
        <li className="flex items-start gap-2">
          <CalendarDays size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
          <span>
            {session.shortLabel} <span aria-hidden="true">•</span> {FREE_CLASS.timeLabel}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Video size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
          <span>
            Live Online <span aria-hidden="true">•</span> RSVP Required
          </span>
        </li>
      </ul>
      <TrackedLink
        href={rsvpHref(session)}
        event={EVENTS.sundayClassCtaClick}
        eventProps={{ location: "this_sunday_card", class_type: session.type, class_date: session.isoDate }}
        className="button button-gold button-lg w-full justify-center"
      >
        Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
      </TrackedLink>
    </article>
  )
}

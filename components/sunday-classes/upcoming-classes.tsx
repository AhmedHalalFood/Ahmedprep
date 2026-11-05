import { ArrowUpRight } from "lucide-react"
import { ClassTypeBadge } from "@/components/sunday-classes/class-type-badge"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { SCHEDULE_2027_ANNOUNCEMENT, rsvpHref, type ClassDay } from "@/lib/free-class"

const WEEKLY_2026_LEGEND = [
  ["1st & 3rd Sundays", "SHSAT, 4–5 PM ET"],
  ["2nd & 4th Sundays", "Digital SAT, 4–5 PM ET"],
  ["5th Sunday, when a month has one", "Special Workshop / Diagnostic / Parent Q&A"],
]
const BIWEEKLY_2027_LEGEND = [
  ["6:00–6:45 PM ET", "Free SHSAT Math Class"],
  ["7:00–7:45 PM ET", "Free Digital SAT Math Class"],
]

export function UpcomingClasses({ days }: { days: ClassDay[] }) {
  const has2026 = days.some((d) => d.schedule === "weekly_2026")
  const has2027 = days.some((d) => d.schedule === "biweekly_2027")
  const legend = has2026 ? WEEKLY_2026_LEGEND : BIWEEKLY_2027_LEGEND

  return (
    <section id="upcoming" aria-labelledby="upcoming-title" className="scroll-mt-4 bg-warm py-14 md:py-20">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow blue">Next {days.length} class Sundays</p>
            <h2 id="upcoming-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              Upcoming Free Classes
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-subtle">
              {has2026
                ? "Through December 27, 2026, one class meets every Sunday from 4:00–5:00 PM ET, live online."
                : "Free Math classes meet every other Sunday, live online. Each Sunday has an SHSAT Math class and a Digital SAT Math class; RSVP for one or both."}
            </p>
            {has2026 && <p className="mt-3 text-pretty font-semibold leading-relaxed text-navy">{SCHEDULE_2027_ANNOUNCEMENT}</p>}
          </div>
          <dl
            className="grid gap-x-6 gap-y-2 border-l-4 border-gold pl-5 text-sm sm:grid-cols-[auto_1fr]"
            aria-label={has2026 ? "2026 monthly schedule" : "Schedule on each class Sunday"}
          >
            {legend.map(([when, what]) => (
              <div key={when} className="contents">
                <dt className="font-semibold text-subtle">{when}</dt>
                <dd className="font-bold text-navy">{what}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {days.map((day, i) => (
            <li key={day.isoDate} className="flex flex-col gap-4 border border-line bg-white p-6">
              <p className="leading-tight">
                <span className="block text-xs font-bold uppercase tracking-widest text-subtle">
                  {i === 0 ? "Next class Sunday" : has2027 && day.schedule === "biweekly_2027" && i > 0 && days[i - 1].schedule === "weekly_2026" ? "New schedule" : "Sunday"}
                </span>
                <span className="mt-1 block text-2xl font-extrabold text-navy">{day.compactLabel}</span>
              </p>
              <ul className="flex flex-1 flex-col gap-4">
                {day.sessions.map((s) => (
                  <li key={s.id} className="flex flex-col gap-2 border-t border-line pt-4 first:border-t-0 first:pt-0">
                    <ClassTypeBadge type={s.type} />
                    <h3 className="text-pretty text-lg font-extrabold leading-snug text-navy">{s.topic}</h3>
                    <p className="text-sm font-semibold text-navy">{s.timeLabel} · Live Online</p>
                    <TrackedLink
                      href={rsvpHref(s)}
                      event={EVENTS.sundayClassCtaClick}
                      eventProps={{ location: "upcoming_card", class_type: s.type, class_date: s.isoDate }}
                      className="button button-outline justify-center"
                      aria-label={`RSVP for ${s.title} on ${s.shortLabel}, ${s.timeLabel}: ${s.topic}`}
                    >
                      RSVP{day.sessions.length > 1 ? ` ${s.typeLabel}` : ""} <ArrowUpRight size={15} aria-hidden="true" />
                    </TrackedLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

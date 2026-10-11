import { ArrowUpRight } from "lucide-react"
import { ClassTypeBadge } from "@/components/sunday-classes/class-type-badge"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { FREE_CLASS, rsvpHref, type SundayClass } from "@/lib/free-class"

const schedule = [
  ["1st & 3rd Sundays", "SHSAT"],
  ["2nd & 4th Sundays", "Digital SAT"],
  ["5th Sunday, when a month has one", "Special Workshop / Diagnostic / Parent Q&A"],
]

export function UpcomingClasses({ classes }: { classes: SundayClass[] }) {
  return (
    <section id="upcoming" aria-labelledby="upcoming-title" className="scroll-mt-4 bg-warm py-14 md:py-20">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow blue">Next four Sundays</p>
            <h2 id="upcoming-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              Upcoming Free Classes
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-subtle">
              Every class runs {FREE_CLASS.timeLabel}, live online. Choose a Sunday to reserve a seat for that class.
            </p>
          </div>
          <dl className="grid gap-x-6 gap-y-2 border-l-4 border-gold pl-5 text-sm sm:grid-cols-[auto_1fr]" aria-label="Monthly schedule">
            {schedule.map(([when, what]) => (
              <div key={when} className="contents">
                <dt className="font-semibold text-subtle">{when}</dt>
                <dd className="font-bold text-navy">{what}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((c, i) => (
            <li key={c.isoDate} className="flex flex-col gap-4 border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="leading-tight">
                  <span className="block text-xs font-bold uppercase tracking-widest text-subtle">{i === 0 ? "This Sunday" : "Sunday"}</span>
                  <span className="mt-1 block text-2xl font-extrabold text-navy">{c.compactLabel}</span>
                </p>
                <ClassTypeBadge type={c.type} />
              </div>
              <div className="flex-1">
                <h3 className="text-pretty text-lg font-extrabold leading-snug text-navy">{c.topic}</h3>
                <p className="mt-1 text-sm leading-relaxed text-subtle">{c.title}</p>
              </div>
              <p className="text-sm font-semibold text-navy">{FREE_CLASS.timeLabelShort} · Live Online</p>
              <TrackedLink
                href={rsvpHref(c)}
                event={EVENTS.sundayClassCtaClick}
                eventProps={{ location: "upcoming_card", class_type: c.type, class_date: c.isoDate }}
                className="button button-outline justify-center"
                aria-label={`RSVP for ${c.title} on ${c.shortLabel}: ${c.topic}`}
              >
                RSVP <ArrowUpRight size={15} aria-hidden="true" />
              </TrackedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

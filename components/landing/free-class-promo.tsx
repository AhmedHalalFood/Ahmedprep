import { ArrowUpRight } from "lucide-react"
import { ClassTypeBadge } from "@/components/sunday-classes/class-type-badge"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { FREE_CLASS, getNextClassDay, rsvpHref, scheduleSummary } from "@/lib/free-class"

/** Compact homepage band for the free Sunday series; intentionally quieter than the paid intensive above it. */
export function FreeClassPromo() {
  const day = getNextClassDay()
  const summary = scheduleSummary()
  return (
    <section id="free-sunday-classes" aria-labelledby="free-class-promo-title" className="scroll-mt-4 border-y border-line bg-cream py-10 md:py-12">
      <div className="container grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div className="flex flex-col gap-3">
          <p className="eyebrow blue">Free live Sunday test prep</p>
          <h2 id="free-class-promo-title" className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-navy md:text-3xl">
            {summary.schedule === "weekly_2026" ? "SHSAT & Digital SAT Classes Alternate Weekly" : "SHSAT & Digital SAT Classes Every Other Sunday"}
          </h2>
          <p className="text-sm font-bold uppercase tracking-wider text-subtle">
            {summary.cadence} <span aria-hidden="true">•</span> {summary.times} <span aria-hidden="true">•</span> Live Online{" "}
            <span aria-hidden="true">•</span> RSVP Required
          </p>
          {summary.upcomingChange && <p className="text-pretty text-sm font-semibold leading-relaxed text-navy">{summary.upcomingChange}</p>}
          <div className="mt-2">
            <TrackedLink
              href={FREE_CLASS.path}
              event={EVENTS.sundayClassCtaClick}
              eventProps={{ location: "home_promo", class_date: day.isoDate }}
              className="button button-outline"
            >
              See the Class Schedule <ArrowUpRight size={15} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>

        <div className="flex flex-col gap-4 border border-line border-t-4 border-t-gold bg-white p-5 sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gold-deep">Next free class · {day.shortLabel}</p>
          {day.sessions.map((s) => (
            <div key={s.id} className="flex flex-col gap-2 border-t border-line pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-subtle">{s.timeLabelShort}</p>
                <ClassTypeBadge type={s.type} />
              </div>
              <p className="text-lg font-extrabold leading-snug text-navy">{s.topic}</p>
              <TrackedLink
                href={rsvpHref(s)}
                event={EVENTS.sundayClassCtaClick}
                eventProps={{ location: "home_next_class", class_type: s.type, class_date: s.isoDate }}
                className="text-link self-start"
              >
                Reserve Free {day.sessions.length > 1 ? `${s.typeLabel} ` : ""}Seat <ArrowUpRight size={15} aria-hidden="true" />
              </TrackedLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

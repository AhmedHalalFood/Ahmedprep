import { ArrowUpRight } from "lucide-react"
import { ClassTypeBadge } from "@/components/sunday-classes/class-type-badge"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { FREE_CLASS, getNextClass, rsvpHref } from "@/lib/free-class"

/** Compact homepage band for the free Sunday series; intentionally quieter than the paid intensive above it. */
export function FreeClassPromo() {
  const next = getNextClass()
  return (
    <section id="free-sunday-classes" aria-labelledby="free-class-promo-title" className="scroll-mt-4 border-y border-line bg-cream py-10 md:py-12">
      <div className="container grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div className="flex flex-col gap-3">
          <p className="eyebrow blue">Free live Sunday test prep</p>
          <h2 id="free-class-promo-title" className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-navy md:text-3xl">
            SHSAT & Digital SAT Classes Alternate Weekly
          </h2>
          <p className="text-sm font-bold uppercase tracking-wider text-subtle">
            Every Sunday <span aria-hidden="true">•</span> {FREE_CLASS.timeLabel} <span aria-hidden="true">•</span> Live Online{" "}
            <span aria-hidden="true">•</span> RSVP Required
          </p>
          <div className="mt-2">
            <TrackedLink
              href={FREE_CLASS.path}
              event={EVENTS.sundayClassCtaClick}
              eventProps={{ location: "home_promo", class_type: next.type, class_date: next.isoDate }}
              className="button button-outline"
            >
              See This Sunday&apos;s Class <ArrowUpRight size={15} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>

        <div className="flex flex-col gap-3 border border-line border-t-4 border-t-gold bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gold-deep">Next free Sunday class</p>
            <ClassTypeBadge type={next.type} />
          </div>
          <p className="text-lg font-extrabold leading-snug text-navy">{next.topic}</p>
          <p className="text-sm font-semibold text-subtle">
            {next.shortLabel} <span aria-hidden="true">•</span> {FREE_CLASS.timeLabelShort}
          </p>
          <TrackedLink
            href={rsvpHref(next)}
            event={EVENTS.sundayClassCtaClick}
            eventProps={{ location: "home_next_class", class_type: next.type, class_date: next.isoDate }}
            className="text-link self-start"
          >
            Reserve Free Seat <ArrowUpRight size={15} aria-hidden="true" />
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}

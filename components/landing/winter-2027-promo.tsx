import { ArrowRight, CalendarDays, Check, Clock, Snowflake, Users } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import {
  DEADLINE_TIME_LABEL,
  FOUNDING_SEATS_PER_COHORT,
  MAX_CLASS_SIZE,
  TERMS_2027,
  WINTER_FOUNDING_DEADLINE_ISO,
  dollars,
  priceFor,
} from "@/lib/cohorts-2027"

const winter = TERMS_2027.find((term) => term.id === "winter")!
const cohort = winter.cohorts[0]
const meetings = cohort.sessions
const weeks = meetings / cohort.weekdays.length
const price = priceFor(cohort)
const founding = price.founding!
const savings = price.regular - founding
const savingsPercent = Math.round((savings / price.regular) * 100)
const deadline = new Date(`${WINTER_FOUNDING_DEADLINE_ISO}T12:00:00Z`).toLocaleDateString("en-US", {
  timeZone: "UTC",
  month: "long",
  day: "numeric",
  year: "numeric",
})

const STATS = [
  { icon: CalendarDays, value: `${weeks} weeks`, detail: `${meetings} classes` },
  { icon: Clock, value: `${cohort.hours} hours`, detail: "of instruction" },
  { icon: Users, value: `Max ${MAX_CLASS_SIZE}`, detail: "per class" },
]

export function Winter2027Promo() {
  return (
    <section id="top" aria-labelledby="winter-2027-promo-title" className="overflow-hidden bg-navy text-cream">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-6 px-4 py-6 sm:px-6 md:py-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-navy">
            <Snowflake size={14} aria-hidden="true" />
            Winter 2027 · Enrolling now
          </span>
          <div className="space-y-2">
            <h1 id="winter-2027-promo-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-cream sm:text-4xl lg:text-[2.7rem]">
              Winter SHSAT &amp; Digital SAT Prep
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-cream/85 sm:text-base">
              Expert-guided Math, ELA &amp; Reading/Writing preparation. Small in-person classes in Astoria, Queens.
            </p>
          </div>

          <ul className="grid min-w-0 grid-cols-3 gap-2 border-y border-gold/25 py-3 sm:gap-4">
            {STATS.map(({ icon: Icon, value, detail }) => (
              <li key={value} className="flex min-w-0 items-start gap-2">
                <Icon size={17} className="mt-0.5 hidden shrink-0 text-gold sm:block" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="block break-words text-sm font-extrabold leading-tight text-cream sm:text-base">{value}</span>
                  <span className="block text-xs leading-snug text-cream/70">{detail}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            <TrackedLink
              href="/enroll-2027"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_winter_promo", cta: "enroll_winter_2027" }}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-extrabold text-navy transition-colors hover:bg-gold-hover sm:flex-none sm:px-6 sm:text-base"
              style={{ color: "var(--navy)" }}
            >
              Enroll for Winter 2027
              <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_winter_promo" }}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-cream/70 px-4 py-2.5 text-center text-sm font-semibold text-cream hover:bg-cream/10 sm:flex-none"
            >
              Free Diagnostic
            </TrackedLink>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-gold/45 bg-cream px-5 py-5 text-navy shadow-lg sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-navy/70">Founding-family offer</p>
            <span className="rounded-full bg-gold/30 px-3 py-1 text-xs font-extrabold text-navy">Save {savingsPercent}%</span>
          </div>
          <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="text-4xl font-black leading-none tracking-tight sm:text-5xl">{dollars(founding)}</span>
            <span className="pb-1 text-sm text-navy/75">Regular <span className="line-through">{dollars(price.regular)}</span></span>
          </div>
          <p className="mt-2 text-sm font-semibold text-navy">SHSAT or Digital SAT · 12-week small-group program</p>
          <div className="mt-4 grid grid-cols-2 gap-2 border-y border-navy/15 py-3 text-sm">
            <div className="border-r border-navy/15 pr-2">
              <p className="font-extrabold">SHSAT Prep</p>
              <p className="text-xs text-navy/70">Math + ELA</p>
            </div>
            <div className="pl-2">
              <p className="font-extrabold">Digital SAT Prep</p>
              <p className="text-xs text-navy/70">Math + Reading/Writing</p>
            </div>
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-navy/85 sm:text-sm">
            <Check size={16} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
            First {FOUNDING_SEATS_PER_COHORT} fully paid students per class. Full-payment deadline: {deadline}, {DEADLINE_TIME_LABEL}.
          </p>
        </div>
      </div>

      <div className="border-t border-gold/30 bg-[#092744]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-5">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-gold">Also enrolling: December 5 Digital SAT Final Intensive</p>
            <p className="text-xs leading-relaxed text-cream/85 sm:text-sm">
              Rolling admission · Mon–Thu, 6–9 PM · $75 per 3-hour class · Astoria
            </p>
          </div>
          <TrackedLink
            href="/digital-sat-final-intensive-december-2026"
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_winter_promo", cta: "december_sat_intensive" }}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-md border border-gold px-4 text-sm font-extrabold text-gold hover:bg-gold/10"
          >
            View SAT Intensive
            <ArrowRight size={16} aria-hidden="true" />
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}

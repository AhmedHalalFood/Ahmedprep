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
  { icon: CalendarDays, value: `${weeks} weeks`, detail: `${meetings} meetings` },
  { icon: Clock, value: `${cohort.hours} hours`, detail: "of instruction" },
  { icon: Users, value: `Max ${MAX_CLASS_SIZE}`, detail: "students per class" },
]

export function Winter2027Promo() {
  return (
    <section aria-labelledby="winter-2027-promo-title" className="relative overflow-hidden bg-navy text-cream">
      <div className="min-w-0 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="container flex min-w-0 w-full max-w-full flex-col gap-6 py-8 md:py-10 lg:w-auto lg:max-w-none lg:py-12 lg:pl-[max(16px,calc((100vw-1180px)/2))] lg:pr-10">
          <div className="flex min-w-0 flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-navy">
              <Snowflake size={14} aria-hidden="true" />
              Enrolling now
            </span>
            <h2 id="winter-2027-promo-title" className="text-balance text-3xl font-extrabold leading-tight text-cream md:text-4xl">
              {"Winter 2027 SHSAT & Digital SAT Prep"}
            </h2>
            <p className="min-w-0 max-w-full text-pretty text-base leading-relaxed text-cream/85 md:text-lg">
              Small-group, in-person preparation in Astoria, Queens.
            </p>
          </div>

          <ul className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3 md:max-w-xl">
            {STATS.map(({ icon: Icon, value, detail }) => (
              <li key={value} className="flex min-w-0 flex-col gap-1 border-l-2 border-gold/60 pl-2 sm:pl-3">
                <Icon size={20} aria-hidden="true" className="text-gold" />
                <span className="break-words text-sm font-extrabold leading-tight text-cream sm:text-base md:text-lg">{value}</span>
                <span className="break-words text-xs leading-snug text-cream/75 md:text-sm">{detail}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 rounded-xl bg-cream p-5 text-ink shadow-lg md:max-w-xl md:flex-row md:items-center md:gap-6">
            <div className="flex shrink-0 flex-col">
              <span className="text-sm font-bold text-navy">Founding-family tuition</span>
              <span className="text-4xl font-extrabold leading-none text-navy md:text-5xl">{dollars(founding)}</span>
              <span className="mt-1 text-sm text-ink/75">
                Regular tuition <span className="line-through">{dollars(price.regular)}</span>
              </span>
            </div>
            <ul className="flex flex-col gap-2 border-t border-navy/15 pt-4 text-sm leading-snug md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <li className="flex gap-2">
                <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-blue" />
                Save {dollars(savings)} ({savingsPercent}% off)
              </li>
              <li className="flex gap-2">
                <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-blue" />
                First {FOUNDING_SEATS_PER_COHORT} fully paid students per class qualify
              </li>
              <li className="flex gap-2 font-bold text-navy">
                <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-blue" />
                Deadline: {deadline}, at {DEADLINE_TIME_LABEL}
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href="/enroll-2027"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_winter_promo", cta: "enroll_winter_2027" }}
              style={{ color: "var(--navy)" }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold px-6 text-base font-extrabold shadow-md transition-colors hover:bg-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              Enroll in Winter 2027
              <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
            </TrackedLink>
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_winter_promo" }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-cream/80 px-6 text-base font-bold text-cream transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              <CalendarDays size={18} aria-hidden="true" className="shrink-0" />
              Book Free Diagnostic
            </TrackedLink>
          </div>
        </div>

        <div className="relative hidden min-h-[580px] overflow-hidden border-l border-gold/25 bg-[#09243f] lg:flex lg:items-center lg:justify-center lg:px-10 lg:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 15%, rgba(236,190,67,.30), transparent 40%), linear-gradient(rgba(236,190,67,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(236,190,67,.12) 1px, transparent 1px)", backgroundSize: "auto, 44px 44px, 44px 44px" }} />
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-gold/20" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full border border-gold/20" />
          <div className="relative z-10 w-full max-w-md space-y-5">
            <div className="text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-gold">Your next chapter starts here</p>
              <p className="mt-3 text-3xl font-extrabold leading-tight text-cream">Two goals. One focused plan.</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">Choose the preparation that fits your student.</p>
            </div>
            <div className="rounded-2xl border border-gold/45 bg-[#12395c] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-navy">Winter 2027</span>
                <span className="text-xs font-semibold text-cream/75">Enrolling now</span>
              </div>
              <p className="text-2xl font-extrabold text-cream">SHSAT Prep</p>
              <p className="mt-1 text-sm text-cream/80">Math + ELA · Small-group instruction</p>
              <div className="my-4 h-px bg-gold/30" />
              <p className="text-2xl font-extrabold text-cream">Digital SAT Prep</p>
              <p className="mt-1 text-sm text-cream/80">Math + Reading & Writing</p>
              <div className="mt-5 flex items-center justify-between border-t border-gold/30 pt-4 text-sm font-semibold text-cream">
                <span>12 weeks · 72 hours</span>
                <span className="text-gold">Max 12 per class</span>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-cream/80">Astoria, Queens · In-person classes</p>
          </div>
        </div>
      </div>
    </section>
  )
}

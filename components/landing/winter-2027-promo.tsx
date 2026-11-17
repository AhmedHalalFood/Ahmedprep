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
        <TrackedLink
          href="/programs-2027"
          event={EVENTS.programCtaClick}
          eventProps={{ location: "home_winter_promo", cta: "explore_winter_programs" }}
          aria-label="Explore Winter 2027 SHSAT and Digital SAT class schedules"
          className="flex min-w-0 flex-col gap-4 rounded-lg transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-navy">
            <Snowflake size={14} aria-hidden="true" />
            Winter 2027 · Enrolling now
          </span>
          <div className="space-y-2">
            <h1 id="winter-2027-promo-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-cream sm:text-4xl lg:text-[2.7rem]">
              Winter SHSAT &amp; Digital SAT Prep
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-cream/85 sm:text-base">
              Personally taught by AhmedPrep’s founder. Focused SHSAT and Digital SAT preparation in small groups in Astoria, Queens.
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


        </TrackedLink>

        <div className="relative min-w-0 rounded-xl border border-gold/45 bg-cream px-5 py-4 text-navy shadow-lg sm:px-5">
          <TrackedLink
            href="/enroll-2027"
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_winter_promo", cta: "founding_offer_details" }}
            aria-label="Review Winter 2027 founding-family tuition and enrollment"
            className="absolute inset-0 z-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <span className="sr-only">Review the Winter 2027 founding-family offer and enrollment</span>
          </TrackedLink>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-extrabold text-navy">Founding-family tuition</p>
            <span className="rounded-full border border-[#D9A42B] bg-[#F5CC59] px-3 py-1.5 text-xs font-black text-[#102F51] shadow-sm">
              Save {dollars(savings)} ({savingsPercent}%)
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="text-4xl font-black leading-none tracking-tight sm:text-5xl">{dollars(founding)}</span>
            <span className="pb-1 text-sm text-navy/75">Regular <span className="line-through">{dollars(price.regular)}</span></span>
          </div>
          <p className="mt-2 text-sm font-semibold text-navy">For SHSAT or Digital SAT · 72 hours of instruction</p>
          <div className="mt-3 grid grid-cols-2 gap-2 border-y border-navy/15 py-2 text-sm">
            <div className="rounded-lg border border-[#B7D5E7] bg-[#E8F2FA] px-3 py-2">
              <p className="font-extrabold text-[#174D7C]">SHSAT Prep</p>
              <p className="text-xs font-medium text-[#375C79]">Math + ELA</p>
            </div>
            <div className="rounded-lg border border-[#A9D5C5] bg-[#E6F4ED] px-3 py-2">
              <p className="font-extrabold text-[#086347]">Digital SAT Prep</p>
              <p className="text-xs font-medium text-[#275C4B]">Math + Reading/Writing</p>
            </div>
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs font-medium leading-snug text-navy sm:text-sm">
            <Check size={16} className="mt-0.5 shrink-0 text-[#087850]" aria-hidden="true" />
            <span>
              For the first {FOUNDING_SEATS_PER_COHORT} fully paid students per class.
              <strong className="block font-extrabold"> Pay in full by {deadline}, {DEADLINE_TIME_LABEL}.</strong>
            </span>
          </p>
          <div className="relative z-10 mt-3 flex flex-col gap-2 border-t border-navy/15 pt-3 sm:flex-row">
            <TrackedLink
              href="/enroll-2027"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_winter_promo", cta: "enroll_winter_2027" }}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-3 py-2 text-center text-sm font-extrabold transition-colors hover:bg-gold-hover"
              style={{ color: "var(--navy)" }}
            >
              Enroll for Winter 2027
              <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_winter_promo" }}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-[#153D64] bg-[#153D64] px-3 py-2 text-center text-sm font-extrabold transition-colors hover:bg-[#285781] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153D64]"
              style={{ color: "#FFFFFF" }}
            >
              <span style={{ color: "#FFFFFF" }}>Free Diagnostic</span>
            </TrackedLink>
          </div>
        </div>
      </div>


    </section>
  )
}

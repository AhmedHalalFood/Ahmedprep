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
    <section
      id="top"
      aria-labelledby="winter-2027-promo-title"
      className="overflow-hidden border-b border-[#C5DCEB] bg-gradient-to-br from-[#DDECF6] via-[#EEF6FB] to-[#F8F7F1] text-navy"
    >
      <div className="mx-auto grid w-full max-w-[1200px] overflow-hidden rounded-2xl border border-[#B9D6E9] bg-[#F9FCFE] shadow-sm my-5 sm:my-7 lg:grid-cols-2">
        <TrackedLink
          href="/programs-2027"
          event={EVENTS.programCtaClick}
          eventProps={{ location: "home_winter_promo", cta: "explore_winter_programs" }}
          aria-label="Explore Winter 2027 SHSAT and Digital SAT classes, schedules and tuition"
          className="group flex min-w-0 flex-col justify-between gap-5 bg-[#F4FAFE] px-5 py-5 text-navy transition-colors hover:bg-[#EAF5FC] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#16476A] sm:px-7 sm:py-6"
        >
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#A6CDE4] bg-[#D8EBF7] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#16476A]">
              <Snowflake size={15} aria-hidden="true" />
              Winter 2027 · Enrolling now
            </span>
            <div className="space-y-3">
              <h1
                id="winter-2027-promo-title"
                className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-[2.5rem]"
              >
                Winter SHSAT &amp; Digital SAT Prep
              </h1>
              <p className="text-pretty text-base leading-relaxed text-[#37536A]">
                Personally taught by AhmedPrep’s founder. Focused SHSAT and Digital SAT preparation in small groups in Astoria, Queens.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-extrabold text-navy">Focused instruction. Personal attention.</p>
            <ul className="grid min-w-0 grid-cols-3 gap-2 border-t border-[#C8DBE8] pt-4 sm:gap-4">
              {STATS.map(({ icon: Icon, value, detail }) => (
                <li key={value} className="flex min-w-0 items-start gap-2">
                  <Icon size={17} className="mt-0.5 hidden shrink-0 text-[#2171A2] sm:block" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="block break-words text-sm font-extrabold leading-tight text-navy sm:text-base">{value}</span>
                    <span className="block text-xs leading-snug text-[#526E84]">{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TrackedLink>

        <div className="flex min-w-0 flex-col border-t border-[#B9D6E9] bg-[#FFFCF5] px-5 py-5 text-navy sm:px-7 sm:py-6 lg:border-l lg:border-t-0">
          <TrackedLink
            href="/enroll-2027"
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_winter_promo", cta: "founding_offer_details" }}
            aria-label="Explore Winter 2027 founding-family tuition and request enrollment"
            className="group block rounded-lg p-1 -m-1 transition-colors hover:bg-[#FFF4D9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16476A]"
          >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#526E84]">Founding-family offer</p>
            <span className="rounded-full bg-[#FBE7B4] px-3 py-1 text-xs font-extrabold text-[#805506]">Save {savingsPercent}%</span>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="text-4xl font-black leading-none tracking-tight text-navy sm:text-5xl">{dollars(founding)}</span>
            <span className="pb-1 text-sm text-[#546B7B]">Regular <span className="line-through">{dollars(price.regular)}</span></span>
          </div>
          <p className="mt-2 text-sm font-semibold text-navy">SHSAT or Digital SAT · 12-week small-group program</p>
          <div className="mt-4 grid grid-cols-2 gap-2 border-y border-[#E9DDC8] py-3 text-sm">
            <div className="border-r border-[#E9DDC8] pr-2">
              <p className="font-extrabold text-[#194D79]">SHSAT Prep</p>
              <p className="text-xs text-[#526E84]">Math + ELA</p>
            </div>
            <div className="pl-2">
              <p className="font-extrabold text-[#146B60]">Digital SAT Prep</p>
              <p className="text-xs text-[#526E84]">Math + Reading/Writing</p>
            </div>
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#37536A] sm:text-sm">
            <Check size={17} className="mt-0.5 shrink-0 text-[#168064]" aria-hidden="true" />
            First {FOUNDING_SEATS_PER_COHORT} fully paid students per class. Full-payment deadline: {deadline}, {DEADLINE_TIME_LABEL}.
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#16476A] underline underline-offset-4 group-hover:text-[#0F5C8F]">
            See offer and enrollment details <ArrowRight size={14} aria-hidden="true" />
          </span>
          </TrackedLink>
          <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
            <TrackedLink
              href="/enroll-2027"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_winter_promo", cta: "enroll_winter_2027" }}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-3 py-2.5 text-center text-sm font-extrabold shadow-sm transition-colors hover:bg-gold-hover"
              style={{ color: "#102F51" }}
            >
              Enroll for Winter 2027
              <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_winter_promo" }}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg border border-[#A7BFCE] bg-white px-3 py-2.5 text-center text-sm font-bold text-navy transition-colors hover:bg-[#EAF3F9]"
              style={{ color: "#102F51" }}
            >
              Free Diagnostic
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  )
}

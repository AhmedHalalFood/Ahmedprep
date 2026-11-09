import { ArrowRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import {
  EARLY_DAYS_BEFORE_SPRING_SUMMER,
  FOUNDING_SEATS_PER_COHORT,
  TERMS_2027,
  dollars,
  priceFor,
} from "@/lib/cohorts-2027"

const termCohorts = (id: string) => TERMS_2027.find((t) => t.id === id)?.cohorts ?? []
const [winterCohort] = termCohorts("winter")
const summerByHours = [...termCohorts("summer")].sort((a, b) => a.hours - b.hours)
const summerWeekend = summerByHours[0]
const summerIntensive = summerByHours.at(-1)!

const TUITION_ROWS = [
  {
    name: "Winter & Spring 2027",
    detail: `${winterCohort.hours} scheduled hours · weekday or weekend`,
    price: dollars(priceFor(winterCohort).regular),
  },
  {
    name: "Summer 2027 Weekend",
    detail: `${summerWeekend.hours} scheduled hours · Saturday & Sunday`,
    price: dollars(priceFor(summerWeekend).regular),
  },
  {
    name: "Summer 2027 Intensive",
    detail: `${summerIntensive.hours} scheduled hours · weekday intensive`,
    price: dollars(priceFor(summerIntensive).regular),
  },
] as const

export function ProgramsPreview() {
  return (
    <section id="programs-pricing" aria-labelledby="programs-pricing-title" className="scroll-mt-4 bg-white py-12 md:py-16">
      <div className="container grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <p className="eyebrow blue">Programs &amp; Pricing</p>
          <h2 id="programs-pricing-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Winter, Spring &amp; Summer 2027
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">
            SHSAT and Digital SAT cohorts in every season, at $20 per scheduled class hour. Exact dates, schedules, deadlines,
            and enrollment links for every cohort are on the programs page.
          </p>
          <TrackedLink
            href="/programs-2027"
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_programs_preview", cta: "compare_all" }}
            className="button button-navy-outline button-lg min-h-12"
          >
            Compare All Programs <ArrowRight size={18} aria-hidden="true" />
          </TrackedLink>
        </div>
        <div className="flex flex-col gap-4">
          <dl className="flex flex-col border border-line">
            {TUITION_ROWS.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between gap-4 border-b border-line bg-warm px-5 py-4 last:border-b-0"
              >
                <dt className="flex flex-col gap-1">
                  <span className="font-extrabold text-navy">{row.name}</span>
                  <span className="text-sm leading-relaxed text-subtle">{row.detail}</span>
                </dt>
                <dd className="flex flex-col items-end">
                  <span className="text-2xl font-extrabold text-navy">{row.price}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Regular tuition</span>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink">
            <li>
              <strong className="text-navy">Winter only:</strong> founding-family tuition for the first{" "}
              {FOUNDING_SEATS_PER_COHORT} fully paid enrollments per cohort.
            </li>
            <li>
              <strong className="text-navy">Spring &amp; Summer:</strong> early full-payment discount when paid in full{" "}
              {EARLY_DAYS_BEFORE_SPRING_SUMMER} days before the cohort starts.
            </li>
            <li className="text-subtle">Discounts cannot be combined. Cohort-specific deadlines are listed on the programs page.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

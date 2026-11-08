import { ArrowRight, ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { MAX_CLASS_SIZE, TERMS_2027, formatRange, termSummary } from "@/lib/cohorts-2027"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"

const T = ENROLLMENT_2027.tuition

export function ProgramsPreview() {
  return (
    <section id="programs-pricing" aria-labelledby="programs-pricing-title" className="scroll-mt-4 bg-white py-12 md:py-16">
      <div className="container flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="eyebrow blue">Programs &amp; Pricing</p>
            <h2 id="programs-pricing-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              2027 SHSAT &amp; Digital SAT programs
            </h2>
            <p className="text-pretty leading-relaxed text-subtle">
              Small groups in Astoria, maximum {MAX_CLASS_SIZE} students per cohort. $20 per scheduled instructional hour; regular tuition
              from {T.regular.total}. Full schedules, deadlines, and enrollment links for all {TERMS_2027.reduce((n, t) => n + t.cohorts.length, 0)} cohorts
              are on the programs page.
            </p>
          </div>
          <TrackedLink
            href="/programs-2027"
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_programs_preview" }}
            className="text-link"
          >
            Compare all programs <ArrowUpRight size={15} aria-hidden="true" />
          </TrackedLink>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {TERMS_2027.map((term) => {
            const summary = termSummary(term)
            return (
              <li key={term.id} className="flex flex-col gap-4 border border-line border-t-4 border-t-gold bg-warm p-5 md:p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-extrabold text-navy">{term.name}</h3>
                  <p className="font-semibold text-ink">{formatRange(summary.startIso, summary.endIso)}</p>
                  <p className="text-sm leading-relaxed text-subtle">
                    {term.cohorts.length} cohorts · SHSAT &amp; Digital SAT · {summary.hoursLabel}
                  </p>
                </div>
                <TrackedLink
                  href={`/programs-2027#${term.id}`}
                  event={EVENTS.programCtaClick}
                  eventProps={{ location: "home_programs_preview", term: term.id }}
                  className="button button-navy-outline mt-auto min-h-12 justify-between"
                  aria-label={`View ${term.name} programs`}
                >
                  View Programs <ArrowRight size={16} aria-hidden="true" />
                </TrackedLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

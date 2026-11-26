import Link from "next/link"
import { ArrowRight, CalendarDays, Clock } from "lucide-react"
import { Section } from "@/components/landing/primitives"
import {
  MAX_CLASS_SIZE,
  TERMS_2027,
  cohortInquiryHref,
  cohortSchedule,
  cohortSpan,
  dollars,
  formatDate,
  tuitionOptionsFor,
  winterFoundingOfferActive,
  type ProgramId,
} from "@/lib/cohorts-2027"
import { programsHref } from "@/lib/program-finder"
import { activeTerms } from "@/lib/program-retirement"

// Seasonal accents are intentionally subtle so program schedules and tuition remain readable.
const SEASON_CARD_TONE = {
  winter: {
    header: "border-blue-200 bg-blue-100 text-blue-900",
    card: "border-blue-200 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-50",
    link: "text-blue-800",
  },
  spring: {
    header: "border-emerald-200 bg-emerald-100 text-emerald-900",
    card: "border-emerald-200 bg-emerald-50/50 hover:border-emerald-500 hover:bg-emerald-50",
    link: "text-emerald-800",
  },
  summer: {
    header: "border-amber-200 bg-amber-100 text-amber-900",
    card: "border-amber-200 bg-amber-50/50 hover:border-amber-500 hover:bg-amber-50",
    link: "text-amber-800",
  },
  fall: {header: "border-violet-200 bg-violet-100 text-violet-900",card:"border-violet-200 bg-violet-50/50 hover:border-violet-500",link:"text-violet-800"},
} as const

export function ProgramTuition({ program, note }: { program: ProgramId; note?: string }) {
  const terms = activeTerms(TERMS_2027).filter((term) => term.cohorts.some((cohort) => cohort.program === program))
  if (terms.length === 0) return null
  return (
    <Section
      id="schedules-tuition"
      eyebrow="2027 schedules and tuition"
      title={`${program} cohorts for Winter, Spring, Summer, and Fall 2027`}
      intro={`Every cohort has a maximum of ${MAX_CLASS_SIZE} students. ${program === "SHSAT" ? "All Winter, Spring, Summer, and Fall SHSAT preparation cohorts are held IN PERSON at our Astoria, Queens classroom. Free Sunday SHSAT Zoom sessions are a separate, online community offering." : "Winter and Spring weekday Digital SAT meet live online; weekend and intensive Digital SAT cohorts meet in person at our Astoria classroom."} ${winterFoundingOfferActive() ? "Winter founding-family tuition (25% off) is for the first five fully paid enrollments per class by December 12, 2026, subject to available seats." : "Winter founding-family discount deadline has passed; regular tuition applies."} Spring, Summer and Fall offer a 10% early-payment discount when paid in full at least 30 calendar days before the cohort begins. Only one discount applies. All deadlines end at 11:59 PM ET.`}
    >
      {note ? <p className="-mt-4 mb-8 max-w-2xl font-bold text-navy">{note}</p> : null}
      <div className="flex flex-col gap-10">
        {terms.map((term) => {
          const cohorts = term.cohorts.filter((c) => c.program === program)
          const tone = SEASON_CARD_TONE[term.id]
          return (
            <div key={term.id} id={`${program === "SHSAT" ? "shsat" : "dsat"}-${term.id}`} className="scroll-mt-4">
              <div className={`flex flex-wrap items-baseline justify-between gap-2 rounded-lg border px-4 py-3 ${tone.header}`}>
                <h3 className="text-2xl font-extrabold">{term.name}</h3>
                <Link
                  href={programsHref({ season: term.id })}
                  className="text-sm font-semibold text-subtle underline underline-offset-4 hover:text-brand"
                >
                  Full {term.name} calendar, closures, and makeups
                </Link>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {cohorts.map((c) => {
                  const span = cohortSpan(c)
                  const options = tuitionOptionsFor(c)
                  return (
                    <article key={c.id} className={`group relative flex cursor-pointer flex-col gap-4 rounded-lg border p-5 transition-colors md:p-6 ${tone.card}`}>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-extrabold text-navy">
                          {program} {c.label}
                        </h4>
                        <p className="flex items-center gap-2 text-sm text-ink">
                          <Clock size={15} aria-hidden="true" className="shrink-0 text-brand" />
                          {cohortSchedule(c)}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-ink">
                          <CalendarDays size={15} aria-hidden="true" className="shrink-0 text-brand" />
                          {formatDate(span.startIso)} – {formatDate(span.endIso)}
                        </p>
                        <p className="text-sm text-subtle">
                          {c.sessions} classes · {c.hours} instructional hours{c.breakMinutes ? ` · ${c.breakMinutes}-minute break per meeting` : ""}
                        </p>
                      </div>
                      <dl className="flex flex-col border-t border-line">
                        {options.map((o) => (
                          <div key={o.id} className="flex flex-col gap-0.5 border-b border-line py-3">
                            <div className="flex items-baseline justify-between gap-4">
                              <dt className="text-sm font-bold text-navy">{o.label}</dt>
                              <dd className="text-lg font-extrabold text-navy">{dollars(o.amount)}</dd>
                            </div>
                            <dd className="text-xs leading-relaxed text-subtle">{o.condition}</dd>
                          </div>
                        ))}
                      </dl>
                      <Link
                        href={cohortInquiryHref(c)}
                        className={`mt-auto inline-flex min-h-11 items-center gap-1.5 self-start font-bold underline-offset-4 after:absolute after:inset-0 after:rounded-lg group-hover:underline focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-navy ${tone.link}`}
                      >
                        Send an enrollment inquiry <ArrowRight size={16} aria-hidden="true" />
                        <span className="sr-only">
                          {" "}
                          for {term.name} {program} {c.label}
                        </span>
                      </Link>
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

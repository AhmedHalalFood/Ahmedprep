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
  type ProgramId,
} from "@/lib/cohorts-2027"

export function ProgramTuition({ program, note }: { program: ProgramId; note?: string }) {
  return (
    <Section
      id="schedules-tuition"
      eyebrow="2027 schedules and tuition"
      title={`${program} cohorts for Winter, Spring, and Summer 2027`}
      intro={`Every cohort meets in person at our Astoria classroom with a maximum of ${MAX_CLASS_SIZE} students. Founding-family tuition is offered for Winter 2027 only; Spring and Summer offer an early full-payment discount. Discounts do not combine. All deadlines end at 11:59:59 PM ET.`}
    >
      {note ? <p className="-mt-4 mb-8 max-w-2xl font-bold text-navy">{note}</p> : null}
      <div className="flex flex-col gap-10">
        {TERMS_2027.map((term) => {
          const cohorts = term.cohorts.filter((c) => c.program === program)
          return (
            <div key={term.id} id={`${program === "SHSAT" ? "shsat" : "dsat"}-${term.id}`} className="scroll-mt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-navy pb-2">
                <h3 className="text-2xl font-extrabold text-navy">{term.name}</h3>
                <Link
                  href={`/programs-2027#${term.id}`}
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
                    <article key={c.id} className="flex flex-col gap-4 border border-line bg-background p-5 md:p-6">
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
                          {c.sessions} three-hour classes · {c.hours} scheduled hours
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
                        className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start font-bold text-brand underline-offset-4 hover:underline"
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

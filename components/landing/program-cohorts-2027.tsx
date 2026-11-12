import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/landing/primitives"
import {
  HOURLY_RATE,
  MAX_CLASS_SIZE,
  TERMS_2027,
  cohortInquiryHref,
  cohortSchedule,
  cohortSpan,
  deadlinesFor,
  dollars,
  formatShortDate,
  priceFor,
  type ProgramId,
} from "@/lib/cohorts-2027"
import { programsHref } from "@/lib/program-finder"
import { SITE_URL } from "@/lib/business"

/** Schema.org CourseInstance entries for every 2027 cohort of one program. */
export function courseInstances2027(program: ProgramId) {
  return TERMS_2027.flatMap((term) =>
    term.cohorts
      .filter((c) => c.program === program)
      .map((c) => {
        const span = cohortSpan(c)
        return {
          "@type": "CourseInstance",
          name: `${term.name} ${c.program} ${c.label}`,
          courseMode: "Onsite",
          startDate: span.startIso,
          endDate: span.endIso,
          courseSchedule: { "@type": "Schedule", description: cohortSchedule(c) },
          location: { "@type": "Place", name: "AhmedPrep, Astoria, Queens" },
          offers: {
            "@type": "Offer",
            price: priceFor(c).regular,
            priceCurrency: "USD",
            url: `${SITE_URL}${cohortInquiryHref(c)}`,
          },
        }
      }),
  )
}

export function ProgramCohorts2027({ program }: { program: ProgramId }) {
  return (
    <Section
      id="classes-2027"
      tone="warm"
      eyebrow="2027 small-group classes"
      title={`${program} classes in Winter, Spring, and Summer 2027`}
    >
      <p className="max-w-2xl text-pretty leading-relaxed text-subtle">
        In person in Astoria, at most {MAX_CLASS_SIZE} students per class, {dollars(HOURLY_RATE)} per scheduled instructional hour.
        Choose a cohort to request enrollment information with it already selected.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {TERMS_2027.map((term) => (
          <div key={term.id} className="flex flex-col gap-3 border border-line bg-white p-6">
            <h3 className="text-xl font-extrabold text-navy">{term.name}</h3>
            <ul className="flex flex-col border-t border-line">
              {term.cohorts
                .filter((c) => c.program === program)
                .map((c) => {
                  const span = cohortSpan(c)
                  const price = priceFor(c)
                  const d = deadlinesFor(c)
                  return (
                    <li key={c.id} className="flex flex-col gap-1 border-b border-line py-4">
                      <span className="font-bold text-navy">{c.label}</span>
                      <span className="text-sm text-subtle">{cohortSchedule(c)}</span>
                      <span className="text-sm text-subtle">
                        {formatShortDate(span.startIso)} – {formatShortDate(span.endIso)} · {c.sessions} classes · {c.hours} hours
                      </span>
                      <span className="text-sm text-ink">
                        <span className="font-bold">{dollars(price.regular)}</span> regular
                        {price.early !== null && d.earlyIso ? ` · ${dollars(price.early)} early payment by ${formatShortDate(d.earlyIso)}` : null}
                        {price.founding !== null && d.foundingIso
                          ? ` · ${dollars(price.founding)} founding-family by ${formatShortDate(d.foundingIso)}`
                          : null}
                      </span>
                      <Link
                        href={cohortInquiryHref(c)}
                        className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-bold text-brand underline-offset-4 hover:underline"
                      >
                        Request this class <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="sr-only">
                          : {term.name} {c.program} {c.label}
                        </span>
                      </Link>
                    </li>
                  )
                })}
            </ul>
            <Link
              href={programsHref({ season: term.id })}
              className="mt-auto inline-flex min-h-11 items-center text-sm font-semibold text-subtle underline underline-offset-4"
            >
              Full {term.name} calendar and closures
            </Link>
          </div>
        ))}
      </div>
    </Section>
  )
}

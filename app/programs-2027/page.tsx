import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ClassFinder } from "@/components/programs/class-finder"
import { FinderHashRestore } from "@/components/programs/finder-hash-restore"
import {
  DEADLINE_TIME_LABEL,
  EARLY_DAYS_BEFORE_SPRING_SUMMER,
  FOUNDING_SEATS_PER_COHORT,
  MAX_CLASS_SIZE,
  TERMS_2027,
  WINTER_FOUNDING_DEADLINE_ISO,
  cohortSchedule,
  cohortSpan,
  dollars,
  formatDate,
  formatShortDate,
  priceFor,
} from "@/lib/cohorts-2027"
import { isCohortFull } from "@/lib/cohort-capacity"
import { cohortHref, parseFinder } from "@/lib/program-finder"
import { getProgram } from "@/lib/programs"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "2027 Programs & Pricing: SHSAT and Digital SAT Classes | AhmedPrep",
  description:
    "AhmedPrep's Winter, Spring, and Summer 2027 SHSAT and Digital SAT cohorts in Astoria: class schedules, dates, hours, tuition, discount deadlines, and enrollment.",
  alternates: { canonical: absoluteUrl("/programs-2027") },
}

const SECONDARY_OPTIONS = (["free_diagnostic", "free_sunday", "private_tutoring"] as const).map((id) => getProgram(id)!)

export default async function Programs2027Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const previewFull = params.previewFull === "1"
  const state = parseFinder(params)
  return (
    <div className="bg-cream">
      <section aria-labelledby="programs-2027-title" className="border-b border-line px-5 pb-8 pt-10 sm:pt-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          <p className="eyebrow blue">Programs &amp; Pricing</p>
          <h1 id="programs-2027-title" className="text-balance font-serif text-3xl font-bold leading-tight text-navy sm:text-5xl">
            2027 SHSAT and Digital SAT classes
          </h1>
          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-subtle">
            Choose when to start, SHSAT or Digital SAT, and a schedule to see one class&apos;s dates and tuition. Small groups in Astoria, maximum {MAX_CLASS_SIZE}{" "}
            students. All times are Eastern Time.
          </p>
        </div>
      </section>

      <FinderHashRestore season={state.season} program={state.program} />
      <ClassFinder state={state} full={(id) => isCohortFull(id, { previewFull })} />

      <section aria-labelledby="tuition-rules-title" className="px-5 pb-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-5">
            <h2 id="tuition-rules-title" className="text-lg font-extrabold text-navy">
              How tuition discounts work
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-ink">
              Winter 2027: founding-family tuition (25% off) is available only to the first {FOUNDING_SEATS_PER_COHORT} fully paid enrollments
              per cohort, paid in full by {formatDate(WINTER_FOUNDING_DEADLINE_ISO)} at {DEADLINE_TIME_LABEL}, subject to seat availability.
              Winter has no separate early-payment tier. Spring and Summer 2027: early-payment tuition (10% off) requires full payment at least{" "}
              {EARLY_DAYS_BEFORE_SPRING_SUMMER} calendar days before the selected cohort begins; there is no founding-family discount. Only one
              discount applies.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper">
            <h2 className="flex min-h-14 items-center px-5 text-lg font-extrabold text-navy">Compare all 2027 classes</h2>
            <div className="flex flex-col gap-6 border-t border-line px-5 pb-5 pt-4">
              {TERMS_2027.map((term) => (
                <div key={term.id} className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <caption className="pb-2 text-left font-extrabold text-navy">{term.name}</caption>
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-wider text-subtle">
                        <th scope="col" className="py-2 pr-3 font-bold">Class</th>
                        <th scope="col" className="py-2 pr-3 font-bold">Schedule</th>
                        <th scope="col" className="py-2 pr-3 font-bold">Dates</th>
                        <th scope="col" className="py-2 font-bold">Regular tuition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {term.cohorts.map((c) => {
                        const span = cohortSpan(c)
                        return (
                          <tr key={c.id} className="border-b border-line last:border-b-0">
                            <th scope="row" className="py-2 pr-3 font-bold text-navy">
                              <Link href={cohortHref(c)} className="underline underline-offset-4">
                                {c.program} · {c.label}
                              </Link>
                            </th>
                            <td className="py-2 pr-3 text-ink">{cohortSchedule(c)}</td>
                            <td className="py-2 pr-3 text-ink">
                              {formatShortDate(span.startIso)} – {formatShortDate(span.endIso)}
                            </td>
                            <td className="py-2 font-bold text-navy">
                              {dollars(priceFor(c).regular)} · {c.hours} hrs
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="more-options-title" id="more-options" className="scroll-mt-28 border-t border-line px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <h2 id="more-options-title" className="text-xl font-extrabold text-navy">
            Other ways to work with AhmedPrep
          </h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {SECONDARY_OPTIONS.map((option) => (
              <li key={option.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4">
                <h3 className="font-extrabold text-navy">{option.name}</h3>
                <p className="text-sm leading-relaxed text-subtle">{option.summary}</p>
                <p className="text-sm font-semibold text-ink">{option.price ?? "Priced separately — contact AhmedPrep for a quote"}</p>
                <Link href={option.cta.href} className="mt-auto inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand underline">
                  {option.cta.label} <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pb-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5">
            <h2 className="text-xl font-extrabold text-navy">Holiday makeups and free Sunday Zoom</h2>
            <p className="text-sm text-ink">Winter and Spring makeup instruction is scheduled on select Saturdays from 5:30–8:30 PM. The summer weekend makeup is a daytime session on August 28. Sunday, August 29 is the required final instructional session for both summer intensive cohorts (SHSAT 10 AM–1 PM ET; Digital SAT 2–5 PM ET). Exact makeup assignments remain subject to final curriculum sequencing and calendar verification before publication.</p>
            <p className="text-sm text-ink">Free Sunday Zoom classes continue every other Sunday in Winter and Spring. Free SHSAT preparation (6:00–6:45 PM ET): focused Math and ELA practice. Free Digital SAT preparation (7:00–7:45 PM ET): focused Math and Reading/Writing practice. A separate RSVP is required for each program. The last session before summer break is June 27, 2027; there are no free Sunday sessions in July or August 2027, and Fall 2027 restart dates have not been announced.</p>
            <p className="text-sm text-ink">Summer break begins August 30, 2027. Digital SAT students bring their own laptops.</p>
          </div>
          <p className="text-sm text-subtle">Submitting an inquiry does not reserve a seat or a discounted tuition rate. Payment, cancellation, and refund terms will be provided before enrollment is finalized.</p>
        </div>
      </section>
    </div>
  )
}

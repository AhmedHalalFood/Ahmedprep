import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import {
  DEADLINE_TIME_LABEL,
  EARLY_DAYS_AFTER_FOUNDING,
  EARLY_DAYS_BEFORE_SPRING_SUMMER,
  FOUNDING_SEATS_PER_COHORT,
  MAX_CLASS_SIZE,
  TERMS_2027,
  cohortSchedule,
  cohortSpan,
  dollars,
  formatLongDate,
  formatShortDate,
  termSummary,
  tuitionOptionsFor,
  type Cohort,
  type ProgramId,
} from "@/lib/cohorts-2027"
import { WAITLIST_DISCLAIMER, enrollActionFor, isCohortFull } from "@/lib/cohort-capacity"
import { getProgram } from "@/lib/programs"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "2027 Programs & Pricing: SHSAT and Digital SAT Classes | AhmedPrep",
  description:
    "AhmedPrep's Winter, Spring, and Summer 2027 SHSAT and Digital SAT cohorts in Astoria: class schedules, dates, hours, tuition, discount deadlines, and enrollment.",
  alternates: { canonical: absoluteUrl("/programs-2027") },
}

const PROGRAM_PAGE: Record<ProgramId, string> = { SHSAT: "/shsat", "Digital SAT": "/digital-sat" }

const SECONDARY_OPTIONS = (["free_diagnostic", "free_sunday", "private_tutoring"] as const).map((id) => getProgram(id)!)

export default async function Programs2027Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const previewFull = (await searchParams).previewFull === "1"
  return (
    <div className="bg-warm">
      <section aria-labelledby="programs-2027-title" className="px-5 pb-10 pt-10 sm:pt-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow blue">Programs &amp; Pricing</p>
            <h1 id="programs-2027-title" className="text-balance text-3xl font-extrabold leading-tight text-navy sm:text-5xl">
              2027 SHSAT and Digital SAT classes
            </h1>
            <p className="max-w-3xl text-pretty text-lg leading-relaxed text-subtle">
              Choose a season to see each cohort&apos;s schedule, tuition, and deadlines. Small groups in Astoria, maximum {MAX_CLASS_SIZE}{" "}
              students. All times are Eastern Time.
            </p>
          </div>
          <nav aria-label="Choose a 2027 season">
            <ul className="grid gap-3 sm:grid-cols-3">
              {TERMS_2027.map((term) => {
                const s = termSummary(term)
                return (
                  <li key={term.id}>
                    <a
                      href={`#${term.id}`}
                      className="group flex h-full flex-col gap-2 border-2 border-navy bg-white p-5 transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-2xl font-extrabold uppercase tracking-wide text-navy group-hover:text-gold">{term.name}</span>
                        <ArrowDown size={20} aria-hidden="true" className="shrink-0 text-brand group-hover:text-gold" />
                      </span>
                      <span className="text-sm font-semibold text-ink group-hover:text-white">
                        {formatShortDate(s.startIso)} – {formatShortDate(s.endIso)}
                      </span>
                      <span className="text-sm text-subtle group-hover:text-white">
                        {s.hoursLabel} · {s.regularLabel} regular tuition
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          <p className="max-w-3xl text-sm leading-relaxed text-subtle">
            Winter 2027 only: founding-family tuition is limited to the first {FOUNDING_SEATS_PER_COHORT} fully paid enrollments per cohort, paid
            by the founding-family deadline, while seats remain. Early-payment tuition (10% off) requires full payment by the cohort&apos;s
            early-payment deadline: for Winter, {EARLY_DAYS_AFTER_FOUNDING} days after the founding-family deadline; for Spring and Summer,{" "}
            {EARLY_DAYS_BEFORE_SPRING_SUMMER} days before the first class. All deadlines end at {DEADLINE_TIME_LABEL}. Discounts do not stack.
          </p>
        </div>
      </section>

      {TERMS_2027.map((term) => (
        <section key={term.id} id={term.id} aria-labelledby={`${term.id}-title`} className="scroll-mt-28 border-t border-line px-5 py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-5">
            <h2 id={`${term.id}-title`} className="text-2xl font-extrabold text-navy sm:text-3xl">
              {term.name}
            </h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {term.cohorts.map((cohort) => (
                <CohortCard key={cohort.id} cohort={cohort} termName={term.name} full={isCohortFull(cohort.id, { previewFull })} />
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section aria-labelledby="more-options-title" id="more-options" className="scroll-mt-28 border-t border-line px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <h2 id="more-options-title" className="text-xl font-extrabold text-navy">
            Other ways to work with AhmedPrep
          </h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {SECONDARY_OPTIONS.map((option) => (
              <li key={option.id} className="flex flex-col gap-2 border border-line bg-white p-4">
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
          <div className="flex flex-col gap-3 border-l-4 border-brand bg-white p-5">
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

function CohortCard({ cohort, termName, full }: { cohort: Cohort; termName: string; full: boolean }) {
  const span = cohortSpan(cohort)
  const options = tuitionOptionsFor(cohort)
  const action = enrollActionFor(cohort, full)
  return (
    <li className="flex flex-col gap-3 border border-line border-t-4 border-t-brand bg-white p-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-extrabold text-navy">
          <Link href={PROGRAM_PAGE[cohort.program]} className="underline-offset-4 hover:underline">
            {cohort.program}
          </Link>{" "}
          · {cohort.label}
        </h3>
        <p className="font-semibold text-ink">{cohortSchedule(cohort)}</p>
        <p className="text-sm text-subtle">
          {formatLongDate(span.startIso)} – {formatLongDate(span.endIso)}
        </p>
        <p className="text-sm text-ink">
          {cohort.sessions} classes · {cohort.hours} instructional hours · Max {MAX_CLASS_SIZE} students
        </p>
      </div>
      <dl className="flex flex-col border-t border-line text-sm">
        {[...options].reverse().map((option) => (
          <div key={option.id} className="flex items-baseline justify-between gap-3 border-b border-line py-2">
            <dt className="flex flex-col text-ink">
              {option.label}
              {option.id !== "regular" ? <span className="text-xs text-subtle">{option.condition}</span> : null}
            </dt>
            <dd className="font-extrabold text-navy">{dollars(option.amount)}</dd>
          </div>
        ))}
      </dl>
      {full ? <p className="text-sm font-semibold text-ink">This class is full. {WAITLIST_DISCLAIMER}</p> : null}
      <Link
        href={action.href}
        data-cohort-id={cohort.id}
        className={`button mt-auto min-h-11 justify-center uppercase ${full ? "button-outline" : "button-gold"}`}
      >
        {action.label}
        <span className="sr-only">
          {" "}
          {full ? "for" : "in"} {termName} {cohort.program} {cohort.label}
        </span>{" "}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </li>
  )
}

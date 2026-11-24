import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, ClipboardCheck, Info, Laptop, UserRound, Video } from "lucide-react"
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
import { parseFinder } from "@/lib/program-finder"
import { getProgram } from "@/lib/programs"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "2027 Programs & Pricing: SHSAT and Digital SAT Classes",
  description:
    "AhmedPrep's Winter, Spring, Summer, and Fall 2027 SHSAT and Digital SAT cohorts in Astoria: class schedules, dates, hours, tuition, discount deadlines, and enrollment.",
  alternates: { canonical: absoluteUrl("/programs-2027") },
}

const SECONDARY_OPTIONS = (["free_diagnostic", "free_sunday", "private_tutoring"] as const).map((id) => getProgram(id)!)

export default async function Programs2027Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const previewFull = params.previewFull === "1"
  const state = parseFinder(params)
  return (
    <div className="bg-site-canvas">
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

      <section aria-labelledby="academic-pathways-title" className="px-5 py-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <h2 id="academic-pathways-title" className="text-xl font-extrabold text-navy">
            How our SHSAT and Digital SAT programs are organized
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <h3 className="font-extrabold text-navy">SHSAT: Four-stage preparation</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">Winter Foundation → Spring Advanced Mastery → Summer Intensive → Fall Final Intensive. Entry is guided by a diagnostic, and the Fall Final Intensive.</p>
              <Link href="/shsat-prep#shsat-pathway" className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-navy underline underline-offset-4">
                Explore the SHSAT pathway <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <h3 className="font-extrabold text-navy">Digital SAT: All mastery tiers in every cohort</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">Each seasonal Digital SAT cohort covers Foundation, Advanced Mastery, Intensive Application, and the 1600 Challenge with diagnostic-based assignments. Summer and Fall meet on weekends, 10 AM–3 PM, with a 30-minute lunch break.</p>
              <Link href="/digital-sat-prep#sat-mastery" className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-navy underline underline-offset-4">
                Explore the Digital SAT model <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
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
              Winter has no separate early-payment tier. Spring, Summer and Fall 2027: early-payment tuition (10% off) requires full payment at least{" "}
              {EARLY_DAYS_BEFORE_SPRING_SUMMER} calendar days before the selected cohort begins; there is no founding-family discount. Only one
              discount applies.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper">
            <h2 className="flex min-h-14 items-center px-5 text-lg font-extrabold text-navy">Compare all 2027 classes</h2>
            <div className="flex flex-col gap-6 border-t border-line px-5 pb-5 pt-4">
              {TERMS_2027.map((term) => (
                <div
                  key={term.id}
                  className={`overflow-x-auto rounded-xl border ${
                    term.id === "winter" ? "border-blue-200" : term.id === "spring" ? "border-emerald-200" : "border-amber-200"
                  }`}
                >
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <caption className={`border-b px-4 py-3 text-left text-base font-extrabold ${
                      term.id === "winter"
                        ? "border-blue-200 bg-blue-100 text-blue-900"
                        : term.id === "spring"
                          ? "border-emerald-200 bg-emerald-100 text-emerald-900"
                          : "border-amber-200 bg-amber-100 text-amber-900"
                    }`}>{term.name}</caption>
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
                          <tr
                            key={c.id}
                            className={`border-b border-line last:border-b-0 ${
                              c.program === "SHSAT" ? "bg-blue-50/60 hover:bg-blue-100/70" : "bg-emerald-50/60 hover:bg-emerald-100/70"
                            }`}
                          >
                            <th scope="row" className={`border-l-4 font-bold ${
                              c.program === "SHSAT" ? "border-blue-500 text-blue-900" : "border-emerald-600 text-emerald-900"
                            }`}>
                              <Link
                                href={`/enroll-2027?cohort=${encodeURIComponent(c.id)}`}
                                aria-label={`Review and request enrollment for ${c.program} ${c.label}, ${term.name}`}
                                className="block px-3 py-3 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-navy"
                              >
                                {c.program} · {c.label}
                              </Link>
                            </th>
                            <td className="text-ink">
                              <Link
                                href={`/enroll-2027?cohort=${encodeURIComponent(c.id)}`}
                                tabIndex={-1}
                                aria-hidden="true"
                                className="block px-3 py-3 text-inherit"
                              >
                                {cohortSchedule(c)}
                              </Link>
                            </td>
                            <td className="text-ink">
                              <Link
                                href={`/enroll-2027?cohort=${encodeURIComponent(c.id)}`}
                                tabIndex={-1}
                                aria-hidden="true"
                                className="block px-3 py-3 text-inherit"
                              >
                                {formatShortDate(span.startIso)} – {formatShortDate(span.endIso)}
                              </Link>
                            </td>
                            <td className="font-bold text-navy">
                              <Link
                                href={`/enroll-2027?cohort=${encodeURIComponent(c.id)}`}
                                tabIndex={-1}
                                aria-hidden="true"
                                className="block px-3 py-3 text-inherit"
                              >
                                {dollars(priceFor(c).regular)} · {c.hours} hrs
                              </Link>
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

      <section aria-labelledby="more-options-title" id="more-options" className="scroll-mt-28 border-t border-line px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand">More ways to get started</p>
            <h2 id="more-options-title" className="text-xl font-extrabold text-navy">
              Other ways to work with AhmedPrep
            </h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {SECONDARY_OPTIONS.map((option) => {
              const Icon = option.id === "free_diagnostic" ? ClipboardCheck : option.id === "free_sunday" ? Video : UserRound
              const tone =
                option.id === "free_diagnostic"
                  ? "border-blue-200 bg-blue-50/50"
                  : option.id === "free_sunday"
                    ? "border-amber-200 bg-amber-50/60"
                    : "border-emerald-200 bg-emerald-50/50"
              const iconTone =
                option.id === "free_diagnostic"
                  ? "bg-blue-100 text-blue-800"
                  : option.id === "free_sunday"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-emerald-100 text-emerald-900"
              return (
                <li key={option.id} className={`flex h-full flex-col gap-2 rounded-xl border p-4 ${tone}`}>
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconTone}`}>
                      <Icon size={19} />
                    </span>
                    <h3 className="text-base font-extrabold leading-snug text-navy">{option.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-ink">{option.summary}</p>
                  <p className="text-xs font-bold leading-snug text-navy">{option.price ?? "Priced separately — contact AhmedPrep for a quote"}</p>
                  <Link href={option.cta.href} className="mt-auto inline-flex min-h-9 items-center gap-2 self-start pt-1 text-sm font-extrabold text-navy underline underline-offset-4 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
                    {option.cta.label} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="calendar-details-title" className="px-5 pb-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          <h2 id="calendar-details-title" className="text-xl font-extrabold text-navy">
            Class calendars and free Sunday Zoom
          </h2>
          <div className="grid items-stretch gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-blue-200 bg-[#F3F8FC] p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                  <CalendarDays size={21} />
                </span>
                <h3 className="text-lg font-extrabold text-navy">Holiday makeups and summer dates</h3>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-ink">
                <p><strong className="text-navy">Winter and Spring:</strong> Makeup instruction is scheduled on select Saturdays from 5:30–8:30 PM.</p>
                <p><strong className="text-navy">Summer Digital SAT:</strong> July 4 closed; August 28 is the final Saturday class.</p>
                <p><strong className="text-navy">Summer SHSAT:</strong> First class July 1, July 5 closed; weekday classes continue July 6–August 26.</p>
                <p className="text-subtle">Exact makeup assignments remain subject to final curriculum sequencing and calendar verification before publication.</p>
              </div>
            </article>
            <article className="rounded-2xl border border-amber-200 bg-[#FFFAED] p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
                  <Video size={21} />
                </span>
                <h3 className="text-lg font-extrabold text-navy">Free Sunday Zoom classes</h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-ink">Free Sunday Zoom classes continue every other Sunday in Winter and Spring.</p>
              <div className="space-y-2 rounded-xl border border-amber-200 bg-white/85 p-3 text-sm text-ink">
                <p><strong className="text-navy">SHSAT · 6:00–6:45 PM ET:</strong> Focused Math and ELA practice.</p>
                <p><strong className="text-navy">Digital SAT · 7:00–7:45 PM ET:</strong> Focused Math and Reading/Writing practice.</p>
              </div>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-navy">A separate RSVP is required for each program.</p>
              <p className="mt-3 text-sm leading-relaxed text-subtle">The last session before summer break is June 27, 2027; there are no free Sunday sessions in July or August 2027, and Fall 2027 restart dates have not been announced.</p>
            </article>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink">
            <span className="inline-flex items-center gap-2"><CalendarDays size={17} aria-hidden="true" className="text-brand" /> Summer break begins August 30, 2027.</span>
            <span className="inline-flex items-center gap-2"><Laptop size={17} aria-hidden="true" className="text-brand" /> Digital SAT students bring their own laptops.</span>
          </div>
          <p className="flex items-start gap-2 text-sm leading-relaxed text-subtle">
            <Info size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
            Submitting an inquiry does not reserve a seat or a discounted tuition rate. Payment, cancellation, and refund terms will be provided before enrollment is finalized.
          </p>
        </div>
      </section>
    </div>
  )
}

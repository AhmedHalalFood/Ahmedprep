import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, Check, Laptop, Leaf, Snowflake, Sun, type LucideIcon } from "lucide-react"
import {
  MAX_CLASS_SIZE,
  PROGRAMS_2027,
  TERMS_2027,
  cohortSchedule,
  cohortSpan,
  dollars,
  formatLongDate,
  formatRange,
  termName,
  termSummary,
  tuitionOptionsFor,
  type Cohort,
  type ProgramId,
  type TermId,
} from "@/lib/cohorts-2027"
import { WAITLIST_DISCLAIMER, enrollActionFor } from "@/lib/cohort-capacity"
import { FINDER_ID, FORMAT_LABEL, programsHref, type FinderState } from "@/lib/program-finder"

const SEASON_ICON: Record<TermId, LucideIcon> = { winter: Snowflake, spring: Leaf, summer: Sun }

const PROGRAM_META: Record<ProgramId, { subjects: string; Icon: LucideIcon; selected: string; badge: string; page: string }> = {
  SHSAT: { subjects: "Math and ELA", Icon: BookOpen, selected: "border-brand bg-brand-soft", badge: "bg-brand", page: "/shsat-prep" },
  "Digital SAT": {
    subjects: "Math and Reading & Writing",
    Icon: Laptop,
    selected: "border-sage bg-sage-soft",
    badge: "bg-sage",
    page: "/digital-sat-prep",
  },
}

const optionBase =
  "group flex h-full min-h-16 items-center gap-3 rounded-xl border-2 bg-paper p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
const optionIdle = "border-line hover:border-navy/40"

function Step({ n, title, done, children }: { n: number; title: string; done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-3">
      <h3 className="flex items-center gap-3 text-lg font-extrabold text-navy">
        <span
          aria-hidden="true"
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${done ? "bg-navy text-paper" : "border-2 border-navy text-navy"}`}
        >
          {done ? <Check size={16} /> : n}
        </span>
        <span>
          <span className="sr-only">Step {n}: </span>
          {title}
        </span>
      </h3>
      {children}
    </li>
  )
}

function OptionLink({ href, selected, className = "", children }: { href: string; selected: boolean; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} scroll={false} aria-current={selected ? "true" : undefined} className={`${optionBase} ${selected ? className || "border-navy bg-brand-soft" : optionIdle}`}>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</span>
      <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-navy transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

export function ClassFinder({ state, full }: { state: FinderState; full: (cohortId: string) => boolean }) {
  const { season, program, format, formats, cohort } = state
  return (
    <section id={FINDER_ID} aria-labelledby="finder-title" className="scroll-mt-28 px-5 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 id="finder-title" className="font-serif text-2xl font-bold text-navy sm:text-3xl">
            Find your class
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">Four quick choices lead to the exact schedule, dates, and tuition.</p>
        </div>

        <ol className="flex flex-col gap-8">
          <Step n={1} title="Choose a season" done={Boolean(season)}>
            <ul className="grid gap-3 sm:grid-cols-3">
              {TERMS_2027.map((term) => {
                const s = termSummary(term)
                const Icon = SEASON_ICON[term.id]
                return (
                  <li key={term.id}>
                    <OptionLink href={programsHref({ season: term.id, program })} selected={season === term.id}>
                      <span className="flex items-center gap-2 font-extrabold text-navy">
                        <Icon size={20} aria-hidden="true" className="text-brand" />
                        {term.name}
                      </span>
                      <span className="text-sm text-ink">{formatRange(s.startIso, s.endIso)}</span>
                      <span className="text-sm text-subtle">
                        {s.hoursLabel} · from {s.regularLabel.split("–")[0]}
                      </span>
                    </OptionLink>
                  </li>
                )
              })}
            </ul>
          </Step>

          {season && (
            <Step n={2} title="Choose a program" done={Boolean(program)}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {PROGRAMS_2027.map((p) => {
                  const meta = PROGRAM_META[p]
                  return (
                    <li key={p}>
                      <OptionLink href={programsHref({ season, program: p })} selected={program === p} className={meta.selected}>
                        <span className="flex items-center gap-3">
                          <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-paper ${meta.badge}`} aria-hidden="true">
                            <meta.Icon size={20} />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-extrabold text-navy">{p}</span>
                            <span className="text-sm text-subtle">{meta.subjects}</span>
                          </span>
                        </span>
                      </OptionLink>
                    </li>
                  )
                })}
              </ul>
            </Step>
          )}

          {season && program && (
            <Step n={3} title="Choose a schedule" done={Boolean(format)}>
              <ul className={`grid gap-3 ${formats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                {formats.map(({ slug, cohort: c }) => (
                  <li key={slug}>
                    <OptionLink href={programsHref({ season, program, format: slug })} selected={format === slug} className={PROGRAM_META[program].selected}>
                      <span className="font-extrabold text-navy">{FORMAT_LABEL[slug]}</span>
                      <span className="text-sm text-ink">{cohortSchedule(c)}</span>
                      <span className="text-sm text-subtle">
                        {c.hours} hours · {dollars(tuitionOptionsFor(c).at(-1)!.amount)} regular
                      </span>
                    </OptionLink>
                  </li>
                ))}
              </ul>
            </Step>
          )}

          {cohort && (
            <Step n={4} title="Review your class" done={false}>
              <CohortDetail cohort={cohort} full={full(cohort.id)} />
            </Step>
          )}
        </ol>

        {!season && <p className="text-sm text-subtle">Start with a season above. Your choices stay in the page address, so you can share or bookmark them.</p>}
      </div>
    </section>
  )
}

function CohortDetail({ cohort, full }: { cohort: Cohort; full: boolean }) {
  const span = cohortSpan(cohort)
  const options = tuitionOptionsFor(cohort)
  const action = enrollActionFor(cohort, full)
  const meta = PROGRAM_META[cohort.program]
  const title = `${termName(cohort.term)} ${cohort.program} · ${cohort.label}`
  return (
    <article aria-labelledby="cohort-detail-title" className={`flex flex-col gap-5 rounded-2xl border-2 p-5 shadow-sm sm:p-6 ${meta.selected}`}>
      <div className="flex flex-col gap-1">
        <h4 id="cohort-detail-title" className="font-serif text-xl font-bold text-navy sm:text-2xl">
          {title}
        </h4>
        <p className="text-sm text-subtle">
          <Link href={meta.page} className="font-semibold text-navy underline underline-offset-4">
            About {cohort.program} preparation
          </Link>
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Schedule", cohortSchedule(cohort)],
          ["Dates", `${formatLongDate(span.startIso)} – ${formatLongDate(span.endIso)}`],
          ["Program length", `${cohort.sessions} classes · ${cohort.hours} instructional hours`],
          ["Class size", `Maximum ${MAX_CLASS_SIZE} students · in person in Astoria`],
        ].map(([term, value]) => (
          <div key={term} className="flex flex-col gap-0.5 rounded-xl bg-paper px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-widest text-subtle">{term}</dt>
            <dd className="font-bold leading-relaxed text-navy">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2">
        <h5 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-navy">
          <CalendarDays size={16} aria-hidden="true" />
          Tuition for this class
        </h5>
        <ul className="flex flex-col overflow-hidden rounded-xl bg-paper">
          {options.map((option) => (
            <li key={option.id} className="flex items-start justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0">
              <span className="flex flex-col">
                <span className="font-bold text-navy">{option.label}</span>
                <span className="text-sm leading-relaxed text-subtle">{option.condition}</span>
              </span>
              <span className="text-xl font-extrabold text-navy">{dollars(option.amount)}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-subtle">Discounts do not combine. Requesting enrollment does not reserve a seat or a discounted rate.</p>
      </div>

      {full && <p className="text-sm font-semibold text-ink">This class is full. {WAITLIST_DISCLAIMER}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={action.href}
          data-cohort-id={cohort.id}
          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-extrabold transition-colors ${
            full ? "border-2 border-navy bg-paper text-navy hover:bg-navy hover:text-paper" : "bg-gold text-navy hover:bg-gold-hover"
          }`}
        >
          {full ? "Join Waitlist" : "Request Enrollment"}
          <span className="sr-only"> for this class</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link href={programsHref({ season: cohort.term, program: cohort.program })} scroll={false} className="inline-flex min-h-11 items-center px-2 text-sm font-bold text-navy underline underline-offset-4">
          Choose a different schedule
        </Link>
      </div>
    </article>
  )
}

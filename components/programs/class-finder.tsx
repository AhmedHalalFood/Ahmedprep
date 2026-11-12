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
  termStartLabel,
  termSummary,
  tuitionOptionsFor,
  type Cohort,
  type ProgramId,
  type TermId,
} from "@/lib/cohorts-2027"
import { WAITLIST_DISCLAIMER, enrollActionFor } from "@/lib/cohort-capacity"
import { ENROLLMENT_ACTIONS, REQUEST_NOT_GUARANTEE } from "@/lib/enrollment-2027"
import { FINDER_ID, FORMAT_LABEL, programsHref, type FinderState } from "@/lib/program-finder"
import { NEUTRAL_TONE, PROGRAM_TONE } from "@/components/programs/program-tone"
import { EnrollmentHelp } from "@/components/enroll-2027/enrollment-help"
import { PayNowSlot } from "@/components/enroll-2027/pay-now-slot"

const START_ICON: Record<TermId, LucideIcon> = { winter: Snowflake, spring: Leaf, summer: Sun }
const PROGRAM_ICON: Record<ProgramId, LucideIcon> = { SHSAT: BookOpen, "Digital SAT": Laptop }

const optionBase =
  "group relative flex h-full min-h-16 items-center gap-3 rounded-xl border-2 p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
const optionIdle = "border-line bg-paper hover:border-navy/40"

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

type Tone = { selected: string; ring: string; badge: string }

function OptionLink({ href, selected, tone, children }: { href: string; selected: boolean; tone: Tone; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={selected ? "true" : undefined}
      className={`${optionBase} ${selected ? `${tone.selected} ${tone.ring}` : optionIdle}`}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</span>
      {selected ? (
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider ${tone.badge}`}>
          <Check size={14} aria-hidden="true" />
          Selected
        </span>
      ) : (
        <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-navy transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  )
}

export function ClassFinder({ state, full }: { state: FinderState; full: (cohortId: string) => boolean }) {
  const { season, program, format, formats, cohort } = state
  const programTone = program ? PROGRAM_TONE[program] : NEUTRAL_TONE
  return (
    <section id={FINDER_ID} aria-labelledby="finder-title" className="scroll-mt-28 px-5 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 id="finder-title" className="font-serif text-2xl font-bold text-navy sm:text-3xl">
            Find your class
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">
            Four quick steps: choose when to start, the program, and a schedule, then review your class and request enrollment.
          </p>
        </div>

        <ol className="flex flex-col gap-8">
          <Step n={1} title="Choose when to start" done={Boolean(season)}>
            {program && !season && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink">
                <span>
                  Showing <strong className="text-navy">{program}</strong> classes ({PROGRAM_TONE[program].subjects}).
                </span>
                <Link href={programsHref({})} scroll={false} className="font-bold text-navy underline underline-offset-4">
                  Change program
                </Link>
              </p>
            )}
            <ul className="grid gap-3 sm:grid-cols-3">
              {TERMS_2027.map((term) => {
                const s = termSummary(term)
                const Icon = START_ICON[term.id]
                return (
                  <li key={term.id}>
                    <OptionLink href={programsHref({ season: term.id, program })} selected={season === term.id} tone={programTone}>
                      <span className="flex items-center gap-2 font-extrabold text-navy">
                        <Icon size={20} aria-hidden="true" className={program ? PROGRAM_TONE[program].text : "text-brand"} />
                        {termStartLabel(term.id)}
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
            <Step n={2} title="Choose SHSAT or Digital SAT" done={Boolean(program)}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {PROGRAMS_2027.map((p) => {
                  const tone = PROGRAM_TONE[p]
                  const Icon = PROGRAM_ICON[p]
                  return (
                    <li key={p}>
                      <OptionLink href={programsHref({ season, program: p })} selected={program === p} tone={tone}>
                        <span className="flex items-center gap-3">
                          <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone.badge}`} aria-hidden="true">
                            <Icon size={20} />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-extrabold text-navy">{p}</span>
                            <span className="text-sm text-subtle">{tone.subjects}</span>
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
            <Step n={3} title={`Choose ${formats.map((f) => FORMAT_LABEL[f.slug]).join(" or ")}`} done={Boolean(format)}>
              <ul className={`grid gap-3 ${formats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                {formats.map(({ slug, cohort: c }) => (
                  <li key={slug}>
                    <OptionLink href={programsHref({ season, program, format: slug })} selected={format === slug} tone={PROGRAM_TONE[program]}>
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
            <Step n={4} title="Review your selected class" done={false}>
              <div className="flex flex-col gap-4">
                <CohortDetail cohort={cohort} full={full(cohort.id)} />
                <EnrollmentAction cohort={cohort} full={full(cohort.id)} />
              </div>
            </Step>
          )}
        </ol>

        {!season && (
          <p className="text-sm text-subtle">
            Start by choosing when your child&apos;s classes begin. Your choices stay in the page address, so you can share or bookmark them.
          </p>
        )}
      </div>
    </section>
  )
}

function CohortDetail({ cohort, full }: { cohort: Cohort; full: boolean }) {
  const span = cohortSpan(cohort)
  const options = tuitionOptionsFor(cohort)
  const tone = PROGRAM_TONE[cohort.program]
  return (
    <article aria-labelledby="cohort-detail-title" className={`flex flex-col gap-5 rounded-2xl border-2 p-5 shadow-sm sm:p-6 ${tone.selected}`}>
      <div className="flex flex-col gap-1">
        <p className={`text-sm font-extrabold uppercase tracking-wider ${tone.text}`}>{termStartLabel(cohort.term)}</p>
        <h4 id="cohort-detail-title" className="font-serif text-xl font-bold text-navy sm:text-2xl">
          {cohort.program} · {cohort.label}
        </h4>
        <p className="text-sm text-subtle">
          <Link href={tone.page} className="font-semibold text-navy underline underline-offset-4">
            About {cohort.program} preparation
          </Link>
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Schedule", cohortSchedule(cohort)],
          ["Dates", `${formatLongDate(span.startIso)} – ${formatLongDate(span.endIso)}`],
          ["Program length", `${cohort.sessions} classes · ${cohort.hours} instructional hours`],
          ["Availability", full ? "Full · waitlist open" : `Accepting enrollment requests · max ${MAX_CLASS_SIZE} students, in person in Astoria`],
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
    </article>
  )
}

function EnrollmentAction({ cohort, full }: { cohort: Cohort; full: boolean }) {
  const action = enrollActionFor(cohort, full)
  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-navy bg-paper p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={action.href}
          data-cohort-id={cohort.id}
          className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-extrabold uppercase tracking-wider transition-colors ${
            full ? "border-2 border-navy bg-paper text-navy hover:bg-navy hover:text-paper" : "bg-gold text-navy hover:bg-gold-hover"
          }`}
        >
          {full ? ENROLLMENT_ACTIONS.waitlist : ENROLLMENT_ACTIONS.request}
          <span className="sr-only"> for {cohort.program} {cohort.label}, {termStartLabel(cohort.term)}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <PayNowSlot cohort={cohort} full={full} />
        <Link
          href={programsHref({ season: cohort.term, program: cohort.program })}
          scroll={false}
          className="inline-flex min-h-11 items-center px-2 text-sm font-bold text-navy underline underline-offset-4"
        >
          Choose a different schedule
        </Link>
      </div>
      <p className="text-sm leading-relaxed text-subtle">{full ? WAITLIST_DISCLAIMER : `No payment is taken. ${REQUEST_NOT_GUARANTEE}`}</p>
      <EnrollmentHelp location="class_finder" />
    </div>
  )
}

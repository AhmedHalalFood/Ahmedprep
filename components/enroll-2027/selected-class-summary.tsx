import Link from "next/link"
import { Check } from "lucide-react"
import { PROGRAM_TONE } from "@/components/programs/program-tone"
import { MAX_CLASS_SIZE, cohortSchedule, cohortSpan, dollars, formatShortDate, termStartLabel, tuitionOptionsFor, type Cohort } from "@/lib/cohorts-2027"
import { programsHref } from "@/lib/program-finder"

/** Concise summary of the class carried over from /programs-2027, shown above the enrollment form. */
export function SelectedClassSummary({ cohort, full }: { cohort: Cohort; full: boolean }) {
  const tone = PROGRAM_TONE[cohort.program]
  const span = cohortSpan(cohort)
  const options = tuitionOptionsFor(cohort)
  return (
    <section aria-labelledby="selected-class-title" className={`flex flex-col gap-4 rounded-2xl border-2 p-4 sm:p-5 ${tone.selected}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tone.badge}`}>
            <Check size={18} />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold uppercase tracking-widest text-subtle">Your selected class</p>
            <h2 id="selected-class-title" className="text-lg font-extrabold leading-snug text-navy sm:text-xl">
              {cohort.program} · {cohort.label}
            </h2>
            <p className={`text-sm font-bold ${tone.text}`}>{termStartLabel(cohort.term)}</p>
          </div>
        </div>
        <Link
          href={programsHref({ season: cohort.term, program: cohort.program })}
          className="inline-flex min-h-11 items-center justify-center self-start rounded-full border-2 border-navy bg-paper px-4 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-paper"
        >
          Change class
        </Link>
      </div>

      <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        {[
          ["Schedule", cohortSchedule(cohort)],
          ["Dates", `${formatShortDate(span.startIso)} – ${formatShortDate(span.endIso)}, ${span.endIso.slice(0, 4)}`],
          ["Length", `${cohort.sessions} classes · ${cohort.hours} instructional hours`],
          ["Availability", full ? "Full · waitlist open" : `Accepting requests · max ${MAX_CLASS_SIZE} students`],
        ].map(([term, value]) => (
          <div key={term} className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-subtle">{term}</dt>
            <dd className="font-semibold leading-relaxed text-navy">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-1 border-t border-navy/10 pt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-subtle">Tuition</p>
        <ul className="flex flex-col gap-1 text-sm">
          {options.map((option) => (
            <li key={option.id} className="flex items-baseline justify-between gap-3">
              <span className="text-ink">{option.label}</span>
              <span className="font-extrabold text-navy">{dollars(option.amount)}</span>
            </li>
          ))}
        </ul>
        <details className="text-sm text-subtle">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-navy underline underline-offset-4">
            Discount deadlines and conditions
          </summary>
          <ul className="flex flex-col gap-1 pb-1 leading-relaxed">
            {options.map((option) => (
              <li key={option.id}>
                <span className="font-semibold text-navy">{option.label}:</span> {option.condition}
              </li>
            ))}
            <li>Discounts cannot be combined.</li>
          </ul>
        </details>
      </div>
    </section>
  )
}

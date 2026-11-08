import {
  DEADLINE_TIME_LABEL,
  FOUNDING_SEATS_PER_COHORT,
  MAX_CLASS_SIZE,
  type Cohort,
  cohortSchedule,
  cohortSpan,
  deadlinesFor,
  dollars,
  formatDeadline,
  formatLongDate,
  priceFor,
} from "@/lib/cohorts-2027"

export function SelectedCohortSummary({ cohort }: { cohort: Cohort }) {
  const price = priceFor(cohort)
  const { foundingIso, earlyIso } = deadlinesFor(cohort)
  const span = cohortSpan(cohort)

  const tiers = [
    ...(price.founding !== null && foundingIso
      ? [
          {
            label: "Founding-Family",
            amount: price.founding,
            note: `First ${FOUNDING_SEATS_PER_COHORT} fully paid seats. Pay in full by ${formatDeadline(foundingIso)}, ${DEADLINE_TIME_LABEL}.`,
          },
        ]
      : []),
    { label: "Early Full Payment", amount: price.early, note: `Pay in full by ${formatDeadline(earlyIso)}, ${DEADLINE_TIME_LABEL}.` },
    { label: "Regular Tuition", amount: price.regular, note: "Pay in full before the first scheduled class." },
  ]

  const facts = [
    { term: "Schedule", value: cohortSchedule(cohort) },
    { term: "Dates", value: `${formatLongDate(span.startIso)} – ${formatLongDate(span.endIso)}` },
    { term: "Program length", value: `${cohort.sessions} classes · ${cohort.hours} class hours` },
    { term: "Class size", value: `Max ${MAX_CLASS_SIZE} students` },
  ]

  return (
    <div className="flex flex-col gap-5 border border-line bg-white">
      <dl className="flex flex-col">
        {facts.map((fact) => (
          <div key={fact.term} className="flex flex-col gap-0.5 border-b border-line px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-widest text-subtle">{fact.term}</dt>
            <dd className="font-bold leading-relaxed text-navy">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3 px-4 pb-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand">Tuition for this cohort</h2>
        <ul className="flex flex-col border-t border-line">
          {tiers.map((tier) => (
            <li key={tier.label} className="flex flex-col gap-1 border-b border-line py-3">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-bold text-navy">{tier.label}</span>
                <span className="text-xl font-extrabold text-navy">{dollars(tier.amount)}</span>
              </span>
              <span className="text-sm leading-relaxed text-subtle">{tier.note}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed text-subtle">
          {price.founding === null
            ? "Discounts cannot be combined. Founding-family pricing applies to Winter 2027 cohorts only."
            : "Discounts cannot be combined."}
        </p>
      </div>
    </div>
  )
}

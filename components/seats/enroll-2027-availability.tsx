import {
  DEMO_GROUPS,
  FOUNDING_RULES,
  GROUP_CAPACITY,
  PUBLISHED_LOCATION,
  TUITION_STACKING_NOTE,
  TUITION_TIERS,
  availabilityFor,
  type DemoGroup,
  type GroupStatus,
} from "@/lib/seat-availability-preview"

const STATUS_COPY: Record<GroupStatus, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-brand-soft text-navy" },
  limited: { label: "Few seats left", className: "bg-gold text-navy" },
  full: { label: "Class full", className: "bg-navy text-primary-foreground" },
}

function AvailabilityCard({ group }: { group: DemoGroup }) {
  const { seatsRemaining, foundingRemaining, status } = availabilityFor(group)
  const badge = STATUS_COPY[status]
  const titleId = `${group.id}-availability-title`

  return (
    <article aria-labelledby={titleId} className="flex flex-col gap-3 border border-line bg-paper p-4">
      <header className="flex flex-wrap-reverse items-start justify-between gap-2">
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{`${group.program} · ${PUBLISHED_LOCATION}`}</p>
          <h3 id={titleId} className="text-lg font-extrabold leading-tight text-navy">
            {group.label}
          </h3>
          <p className="text-sm leading-relaxed text-subtle">{group.schedule}</p>
        </div>
        <span className={`shrink-0 px-2 py-1 text-xs font-bold uppercase tracking-wide ${badge.className}`}>
          {badge.label}
        </span>
      </header>

      <div className="flex flex-col gap-1 border-t border-line pt-3">
        <p className="flex items-baseline gap-2 text-navy">
          <span className="text-5xl font-extrabold leading-none">{seatsRemaining}</span>
          <span className="text-sm font-bold uppercase tracking-wide">{`of ${GROUP_CAPACITY} seats left`}</span>
        </p>
        <p className="text-sm font-semibold leading-relaxed text-ink">
          <span className="mr-1 inline-block size-2.5 bg-gold align-middle" aria-hidden="true" />
          {foundingRemaining === 0
            ? "Founding-family seats filled"
            : `${foundingRemaining} of ${FOUNDING_RULES.seatsPerGroup} founding-family seats left`}
        </p>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-gold-deep">Demo count</p>
    </article>
  )
}

export function Enroll2027Availability() {
  return (
    <section aria-labelledby="availability-heading" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="eyebrow blue">{`January 2027 · ${PUBLISHED_LOCATION}`}</p>
        <h2 id="availability-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Seat availability
        </h2>
      </div>

      <p className="border-2 border-dashed border-gold-deep bg-cream px-3 py-2 text-sm font-bold leading-relaxed text-navy">
        PREVIEW: DEMONSTRATION SEAT COUNTS ONLY. These numbers are examples, not actual availability, and are not
        connected to enrollment records.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {DEMO_GROUPS.map((group) => (
          <AvailabilityCard key={group.id} group={group} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-navy">Tuition policy</h3>
        <ul className="flex flex-col border border-line bg-paper">
          {TUITION_TIERS.map((tier) => (
            <li key={tier.id} className="flex flex-col gap-1 border-b border-line p-4 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold text-navy">{tier.name}</span>
                <span className="text-xl font-extrabold text-navy">{tier.amount}</span>
              </div>
              <span className="text-sm leading-relaxed text-subtle">{tier.condition}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm font-bold leading-relaxed text-ink">{TUITION_STACKING_NOTE}</p>
      </div>
    </section>
  )
}

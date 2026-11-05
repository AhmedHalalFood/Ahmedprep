import {
  DEMO_GROUPS,
  FOUNDING_RULES,
  GROUP_CAPACITY,
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

function SeatStrip({ group }: { group: DemoGroup }) {
  return (
    <div className="flex flex-wrap gap-1" aria-hidden="true">
      {Array.from({ length: GROUP_CAPACITY }, (_, i) => {
        const taken = i < group.demoConfirmed
        const founding = i < group.demoFounding
        return (
          <span
            key={i}
            className={`size-4 border ${
              taken ? (founding ? "border-gold-deep bg-gold" : "border-navy bg-navy") : "border-line bg-paper"
            }`}
          />
        )
      })}
    </div>
  )
}

function GroupCard({ group }: { group: DemoGroup }) {
  const { seatsRemaining, foundingRemaining, status } = availabilityFor(group)
  const badge = STATUS_COPY[status]

  return (
    <article className="flex flex-col gap-4 border border-line bg-paper p-4" aria-labelledby={`${group.id}-title`}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{group.program}</p>
          <h3 id={`${group.id}-title`} className="text-lg font-extrabold leading-tight text-navy">
            {group.label}
          </h3>
          <p className="text-sm leading-relaxed text-subtle">{group.schedule}</p>
        </div>
        <span className={`shrink-0 px-2 py-1 text-xs font-bold uppercase tracking-wide ${badge.className}`}>
          {badge.label}
        </span>
      </header>

      <SeatStrip group={group} />

      <dl className="grid grid-cols-2 gap-3 border-t border-line pt-3">
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-bold uppercase tracking-wider text-subtle">Seats left</dt>
          <dd className="text-2xl font-extrabold text-navy">
            {seatsRemaining}
            <span className="text-sm font-semibold text-subtle">{` / ${GROUP_CAPACITY}`}</span>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs font-bold uppercase tracking-wider text-subtle">Founding left</dt>
          <dd className="text-2xl font-extrabold text-navy">
            {foundingRemaining}
            <span className="text-sm font-semibold text-subtle">{` / ${FOUNDING_RULES.seatsPerGroup}`}</span>
          </dd>
        </div>
      </dl>
      <p className="sr-only">{`${seatsRemaining} of ${GROUP_CAPACITY} seats remaining, ${foundingRemaining} founding-family seats remaining. Demonstration values.`}</p>

      {status === "full" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed text-ink">
            This group is full. Join the waitlist and we&apos;ll contact you in order if a seat opens.
          </p>
          <span
            className="flex min-h-11 items-center justify-center border-2 border-navy px-3 text-center text-sm font-bold uppercase tracking-wide text-navy"
            aria-disabled="true"
          >
            Join waitlist (preview)
          </span>
        </div>
      ) : (
        <span
          className="flex min-h-11 items-center justify-center bg-gold px-3 text-center text-sm font-bold uppercase tracking-wide text-navy"
          aria-disabled="true"
        >
          Request a seat (preview)
        </span>
      )}
    </article>
  )
}

export function SeatAvailabilityBoard() {
  const totalRemaining = DEMO_GROUPS.reduce((sum, g) => sum + availabilityFor(g).seatsRemaining, 0)
  const foundingRemaining = DEMO_GROUPS.reduce((sum, g) => sum + availabilityFor(g).foundingRemaining, 0)

  return (
    <div className="flex flex-col gap-6">
      <p className="border-2 border-dashed border-gold-deep bg-cream px-3 py-2 text-sm font-bold leading-relaxed text-navy">
        DEMONSTRATION VALUES ONLY. These seat counts are not real enrollment data and are not connected to the
        database. Buttons on this page do nothing.
      </p>

      <section aria-labelledby="seat-totals" className="flex flex-col gap-3 bg-navy p-4 text-primary-foreground">
        <h2 id="seat-totals" className="text-xs font-bold uppercase tracking-wider text-gold">
          January 2027 · Astoria · Demo totals
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="flex flex-col">
            <span className="text-3xl font-extrabold">{totalRemaining}</span>
            <span className="text-sm leading-relaxed">{`seats left of ${GROUP_CAPACITY * DEMO_GROUPS.length}`}</span>
          </p>
          <p className="flex flex-col">
            <span className="text-3xl font-extrabold text-gold">{foundingRemaining}</span>
            <span className="text-sm leading-relaxed">founding-family seats left</span>
          </p>
        </div>
        <p className="text-sm leading-relaxed">
          Counts include only enrollments approved by AhmedPrep with full payment verified. Inquiries do not hold a
          seat.
        </p>
      </section>

      <section aria-labelledby="groups-heading" className="flex flex-col gap-3">
        <h2 id="groups-heading" className="text-xl font-extrabold text-navy">
          Class groups
        </h2>
        <div className="flex items-center gap-4 text-xs font-semibold text-subtle" aria-hidden="true">
          <span className="flex items-center gap-1">
            <span className="size-3 border border-gold-deep bg-gold" />
            Founding
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 border border-navy bg-navy" />
            Enrolled
          </span>
          <span className="flex items-center gap-1">
            <span className="size-3 border border-line bg-paper" />
            Open
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {DEMO_GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>

      <section aria-labelledby="tuition-heading" className="flex flex-col gap-3">
        <h2 id="tuition-heading" className="text-xl font-extrabold text-navy">
          Tuition options
        </h2>
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
        <p className="text-sm leading-relaxed text-ink">
          Each family pays one tuition rate. Discounts do not stack.
        </p>
      </section>
    </div>
  )
}

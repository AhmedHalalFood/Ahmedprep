import { OptionCard } from "./choice-steps"
import {
  FOUNDING_POLICY,
  MAX_CLASS_SIZE,
  TUITION,
  deadlinesForClass,
  formatUsd,
  isEarlyWindowOpen,
  isFoundingWindowOpen,
  paymentOptionsFor,
  type PaymentOption,
} from "@/lib/enrollment-catalog"

function Price({ amount, badge }: { amount: string; badge?: string }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-2xl font-extrabold tabular-nums text-navy">{amount}</span>
      {badge && (
        <span className="bg-gold px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-navy">
          <span className="sr-only">{"— "}</span>
          {badge}
        </span>
      )}
    </span>
  )
}

function ClosedNote({ children }: { children: React.ReactNode }) {
  return <p className="border border-line bg-warm p-4 text-sm leading-relaxed text-subtle">{children}</p>
}

/**
 * Display only. `now` comes from the server render, and the final decision is re-checked on the server at checkout,
 * so a wrong device clock cannot unlock a closed discount.
 */
export function TuitionStep({
  classId,
  now,
  value,
  onChange,
}: {
  classId: string
  now: Date
  value: PaymentOption | null
  onChange: (p: PaymentOption) => void
}) {
  const options = paymentOptionsFor(classId)
  const deadlines = deadlinesForClass(classId)
  const foundingOpen = isFoundingWindowOpen(classId, now)
  const earlyOpen = isEarlyWindowOpen(classId, now)

  return (
    <fieldset className="flex flex-col gap-6">
      <legend className="sr-only">Tuition option</legend>

      <section aria-labelledby="founding-heading" className="flex flex-col gap-3 border-t-4 border-gold pt-4">
        <h3 id="founding-heading" className="text-sm font-extrabold uppercase tracking-wider text-navy">
          Founding-Family tuition
        </h3>

        {foundingOpen ? (
          <OptionCard
            name="tuition"
            value="founding-full"
            checked={value === "founding-full"}
            onSelect={() => onChange("founding-full")}
          >
            <span className="font-bold text-ink">{options["founding-full"].title}</span>
            <Price amount={formatUsd(TUITION.foundingCents)} badge={`Save ${formatUsd(TUITION.savingsCents)}`} />
            <span className="text-sm leading-relaxed text-subtle">{options["founding-full"].detail}</span>
          </OptionCard>
        ) : (
          <ClosedNote>{`Founding-Family tuition for this class closed on ${deadlines?.founding.label ?? "its deadline"}.`}</ClosedNote>
        )}

        <p className="text-sm leading-relaxed text-ink">
          {`Limited to the first ${FOUNDING_POLICY.seatsPerClass} fully paid enrollments in each class.`}
        </p>
      </section>

      <section aria-labelledby="other-tuition-heading" className="flex flex-col gap-3 border-t border-line pt-4">
        <h3 id="other-tuition-heading" className="text-sm font-extrabold uppercase tracking-wider text-navy">
          Other tuition options
        </h3>
        {earlyOpen ? (
          <OptionCard
            name="tuition"
            value="early-full"
            checked={value === "early-full"}
            onSelect={() => onChange("early-full")}
          >
            <span className="font-bold text-ink">{options["early-full"].title}</span>
            <Price amount={formatUsd(TUITION.earlyCents)} badge="10% off" />
            <span className="text-sm leading-relaxed text-subtle">{options["early-full"].detail}</span>
          </OptionCard>
        ) : (
          <ClosedNote>{`Early Full Payment for this class closed on ${deadlines?.early.label ?? "its deadline"}.`}</ClosedNote>
        )}
        <OptionCard
          name="tuition"
          value="regular-full"
          checked={value === "regular-full"}
          onSelect={() => onChange("regular-full")}
        >
          <span className="font-bold text-ink">{options["regular-full"].title}</span>
          <Price amount={formatUsd(TUITION.regularCents)} />
          <span className="text-sm leading-relaxed text-subtle">{options["regular-full"].detail}</span>
        </OptionCard>
      </section>

      <div className="flex flex-col gap-1 border-l-4 border-gold bg-cream px-4 py-3 text-sm leading-relaxed text-navy">
        <p className="font-bold">Discounts cannot be combined. No installment plans for Winter 2027.</p>
        <p>{`Enrollment is subject to available seats (maximum ${MAX_CLASS_SIZE} students per class). An inquiry does not reserve a seat.`}</p>
        <p>No registration, materials, or processing fees.</p>
      </div>
    </fieldset>
  )
}

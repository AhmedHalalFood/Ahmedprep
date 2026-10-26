import { OptionCard } from "./choice-steps"
import {
  FOUNDING_POLICY,
  PAYMENT_OPTIONS,
  TUITION,
  formatUsd,
  isFoundingWindowOpen,
  type PaymentOption,
} from "@/lib/enrollment-catalog"

function Price({ amount, suffix }: { amount: string; suffix?: string }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-2xl font-extrabold tabular-nums text-navy">{amount}</span>
      {suffix && <span className="text-sm font-semibold text-subtle">{suffix}</span>}
    </span>
  )
}

export function TuitionStep({ value, onChange }: { value: PaymentOption | null; onChange: (p: PaymentOption) => void }) {
  const foundingOpen = isFoundingWindowOpen()

  return (
    <fieldset className="flex flex-col gap-6">
      <legend className="sr-only">Tuition option</legend>

      <section aria-labelledby="founding-heading" className="flex flex-col gap-3 border-t-4 border-gold pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="founding-heading" className="text-sm font-extrabold uppercase tracking-wider text-navy">
            Founding-family tuition
          </h3>
          <span className="bg-gold px-2 py-1 text-xs font-extrabold uppercase tracking-wide text-navy">
            {`Save ${formatUsd(TUITION.savingsCents)}`}
          </span>
        </div>

        {foundingOpen ? (
          <OptionCard
            name="tuition"
            value="founding-full"
            checked={value === "founding-full"}
            onSelect={() => onChange("founding-full")}
          >
            <span className="font-bold text-ink">{PAYMENT_OPTIONS["founding-full"].title}</span>
            <span className="flex flex-wrap items-baseline gap-x-2">
              <Price amount={formatUsd(TUITION.foundingCents)} />
              <span className="text-sm text-subtle line-through">{formatUsd(TUITION.regularCents)}</span>
            </span>
            <span className="text-sm leading-relaxed text-subtle">{PAYMENT_OPTIONS["founding-full"].detail}</span>
          </OptionCard>
        ) : (
          <p className="border border-line bg-warm p-4 text-sm leading-relaxed text-subtle">
            Founding-family tuition closed on {FOUNDING_POLICY.deadlineLabel}.
          </p>
        )}

        <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink">
          <li>{`Available to the first ${FOUNDING_POLICY.seatsPerClass} qualifying, fully paid students in each class.`}</li>
          <li>{`Deadline: ${FOUNDING_POLICY.deadlineLabel}.`}</li>
          <li>
            {`Ends when ${FOUNDING_POLICY.seatsPerClass} qualifying seats are filled or the deadline passes, whichever comes first.`}
          </li>
          <li className="font-semibold">An enrollment inquiry alone does not reserve founding-family tuition.</li>
        </ul>
      </section>

      <section aria-labelledby="regular-heading" className="flex flex-col gap-3 border-t border-line pt-4">
        <h3 id="regular-heading" className="text-sm font-extrabold uppercase tracking-wider text-navy">
          Regular tuition
        </h3>
        <OptionCard
          name="tuition"
          value="regular-full"
          checked={value === "regular-full"}
          onSelect={() => onChange("regular-full")}
        >
          <span className="font-bold text-ink">Pay in full</span>
          <Price amount={formatUsd(TUITION.regularCents)} />
          <span className="text-sm leading-relaxed text-subtle">{PAYMENT_OPTIONS["regular-full"].detail}</span>
        </OptionCard>
        <OptionCard
          name="tuition"
          value="regular-installments"
          checked={value === "regular-installments"}
          onSelect={() => onChange("regular-installments")}
        >
          <span className="font-bold text-ink">3 installments</span>
          <Price amount={formatUsd(TUITION.installmentCents)} suffix="× 3" />
          <span className="text-sm leading-relaxed text-subtle">
            {`${PAYMENT_OPTIONS["regular-installments"].detail} Total ${formatUsd(TUITION.regularCents)}.`}
          </span>
        </OptionCard>
      </section>

      <p className="text-sm leading-relaxed text-subtle">
        No registration, materials, or processing fees. The price you see is the full tuition.
      </p>
    </fieldset>
  )
}

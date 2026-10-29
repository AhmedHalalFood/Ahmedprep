"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import {
  PAYMENT_OPTIONS,
  TUITION,
  formatUsd,
  startLabelFor,
  type ClassOffering,
  type PaymentOption,
  type Program,
} from "@/lib/enrollment-catalog"
import type { FamilyInfo } from "./family-step"

function Row({ label, value, onEdit }: { label: string; value: React.ReactNode; onEdit?: () => void }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-xs font-bold uppercase tracking-wider text-subtle">{label}</dt>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-sm font-bold text-brand underline underline-offset-2">
            Edit<span className="sr-only">{` ${label.toLowerCase()}`}</span>
          </button>
        )}
      </div>
      <dd className="text-pretty break-words text-sm leading-relaxed text-ink">{value}</dd>
    </div>
  )
}

export function CheckoutPreview({
  program,
  offering,
  family,
  payment,
  onEdit,
}: {
  program: Program
  offering: ClassOffering
  family: FamilyInfo
  payment: PaymentOption
  onEdit: (step: number) => void
}) {
  const [simulated, setSimulated] = useState(false)
  const option = PAYMENT_OPTIONS[payment]
  const totalCents = option.amountCents
  const savingsCents = TUITION.regularCents - totalCents

  return (
    <div className="flex flex-col gap-5">
      <p className="border-2 border-dashed border-gold-deep bg-cream px-3 py-2 text-sm font-bold leading-relaxed text-navy">
        DEMO / PREVIEW ONLY. Payments are not active yet. Nothing on this page charges a card or reserves a seat.
      </p>

      <dl className="flex flex-col">
        <Row label="Program" value={program.name} onEdit={() => onEdit(0)} />
        <Row
          label="Class"
          value={
            <span className="flex flex-col">
              <span className="font-semibold">{`${offering.label}: ${offering.days}, ${offering.time}`}</span>
              <span className="text-subtle">{startLabelFor(offering)}</span>
            </span>
          }
          onEdit={() => onEdit(1)}
        />
        <Row
          label="Student & parent"
          value={
            <span className="flex flex-col">
              <span>{`${family.studentName}, ${family.grade}`}</span>
              <span>{family.parentName}</span>
              <span className="text-subtle">{`${family.parentEmail} · ${family.phone}`}</span>
            </span>
          }
          onEdit={() => onEdit(2)}
        />
        <Row label="Tuition" value={option.title} onEdit={() => onEdit(3)} />
      </dl>

      <div className="flex flex-col gap-2 bg-navy p-4 text-primary-foreground">
        {savingsCents > 0 && (
          <>
            <div className="flex justify-between gap-3 text-sm">
              <span>Regular tuition</span>
              <span className="tabular-nums">{formatUsd(TUITION.regularCents)}</span>
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <span>{payment === "founding-full" ? "Founding-Family savings" : "Early payment savings (10%)"}</span>
              <span className="font-bold tabular-nums text-gold">{`−${formatUsd(savingsCents)}`}</span>
            </div>
          </>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-bold">Total due (full payment)</span>
          <span className="text-2xl font-extrabold tabular-nums">{formatUsd(totalCents)}</span>
        </div>
        <p className="text-sm leading-relaxed text-brand-soft">{option.detail}</p>
      </div>

      <p className="text-sm leading-relaxed text-subtle">
        Discounts cannot be combined. No installment plans. Enrollment is subject to available seats.
      </p>

      <button
        type="button"
        onClick={() => setSimulated(true)}
        className="flex min-h-12 items-center justify-center gap-2 bg-gold px-5 text-sm font-extrabold uppercase tracking-wide text-navy hover:bg-gold-hover"
      >
        <Lock className="size-4" aria-hidden />
        Continue to Secure Payment
      </button>

      <div aria-live="polite">
        {simulated && (
          <div className="flex flex-col gap-2 border border-brand bg-brand-soft p-4 text-sm leading-relaxed text-navy">
            <p className="font-extrabold">Demo stop: no payment was taken.</p>
            <p>
              In the live version, this button would open a secure Stripe-hosted payment page. Your seat and tuition
              would be confirmed only after Stripe verifies the payment. Nothing was saved or sent in this preview.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-subtle">
        AhmedPrep will never ask for card details on this site. Card payments will be handled entirely by Stripe.
      </p>
    </div>
  )
}

"use client"

import { Check, ChevronDown } from "lucide-react"
import {
  CLASS_DATES,
  HOURS_PER_CLASS,
  PRICE_PER_CLASS_CENTS,
  SAT_INTENSIVE_CAPACITY,
  formatClassDate,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  type ClassDate,
} from "@/lib/sat-final-intensive"

/** The one start-date control for enrollment; the registration form submits whatever date is chosen here. */
export function TuitionCalculator({
  available,
  selected,
  onSelect,
  error,
}: {
  available: ClassDate[]
  selected: ClassDate | null
  onSelect: (date: ClassDate) => void
  error?: string
}) {
  const quote = selected ? quoteFor(selected) : null

  return (
    <div id="tuition" className="flex scroll-mt-4 flex-col gap-5 rounded-2xl border-2 border-gold bg-paper p-5 shadow-sm sm:p-6 lg:sticky lg:top-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">Step 1 · Tuition</p>
        <h3 className="text-xl font-extrabold text-navy">Choose your student&apos;s first class</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-firstClassDate" className="text-sm font-bold text-navy">
          First class date
        </label>
        <select
          id="reg-firstClassDate"
          value={selected ?? ""}
          onChange={(e) => onSelect(e.target.value as ClassDate)}
          disabled={available.length === 0}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "reg-firstClassDate-error" : undefined}
          className={`min-h-12 w-full rounded-lg border-2 bg-paper px-4 text-base font-bold text-navy ${error ? "border-error" : "border-navy/20 focus:border-navy"}`}
        >
          {available.length === 0 && <option value="">Enrollment closed: all classes have started</option>}
          {CLASS_DATES.map((d) => {
            const open = available.includes(d)
            return (
              <option key={d} value={d} disabled={!open}>
                {formatClassDateLong(d)}
                {open ? "" : " (class started)"}
              </option>
            )
          })}
        </select>
        {error && (
          <p id="reg-firstClassDate-error" className="text-sm font-semibold text-error">
            {error}
          </p>
        )}
      </div>

      <dl aria-live="polite" className="grid grid-cols-3 overflow-hidden rounded-xl border border-line text-center">
        <Result label="Classes" value={quote ? String(quote.remainingClasses) : "–"} />
        <Result label="Hours" value={quote ? String(quote.remainingHours) : "–"} />
        <Result label="Due upfront" value={quote ? formatUsd(quote.tuitionCents) : "–"} highlight />
      </dl>

      <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink" aria-label="How payment works">
        {[
          `${formatUsd(PRICE_PER_CLASS_CENTS)} per 3-hour class for the classes that remain, paid in full upfront. No installments or drop-ins.`,
          "Pay by Zelle, cash, or check after AhmedPrep confirms availability. No payment is taken on this website.",
          `Sending the form does not reserve a seat. Classes are capped at ${SAT_INTENSIVE_CAPACITY} students.`,
        ].map((point) => (
          <li key={point} className="flex items-start gap-2">
            <Check size={16} strokeWidth={3} className="mt-1 shrink-0 text-gold-deep" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>

      <details className="group rounded-lg border border-line">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-bold text-navy [&::-webkit-details-marker]:hidden">
          Tuition for every start date
          <ChevronDown size={16} className="text-gold-deep transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[18rem] text-left text-sm">
            <caption className="sr-only">Tuition by first class date</caption>
            <thead className="bg-cream text-xs uppercase tracking-wider text-subtle">
              <tr>
                <th scope="col" className="px-3 py-2">First class</th>
                <th scope="col" className="px-3 py-2 text-right">Classes</th>
                <th scope="col" className="px-3 py-2 text-right">Hours</th>
                <th scope="col" className="px-3 py-2 text-right">Tuition</th>
              </tr>
            </thead>
            <tbody>
              {CLASS_DATES.map((d) => {
                const q = quoteFor(d)
                const open = available.includes(d)
                return (
                  <tr key={d} className={`border-t border-line ${d === selected ? "bg-sage-soft font-bold" : ""} ${open ? "" : "text-subtle line-through"}`}>
                    <th scope="row" className="px-3 py-2 font-semibold text-navy">{formatClassDate(d)}</th>
                    <td className="px-3 py-2 text-right">{q.remainingClasses}</td>
                    <td className="px-3 py-2 text-right">{q.remainingClasses * HOURS_PER_CLASS}</td>
                    <td className="px-3 py-2 text-right">{formatUsd(q.tuitionCents)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 px-2 py-3 ${highlight ? "bg-sage-soft" : "border-r border-line bg-cream"}`}>
      <dt className={`text-[11px] font-extrabold uppercase tracking-wider ${highlight ? "text-sage-deep" : "text-subtle"}`}>{label}</dt>
      <dd className={`text-2xl font-extrabold tabular-nums ${highlight ? "text-sage-deep" : "text-navy"}`}>{value}</dd>
    </div>
  )
}

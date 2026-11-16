"use client"

import { ArrowRight } from "lucide-react"
import {
  CLASS_DATES,
  HOURS_PER_CLASS,
  OFFLINE_PAYMENT_STATEMENT,
  PRICE_PER_CLASS_CENTS,
  formatClassDate,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  type ClassDate,
} from "@/lib/sat-final-intensive"

export function TuitionCalculator({
  available,
  selected,
  onSelect,
}: {
  available: ClassDate[]
  selected: ClassDate | null
  onSelect: (date: ClassDate) => void
}) {
  const quote = selected ? quoteFor(selected) : null

  return (
    <section id="tuition" aria-labelledby="tuition-title" className="scroll-mt-4 bg-warm py-16 md:py-20">
      <div className="container">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-2xl border-4 border-gold bg-white p-5 shadow-xl sm:p-8 md:p-10">
          <div className="flex flex-col gap-3 text-center">
            <p className="eyebrow blue">Rolling enrollment tuition</p>
            <h2 id="tuition-title" className="text-balance text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
              Calculate your tuition
            </h2>
            <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-subtle">
              Tuition is {formatUsd(PRICE_PER_CLASS_CENTS)} per student per 3-hour class. Choose your student’s first class and pay
              only for the classes that remain. Full tuition is due before enrollment is confirmed. No installments or individual drop-in classes.
            </p>
            <p className="mx-auto max-w-2xl rounded-lg bg-cream px-4 py-3 text-pretty font-extrabold leading-relaxed text-navy">
              {OFFLINE_PAYMENT_STATEMENT}
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col gap-2">
            <label htmlFor="calc-first-class" className="text-sm font-extrabold text-navy">
              Student’s first class date
            </label>
            <select
              id="calc-first-class"
              value={selected ?? ""}
              onChange={(e) => onSelect(e.target.value as ClassDate)}
              disabled={available.length === 0}
              className="min-h-14 w-full rounded-lg border-2 border-navy/20 bg-white px-4 text-base font-bold text-navy focus:border-navy"
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
          </div>

          <div aria-live="polite" className="grid gap-4 sm:grid-cols-3">
            <ResultCard label="Remaining Classes" value={quote ? String(quote.remainingClasses) : "–"} />
            <ResultCard label="Total Hours" value={quote ? String(quote.remainingHours) : "–"} />
            <ResultCard label="Tuition Due Upfront" value={quote ? formatUsd(quote.tuitionCents) : "–"} highlight />
          </div>

          {quote && (
            <p className="text-center text-lg font-extrabold text-navy">
              {quote.remainingClasses} {quote.remainingClasses === 1 ? "Class" : "Classes"} <span className="text-gold-deep">|</span>{" "}
              {quote.remainingHours} Hours <span className="text-gold-deep">|</span> {formatUsd(quote.tuitionCents)} Upfront
            </p>
          )}

          <a
            href="#register"
            className="mx-auto inline-flex min-h-14 w-full max-w-md items-center justify-center gap-2 rounded-md bg-coral px-8 text-base font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover"
          >
            Register for these classes <ArrowRight size={18} aria-hidden="true" />
          </a>

          <details className="group rounded-lg border border-line">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-bold text-navy [&::-webkit-details-marker]:hidden">
              View the full rolling-enrollment schedule
              <span className="text-gold-deep transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="overflow-x-auto border-t border-line">
              <table className="w-full min-w-[22rem] text-left text-sm">
                <caption className="sr-only">Tuition by first class date</caption>
                <thead className="bg-warm text-xs uppercase tracking-wider text-subtle">
                  <tr>
                    <th scope="col" className="px-4 py-3">First class</th>
                    <th scope="col" className="px-4 py-3 text-right">Classes</th>
                    <th scope="col" className="px-4 py-3 text-right">Hours</th>
                    <th scope="col" className="px-4 py-3 text-right">Tuition</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASS_DATES.map((d) => {
                    const q = quoteFor(d)
                    const open = available.includes(d)
                    return (
                      <tr key={d} className={`border-t border-line ${d === selected ? "bg-sage-soft font-bold" : ""} ${open ? "" : "text-subtle line-through"}`}>
                        <th scope="row" className="px-4 py-2.5 font-semibold text-navy">{formatClassDate(d)}</th>
                        <td className="px-4 py-2.5 text-right">{q.remainingClasses}</td>
                        <td className="px-4 py-2.5 text-right">{q.remainingClasses * HOURS_PER_CLASS}</td>
                        <td className="px-4 py-2.5 text-right">{formatUsd(q.tuitionCents)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-5 text-center ${
        highlight ? "border-sage bg-sage-soft" : "border-line bg-warm"
      }`}
    >
      <p className={`text-xs font-extrabold uppercase tracking-wider ${highlight ? "text-sage-deep" : "text-subtle"}`}>{label}</p>
      <p className={`text-4xl font-extrabold tabular-nums ${highlight ? "text-sage-deep" : "text-navy"}`}>{value}</p>
    </div>
  )
}

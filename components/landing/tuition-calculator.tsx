"use client"

import { useId, useState } from "react"
import { formatClassDate, formatUsd, tuitionFrom } from "@/lib/shsat-intensive"

/** Lets a parent see tuition for a later first class. `dates` comes from the server so it matches the rest of the page. */
export function TuitionCalculator({ dates }: { dates: string[] }) {
  const id = useId()
  const [startDate, setStartDate] = useState(dates[0])
  if (!startDate) return null
  const { classes, hours, tuition } = tuitionFrom(startDate)

  return (
    <div className="flex flex-col gap-3 border border-white/20 bg-white/5 p-4 md:p-5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-white/80">
        Starting on a later date? Choose the first class your child will attend
      </label>
      <select
        id={id}
        value={startDate}
        onChange={(event) => setStartDate(event.target.value)}
        className="min-h-12 w-full border border-white/30 bg-navy px-3 text-base font-semibold text-white focus:border-gold focus:outline-none"
      >
        {dates.map((date) => (
          <option key={date} value={date}>
            {formatClassDate(date, "long")}
          </option>
        ))}
      </select>
      <p aria-live="polite" className="text-pretty leading-relaxed text-white/90">
        <span className="font-semibold">{classes} remaining classes</span>
        <span className="px-1.5 text-white/40" aria-hidden="true">
          {"\u2022"}
        </span>
        <span className="font-semibold">{hours} instructional hours</span>
        <span className="px-1.5 text-white/40" aria-hidden="true">
          {"\u2022"}
        </span>
        <span className="text-xl font-extrabold text-gold">{formatUsd(tuition)}</span>
      </p>
    </div>
  )
}

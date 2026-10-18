"use client"

import { useId, useState } from "react"
import { LATE_ENROLLMENT_START, LATE_START_DATES, formatClassDate, formatUsd, tuitionFrom } from "@/lib/shsat-intensive"

export function TuitionCalculator() {
  const id = useId()
  const [startDate, setStartDate] = useState(LATE_ENROLLMENT_START)
  const { classes, hours, tuition } = tuitionFrom(startDate)

  return (
    <div className="flex flex-col gap-3 border border-white/20 bg-white/5 p-4 md:p-5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-white/80">
        Joining midweek? Choose the first class your child will attend
      </label>
      <select
        id={id}
        value={startDate}
        onChange={(event) => setStartDate(event.target.value)}
        className="min-h-12 w-full border border-white/30 bg-navy px-3 text-base font-semibold text-white focus:border-gold focus:outline-none"
      >
        {LATE_START_DATES.map((date) => (
          <option key={date} value={date}>
            {formatClassDate(date, "long")}
          </option>
        ))}
      </select>
      <p aria-live="polite" className="text-pretty leading-relaxed text-white/90">
        <span className="font-semibold">{classes} remaining classes</span>
        <span className="px-1.5 text-white/40" aria-hidden="true">
          {"•"}
        </span>
        <span className="font-semibold">{hours} instructional hours</span>
        <span className="px-1.5 text-white/40" aria-hidden="true">
          {"•"}
        </span>
        <span className="text-xl font-extrabold text-gold">{formatUsd(tuition)}</span>
      </p>
    </div>
  )
}

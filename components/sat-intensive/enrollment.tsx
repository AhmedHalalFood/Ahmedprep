"use client"

import { useEffect, useMemo, useState } from "react"
import { availableStartDates, type ClassDate } from "@/lib/sat-final-intensive"
import { Registration } from "@/components/sat-intensive/registration"

/** Shares the chosen first class between the calculator and the form, and closes dates as their 6 PM ET start passes. */
export function SatIntensiveEnrollment({ renderedAt }: { renderedAt: string }) {
  const [now, setNow] = useState(() => new Date(renderedAt))
  const available = useMemo(() => availableStartDates(now), [now])
  const [chosen, setChosen] = useState<ClassDate | null>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const selected = chosen && available.includes(chosen) ? chosen : (available[0] ?? null)

  return <Registration available={available} selected={selected} onSelect={setChosen} />
}

import Link from "next/link"
import { ArrowRight, CalendarCheck, ListChecks } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import type { EventName } from "@/lib/analytics"
import type { ProgramId } from "@/lib/cohorts-2027"

export function ProgramCtas({
  program,
  location,
  diagnosticEvent,
  className = "",
  compact = false,
}: {
  program: ProgramId
  location: string
  diagnosticEvent: EventName
  className?: string
  compact?: boolean
}) {
  const enrollHref = `/enroll-2027?${new URLSearchParams({ program })}`
  return (
    <div className={compact ? `grid grid-cols-1 gap-2 sm:grid-cols-3 ${className}` : `flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <TrackedLink
        href="#diagnostic"
        event={diagnosticEvent}
        eventProps={{ location }}
        className={compact ? "button button-gold min-h-13 min-w-0 px-2 py-3 text-center text-[11px] leading-tight sm:text-xs" : "button button-gold button-lg justify-center"}
      >
        <CalendarCheck size={16} className="shrink-0" aria-hidden="true" />
        {compact ? "Free Diagnostic" : "Book Free Diagnostic"}
      </TrackedLink>
      <Link href="/programs-2027" className={compact ? "button button-outline min-h-13 min-w-0 px-2 py-3 text-center text-[11px] leading-tight sm:text-xs" : "button button-outline button-lg justify-center"}>
        <ListChecks size={16} className="shrink-0" aria-hidden="true" />
        {compact ? "Programs & Pricing" : "View Programs & Pricing"}
      </Link>
      <Link href={enrollHref} className={compact ? "button button-outline min-h-13 min-w-0 px-2 py-3 text-center text-[11px] leading-tight sm:text-xs" : "button button-outline button-lg justify-center"}>
        Enroll for 2027 <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
      </Link>
    </div>
  )
}

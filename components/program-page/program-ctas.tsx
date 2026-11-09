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
}: {
  program: ProgramId
  location: string
  diagnosticEvent: EventName
  className?: string
}) {
  const enrollHref = `/enroll-2027?${new URLSearchParams({ program })}`
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <TrackedLink
        href="#diagnostic"
        event={diagnosticEvent}
        eventProps={{ location }}
        className="button button-gold button-lg justify-center"
      >
        <CalendarCheck size={18} aria-hidden="true" />
        Book Free Diagnostic
      </TrackedLink>
      <Link href="/programs-2027" className="button button-outline button-lg justify-center">
        <ListChecks size={18} aria-hidden="true" />
        View Programs &amp; Pricing
      </Link>
      <Link href={enrollHref} className="button button-outline button-lg justify-center">
        Enroll for 2027 <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  )
}

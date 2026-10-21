import { Table2 } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { INTENSIVE_PATH, TUITION_SCHEDULE_ID } from "@/lib/shsat-intensive"

export const TUITION_SCHEDULE_HREF = `${INTENSIVE_PATH}#${TUITION_SCHEDULE_ID}`

/** Secondary action that goes straight to the prorated tuition table on the Intensive page. */
export function TuitionScheduleLink({ location, className = "" }: { location: string; className?: string }) {
  return (
    <TrackedLink
      href={TUITION_SCHEDULE_HREF}
      event={EVENTS.shsatIntensiveClick}
      eventProps={{ location, lead_stage: "tuition_schedule_view" }}
      className={`button button-navy-outline uppercase ${className}`}
    >
      <Table2 size={16} aria-hidden="true" />
      View Tuition Schedule
    </TrackedLink>
  )
}

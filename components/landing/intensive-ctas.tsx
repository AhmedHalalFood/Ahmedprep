import { Phone } from "lucide-react"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TuitionScheduleLink } from "@/components/landing/tuition-schedule-link"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

/** Enrollment calls to action: open the enrollment form, jump to the tuition table, or call. */
export function IntensiveCtas({
  location,
  showEnroll = true,
  showSchedule = true,
}: {
  location: string
  showEnroll?: boolean
  showSchedule?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {showEnroll && <ReserveSeatDialog location={location} />}
      {showEnroll && showSchedule && (
        <TuitionScheduleLink location={location} className="button-lg justify-center" />
      )}
      <TrackedLink
        href={BUSINESS.phoneHref}
        event={EVENTS.phoneClick}
        eventProps={{ location }}
        className="button button-lg justify-center border border-white/40 uppercase text-white hover:border-gold hover:text-gold"
      >
        <Phone size={16} aria-hidden="true" />
        {`Call ${BUSINESS.phoneDisplay}`}
      </TrackedLink>
    </div>
  )
}

import { Phone } from "lucide-react"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

/** The two enrollment calls to action: open the enrollment form, or call. */
export function IntensiveCtas({ location, showEnroll = true }: { location: string; showEnroll?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {showEnroll && <ReserveSeatDialog location={location} />}
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

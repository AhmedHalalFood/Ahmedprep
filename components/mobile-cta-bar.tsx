"use client"

import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"

export function MobileCtaBar({ showIntensive }: { showIntensive: boolean }) {
  return (
    <nav className="mobile-cta-bar" aria-label="Quick contact">
      <TrackedLink href={BUSINESS.phoneHref} event={EVENTS.phoneClick} eventProps={{ location: "mobile_bar" }} aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <Phone size={15} aria-hidden="true" />
        Call
      </TrackedLink>
      <TrackedLink href={BUSINESS.smsHref} event={EVENTS.textClick} eventProps={{ location: "mobile_bar" }} aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <MessageSquare size={15} aria-hidden="true" />
        Text
      </TrackedLink>
      {showIntensive ? (
        <ReserveSeatDialog
          location="mobile_bar"
          trigger={
            <button type="button" className="mobile-cta-primary">
              Reserve a Seat <ArrowRight size={15} aria-hidden="true" />
            </button>
          }
        />
      ) : (
        <TrackedLink
          href={ENROLLMENT_2027.requestHref}
          event={EVENTS.programCtaClick}
          eventProps={{ location: "mobile_bar", cta: "request_enrollment_info" }}
          className="mobile-cta-primary"
        >
          Reserve a Seat <ArrowRight size={15} aria-hidden="true" />
        </TrackedLink>
      )}
    </nav>
  )
}

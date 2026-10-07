"use client"

import type { MouseEvent } from "react"
import { CalendarCheck, MessageSquare, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

export function MobileCtaBar() {
  // Prefer the diagnostic form on the current page; otherwise navigate to the dedicated page.
  const scrollToForm = (e: MouseEvent<HTMLAnchorElement>) => {
    const form = document.getElementById("diagnostic")
    if (!form) return
    e.preventDefault()
    form.scrollIntoView({ behavior: "smooth", block: "start" })
    history.replaceState(null, "", "#diagnostic")
  }

  return (
    <nav className="mobile-cta-bar" aria-label="Quick contact">
      <TrackedLink href={BUSINESS.phoneHref} event={EVENTS.phoneClick} eventProps={{ location: "mobile_bar" }} aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <Phone size={18} aria-hidden="true" />
        Call
      </TrackedLink>
      <TrackedLink href={BUSINESS.smsHref} event={EVENTS.textClick} eventProps={{ location: "mobile_bar" }} aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <MessageSquare size={18} aria-hidden="true" />
        Text
      </TrackedLink>
      <TrackedLink
        href="/free-diagnostic"
        event={EVENTS.diagnosticCtaClick}
        eventProps={{ location: "mobile_bar" }}
        onClick={scrollToForm}
        className="mobile-cta-primary"
      >
        <CalendarCheck size={18} aria-hidden="true" />
        Free Diagnostic
      </TrackedLink>
    </nav>
  )
}

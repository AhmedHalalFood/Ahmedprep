"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { ReserveSeatDialog } from "@/components/landing/reserve-seat-dialog"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"

export function MobileCtaBar({ showIntensive }: { showIntensive: boolean }) {
  const pathname = usePathname()
  const [formVisible, setFormVisible] = useState(false)

  // The inquiry form has its own real submit button. Hide the competing sticky
  // enrollment shortcut while that section is on screen, but keep Call / Text.
  useEffect(() => {
    setFormVisible(false)
    if (pathname !== "/enroll-2027") return
    const section = document.getElementById("inquiry-form")
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -64px 0px", threshold: 0 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [pathname])

  const showEnrollmentShortcut = !(pathname === "/enroll-2027" && formVisible)

  return (
    <nav
      className="mobile-cta-bar"
      aria-label="Quick contact"
      style={showEnrollmentShortcut ? undefined : { gridTemplateColumns: "1fr 1fr" }}
    >
      <TrackedLink href={BUSINESS.phoneHref} event={EVENTS.phoneClick} eventProps={{ location: "mobile_bar" }} aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <Phone size={15} aria-hidden="true" />
        Call
      </TrackedLink>
      <TrackedLink href={BUSINESS.smsHref} event={EVENTS.textClick} eventProps={{ location: "mobile_bar" }} aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <MessageSquare size={15} aria-hidden="true" />
        Text
      </TrackedLink>
      {showEnrollmentShortcut && (showIntensive ? (
        <ReserveSeatDialog
          location="mobile_bar"
          trigger={
            <button type="button" className="mobile-cta-primary">
              Request Enrollment <ArrowRight size={15} aria-hidden="true" />
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
          Request Enrollment <ArrowRight size={15} aria-hidden="true" />
        </TrackedLink>
      ))}
    </nav>
  )
}

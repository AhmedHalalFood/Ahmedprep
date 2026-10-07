import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import styles from "./top-contact-bar.module.css"

export function TopContactBar() {
  return (
    <>
    <TrackedLink
      href="/free-shsat-class"
      event={EVENTS.freeShsatClassCtaClicked}
      eventProps={{ location: "top_announcement" }}
      className={styles.announce}
    >
      <span>Free Live SHSAT Class • Every Sunday 4–5 PM • RSVP Required</span>
      <ArrowRight size={14} aria-hidden="true" />
    </TrackedLink>
    <div className={`contact-strip ${styles.strip}`}>
      <div className={styles.inner}>
        <span className={styles.label}>SHSAT &amp; Digital SAT prep in Astoria, Queens</span>
        <TrackedLink
          href={BUSINESS.phoneHref}
          event={EVENTS.phoneClick}
          eventProps={{ location: "top_bar" }}
          className={styles.phone}
          aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}
        >
          <Phone size={16} aria-hidden="true" />
          <span>
            Call AhmedPrep: <strong>{BUSINESS.phoneDisplay}</strong>
          </span>
        </TrackedLink>
        <TrackedLink
          href={BUSINESS.smsHref}
          event={EVENTS.textClick}
          eventProps={{ location: "top_bar" }}
          className={styles.text}
          aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}
        >
          <MessageSquare size={15} aria-hidden="true" />
          Text us
        </TrackedLink>
      </div>
    </div>
    </>
  )
}

import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import styles from "./top-contact-bar.module.css"

export function TopContactBar() {
  return (
    <div className={`contact-strip ${styles.strip}`}>
      <div className={styles.inner}>
        <TrackedLink
          href="/free-shsat-class"
          event={EVENTS.freeShsatClassCtaClicked}
          eventProps={{ location: "top_announcement" }}
          className={styles.announce}
        >
          <span className={styles.tag}>Free</span>
          <span>
            Live SHSAT Class <span className={styles.sep} aria-hidden="true">•</span> Sundays 4–5 PM{" "}
            <span className={styles.sep} aria-hidden="true">•</span> RSVP
          </span>
          <ArrowRight size={13} aria-hidden="true" />
        </TrackedLink>
        <div className={styles.contact}>
          <TrackedLink
            href={BUSINESS.phoneHref}
            event={EVENTS.phoneClick}
            eventProps={{ location: "top_bar" }}
            className={styles.phone}
            aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}
          >
            <Phone size={14} aria-hidden="true" />
            <strong>{BUSINESS.phoneDisplay}</strong>
          </TrackedLink>
          <TrackedLink
            href={BUSINESS.smsHref}
            event={EVENTS.textClick}
            eventProps={{ location: "top_bar" }}
            className={styles.text}
            aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}
          >
            <MessageSquare size={13} aria-hidden="true" />
            Text us
          </TrackedLink>
        </div>
      </div>
    </div>
  )
}

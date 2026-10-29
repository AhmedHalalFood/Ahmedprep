import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { scheduleSummary } from "@/lib/free-class"
import styles from "./top-contact-bar.module.css"

export function TopContactBar() {
  return (
    <div className={`contact-strip ${styles.strip}`}>
      <div className={styles.inner}>
        <TrackedLink
          href="/free-sunday-classes"
          event={EVENTS.sundayClassCtaClick}
          eventProps={{ location: "top_announcement" }}
          className={styles.announce}
        >
          <span className={styles.tag}>Free</span>
          {scheduleSummary().schedule === "weekly_2026" ? (
            <span>
              Live SHSAT & Digital SAT Zoom Classes — Sundays 4:00–5:00 PM ET{" "}
              <span className={styles.sep} aria-hidden="true">•</span> New schedule from Jan 10, 2027{" "}
              <span className={styles.sep} aria-hidden="true">•</span> RSVP
            </span>
          ) : (
            <span>
              Live SHSAT & Digital SAT Zoom Classes — Every Other Sunday{" "}
              <span className={styles.sep} aria-hidden="true">•</span> SHSAT: 6:00–6:45 PM ET{" "}
              <span className={styles.sep} aria-hidden="true">•</span> Digital SAT: 7:00–7:45 PM ET{" "}
              <span className={styles.sep} aria-hidden="true">•</span> RSVP
            </span>
          )}
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

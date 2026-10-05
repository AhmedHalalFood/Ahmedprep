import { Phone } from "lucide-react"
import { BUSINESS } from "@/lib/business"
import styles from "./top-contact-bar.module.css"

export function TopContactBar() {
  return (
    <div className={`contact-strip ${styles.strip}`}>
      <div className={styles.inner}>
        <span className={styles.label}>Questions about SHSAT or Digital SAT prep?</span>
        <a href={BUSINESS.phoneHref} className={styles.phone} aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}>
          <Phone size={16} aria-hidden="true" />
          <span>
            Call AhmedPrep: <strong>{BUSINESS.phoneDisplay}</strong>
          </span>
        </a>
      </div>
    </div>
  )
}

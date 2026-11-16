import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { BUSINESS } from "@/lib/business"

/**
 * Sits exactly over the site-wide mobile bar on this page only, so the reserved bottom space is unchanged and no extra
 * content is covered, while the primary action points to this program's registration instead of 2027 enrollment.
 */
export function SatIntensiveMobileBar() {
  return (
    <nav className="mobile-cta-bar sat-intensive-mobile-bar" aria-label="Digital SAT Final Intensive quick actions">
      <a href={BUSINESS.phoneHref} aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <Phone size={15} aria-hidden="true" />
        Call
      </a>
      <a href={BUSINESS.smsHref} aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}>
        <MessageSquare size={15} aria-hidden="true" />
        Text
      </a>
      <a href="#register" className="mobile-cta-primary">
        Request Enrollment <ArrowRight size={15} aria-hidden="true" />
      </a>
    </nav>
  )
}

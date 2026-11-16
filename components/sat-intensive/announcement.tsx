import Link from "next/link"
import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { BUSINESS } from "@/lib/business"
import { SAT_INTENSIVE_PATH, formatUsd, satIntensiveUrgency } from "@/lib/sat-final-intensive"

const iconLinkClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"

/** Temporary promotion for the December 2026 intensive. Renders nothing once the last class has started. */
export function SatIntensiveAnnouncement() {
  const urgency = satIntensiveUrgency()
  if (!urgency) return null
  const { quote, isFirstClass } = urgency

  const details = [
    "Mon – Thu, 6–9 PM",
    `In person · ${BUSINESS.address.street}, Astoria`,
    "Max 12 students",
    isFirstClass
      ? `${formatUsd(quote.tuitionCents)} upfront`
      : `${formatUsd(quote.tuitionCents)} upfront for ${quote.remainingClasses} remaining ${quote.remainingClasses === 1 ? "class" : "classes"}`,
  ]

  return (
    <section aria-labelledby="sat-intensive-announcement-title" className="border-b-2 border-gold bg-navy text-cream">
      <div className="container flex flex-col gap-2.5 py-2.5 md:flex-row md:items-center md:justify-between md:gap-6 md:py-3">
        <div className="flex min-w-0 flex-col gap-0.5 md:gap-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gold">{urgency.examCountdown}</p>
          <h2 id="sat-intensive-announcement-title" className="text-balance text-base font-extrabold leading-snug text-cream md:text-lg">
            Digital SAT Final Intensive: <span className="text-gold">{urgency.nextClassLabel}</span>
          </h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-sm leading-relaxed text-cream/85 md:flex md:flex-wrap">
            {details.map((detail, i) => (
              <li key={detail} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="hidden text-gold/70 md:inline">
                    ·
                  </span>
                )}
                {detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`${SAT_INTENSIVE_PATH}#register`}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-coral px-5 text-sm font-extrabold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-coral-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:flex-none"
          >
            Request Enrollment
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href={BUSINESS.phoneHref} aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`} className={iconLinkClass}>
            <Phone size={18} aria-hidden="true" />
          </a>
          <a href={BUSINESS.smsHref} aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`} className={iconLinkClass}>
            <MessageSquare size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

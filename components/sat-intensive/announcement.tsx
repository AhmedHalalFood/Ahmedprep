import Link from "next/link"
import { ArrowRight, MessageSquare, Phone } from "lucide-react"
import { BUSINESS } from "@/lib/business"
import {
  CLASS_DATES,
  HOURS_PER_CLASS,
  PRICE_PER_CLASS_CENTS,
  SAT_INTENSIVE_CAPACITY,
  SAT_INTENSIVE_PATH,
  formatClassDate,
  formatUsd,
  quoteFor,
  satIntensiveUrgency,
} from "@/lib/sat-final-intensive"

const iconLinkClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"

const FULL_PROGRAM_CENTS = quoteFor(CLASS_DATES[0]).tuitionCents

/** Temporary promotion for the December 2026 intensive. Renders nothing once the last class has started. */
export function SatIntensiveAnnouncement() {
  const urgency = satIntensiveUrgency()
  if (!urgency) return null
  const { quote, isFirstClass } = urgency
  const classWord = quote.remainingClasses === 1 ? "class" : "classes"

  const details = [
    { primary: "Nov 16 – Dec 3, 2026", secondary: "Rolling enrollment" },
    { primary: "Mon – Thu, 6–9 PM ET", secondary: "No class Nov 26" },
    { primary: "In person, Astoria", secondary: BUSINESS.address.street },
    { primary: `Max ${SAT_INTENSIVE_CAPACITY} students`, secondary: "Per class" },
  ]

  return (
    <section aria-labelledby="sat-intensive-announcement-title" className="border-b-2 border-gold bg-navy text-cream">
      <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-8 md:py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">{urgency.examCountdown}</p>
            <h2
              id="sat-intensive-announcement-title"
              className="text-balance text-base font-extrabold leading-snug text-cream md:text-lg"
            >
              Digital SAT Final Intensive: <span className="text-gold">{urgency.nextClassLabel}</span>
            </h2>
          </div>

          <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm leading-snug min-[360px]:grid-cols-2 lg:grid-cols-4">
            {details.map((d) => (
              <li key={d.primary} className="flex min-w-0 flex-col">
                <span className="whitespace-nowrap font-semibold text-cream">{d.primary}</span>
                <span className="whitespace-nowrap text-cream/75">{d.secondary}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-0.5 border-t border-gold/30 pt-2 text-sm leading-snug">
            <p className="font-bold text-cream">
              <span className="text-gold">{formatUsd(PRICE_PER_CLASS_CENTS)}</span> per {HOURS_PER_CLASS}-hour class, per
              student
            </p>
            <p className="text-cream/85">
              Full {CLASS_DATES.length}-class program: <span className="font-semibold text-cream">{formatUsd(FULL_PROGRAM_CENTS)}</span>
            </p>
            {!isFirstClass && (
              <p className="text-cream/85">
                Starting {formatClassDate(quote.firstClassDate)}:{" "}
                <span className="font-semibold text-gold">
                  {formatUsd(quote.tuitionCents)} for {quote.remainingClasses} remaining {classWord}
                </span>
              </p>
            )}
            <p className="text-pretty text-cream/75">
              Rolling enrollment available. Pay upfront for remaining classes; seats are confirmed after full payment.
            </p>
          </div>
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

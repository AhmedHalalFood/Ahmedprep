import Link from "next/link"
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react"
import { BUSINESS } from "@/lib/business"
import {
  CLASS_DATES,
  SAT_INTENSIVE_CAPACITY,
  SAT_INTENSIVE_PATH,
  formatClassDateLong,
  formatUsd,
  quoteFor,
  satIntensiveUrgency,
} from "@/lib/sat-final-intensive"

const FULL_PROGRAM_CENTS = quoteFor(CLASS_DATES[0]).tuitionCents

function ExamDateBadge({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 flex-col items-center overflow-hidden rounded-lg border-2 border-gold bg-cream text-navy shadow-md ${className}`}
    >
      <span className="w-full bg-gold py-0.5 text-center text-[10px] font-extrabold uppercase tracking-widest text-navy">
        Dec
      </span>
      <span className="text-3xl font-black leading-none md:text-4xl">5</span>
      <span className="pb-1 text-[10px] font-extrabold uppercase tracking-widest">SAT</span>
    </div>
  )
}

/** Temporary promotion for the December 2026 intensive. Renders nothing once the last class has started. */
export function SatIntensiveAnnouncement() {
  const urgency = satIntensiveUrgency()
  if (!urgency) return null
  const { quote, isFirstClass } = urgency
  const startLabel = isFirstClass ? "Start" : "Next class"

  return (
    <section aria-labelledby="sat-intensive-announcement-title" className="border-b-4 border-gold bg-navy text-cream">
      <div className="container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <ExamDateBadge className="w-14 md:w-16" />

          <div className="flex min-w-0 flex-col gap-1.5">
            <h2
              id="sat-intensive-announcement-title"
              className="text-balance text-lg font-extrabold leading-tight text-cream md:text-2xl"
            >
              December 5 <span className="text-gold">Digital SAT Final Intensive</span>
            </h2>
            <p className="text-sm font-bold leading-snug text-cream md:text-base">
              {startLabel}: {formatClassDateLong(quote.firstClassDate)}
            </p>
            <ul className="flex flex-col gap-1 text-sm leading-snug text-cream/85 sm:flex-row sm:flex-wrap sm:gap-x-4">
              <li className="flex items-center gap-1.5">
                <Clock size={16} aria-hidden="true" className="shrink-0 text-gold" />
                Mon – Thu, 6:00 – 9:00 PM
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={16} aria-hidden="true" className="shrink-0 text-gold" />
                In person, Astoria, Queens
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-gold/30 pt-3 lg:w-48 lg:shrink-0 lg:items-center lg:border-x lg:border-t-0 lg:px-6 lg:pt-0 lg:text-center">
          {isFirstClass ? (
            <>
              <p className="flex items-baseline gap-2 lg:flex-col lg:items-center lg:gap-0">
                <span className="text-3xl font-black leading-none text-gold md:text-4xl">
                  {formatUsd(FULL_PROGRAM_CENTS)}
                </span>
                <span className="text-sm font-semibold text-cream">Upfront tuition</span>
              </p>
              <p className="text-xs text-cream/75">For students starting Nov 16</p>
            </>
          ) : (
            <p className="text-pretty text-sm font-semibold leading-snug text-cream">
              Rolling enrollment available. Contact AhmedPrep for remaining sessions and tuition details.
            </p>
          )}
          <span className="mt-1 inline-flex w-fit rounded-full bg-cream/15 px-3 py-0.5 text-xs font-bold text-cream">
            Max {SAT_INTENSIVE_CAPACITY} students
          </span>
        </div>

        <div className="flex flex-col gap-2 lg:w-72 lg:shrink-0">
          <Link
            href={`${SAT_INTENSIVE_PATH}#register`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gold px-4 text-center text-sm font-extrabold text-navy shadow-md transition-colors hover:bg-gold/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            View Intensive & Request Enrollment
            <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
          </Link>
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cream/70 px-4 text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Phone size={16} aria-hidden="true" className="shrink-0" />
            Call or Text {BUSINESS.phoneDisplay}
          </a>
          {isFirstClass && (
            <p className="text-center text-xs italic text-cream/75">Rolling enrollment available after Nov 16</p>
          )}
        </div>
      </div>
    </section>
  )
}

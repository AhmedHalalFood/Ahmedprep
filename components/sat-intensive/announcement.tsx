import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Users,
  type LucideIcon,
} from "lucide-react"
import { BUSINESS } from "@/lib/business"
import { SAT_INTENSIVE_PATH, isSatIntensiveEnrollmentOpen } from "@/lib/sat-final-intensive"

const DETAILS: { Icon: LucideIcon; text: string }[] = [
  { Icon: CalendarDays, text: "November 16 – December 3, 2026" },
  { Icon: Clock, text: "Monday – Thursday, 6:00 – 9:00 PM" },
  { Icon: MapPin, text: "In person, Astoria, Queens" },
  { Icon: Users, text: "Maximum 12 students" },
  { Icon: RefreshCw, text: "Rolling enrollment available" },
  { Icon: DollarSign, text: "$75 per 3-hour session" },
]

/** Temporary promotion for the December 2026 intensive. Renders nothing once the last class has started. */
export function SatIntensiveAnnouncement() {
  if (!isSatIntensiveEnrollmentOpen()) return null
  return (
    <section
      aria-labelledby="sat-intensive-announcement-title"
      className="border-b-4 border-gold bg-navy text-cream"
    >
      <div className="container flex flex-col gap-5 py-6 md:gap-6 md:py-10">
        <div className="flex flex-col gap-2">
          <p className="inline-flex w-fit items-center rounded-full bg-gold px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-navy">
            December 5, 2026 SAT preparation
          </p>
          <h2
            id="sat-intensive-announcement-title"
            className="text-balance text-2xl font-extrabold uppercase leading-tight tracking-tight text-cream md:text-4xl"
          >
            Digital SAT Final Intensive:{" "}
            <span className="text-gold">Classes begin November 16!</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={SAT_INTENSIVE_PATH}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-coral px-8 text-lg font-extrabold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-coral-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Enroll Now
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
          <div className="flex items-stretch gap-2">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-md border-2 border-gold px-4 text-sm font-extrabold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-navy sm:flex-none md:text-base"
            >
              <Phone size={18} aria-hidden="true" />
              Call or text: {BUSINESS.phoneDisplay}
            </a>
            <a
              href={BUSINESS.smsHref}
              aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}
              className="inline-flex min-h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-gold text-gold transition-colors hover:bg-gold hover:text-navy"
            >
              <MessageSquare size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm leading-relaxed sm:grid-cols-2 md:text-base lg:grid-cols-3">
          {DETAILS.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon size={18} className="shrink-0 text-gold" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-1 border-t border-cream/20 pt-4 text-sm leading-relaxed text-cream/85">
          <p>Full tuition for all remaining sessions is required before enrollment is confirmed.</p>
          <p className="font-bold text-gold">No class on Thanksgiving, Thursday, November 26.</p>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { ArrowRight, CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { SAT_INTENSIVE_CAPACITY, SAT_INTENSIVE_PATH, satIntensiveUrgency } from "@/lib/sat-final-intensive"

const DETAILS = [
  { icon: CalendarDays, label: "Monday – Thursday" },
  { icon: Clock, label: "6:00 – 9:00 PM" },
  { icon: MapPin, label: "In person, Astoria, Queens" },
  { icon: Users, label: `Maximum ${SAT_INTENSIVE_CAPACITY} students` },
]

/** Temporary promotion for the December 2026 intensive. Renders nothing once the last class has started. */
export function SatIntensiveAnnouncement() {
  const urgency = satIntensiveUrgency()
  if (!urgency) return null

  return (
    <section aria-labelledby="sat-intensive-announcement-title" className="bg-cream py-3 md:py-4">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border border-[#C7DCE9] bg-[#ECF5FA] text-navy shadow-sm">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gold" />

          <div className="flex flex-col gap-4 px-5 py-5 md:px-8 md:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-emerald-900">
                  <span aria-hidden="true" className="size-2 rounded-full bg-emerald-600" />
                  {urgency.isFirstClass ? "Enrollment Open" : "Classes Underway · Enrollment Open"}
                </span>
                <span className="inline-flex items-center rounded-full bg-gold px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-navy">
                  Dec 5 SAT
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h2
                  id="sat-intensive-announcement-title"
                  className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl"
                >
                  Digital SAT Final Intensive
                </h2>
                <p className="text-pretty text-sm font-semibold leading-relaxed text-ink md:text-base">
                  {urgency.isFirstClass
                    ? "Starting November 16. Rolling enrollment is open for the December 5 SAT."
                    : "Classes started November 16. New students can request to join the remaining sessions for the December 5 SAT."}
                </p>
                <p className="text-sm font-extrabold text-blue-800">{urgency.nextClassLabel}</p>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
                {DETAILS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon size={16} aria-hidden="true" className="shrink-0 text-brand" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:shrink-0 lg:flex-col lg:items-stretch lg:text-center">
              <Link
                href={`${SAT_INTENSIVE_PATH}#register`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold px-6 text-base font-extrabold text-navy shadow-sm transition-colors hover:bg-gold/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                Request to Join
                <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
              </Link>
              <p className="text-pretty text-xs leading-relaxed text-subtle lg:max-w-56">
                Rolling enrollment for remaining classes. Seat availability is confirmed by AhmedPrep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

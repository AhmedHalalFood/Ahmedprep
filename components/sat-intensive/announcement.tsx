import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SAT_INTENSIVE_PATH, isSatIntensiveEnrollmentOpen } from "@/lib/sat-final-intensive"

/** Temporary promotion for the December 2026 intensive. Renders nothing once the last class has started. */
export function SatIntensiveAnnouncement({ className = "" }: { className?: string }) {
  if (!isSatIntensiveEnrollmentOpen()) return null
  return (
    <aside aria-label="Digital SAT Final Intensive" className={`border-y border-gold/40 bg-cream ${className}`}>
      <div className="container flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">Now enrolling · Astoria, Queens</p>
          <p className="text-pretty font-extrabold leading-snug text-navy">
            Digital SAT Final Intensive for the December 5 SAT
          </p>
          <p className="text-pretty text-sm leading-relaxed text-ink">
            Nov 16 – Dec 3, Mon–Thu 6–9 PM, in person, max 12 students. Join any remaining class at $75 per class.
          </p>
        </div>
        <Link
          href={SAT_INTENSIVE_PATH}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-coral px-6 font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover"
        >
          Enroll Now
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}

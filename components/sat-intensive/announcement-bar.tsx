import Link from "next/link"
import { ArrowRight, Megaphone } from "lucide-react"
import { SAT_INTENSIVE_PATH, satIntensiveUrgency } from "@/lib/sat-final-intensive"

/** One homepage announcement for the December 2026 intensive. Automatically disappears after the last class starts. */
export function SatIntensiveAnnouncementBar() {
  const urgency = satIntensiveUrgency()
  if (!urgency) return null

  return (
    <aside aria-label="December 5 Digital SAT Final Intensive enrollment" className="border-y border-[#E9D7A2] bg-[#FFF8E8] text-navy">
      <div className="container py-2.5 md:py-3">
        <div className="flex flex-col gap-3 rounded-xl border border-[#E5D4AB] bg-[#FFFCF5] px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy">
                <Megaphone size={14} aria-hidden="true" />
                Dec 5 SAT
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-900">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-600" />
                {urgency.isFirstClass ? "Starting Nov 16 · Enrollment Open" : "Classes Underway · Rolling Enrollment Open"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
              <p className="text-base font-extrabold leading-snug text-navy md:text-lg">Digital SAT Final Intensive</p>
              <p className="text-xs font-medium leading-relaxed text-ink md:text-sm">
                Mon–Thu, 6–9 PM · Astoria, Queens · $75 per 3-hour class
              </p>
            </div>
          </div>
          <Link
            href={`${SAT_INTENSIVE_PATH}#register`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-navy px-5 py-2 text-sm font-extrabold text-white transition-colors hover:bg-[#214C77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy lg:self-center"
          >
            Request to Join <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  )
}

import { ArrowRight, Megaphone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { SAT_INTENSIVE_PATH, satIntensiveUrgency } from "@/lib/sat-final-intensive"

/** Single clickable December intensive announcement, automatically removed when all classes have begun. */
export function SatIntensiveAnnouncementBar() {
  const urgency = satIntensiveUrgency()
  if (!urgency) return null

  return (
    <aside aria-label="December 5th Digital SAT Final Intensive enrollment" className="border-y border-[#E7D8B9] bg-[#FFF8E8] text-navy">
      <div className="container py-2.5 md:py-3">
        <TrackedLink
          href={`${SAT_INTENSIVE_PATH}#register`}
          event={EVENTS.programCtaClick}
          eventProps={{ location: "home_dec_sat_announcement", cta: "join_remaining_classes" }}
          className="group flex min-w-0 flex-col gap-3 rounded-xl border border-[#C9DCE9] border-l-[5px] border-l-[#DAA928] bg-[#EDF6FC] px-4 py-3 shadow-[0_4px_14px_rgba(16,47,81,0.14)] transition-all hover:border-[#83B0CC] hover:border-l-[#DAA928] hover:bg-[#F6FBFE] hover:shadow-[0_6px_18px_rgba(16,47,81,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16476A] lg:flex-row lg:items-center lg:justify-between lg:gap-6"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-navy">
                <Megaphone size={15} aria-hidden="true" className="shrink-0" />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">December 5th</span>
                <strong className="text-base font-black uppercase leading-none tracking-tight">SAT</strong>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-[#D7F6E4] px-3 py-1.5 text-xs font-extrabold text-[#07583C]">
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-emerald-600 ring-[3px] ring-emerald-200 motion-safe:animate-pulse" />
                Rolling Enrollment Open
              </span>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
              <p className="text-base font-extrabold leading-snug text-navy md:text-lg">Digital SAT Final Intensive</p>
              <p className="text-xs font-medium leading-relaxed text-ink md:text-sm">
                Mon–Thu, 6–9 PM · Astoria, Queens · $75 per 3-hour class
              </p>
              <p className="text-xs font-semibold leading-snug text-navy/80">Full upfront payment required for all remaining classes.</p>
            </div>
          </div>
          <span
            aria-hidden="true"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-gold px-5 py-2.5 text-sm font-extrabold text-[#102F51] shadow-sm transition-colors group-hover:bg-[#F5CF62] lg:self-center"
          >
            Request to Join Now <ArrowRight size={16} aria-hidden="true" />
          </span>
        </TrackedLink>
      </div>
    </aside>
  )
}

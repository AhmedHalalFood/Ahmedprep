import { ArrowRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"

export function ShsatIntensiveBar() {
  return (
    <div
      className="relative z-20 border-b border-gold/40 bg-cream text-navy"
      role="region"
      aria-label="2026 SHSAT Final Intensive announcement"
    >
      <div className="h-[3px] bg-gold" aria-hidden="true" />
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col items-center gap-3 py-4 text-center md:flex-row md:justify-between md:gap-8 md:py-5 md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <span className="inline-flex items-center rounded-sm bg-gold px-2.5 py-1 text-[11px] font-extrabold uppercase leading-none tracking-[0.16em] text-navy">
            Now Enrolling
          </span>
          <p className="text-balance text-[22px] font-extrabold leading-tight tracking-tight text-navy md:text-[28px]">
            2026 SHSAT Final Intensive
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-6">
          <div className="flex flex-col items-center gap-0.5 md:items-end md:text-right">
            <p className="text-base font-semibold leading-snug text-navy">60 Hours of Live Prep</p>
            <p className="whitespace-nowrap text-sm font-medium leading-snug text-ink/75">
              Oct. 12–Nov. 12
              <span className="px-1.5 text-gold-deep" aria-hidden="true">
                {"•"}
              </span>
              <span className="text-base font-extrabold text-gold-deep">Only $1,000</span>
            </p>
          </div>
          <TrackedLink
            href={INTENSIVE_PATH}
            event={EVENTS.shsatIntensiveClick}
            eventProps={{ location: "shsat_intensive_bar" }}
            className="button button-gold min-h-11 shrink-0 whitespace-nowrap uppercase"
          >
            View SHSAT Intensive <ArrowRight size={15} aria-hidden="true" />
          </TrackedLink>
        </div>
      </div>
    </div>
  )
}

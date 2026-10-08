import { ArrowRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"

export function ShsatIntensiveBar() {
  return (
    <div className="relative z-20 border-b border-gold/60 bg-cream text-navy" role="region" aria-label="2026 SHSAT Final Intensive announcement">
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col items-center gap-2.5 py-3 text-center md:flex-row md:justify-between md:gap-6 md:text-left">
        <p className="flex flex-col items-center gap-1 text-xs font-extrabold uppercase leading-relaxed tracking-wider md:flex-row md:flex-wrap md:items-center md:gap-0">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 bg-gold" aria-hidden="true" />
            2026 SHSAT Final Intensive Now Enrolling
          </span>
          <span className="hidden text-gold-deep md:inline" aria-hidden="true">
            {"\u00a0\u00a0|\u00a0\u00a0"}
          </span>
          <span className="font-bold text-ink/80">
            60 Hours of Live Prep
            <span className="text-gold-deep" aria-hidden="true">{" • "}</span>
            Oct. 12–Nov. 12
            <span className="text-gold-deep" aria-hidden="true">{" • "}</span>
            Only <span className="font-extrabold text-navy">$1,000</span>
          </span>
        </p>
        <TrackedLink
          href={INTENSIVE_PATH}
          event={EVENTS.shsatIntensiveClick}
          eventProps={{ location: "shsat_intensive_bar" }}
          className="button button-gold shrink-0 whitespace-nowrap uppercase"
        >
          2026 SHSAT Final Intensive <ArrowRight size={15} aria-hidden="true" />
        </TrackedLink>
      </div>
    </div>
  )
}

import { ArrowRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"

export function ShsatIntensiveBar() {
  return (
    <div className="relative z-20 border-b-2 border-gold bg-navy text-white" role="region" aria-label="2026 SHSAT Final Intensive announcement">
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col items-center gap-2 py-2.5 text-center md:flex-row md:justify-between md:gap-6 md:text-left">
        <p className="text-xs font-extrabold uppercase leading-relaxed tracking-wider">
          <span className="text-gold">2026 SHSAT Final Intensive Now Enrolling</span>
          <span className="text-white/50" aria-hidden="true">{" • "}</span>
          60 Hours of Live Prep
          <span className="text-white/50" aria-hidden="true">{" • "}</span>
          Oct. 12–Nov. 12
          <span className="text-white/50" aria-hidden="true">{" • "}</span>
          Only <span className="text-gold">$1,000</span>
          <span className="text-white/50" aria-hidden="true">{" • "}</span>
          <TrackedLink
            href={BUSINESS.phoneHref}
            event={EVENTS.phoneClick}
            eventProps={{ location: "shsat_intensive_bar" }}
            className="whitespace-nowrap underline-offset-4 hover:text-gold hover:underline"
          >
            Call 347-479-5020
          </TrackedLink>
        </p>
        <TrackedLink
          href="/#shsat-intensive"
          event={EVENTS.shsatCtaClick}
          eventProps={{ location: "shsat_intensive_bar" }}
          className="button button-gold shrink-0 whitespace-nowrap uppercase"
        >
          View SHSAT Intensive <ArrowRight size={15} aria-hidden="true" />
        </TrackedLink>
      </div>
    </div>
  )
}

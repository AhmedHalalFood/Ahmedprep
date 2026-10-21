import { MessageSquare } from "lucide-react"
import { IntensiveCtas } from "@/components/landing/intensive-ctas"
import { IntensiveFacts } from "@/components/landing/intensive-facts"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { ENROLLMENT_STATUS, INTENSIVE_NAME, type EnrollmentSnapshot } from "@/lib/shsat-intensive"

export function IntensiveHero({ snapshot }: { snapshot: EnrollmentSnapshot }) {
  return (
    <section aria-labelledby="intensive-title" className="border-b-4 border-gold bg-navy pb-10 pt-10 text-white md:pb-16 md:pt-16">
      <div className="container flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow gold">SHSAT Prep · Astoria, Queens</p>
          <h1 id="intensive-title" className="max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-none">
            {INTENSIVE_NAME}
          </h1>
          {snapshot.nextClass && (
            <p className="text-pretty text-xl font-extrabold uppercase leading-snug text-gold md:text-2xl">{ENROLLMENT_STATUS}</p>
          )}
        </div>
        <IntensiveFacts snapshot={snapshot} />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <IntensiveCtas location="intensive_page_hero" showEnroll={snapshot.nextClass !== null} />
          <TrackedLink
            href={BUSINESS.smsHref}
            event={EVENTS.textClick}
            eventProps={{ location: "intensive_page_hero" }}
            className="inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm font-bold uppercase tracking-wider text-white/85 hover:text-gold"
          >
            <MessageSquare size={15} aria-hidden="true" />
            Text us
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}

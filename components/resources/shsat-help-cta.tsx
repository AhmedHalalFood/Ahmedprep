import { ArrowRight, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { FREE_CLASS } from "@/lib/free-class"

export function ShsatHelpCta({ location }: { location: string }) {
  return (
    <section aria-labelledby="shsat-help-title" className="mt-14 flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-warm p-6 md:p-8">
      <h2 id="shsat-help-title" className="text-2xl font-extrabold tracking-tight text-navy">
        Need help preparing for the SHSAT?
      </h2>
      <p className="text-pretty leading-relaxed text-ink">
        AhmedPrep is based in Astoria, Queens, and helps students across NYC prepare for the SHSAT. A free diagnostic is the
        clearest first step: it shows your child&apos;s strengths, gaps, and a realistic plan for the time remaining.
      </p>
      <div className="flex flex-wrap gap-3 py-2">
        <TrackedLink
          href="/free-diagnostic"
          event={EVENTS.diagnosticCtaClick}
          eventProps={{ location }}
          className="button button-gold"
        >
          BOOK A FREE DIAGNOSTIC <ArrowRight size={15} aria-hidden="true" />
        </TrackedLink>
        <TrackedLink href="/shsat" event={EVENTS.shsatCtaClick} eventProps={{ location }} className="button button-outline">
          VIEW SHSAT PREP
        </TrackedLink>
        <TrackedLink
          href={FREE_CLASS.path}
          event={EVENTS.freeShsatClassCtaClicked}
          eventProps={{ location }}
          className="button button-outline"
        >
          FREE SUNDAY SHSAT CLASS
        </TrackedLink>
      </div>
      <p className="text-sm text-subtle">
        Questions? Call or text{" "}
        <TrackedLink
          href={BUSINESS.phoneHref}
          event={EVENTS.phoneClick}
          eventProps={{ location }}
          className="inline-flex items-center gap-1 font-extrabold text-navy hover:text-brand"
        >
          <Phone size={14} aria-hidden="true" />
          347-479-5020
        </TrackedLink>
      </p>
    </section>
  )
}

import { ArrowRight, Phone } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { FREE_CLASS } from "@/lib/free-class"

export function ShsatHelpCta({ location }: { location: string }) {
  return (
    <section aria-labelledby="shsat-help-title" className="mt-8 rounded-xl border border-[#CAD8E6] bg-[#F7FAFD] p-4 shadow-sm md:p-5">
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6">
        <div className="min-w-0">
          <h2 id="shsat-help-title" className="text-xl font-extrabold leading-tight tracking-tight text-navy md:text-2xl">
            Need help preparing for the SHSAT?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink md:text-base">
            AhmedPrep helps NYC students prepare in Astoria, Queens. Start with a free diagnostic to identify your child&apos;s strengths, gaps, and next steps.
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-3 lg:border-l lg:border-line lg:pl-6">
          <div className="grid gap-2 sm:grid-cols-2">
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-gold px-3 py-2 text-center text-sm font-extrabold text-navy transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Book a Free Diagnostic <ArrowRight size={16} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/shsat-prep"
              event={EVENTS.shsatCtaClick}
              eventProps={{ location }}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-navy bg-white px-3 py-2 text-center text-sm font-bold text-navy transition hover:bg-[#EAF2F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View SHSAT Prep
            </TrackedLink>
            <TrackedLink
              href={FREE_CLASS.path}
              event={EVENTS.sundayClassCtaClick}
              eventProps={{ location }}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-navy bg-white px-3 py-2 text-center text-sm font-bold text-navy transition hover:bg-[#EAF2F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Free Sunday SHSAT Class
            </TrackedLink>
            <p className="flex min-h-11 items-center justify-center gap-2 text-sm text-subtle">
              Call or text:
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
          </div>
        </div>
      </div>
    </section>
  )
}

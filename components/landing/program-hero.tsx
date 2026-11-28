import type { ReactNode } from "react"
import { ArrowUpRight, Check } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { TrackedLink } from "@/components/tracked-link"
import type { EventName } from "@/lib/analytics"

export function ProgramHero({
  eyebrow,
  title,
  intro,
  benefitsTitle,
  benefits,
  ctaLabel,
  ctaEvent,
  location,
  serviceArea,
  actions,
  balancedActions = false,
  compact = false,
}: {
  actions?: ReactNode
  balancedActions?: boolean
  compact?: boolean
  eyebrow: string
  title: string
  intro: string
  serviceArea?: string
  benefitsTitle: string
  benefits: string[]
  ctaLabel: string
  ctaEvent: EventName
  location: string
}) {
  return (
    <section aria-labelledby={`${location}-hero-title`} className="border-b border-line bg-site-canvas">
      <div className={`container grid lg:items-center ${compact ? "gap-6 py-8 md:py-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-9" : `gap-8 py-14 md:py-20 ${balancedActions ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8" : "lg:grid-cols-[1.25fr_1fr] lg:gap-16"}`}`}>
        <div className={`flex flex-col ${compact ? "gap-3.5" : "gap-6"}`}>
          <p className="eyebrow blue">{eyebrow}</p>
          <h1
            id={`${location}-hero-title`}
            className={`text-balance font-extrabold tracking-tight text-navy ${compact ? "text-4xl leading-[1.1] md:text-[2.75rem] lg:text-[3.125rem]" : "text-4xl leading-[1.05] md:text-5xl lg:text-6xl"}`}
          >
            {title}
          </h1>
          {serviceArea ? (
            <p className="max-w-xl text-pretty text-base font-bold leading-relaxed text-navy">{serviceArea}</p>
          ) : null}
          <p className={`max-w-xl text-pretty leading-relaxed text-subtle ${compact ? "text-base" : "text-lg"}`}>{intro}</p>
          {actions ? (
            <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"}`}>
              {actions}
              {compact ? (
                <div className="self-start"><CallTextLinks location={`${location}_hero`} /></div>
              ) : (
                <CallTextLinks location={`${location}_hero`} />
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <TrackedLink href="#diagnostic" event={ctaEvent} eventProps={{ location: `${location}_hero` }} className="button button-gold button-lg">
                {ctaLabel} <ArrowUpRight size={17} aria-hidden="true" />
              </TrackedLink>
              <CallTextLinks location={`${location}_hero`} />
            </div>
          )}
        </div>
        <div className={`border border-line border-t-4 border-t-gold bg-paper ${compact ? "p-5 md:p-6" : "p-6 md:p-8"}`}>
          <h2 className="text-lg font-extrabold text-navy">{benefitsTitle}</h2>
          <ul className={`flex flex-col ${compact ? "mt-3 gap-2.5" : "mt-5 gap-4"}`}>
            {benefits.map((benefit) => (
              <li key={benefit} className={`flex items-start gap-3 text-ink ${compact ? "text-sm leading-snug md:text-[15px]" : "leading-relaxed"}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-navy text-gold">
                  <Check size={14} aria-hidden="true" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

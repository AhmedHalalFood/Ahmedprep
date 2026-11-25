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
      <div className={`container grid lg:items-center ${compact ? "gap-5 py-7 md:gap-8 md:py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10" : `gap-8 py-14 md:py-20 ${balancedActions ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8" : "lg:grid-cols-[1.25fr_1fr] lg:gap-16"}`}`}>
        <div className={compact ? "flex flex-col gap-3 md:gap-4" : "flex flex-col gap-6"}>
          <p className="eyebrow blue">{eyebrow}</p>
          <h1
            id={`${location}-hero-title`}
            className={compact ? "text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl lg:text-5xl" : "text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-navy md:text-5xl lg:text-6xl"}
          >
            {title}
          </h1>
          {serviceArea ? (
            <p className={compact ? "max-w-2xl text-pretty text-sm font-bold leading-snug text-navy md:text-base" : "max-w-xl text-pretty text-base font-bold leading-relaxed text-navy"}>{serviceArea}</p>
          ) : null}
          <p className={compact ? "max-w-2xl text-pretty text-sm leading-relaxed text-subtle md:text-base" : "max-w-xl text-pretty text-lg leading-relaxed text-subtle"}>{intro}</p>
          {actions ? (
            <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-4"}>
              {actions}
              <CallTextLinks location={`${location}_hero`} />
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
        <div className={compact ? "rounded-xl border border-line border-l-4 border-l-gold bg-[#FFFAEF] p-4 shadow-sm md:p-5" : "border border-line border-t-4 border-t-gold bg-paper p-6 md:p-8"}>
          <h2 className={compact ? "text-base font-extrabold text-navy" : "text-lg font-extrabold text-navy"}>{benefitsTitle}</h2>
          <ul className={compact ? "mt-3 flex flex-col gap-2" : "mt-5 flex flex-col gap-4"}>
            {benefits.map((benefit) => (
              <li key={benefit} className={compact ? "flex items-start gap-2 text-sm leading-snug text-ink md:text-base" : "flex items-start gap-3 leading-relaxed text-ink"}>
                <span className={compact ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-gold" : "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-navy text-gold"}>
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

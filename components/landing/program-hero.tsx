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
}: {
  eyebrow: string
  title: string
  intro: string
  benefitsTitle: string
  benefits: string[]
  ctaLabel: string
  ctaEvent: EventName
  location: string
}) {
  return (
    <section aria-labelledby={`${location}-hero-title`} className="border-b border-line bg-white">
      <div className="container grid gap-10 py-14 md:py-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="eyebrow blue">{eyebrow}</p>
          <h1
            id={`${location}-hero-title`}
            className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-navy md:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-subtle">{intro}</p>
          <div className="flex flex-wrap items-center gap-4">
            <TrackedLink href="#diagnostic" event={ctaEvent} eventProps={{ location: `${location}_hero` }} className="button button-gold button-lg">
              {ctaLabel} <ArrowUpRight size={17} aria-hidden="true" />
            </TrackedLink>
            <CallTextLinks location={`${location}_hero`} />
          </div>
        </div>
        <div className="border border-line border-t-4 border-t-gold bg-warm p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-navy">{benefitsTitle}</h2>
          <ul className="mt-5 flex flex-col gap-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 leading-relaxed text-ink">
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

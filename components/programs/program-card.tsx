import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import type { Program } from "@/lib/programs"

export function ProgramCard({ program }: { program: Program }) {
  const detailsLink = program.href !== program.cta.href.split("#")[0] && program.href !== "/contact"
  return (
    <article id={program.id} className="flex scroll-mt-4 flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-extrabold text-navy">{program.name}</h2>
        <p className="text-sm leading-relaxed text-subtle">{program.summary}</p>
      </header>

      <div className="border-y border-line py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-subtle">Price</p>
        {program.price ? (
          <p className="mt-1 text-2xl font-extrabold text-navy">{program.price}</p>
        ) : (
          <p className="mt-1 text-base font-extrabold leading-snug text-navy">Contact AhmedPrep for current pricing</p>
        )}
        {program.priceNote && <p className="mt-1 text-xs leading-relaxed text-subtle">{program.priceNote}</p>}
      </div>

      <dl className="flex flex-col gap-3 text-sm leading-relaxed">
        <div>
          <dt className="font-bold text-navy">Who it&apos;s for</dt>
          <dd className="text-ink">{program.audience}</dd>
        </div>
        <div>
          <dt className="font-bold text-navy">Format</dt>
          <dd className="text-ink">{program.format}</dd>
        </div>
        {program.schedule && (
          <div>
            <dt className="font-bold text-navy">Schedule</dt>
            <dd className="text-ink">{program.schedule}</dd>
          </div>
        )}
      </dl>

      <ul className="flex flex-col gap-2 text-sm text-ink">
        {program.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <TrackedLink
          href={program.cta.href}
          event={EVENTS.programCtaClick}
          eventProps={{ location: "programs_page", program: program.id }}
          className="button button-gold w-full justify-center"
        >
          {program.cta.label} <ArrowUpRight size={16} aria-hidden="true" />
        </TrackedLink>
        {detailsLink && (
          <Link href={program.href} className="text-link justify-center">
            Program details <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  )
}

import { ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { PROGRAMS } from "@/lib/programs"

export function ProgramsPreview() {
  return (
    <section id="programs-pricing" aria-labelledby="programs-pricing-title" className="bg-white py-16 md:py-20">
      <div className="container flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow blue">Programs & Pricing</p>
            <h2 id="programs-pricing-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              Free ways to start, and programs to go further
            </h2>
          </div>
          <TrackedLink href="/programs" event={EVENTS.programCtaClick} eventProps={{ location: "home_programs_preview" }} className="text-link">
            Compare programs <ArrowUpRight size={15} aria-hidden="true" />
          </TrackedLink>
        </div>
        <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => (
            <li key={program.id} className="border-b border-line">
              <TrackedLink
                href={`/programs#${program.id}`}
                event={EVENTS.programCtaClick}
                eventProps={{ location: "home_programs_preview", program: program.id }}
                className="group flex h-full items-start justify-between gap-4 py-5 pr-4"
              >
                <span className="flex flex-col gap-1">
                  <span className="font-extrabold text-navy group-hover:text-brand">{program.name}</span>
                  <span className="text-sm font-semibold text-subtle">{program.price ?? "Contact AhmedPrep for current pricing"}</span>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" className="mt-1 shrink-0 text-brand" />
              </TrackedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

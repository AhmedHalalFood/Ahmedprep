import { ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"
import { visiblePrograms } from "@/lib/programs"

const T = ENROLLMENT_2027.tuition

export function ProgramsPreview({ showIntensive }: { showIntensive: boolean }) {
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
        <div className="flex flex-col gap-4 border-l-0 border-t-4 border-t-gold bg-warm p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-extrabold text-navy">January 2027 SHSAT &amp; Digital SAT small-group tuition</h3>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink">
              {[T.regular, T.early, T.founding].map((option) => (
                <div key={option.label} className="flex gap-2">
                  <dt className="font-semibold">{option.label}</dt>
                  <dd className="font-extrabold text-navy">{option.total}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm leading-relaxed text-subtle">
              12 weeks, {ENROLLMENT_2027.hoursLabel}. {T.rules} Private tutoring is priced separately.
            </p>
          </div>
          <TrackedLink
            href={ENROLLMENT_2027.requestHref}
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_programs_preview", cta: "january_2027_tuition" }}
            className="text-link shrink-0"
          >
            See January 2027 tuition details <ArrowUpRight size={15} aria-hidden="true" />
          </TrackedLink>
        </div>
        <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {visiblePrograms(showIntensive).map((program) => (
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

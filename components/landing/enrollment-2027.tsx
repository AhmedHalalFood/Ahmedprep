import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import {
  EARLY_DAYS_AFTER_FOUNDING,
  EARLY_DAYS_BEFORE_SPRING_SUMMER,
  FOUNDING_DAYS_BEFORE,
  FOUNDING_SEATS_PER_COHORT,
  HOURLY_RATE,
  MAX_CLASS_SIZE,
  TERMS_2027,
  cohortInquiryHref,
  cohortSchedule,
  dollars,
  formatShortDate,
  priceFor,
  termSummary,
} from "@/lib/cohorts-2027"
import { programsHref } from "@/lib/program-finder"
import { ENROLLMENT_2027 as E } from "@/lib/enrollment-2027"

export function Enrollment2027({ showIntensive }: { showIntensive: boolean }) {
  return (
    <section id="programs" className="scroll-mt-4 bg-warm py-16 md:py-20" aria-labelledby="enrollment-title">
      <div className="container flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="eyebrow">2027 Enrollment</p>
          <h2 id="enrollment-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Winter, Spring, and Summer 2027. <span className="text-brand">Small SHSAT and Digital SAT classes.</span>
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">
            Twelve in-person cohorts in Astoria across three terms. Every date below comes from the approved 2027 calendar, including
            holiday closures. If AhmedPrep cancels a scheduled class, we provide a makeup class or equivalent live instruction at no
            additional cost.
          </p>
        </div>

        <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
          {[
            { term: "Terms", value: "Winter · Spring · Summer" },
            { term: "Tuition", value: `${dollars(HOURLY_RATE)} per class hour` },
            { term: "Class size", value: `Max ${MAX_CLASS_SIZE} students` },
            { term: "Diagnostic", value: "Free" },
          ].map((fact, i) => (
            <div
              key={fact.term}
              className={`flex flex-col gap-1 py-4 ${i % 2 === 1 ? "border-l border-line pl-4" : "pr-4"} ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l md:pl-4" : ""}`}
            >
              <dt className="text-xs font-bold uppercase tracking-widest text-subtle">{fact.term}</dt>
              <dd className="text-lg font-extrabold text-navy">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-4 lg:grid-cols-3">
          {TERMS_2027.map((term) => {
            const s = termSummary(term)
            return (
              <article key={term.id} className="flex flex-col gap-5 border border-line bg-white p-6" aria-labelledby={`home-${term.id}-title`}>
                <div className="flex flex-col gap-1">
                  <h3 id={`home-${term.id}-title`} className="text-2xl font-extrabold tracking-tight text-navy">
                    {term.name}
                  </h3>
                  <p className="text-sm font-semibold text-subtle">
                    {formatShortDate(s.startIso)} – {formatShortDate(s.endIso)} · {s.hoursLabel} · {s.regularLabel}
                  </p>
                </div>
                <ul className="flex flex-col border-t border-line">
                  {term.cohorts.map((c) => (
                    <li key={c.id} className="border-b border-line">
                      <Link
                        href={cohortInquiryHref(c)}
                        className="flex min-h-11 flex-col gap-0.5 py-3 hover:bg-brand-soft focus-visible:bg-brand-soft"
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-bold text-navy">
                            {c.program} {c.label}
                          </span>
                          <span className="text-sm font-bold text-brand">{dollars(priceFor(c).regular)}</span>
                        </span>
                        <span className="text-sm text-subtle">{cohortSchedule(c)}</span>
                        <span className="sr-only">Start an inquiry for this cohort</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <dl className="flex flex-col gap-2 text-sm leading-relaxed text-subtle">
                  {term.deadlines.map((d) => (
                    <div key={d.group} className="flex flex-col">
                      <dt className="font-bold text-navy">{d.group}</dt>
                      {d.foundingShort && <dd>Founding-family payment deadline: {d.foundingShort}</dd>}
                      <dd>Early-payment deadline: {d.earlyShort}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={programsHref({ season: term.id })}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-brand underline-offset-4 hover:underline"
                >
                  {term.name} dates and closures <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-5 bg-navy p-6 text-white md:p-8" aria-labelledby="tuition-2027-title">
            <div className="flex flex-col gap-2">
              <p className="eyebrow gold">Tuition</p>
              <h3 id="tuition-2027-title" className="text-2xl font-extrabold tracking-tight">
                {dollars(HOURLY_RATE)} per scheduled instructional hour
              </h3>
              <p className="text-pretty leading-relaxed text-white/75">
                The same rate applies to SHSAT and Digital SAT. Winter and Spring cohorts are 72 hours; Summer cohorts are 96 hours
                (weekday intensive) or 48 hours (weekend).
              </p>
            </div>
            <ul className="flex flex-col border-t border-white/20">
              {[
                { label: "Founding-Family (Winter 2027 only)", value: "25% off", note: `First ${FOUNDING_SEATS_PER_COHORT} fully paid seats per Winter cohort, paid in full ${FOUNDING_DAYS_BEFORE} days before the first class` },
                { label: "Early Full Payment", value: "10% off", note: `Winter: ${EARLY_DAYS_AFTER_FOUNDING} days after the founding-family deadline. Spring and Summer: ${EARLY_DAYS_BEFORE_SPRING_SUMMER} days before the first class` },
                { label: "Regular Tuition", value: "Full rate", note: "Paid in full before the student’s first scheduled class" },
              ].map((t) => (
                <li key={t.label} className="flex flex-col gap-1 border-b border-white/20 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="font-semibold text-white/80">{t.label}</span>
                  <span className="flex flex-col sm:items-end sm:text-right">
                    <span className="text-2xl font-extrabold text-gold">{t.value}</span>
                    <span className="text-sm text-white/75">{t.note}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-white/75">
              <span className="font-bold text-gold">Discounts cannot be combined.</span> Deadlines end at 11:59 PM ET on each cohort&apos;s
              published date. {E.tuition.seatNote}
            </p>
          </div>

          <div className="flex flex-col gap-4 border border-line bg-white p-6 md:p-8" aria-labelledby="included-2027-title">
            <p className="eyebrow blue">Included for every student</p>
            <h3 id="included-2027-title" className="sr-only">
              Included for every student
            </h3>
            <ul className="flex flex-col gap-4">
              {E.included.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  <span className="flex flex-col">
                    <span className="font-bold text-navy">{item.title}</span>
                    <span className="text-sm leading-relaxed text-subtle">{item.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href={E.requestHref}
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_enrollment_2027", cta: "request_enrollment_info" }}
              className="button button-gold button-lg"
            >
              Request Enrollment <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href={E.diagnosticHref}
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_enrollment_2027" }}
              className="button button-navy-outline button-lg"
            >
              Book a Free Diagnostic
            </TrackedLink>
          </div>
          {showIntensive && (
            <p className="text-sm leading-relaxed text-subtle">
              Preparing for this year&apos;s SHSAT?{" "}
              <TrackedLink
                href={E.intensive2026Href}
                event={EVENTS.shsatIntensiveClick}
                eventProps={{ location: "home_enrollment_2027" }}
                className="font-bold text-brand underline underline-offset-4"
              >
                See the 2026 SHSAT Final Intensive
              </TrackedLink>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

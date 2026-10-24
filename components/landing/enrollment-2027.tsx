import { ArrowUpRight, Check } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { ENROLLMENT_2027 as E, startLabel } from "@/lib/enrollment-2027"

export function Enrollment2027() {
  return (
    <section id="programs" className="scroll-mt-4 bg-warm py-16 md:py-20" aria-labelledby="enrollment-title">
      <div className="container flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="eyebrow">{E.eyebrow}</p>
          <h2 id="enrollment-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Two programs. <span className="text-brand">One clear 12-week plan.</span>
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">{E.launchNote}</p>
        </div>

        <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
          {[
            { term: "Program length", value: `${E.weeks} weeks` },
            { term: "Instruction", value: `${E.hours} hours per group` },
            { term: "Class size", value: `Max ${E.maxClassSize} students` },
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

        <div className="grid gap-4 md:grid-cols-2">
          {E.programs.map((program) => (
            <article key={program.id} className="flex flex-col gap-5 border border-line bg-white p-6 md:p-8" aria-labelledby={`${program.id}-2027-title`}>
              <div className="flex flex-col gap-2">
                <p className="eyebrow blue">{program.kicker}</p>
                <h3 id={`${program.id}-2027-title`} className="text-2xl font-extrabold tracking-tight text-navy">
                  {program.name}
                </h3>
                <p className="text-pretty leading-relaxed text-subtle">{program.body}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-navy">Choose a schedule</p>
                <ul className="flex flex-col border-t border-line">
                  {program.schedules.map((s) => (
                    <li key={s.label} className="flex flex-col gap-1 border-b border-line py-3">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <span className="text-sm font-semibold text-subtle">{s.label}</span>
                        <span className="font-bold text-navy">
                          {s.days} <span className="font-semibold text-subtle">· {s.time}</span>
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-brand">{startLabel(s)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <TrackedLink
                href={program.href}
                event={program.id === "shsat" ? EVENTS.shsatCtaClick : EVENTS.digitalSatCtaClick}
                eventProps={{ location: "home_enrollment_2027" }}
                className="mt-auto inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-brand underline-offset-4 hover:underline"
              >
                About {program.name} <ArrowUpRight size={16} aria-hidden="true" />
              </TrackedLink>
            </article>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-5 bg-navy p-6 text-white md:p-8" aria-labelledby="tuition-2027-title">
            <div className="flex flex-col gap-2">
              <p className="eyebrow gold">Tuition</p>
              <h3 id="tuition-2027-title" className="text-2xl font-extrabold tracking-tight">
                Clear, affordable tuition
              </h3>
              <p className="text-pretty leading-relaxed text-white/75">
                Tuition covers the full {E.weeks}-week program ({E.hours} hours of instruction). The same tuition applies to SHSAT and Digital SAT Prep.
              </p>
            </div>
            <div className="flex flex-col border-t border-white/20">
              {[E.tuition.regular, E.tuition.founding].map((t) => (
                <div key={t.label} className="flex flex-col gap-1 border-b border-white/20 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-semibold text-white/80">{t.label}</span>
                  <span className="flex flex-col sm:items-end">
                    <span className="text-2xl font-extrabold text-gold">{t.total}</span>
                    <span className="text-sm text-white/75">{t.installments}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-white/75">
              <span className="font-bold text-gold">Founding families save {E.tuition.founding.savings}.</span> {E.tuition.founding.note}
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
              Request Enrollment Information <ArrowUpRight size={16} aria-hidden="true" />
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
        </div>
      </div>
    </section>
  )
}

import { ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import type { CaseStudy } from "@/lib/case-studies"
import { getProgram } from "@/lib/programs"

function formatMonth(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
}

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const program = getProgram(study.program)
  return (
    <article className="flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-extrabold uppercase tracking-widest text-brand">
          {study.test} <span aria-hidden="true">·</span> Grade {study.grade}
        </p>
        <h3 className="text-lg font-extrabold text-navy">{study.studentLabel}</h3>
        <p className="text-xs text-subtle">
          <time dateTime={study.date}>{formatMonth(study.date)}</time>
        </p>
      </header>

      {(study.startingScore || study.laterScore) && (
        <dl className="grid grid-cols-2 border-y border-line py-4">
          <div>
            <dt className="text-xs font-semibold text-subtle">Starting diagnostic</dt>
            <dd className="mt-1 text-xl font-extrabold text-navy">{study.startingScore ?? "—"}</dd>
          </div>
          <div className="border-l border-line pl-4">
            <dt className="text-xs font-semibold text-subtle">Later score</dt>
            <dd className="mt-1 text-xl font-extrabold text-navy">{study.laterScore ?? "—"}</dd>
            {study.laterScoreSource && <dd className="mt-1 text-xs text-subtle">{study.laterScoreSource}</dd>}
          </div>
        </dl>
      )}

      {study.skillsImproved.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-subtle">Skill areas improved</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {study.skillsImproved.map((skill) => (
              <li key={skill} className="bg-brand-soft px-2.5 py-1 text-xs font-bold text-navy">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {study.quote && (
        <blockquote className="border-l-2 border-gold pl-4 leading-relaxed text-ink">
          &ldquo;{study.quote.text}&rdquo;
          <footer className="mt-2 text-sm font-semibold text-subtle">— {study.quote.by}</footer>
        </blockquote>
      )}

      {program && (
        <TrackedLink
          href={program.href}
          event={EVENTS.resultsCtaClick}
          eventProps={{ location: "case_study", program: program.id }}
          className="text-link mt-auto"
        >
          Program: {program.name} <ArrowUpRight size={15} aria-hidden="true" />
        </TrackedLink>
      )}
    </article>
  )
}

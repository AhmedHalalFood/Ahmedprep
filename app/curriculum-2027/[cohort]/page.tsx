import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ALL_COHORTS, cohortSchedule, cohortTitle, formatDate, formatLongDate } from "@/lib/cohorts-2027"
import { SESSION_BLOCKS, VERBAL_LABEL, syllabusForId } from "@/lib/curriculum-2027"
import { DraftNotice } from "@/components/curriculum/draft-notice"
import { PrintButton } from "@/components/curriculum/print-button"

type Params = { params: Promise<{ cohort: string }> }

export const dynamicParams = false
export const generateStaticParams = () => ALL_COHORTS.map((c) => ({ cohort: c.id }))

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = syllabusForId((await params).cohort)
  return {
    title: found ? `Draft syllabus: ${cohortTitle(found.cohort)} | AhmedPrep` : "Draft syllabus | AhmedPrep",
    robots: { index: false, follow: false },
  }
}

export default async function CohortSyllabusPage({ params }: Params) {
  const found = syllabusForId((await params).cohort)
  if (!found) notFound()
  const { cohort, sessions } = found
  const verbal = VERBAL_LABEL[cohort.program]

  return (
    <div className="bg-warm px-5 py-10 print:bg-background print:p-0 sm:py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4">
          <Link href="/curriculum-2027" className="text-sm font-semibold text-brand underline-offset-2 hover:underline" data-print-hide>
            All draft curriculum
          </Link>
          <p className="eyebrow blue">Draft syllabus · Internal</p>
          <h1 className="text-balance text-3xl font-extrabold text-navy sm:text-4xl">{cohortTitle(cohort)}</h1>
          <p className="leading-relaxed text-ink">
            {cohortSchedule(cohort)} · {cohort.sessions} sessions · {cohort.hours} instructional hours ·{" "}
            {formatDate(sessions[0].iso)} – {formatDate(sessions[sessions.length - 1].iso)}
          </p>
          {cohort.closures.length > 0 ? (
            <p className="text-sm leading-relaxed text-subtle">
              Closed: {cohort.closures.map((c) => `${formatDate(c.iso)} (${c.reason})`).join("; ")}.
            </p>
          ) : null}
          <DraftNotice />
          <p className="text-sm leading-relaxed text-subtle">
            Instruction sessions: {SESSION_BLOCKS.map((b) => `${b.minutes} min ${b.label}`).join(" · ")}.
          </p>
          <div className="flex flex-wrap gap-3"><PrintButton /></div>
        </header>

        <ol className="flex flex-col gap-4">
          {sessions.map((s) => (
            <li key={s.number} className="break-inside-avoid border border-line bg-background p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-bold text-navy">
                  Session {s.number} · {formatLongDate(s.iso)}
                </h2>
                <span className="text-sm text-subtle">{s.time} ET</span>
              </div>
              {s.kind === "makeup" ? (
                <p className={s.approved ? "mt-2 text-sm font-semibold text-ink" : "mt-2 text-sm font-semibold text-gold-deep"}>
                  {s.approved ? "Approved makeup" : "Proposed makeup — not yet approved"}
                  {s.replaces ? `, preserving the hours of ${formatDate(s.replaces)}` : ""}
                </p>
              ) : null}

              {s.format === "instruction" && s.math && s.verbal ? (
                <dl className="mt-3 grid gap-3 text-sm leading-relaxed text-ink md:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-navy">Math (75 min): {s.math.title}{s.math.part ? ` — part ${s.math.part}` : ""}</dt>
                    <dd className="text-subtle">{s.math.domain}</dd>
                    <dd>Objective: {s.math.objective}</dd>
                    {s.math.desmos ? <dd>Desmos: {s.math.desmos}</dd> : null}
                  </div>
                  <div>
                    <dt className="font-semibold text-navy">{verbal} (75 min): {s.verbal.title}{s.verbal.part ? ` — part ${s.verbal.part}` : ""}</dt>
                    <dd className="text-subtle">{s.verbal.domain}</dd>
                    <dd>Objective: {s.verbal.objective}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-navy">Practice</dt>
                    <dd>{s.math.practice} {s.verbal.practice}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-navy">Review (30 min)</dt>
                    <dd>{s.review}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-ink">{s.review}</p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink"><span className="font-semibold text-navy">Homework:</span> {s.homework}</p>
              {s.assessments.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.assessments.map((a) => (
                    <li key={a.label} className="border border-navy px-2 py-1 text-xs font-semibold text-navy">{a.label}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

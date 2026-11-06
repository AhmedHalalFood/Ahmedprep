import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ALL_COHORTS, cohortSchedule, cohortTitle, formatDate, formatLongDate } from "@/lib/cohorts-2027"
import { EXAM_FORMAT, SESSION_BLOCKS, STAGE_LABEL, VERBAL_LABEL, type Slot, syllabusForId } from "@/lib/curriculum-2027"
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

function TrackBlock({ label, slot }: { label: string; slot: Slot }) {
  return (
    <div>
      <dt className="font-semibold text-navy">
        {label} (75 min): {slot.title}
        {slot.priority && slot.stage !== "mixed" ? <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-gold-deep">Priority</span> : null}
      </dt>
      <dd className="text-subtle">{slot.domain}</dd>
      <dd>Objective: {slot.objective}</dd>
      {slot.desmos ? <dd>Desmos: {slot.desmos}</dd> : null}
    </div>
  )
}

export default async function CohortSyllabusPage({ params }: Params) {
  const found = syllabusForId((await params).cohort)
  if (!found) notFound()
  const { cohort, sessions } = found
  const verbal = VERBAL_LABEL[cohort.program]
  const format = EXAM_FORMAT[cohort.program]

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
            Lesson sessions: {SESSION_BLOCKS.map((b) => `${b.minutes} min ${b.label}`).join(" · ")}. Diagnostic and mock-exam
            sessions use the full period. Exam format: {format.summary}
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
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-subtle">
                {s.format === "diagnostic" ? "Diagnostic" : s.format === "mock" ? "Full-length mock exam" : STAGE_LABEL[s.stage ?? "foundations"]}
              </p>
              {s.kind === "makeup" ? (
                <div className="mt-2 text-sm leading-relaxed">
                  <p className={s.approved ? "font-semibold text-ink" : "font-semibold text-gold-deep"}>
                    {s.approved ? "Approved makeup" : "Proposed makeup — not yet approved"}
                    {s.replaces && !s.additional ? `, preserving the hours of ${formatDate(s.replaces)}` : ""}
                  </p>
                  {s.additional ? (
                    <p className="text-ink">
                      Additional scheduled instructional session that completes the approved {cohort.sessions} sessions and{" "}
                      {cohort.hours} hours. {formatDate(s.replaces ?? "")} was never a scheduled class.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {s.format === "instruction" && s.math && s.verbal ? (
                <dl className="mt-3 grid gap-3 text-sm leading-relaxed text-ink md:grid-cols-2">
                  <TrackBlock label="Math" slot={s.math} />
                  <TrackBlock label={verbal} slot={s.verbal} />
                  <div>
                    <dt className="font-semibold text-navy">Practice</dt>
                    <dd>{s.math.practice} {s.verbal.practice}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-navy">Review (30 min)</dt>
                    <dd>{s.review}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="font-semibold text-navy">SMART activities</dt>
                    <dd>
                      <ul className="mt-1 flex flex-col gap-1">
                        {s.smart.map((a) => (
                          <li key={a.letter}><span className="font-bold text-navy">{a.letter}</span> · {a.activity}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-ink">{s.review}</p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink"><span className="font-semibold text-navy">Homework:</span> {s.homework}</p>
              {s.assessments.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.assessments.map((a) => (
                    <li key={a.label} className="border border-navy px-2 py-1 text-xs font-semibold leading-relaxed text-navy">{a.label}</li>
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

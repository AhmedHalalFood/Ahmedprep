import type { Metadata } from "next"
import Link from "next/link"
import { TERMS_2027, cohortTitle, cohortSchedule, PROGRAMS_2027 } from "@/lib/cohorts-2027"
import { ASSESSMENT_PLAN, GRADECAM_NOTE, PROGRESS_INDICATORS, SESSION_BLOCKS, TOPICS, VERBAL_LABEL, mockSessionsFor } from "@/lib/curriculum-2027"
import { DraftNotice } from "@/components/curriculum/draft-notice"
import { PrintButton } from "@/components/curriculum/print-button"

export const metadata: Metadata = {
  title: "Draft 2027 Curriculum and Assessment Plan | AhmedPrep",
  description: "Internal draft of the 2027 SHSAT and Digital SAT curriculum for owner review.",
  robots: { index: false, follow: false },
}

const COURSE_SHAPES = [
  { name: "Winter and Spring (all 8 cohorts)", sessions: 24 },
  { name: "Summer weekday intensive (2 cohorts)", sessions: 32 },
  { name: "Summer weekend (2 cohorts)", sessions: 16 },
]

export default function Curriculum2027Page() {
  return (
    <div className="bg-warm px-5 py-10 print:bg-background print:p-0 sm:py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="eyebrow blue">AhmedPrep 2027 · Internal</p>
          <h1 className="text-balance text-3xl font-extrabold text-navy sm:text-5xl">Curriculum outline and assessment plan</h1>
          <DraftNotice />
          <div className="flex flex-wrap gap-3">
            <PrintButton />
          </div>
        </header>

        <section aria-labelledby="structure" className="flex flex-col gap-4">
          <h2 id="structure" className="text-2xl font-extrabold text-navy">Session structure</h2>
          <p className="leading-relaxed text-ink">
            Every session is three hours. Session 1 is the full-length diagnostic, and mock-exam sessions use the full three
            hours for testing. All other sessions follow the approved structure:
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {SESSION_BLOCKS.map((b) => (
              <li key={b.id} className="border border-line bg-background p-4">
                <p className="text-3xl font-extrabold text-navy">{b.minutes} min</p>
                <p className="mt-1 text-sm leading-relaxed text-ink">{b.label}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-subtle">
            Each session follows AhmedPrep&apos;s SMART method. Every review block opens with cumulative retrieval practice
            drawn from earlier sessions and the student&apos;s own error log.
          </p>
        </section>

        <section aria-labelledby="shapes" className="flex flex-col gap-4">
          <h2 id="shapes" className="text-2xl font-extrabold text-navy">Course shapes</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-background text-left text-sm">
              <thead className="bg-navy text-primary-foreground">
                <tr><th className="p-3">Cohorts</th><th className="p-3">Sessions</th><th className="p-3">Hours</th><th className="p-3">Diagnostic</th><th className="p-3">Mock exams</th></tr>
              </thead>
              <tbody>
                {COURSE_SHAPES.map((s) => (
                  <tr key={s.name} className="border-b border-line">
                    <td className="p-3 font-semibold text-ink">{s.name}</td>
                    <td className="p-3">{s.sessions}</td>
                    <td className="p-3">{s.sessions * 3}</td>
                    <td className="p-3">Session 1</td>
                    <td className="p-3">Sessions {mockSessionsFor(s.sessions).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {PROGRAMS_2027.map((program) => (
          <section key={program} aria-labelledby={`outline-${program}`} className="flex flex-col gap-4 print:break-before-page">
            <h2 id={`outline-${program}`} className="text-2xl font-extrabold text-navy">{program} topic sequence</h2>
            <p className="text-sm leading-relaxed text-subtle">
              {program === "SHSAT"
                ? "Aligned to the NYC DOE SHSAT Student Handbook: Math, and ELA (Revising/Editing Parts A and B, Reading Comprehension)."
                : "Aligned to the College Board Digital SAT content domains. Math sessions teach the built-in Desmos graphing calculator alongside each topic."}{" "}
              Shorter courses combine adjacent topics; the 32-session intensive splits topics into teach and apply sessions.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {(["math", "verbal"] as const).map((track) => (
                <div key={track} className="border border-line bg-background p-5">
                  <h3 className="font-bold text-navy">{track === "math" ? "Math" : VERBAL_LABEL[program]}</h3>
                  <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-ink">
                    {TOPICS[program][track].map((t) => (
                      <li key={t.title}>
                        <span className="font-semibold">{t.title}</span> <span className="text-subtle">({t.domain})</span>
                        {t.desmos ? <span className="block text-subtle">Desmos: {t.desmos}</span> : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section aria-labelledby="assessment" className="flex flex-col gap-4 print:break-before-page">
          <h2 id="assessment" className="text-2xl font-extrabold text-navy">Assessment plan</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-background text-left text-sm">
              <thead className="bg-navy text-primary-foreground">
                <tr><th className="p-3">Assessment</th><th className="p-3">Frequency</th><th className="p-3">Purpose</th><th className="p-3">Scoring</th></tr>
              </thead>
              <tbody>
                {ASSESSMENT_PLAN.map((r) => (
                  <tr key={r.assessment} className="border-b border-line align-top">
                    <td className="p-3 font-semibold text-ink">{r.assessment}</td>
                    <td className="p-3">{r.frequency}</td>
                    <td className="p-3">{r.purpose}</td>
                    <td className="p-3">{r.scoring}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-relaxed text-subtle">{GRADECAM_NOTE}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {PROGRAMS_2027.map((program) => (
              <div key={program} className="border border-line bg-background p-5">
                <h3 className="font-bold text-navy">{program} progress indicators</h3>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-ink">
                  {PROGRESS_INDICATORS[program].map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="syllabi" className="flex flex-col gap-4" data-print-hide>
          <h2 id="syllabi" className="text-2xl font-extrabold text-navy">Dated draft syllabi</h2>
          {TERMS_2027.map((term) => (
            <div key={term.id} className="flex flex-col gap-2">
              <h3 className="font-bold text-navy">{term.name}</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {term.cohorts.map((c) => (
                  <li key={c.id}>
                    <Link href={`/curriculum-2027/${c.id}`} className="flex min-h-11 flex-col border border-line bg-background p-3 hover:border-brand">
                      <span className="font-semibold text-brand">{cohortTitle(c)}</span>
                      <span className="text-sm text-subtle">{cohortSchedule(c)} · {c.sessions} sessions</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

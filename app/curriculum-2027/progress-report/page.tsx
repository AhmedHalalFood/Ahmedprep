import type { Metadata } from "next"
import Link from "next/link"
import { PROGRAMS_2027, type ProgramId } from "@/lib/cohorts-2027"
import { REPORT_AREAS, SCORE_RULES, VERBAL_LABEL } from "@/lib/curriculum-2027"
import { DraftNotice } from "@/components/curriculum/draft-notice"
import { PrintButton } from "@/components/curriculum/print-button"

export const metadata: Metadata = {
  title: "Draft parent progress report template | AhmedPrep",
  robots: { index: false, follow: false },
}

function Field({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-subtle">{label}</span>
      <span className="h-7 border-b border-line" aria-hidden="true" />
    </div>
  )
}

function AreaTable({ caption, areas }: { caption: string; areas: readonly string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="pb-2 text-left font-bold text-navy">{caption}</caption>
        <thead>
          <tr className="border-b border-navy">
            <th className="py-2 pr-3">Area</th><th className="py-2 pr-3">Correct / total</th><th className="py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((a) => (
            <tr key={a} className="border-b border-line">
              <td className="py-3 pr-3 text-ink">{a}</td><td className="py-3 pr-3" /><td className="py-3" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReportTemplate({ program }: { program: ProgramId }) {
  const verbal = VERBAL_LABEL[program]
  return (
    <article aria-labelledby={`report-${program}`} className="flex flex-col gap-6 border border-line bg-background p-6 print:break-before-page print:border-0 print:p-0">
      <header className="flex flex-col gap-1 border-b-2 border-navy pb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">AhmedPrep</p>
        <h2 id={`report-${program}`} className="text-2xl font-extrabold text-navy">{program} parent progress report</h2>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Student name" />
        <Field label="Cohort" />
        <Field label="Report date" />
        <Field label="Report type (diagnostic / after mock exam / final)" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="pb-2 text-left font-bold text-navy">Assessment results</caption>
          <thead>
            <tr className="border-b border-navy">
              <th className="py-2 pr-3">Assessment</th><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Math</th>
              <th className="py-2 pr-3">{verbal}</th><th className="py-2">Score type</th>
            </tr>
          </thead>
          <tbody>
            {["Diagnostic", "Latest assessment"].map((r) => (
              <tr key={r} className="border-b border-line">
                <td className="py-3 pr-3 font-semibold text-ink">{r}</td><td /><td /><td /><td className="py-3 text-subtle">Raw / Scaled</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs leading-relaxed text-subtle">{SCORE_RULES[program]}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AreaTable caption="Math performance" areas={REPORT_AREAS[program].math} />
        <AreaTable caption={`${verbal} performance`} areas={REPORT_AREAS[program].verbal} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sessions attended (of scheduled to date)" />
        <Field label="Homework completed (of assigned to date)" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-navy">Areas needing improvement</h3>
        {[1, 2, 3].map((i) => <span key={i} className="h-7 border-b border-line" aria-hidden="true" />)}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-navy">Recommended practice before the next assessment</h3>
        {[1, 2, 3].map((i) => <span key={i} className="h-7 border-b border-line" aria-hidden="true" />)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Instructor" />
        <Field label="Next assessment date" />
      </div>
    </article>
  )
}

export default function ProgressReportTemplatePage() {
  return (
    <div className="bg-warm px-5 py-10 print:bg-background print:p-0 sm:py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-4" data-print-hide>
          <Link href="/curriculum-2027" className="text-sm font-semibold text-brand underline-offset-2 hover:underline">
            All draft curriculum
          </Link>
          <p className="eyebrow blue">Draft template · Internal</p>
          <h1 className="text-balance text-3xl font-extrabold text-navy sm:text-4xl">Parent progress report template</h1>
          <DraftNotice />
          <p className="text-sm leading-relaxed text-subtle">
            Filled in by the instructor from GradeCam results and the error log after the diagnostic, after each mock exam,
            and at course end. Each program prints on its own page.
          </p>
          <div className="flex flex-wrap gap-3"><PrintButton /></div>
        </header>
        {PROGRAMS_2027.map((p) => <ReportTemplate key={p} program={p} />)}
      </div>
    </div>
  )
}

import { ExternalLink } from "lucide-react"

type Exam = "SHSAT" | "Digital SAT"

const SOURCES = {
  SHSAT: [
    {label:"Official SHSAT information and exam format",url:"https://www.schools.nyc.gov/learning/testing/specialized-high-school-admissions-test"},
    {label:"NYC Public Schools testing calendar",url:"https://www.schools.nyc.gov/learning/testing/testing-calendar"},
    {label:"Specialized High Schools admissions and registration",url:"https://www.schools.nyc.gov/enrollment/enroll-grade-by-grade/specialized-high-schools"},
  ],
  "Digital SAT": [
    {label:"Official SAT dates and registration deadlines",url:"https://satsuite.collegeboard.org/sat/dates-deadlines"},
    {label:"SAT test structure",url:"https://satsuite.collegeboard.org/sat/whats-on-the-test/structure"},
    {label:"Bluebook testing preparation and device information",url:"https://bluebook.collegeboard.org/students/sat-weekend"},
  ],
} as const

/**
 * Primary-source links stay current even when the exam authority edits its pages.
 * Approved AhmedPrep cohort dates/tuition are separate from NYCPS and College Board exam dates.
 */
export function OfficialExamSources({ exam }: { exam: Exam }) {
  const organization = exam === "SHSAT" ? "NYC Public Schools" : "College Board"
  return (
    <section aria-label={`${exam} official updates`} className="border-y border-line bg-paper py-5">
      <div className="container">
        <p className="text-xs font-extrabold uppercase tracking-wider text-brand">Official exam information</p>
        <h2 className="mt-1 text-xl font-extrabold text-navy">Check the latest {exam} updates directly with {organization}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-subtle">
          Exam dates, registration deadlines, testing rules, and accommodations may change. For the most current official instructions, use the source links below.
          AhmedPrep class schedules and tuition are separate from official exam registration.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {SOURCES[exam].map(({ label, url }) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-navy underline underline-offset-4 hover:text-brand">
                {label}<ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

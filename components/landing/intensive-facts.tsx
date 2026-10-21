import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS } from "@/lib/business"
import {
  CLASS_DAYS,
  CLASS_TIME,
  ENROLLMENT_STATUS,
  INTENSIVE_NAME,
  ORIGINAL_DATES,
  ORIGINAL_HOURS,
  ORIGINAL_TUITION,
  PROGRAM_FORMAT,
  formatClassDate,
  formatUsd,
  type EnrollmentSnapshot,
} from "@/lib/shsat-intensive"

/** Program facts shown identically on the homepage, SHSAT page, and Intensive page. Designed for dark (navy) backgrounds. */
export function IntensiveFacts({ snapshot }: { snapshot: EnrollmentSnapshot }) {
  const facts: { term: string; detail: React.ReactNode }[] = [
    { term: "Program", detail: INTENSIVE_NAME },
    { term: "Enrollment status", detail: snapshot.nextClass ? ENROLLMENT_STATUS : "Program completed" },
    { term: "Original program dates", detail: ORIGINAL_DATES },
    { term: "Class days", detail: CLASS_DAYS },
    { term: "Class time", detail: CLASS_TIME },
    { term: "Original program", detail: `${ORIGINAL_HOURS} instructional hours for ${formatUsd(ORIGINAL_TUITION)}` },
    { term: "Format", detail: PROGRAM_FORMAT },
    { term: "Address", detail: `${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}` },
    {
      term: "Phone",
      detail: (
        <a href={BUSINESS.phoneHref} className="underline underline-offset-4 hover:text-gold">
          {BUSINESS.phoneDisplay}
        </a>
      ),
    },
  ]

  return (
    <div className="flex flex-col border border-white/20">
      <dl className="m-0 grid sm:grid-cols-2 lg:grid-cols-3">
        {facts.map(({ term, detail }) => (
          <div key={term} className="flex flex-col gap-1 border-b border-white/15 px-4 py-3 sm:px-5">
            <dt className="text-xs font-bold uppercase tracking-widest text-white/60">{term}</dt>
            <dd className="m-0 font-semibold leading-snug text-white">{detail}</dd>
          </div>
        ))}
      </dl>
      <EnrollingTodaySummary snapshot={snapshot} />
    </div>
  )
}

export function EnrollingTodaySummary({ snapshot }: { snapshot: EnrollmentSnapshot }) {
  if (!snapshot.nextClass) {
    return (
      <p className="m-0 bg-white/5 px-4 py-4 leading-relaxed text-white/85 sm:px-5">
        All scheduled classes for the {INTENSIVE_NAME} have been held. Call us to ask about upcoming programs.
      </p>
    )
  }
  return (
    <div className="flex flex-col gap-1 bg-white/5 px-4 py-4 sm:px-5">
      <p className="m-0 text-xs font-bold uppercase tracking-widest text-gold">If you enroll today</p>
      <p className="m-0 text-pretty text-lg font-extrabold leading-snug text-white">
        {`First available class: ${formatClassDate(snapshot.nextClass, "long")} \u00b7 ${snapshot.classes} remaining classes \u00b7 ${snapshot.hours} instructional hours \u00b7 `}
        <span className="text-gold">{`${formatUsd(snapshot.tuition)} tuition`}</span>
      </p>
      <p className="m-0 text-sm leading-relaxed text-white/70">
        {`Tuition is prorated for the remaining scheduled hours. The ${snapshot.classesHeld} classes already held are not included and are not charged.`}
      </p>
    </div>
  )
}

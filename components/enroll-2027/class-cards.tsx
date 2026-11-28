import { Clock } from "lucide-react"
import { cohortSchedule, cohortInquiryHref, TERMS_2027, formatShortDate, cohortSpan, dollars, priceFor } from "@/lib/cohorts-2027"
import { activeTerms } from "@/lib/program-retirement"
import { ENROLLMENT_2027 as E } from "@/lib/enrollment-2027"

export function ClassCards() {
  const winter = activeTerms(TERMS_2027).find((term) => term.id === "winter")
  const classes = winter?.cohorts ?? []
  if (!classes.length) return null

  return (
    <section aria-labelledby="classes-heading" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="eyebrow blue">Four Winter 2027 class choices</p>
        <h2 id="classes-heading" className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Choose your SHSAT or Digital SAT class
        </h2>
        <p className="text-pretty leading-relaxed text-subtle">
          Two SHSAT groups meet in person in Astoria; Digital SAT offers a live online weekday group and an in-person weekend group.
          Each cohort has {E.hours} instructional hours and no more than {E.maxClassSize} students.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {classes.map((cohort) => {
          const titleId = `${cohort.id}-title`
          const span = cohortSpan(cohort)
          return (
            <li key={cohort.id}>
              <article aria-labelledby={titleId} className="flex h-full flex-col gap-3 border border-line border-t-4 border-t-brand bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">{cohort.program}</p>
                <h3 id={titleId} className="text-xl font-extrabold leading-tight text-navy">{cohort.label}</h3>
                <p className="text-sm leading-relaxed text-ink">{cohortSchedule(cohort)}</p>
                <p className="text-sm text-subtle">{formatShortDate(span.startIso)} to {formatShortDate(span.endIso)} · {cohort.sessions} meetings · {cohort.hours} hours</p>
                <p className="text-sm font-bold text-navy">{dollars(priceFor(cohort).regular)} regular · {dollars(priceFor(cohort).founding ?? priceFor(cohort).regular)} founding-family if eligible</p>
                <p className="flex items-center gap-2 bg-cream px-3 py-2 text-sm font-bold text-navy">
                  <Clock size={16} aria-hidden="true" className="shrink-0 text-gold-deep" />
                  {E.availabilityStatus}
                </p>
                <a className="mt-auto text-sm font-extrabold text-brand underline underline-offset-4" href={cohortInquiryHref(cohort)}>Request details for this class</a>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

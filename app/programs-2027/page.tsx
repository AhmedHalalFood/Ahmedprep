import type { Metadata } from "next"
import Link from "next/link"
import { TERMS_2027, priceFor } from "@/lib/cohorts-2027"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "2027 SHSAT and Digital SAT Class Schedule and Tuition | AhmedPrep",
  description: "Compare AhmedPrep's approved Winter, Spring, and Summer 2027 SHSAT and Digital SAT cohorts, class hours, tuition, and early enrollment deadlines in Astoria.",
  alternates: { canonical: absoluteUrl("/programs-2027") },
}
const dollars = (n: number) => "$" + n.toLocaleString("en-US")

export default function Programs2027Page() {
  return (
    <div className="bg-warm px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="eyebrow blue">AhmedPrep 2027</p>
          <h1 className="text-3xl font-extrabold text-navy sm:text-5xl">SHSAT and Digital SAT class schedules</h1>
          <p className="max-w-3xl text-lg text-subtle">Small-group classes in Astoria. Compare all 12 approved cohorts, instructional hours, tuition, and full-payment discount deadlines. All times are Eastern Time.</p>
          <Link href="/enroll-2027" className="button button-gold button-lg inline-flex">Request 2027 enrollment information</Link>
          <p className="text-sm text-subtle">Enrollment inquiries are open for all Winter, Spring, and Summer 2027 cohorts. Choose a cohort below to start an inquiry with it already selected.</p>
        </header>
        {TERMS_2027.map((term) => (
          <section key={term.id} id={term.id} className="space-y-5" aria-labelledby={term.id + "-title"}>
            <h2 id={term.id + "-title"} className="text-2xl font-extrabold text-navy">{term.name}</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {term.cohorts.map((cohort) => {
                const price = priceFor(cohort)
                return (
                  <li key={cohort.id} className="border border-line border-t-4 border-t-brand bg-white p-5">
                    <h3 className="text-lg font-extrabold text-navy">{cohort.program} · {cohort.label}</h3>
                    <p className="mt-2 font-semibold text-ink">{cohort.days}, {cohort.time}</p>
                    <p className="text-sm text-subtle">{cohort.dates}, 2027</p>
                    <p className="mt-2 text-sm text-ink">{cohort.sessions} classes · {cohort.hours} scheduled instructional hours</p>
                    <p className="mt-3 text-sm text-ink">Regular <strong>{dollars(price.regular)}</strong> · Early <strong>{dollars(price.early)}</strong> · Founding <strong>{dollars(price.founding)}</strong></p>
                    <Link
                      href={`/enroll-2027?${new URLSearchParams({ program: cohort.program, term: cohort.term, cohort: cohort.id })}`}
                      className="mt-3 inline-block text-sm font-bold text-brand underline"
                    >
                      Request info for {term.name} {cohort.program} {cohort.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="border border-line bg-white p-5">
              <h3 className="font-extrabold text-navy">Full-payment discount deadlines</h3>
              <p className="mt-1 text-sm text-subtle">Founding: first five fully paid enrollments per cohort, by the listed date or until filled. Early: 10% off with full payment by the listed date. Discounts do not stack.</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-line"><th className="py-2 pr-4">Cohort</th><th className="py-2 pr-4">Founding deadline</th><th className="py-2">Early deadline</th></tr></thead>
                  <tbody>{term.deadlines.map((d) => <tr key={d.group} className="border-b border-line"><td className="py-2 pr-4">{d.group}</td><td className="py-2 pr-4">{d.founding}</td><td className="py-2">{d.early}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </section>
        ))}
        <section className="space-y-3 border-l-4 border-brand bg-white p-5">
          <h2 className="text-xl font-extrabold text-navy">Holiday makeups and free Sunday Zoom</h2>
          <p className="text-sm text-ink">Winter and Spring makeup instruction is scheduled on select Saturdays from 5:30–8:30 PM. The summer weekend makeup is a daytime session on August 28. Sunday, August 29 is the required final instructional session for both summer intensive cohorts (SHSAT 10 AM–1 PM ET; Digital SAT 2–5 PM ET). Exact makeup assignments remain subject to final curriculum sequencing and calendar verification before publication.</p>
          <p className="text-sm text-ink">Free Sunday Zoom classes continue every other Sunday in Winter and Spring: SHSAT 6–6:45 PM and Digital SAT 7–7:45 PM. The last 2027 class Sunday is June 27. Both are suspended during July and August 2027, and Fall 2027 dates have not been announced.</p>
          <p className="text-sm text-ink">Summer break begins August 30, 2027. Digital SAT students bring their own laptops.</p>
        </section>
        <p className="text-sm text-subtle">Submitting an inquiry does not reserve a seat or a discounted tuition rate. Payment, cancellation, and refund terms will be provided before enrollment is finalized.</p>
      </div>
    </div>
  )
}

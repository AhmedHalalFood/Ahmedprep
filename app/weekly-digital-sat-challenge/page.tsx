import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Breadcrumbs } from "@/components/landing/primitives"
import { DigitalSATWeeklyQuiz } from "@/components/weekly-practice/digital-sat-weekly-quiz"
import { currentDigitalSATChallenge } from "@/lib/digital-sat-weekly-challenge"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Weekly Digital SAT Challenge: 5 Hard + 5 Super Hard | AhmedPrep",
  description: "Take 10 original Digital SAT-style questions: five hard and five super hard. Submit all answers before reviewing your score, worked solutions, and strategy tips.",
  alternates: { canonical: absoluteUrl("/weekly-digital-sat-challenge") },
}
export const revalidate = 3600

export default function WeeklyDigitalSATChallengePage() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date())
  const part = (type: string) => parts.find((value) => value.type === type)?.value ?? ""
  const today = `${part("year")}-${part("month")}-${part("day")}`
  const set = currentDigitalSATChallenge(today)

  return (
    <>
      <Breadcrumbs items={[{ label: "Weekly Practice", href: "/weekly-practice" }, { label: "Weekly Digital SAT Challenge", href: "/weekly-digital-sat-challenge" }]} />
      <section className="bg-site-canvas py-8 md:py-12">
        <div className="container max-w-3xl space-y-6">
          <header className="space-y-3">
            <p className="eyebrow blue">AhmedPrep · Free weekly Digital SAT challenge</p>
            <h1 className="text-balance text-3xl font-extrabold leading-tight text-navy md:text-4xl">
              10 Digital SAT Questions: Hard &amp; Super Hard
            </h1>
            <p className="text-base leading-relaxed text-subtle">
              Five hard and five super-hard questions across Math and Reading &amp; Writing.
              Complete the whole quiz before seeing your score, the correct answers, detailed explanations, and strategies.
            </p>
            {set && <p className="text-sm font-bold text-navy">Current set released: {set.publishedDate} · New sets are prepared and scheduled on Mondays</p>}
          </header>
          {set ? <DigitalSATWeeklyQuiz key={set.publishedDate} set={set} /> : (
            <p className="rounded-xl border border-line bg-white p-6 font-semibold text-navy">The first challenge is being prepared. Check again soon.</p>
          )}
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="text-xl font-extrabold text-navy">Aim for your highest Digital SAT score</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              AhmedPrep offers live online weekday Digital SAT classes and in-person weekend classes in Astoria, Queens.
              Our integrated mastery curriculum includes a 1600 Challenge tier.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/free-diagnostic" className="button button-gold">Book a free diagnostic <ArrowUpRight size={16} aria-hidden="true" /></Link>
              <Link href="/digital-sat-prep" className="button button-outline">Explore Digital SAT classes</Link>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-subtle">
            These are independent, original AhmedPrep practice questions, not official College Board materials,
            not a Bluebook adaptive test, and not a guarantee or prediction of a 1600 score.
            Future sets must be written and checked before their scheduled publication.
          </p>
        </div>
      </section>
    </>
  )
}

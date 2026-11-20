import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Breadcrumbs } from "@/components/landing/primitives"
import { SHSATWeeklyQuiz } from "@/components/weekly-practice/shsat-weekly-quiz"
import { currentSHSATChallenge } from "@/lib/shsat-weekly-challenge"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Weekly SHSAT Challenge: 10 Advanced Questions | AhmedPrep",
  description: "Try 10 challenging original SHSAT-style Math and ELA questions. Submit the entire quiz first, then review a score, answer key, worked explanations, and strategies.",
  alternates: { canonical: absoluteUrl("/weekly-shsat-challenge") },
}

/** Refresh hourly so Monday's new set appears in New York local time. */
export const revalidate = 3600

export default function WeeklySHSATChallengePage() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date())
  const part = (type: string) => parts.find((value) => value.type === type)?.value ?? ""
  const today = `${part("year")}-${part("month")}-${part("day")}`
  const set = currentSHSATChallenge(today)

  return (
    <>
      <Breadcrumbs items={[{ label: "Weekly Practice", href: "/weekly-practice" }, { label: "Weekly SHSAT Challenge", href: "/weekly-shsat-challenge" }]} />
      <section className="bg-site-canvas py-8 md:py-12">
        <div className="container max-w-3xl space-y-6">
          <header className="space-y-3">
            <p className="eyebrow blue">AhmedPrep · Free weekly challenge</p>
            <h1 className="text-balance text-3xl font-extrabold leading-tight text-navy md:text-4xl">10 Advanced SHSAT Questions Every Week</h1>
            <p className="text-base leading-relaxed text-subtle">
              Test your Math and ELA skills before seeing any answers. Receive your complete scored report,
              detailed explanations, and shortcuts only after submitting all 10 questions.
            </p>
            {set && <p className="text-sm font-bold text-navy">Current challenge released: {set.publishedDate} · New sets scheduled on Mondays</p>}
          </header>
          {set ? <SHSATWeeklyQuiz key={set.publishedDate} set={set} /> : (
            <p className="rounded-xl border border-line bg-white p-6 font-semibold text-navy">The first weekly challenge is being prepared. Check again soon.</p>
          )}
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="text-xl font-extrabold text-navy">Want to improve your SHSAT score?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">AhmedPrep offers small-group, in-person Math and ELA preparation in Astoria, Queens, including diagnostic-based guidance and timed practice.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/free-diagnostic" className="button button-gold">Book a free diagnostic <ArrowUpRight size={16} /></Link>
              <Link href="/shsat-prep" className="button button-outline">Explore SHSAT classes</Link>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-subtle">This is independent AhmedPrep practice, not an official NYC Public Schools SHSAT or a computer-adaptive test. New weekly content must be reviewed and added before each scheduled release; the website never fabricates new questions automatically.</p>
        </div>
      </section>
    </>
  )
}

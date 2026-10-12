import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { CaseStudyCard } from "@/components/results/case-study-card"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { getPublishedCaseStudies } from "@/lib/case-studies"
import { FREE_CLASS } from "@/lib/free-class"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"

const TITLE = "AhmedPrep Student Progress & Results"
const DESCRIPTION =
  "Verified SHSAT and Digital SAT student progress at AhmedPrep in Astoria, Queens, shared only with written family permission."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/results") },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl("/results") },
}

const HOW_WE_MEASURE = [
  ["A real starting point", "Every student begins with a diagnostic, recorded exactly as scored."],
  ["The same yardstick later", "Later scores come from full-length practice tests or official results, and each case study says which."],
  ["Family permission first", "Nothing is published without written permission. Students are identified only by grade or initials."],
] as const

export default function ResultsPage() {
  const studies = getPublishedCaseStudies()
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/results", name: TITLE, description: DESCRIPTION, type: "CollectionPage" })} />
      <Breadcrumbs items={[{ label: "Results", href: "/results" }]} />

      <section aria-labelledby="results-title" className="bg-warm py-14 md:py-20">
        <div className="container flex max-w-3xl flex-col gap-5">
          <p className="eyebrow blue">Student results</p>
          <h1 id="results-title" className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
            AhmedPrep Student Progress & Results
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-subtle">
            We share case studies only when the scores are verified and the family has given written permission. No invented numbers, no
            borrowed testimonials.
          </p>
        </div>
      </section>

      <section aria-labelledby="how-we-measure" className="bg-white py-14">
        <div className="container">
          <h2 id="how-we-measure" className="text-2xl font-extrabold text-navy">
            How we measure progress
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {HOW_WE_MEASURE.map(([title, body]) => (
              <li key={title} className="border-t-2 border-gold pt-4">
                <h3 className="font-extrabold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="case-studies-title" className="border-t border-line bg-white py-14">
        <div className="container">
          <h2 id="case-studies-title" className="text-2xl font-extrabold text-navy">
            Case studies
          </h2>
          {studies.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study) => (
                <CaseStudyCard key={study.id} study={study} />
              ))}
            </div>
          ) : (
            <div className="mt-6 max-w-2xl border border-line bg-warm p-6">
              <p className="font-bold text-navy">Verified case studies are being collected.</p>
              <p className="mt-2 text-sm leading-relaxed text-subtle">
                We&apos;ll publish them here as families give permission. The best way to see how AhmedPrep teaches is to start with a free
                diagnostic or a free Sunday class.
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="results-cta" className="bg-navy py-14 text-primary-foreground">
        <div className="container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 id="results-cta" className="text-balance text-2xl font-extrabold">
            Start with an honest starting point.
          </h2>
          <div className="flex flex-wrap gap-4">
            <TrackedLink href="/free-diagnostic" event={EVENTS.resultsCtaClick} eventProps={{ location: "results_page", cta: "diagnostic" }} className="button button-gold">
              Book Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href={FREE_CLASS.path}
              event={EVENTS.resultsCtaClick}
              eventProps={{ location: "results_page", cta: "sunday_class" }}
              className="inline-flex min-h-12 items-center gap-2 font-bold text-primary-foreground underline-offset-4 hover:underline"
            >
              Try a Free Sunday Class <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  )
}

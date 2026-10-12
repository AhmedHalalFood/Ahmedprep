import { ArrowUpRight } from "lucide-react"
import { CaseStudyCard } from "@/components/results/case-study-card"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { getPublishedCaseStudies } from "@/lib/case-studies"

export function ResultsPreview() {
  const studies = getPublishedCaseStudies().slice(0, 2)
  return (
    <section id="student-progress" aria-labelledby="student-progress-title" className="bg-white py-16 md:py-20">
      <div className="container flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow blue">Real Student Progress</p>
            <h2 id="student-progress-title" className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              Progress measured from a real starting point
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-subtle">
              {studies.length > 0
                ? "Case studies shared with written permission from each family."
                : "Each student's progress is tracked from their first diagnostic. We publish case studies only with verified scores and written family permission."}
            </p>
          </div>
          <TrackedLink href="/results" event={EVENTS.resultsCtaClick} eventProps={{ location: "home_results_preview" }} className="text-link">
            {studies.length > 0 ? "See all results" : "How we track progress"} <ArrowUpRight size={15} aria-hidden="true" />
          </TrackedLink>
        </div>
        {studies.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {studies.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

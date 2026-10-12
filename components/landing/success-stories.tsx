import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/landing/primitives"
import { CaseStudyCard } from "@/components/results/case-study-card"
import { getPublishedCaseStudies, type CaseStudy } from "@/lib/case-studies"

/** Renders only verified, family-approved case studies. Shows nothing when none are published. */
export function SuccessStories({ program, title = "Student progress" }: { program?: CaseStudy["test"]; title?: string }) {
  const studies = getPublishedCaseStudies(program).slice(0, 3)
  if (studies.length === 0) return null
  return (
    <Section id="success-stories" eyebrow="Student results" title={title} intro="Shared with written permission from each family.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {studies.map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
      <Link href="/results" className="text-link mt-8">
        All student results <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </Section>
  )
}

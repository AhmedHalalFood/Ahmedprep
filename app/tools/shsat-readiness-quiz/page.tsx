import type { Metadata } from "next"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { ReadinessQuiz } from "@/components/tools/readiness-quiz"
import { ToolHero } from "@/components/tools/tool-hero"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"

const PATH = "/tools/shsat-readiness-quiz"
const TITLE = "Free SHSAT Readiness Quiz"
const DESCRIPTION = "Ten quick SHSAT Math, ELA, and test-habit questions with answer explanations and a general readiness summary."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH) },
}

export default function ReadinessQuizPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION, type: "WebApplication" })} />
      <Breadcrumbs items={[{ label: "Free Tools", href: "/tools" }, { label: "SHSAT Readiness Quiz", href: PATH }]} />
      <ToolHero id="quiz-title" eyebrow="Free tool · SHSAT" title="SHSAT Readiness Quiz">
        <p>
          Ten short questions on core Math, ELA, and test-day habits. You&apos;ll see explanations for every answer and a general readiness
          summary. It isn&apos;t a score prediction.
        </p>
      </ToolHero>
      <section aria-label="Quiz" className="bg-warm pb-16">
        <div className="container max-w-3xl">
          <ReadinessQuiz />
        </div>
      </section>
    </>
  )
}

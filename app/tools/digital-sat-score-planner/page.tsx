import type { Metadata } from "next"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { SatGoalPlanner } from "@/components/tools/sat-goal-planner"
import { ToolHero } from "@/components/tools/tool-hero"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"

const PATH = "/tools/digital-sat-score-planner"
const TITLE = "Digital SAT Score Goal Planner"
const DESCRIPTION = "Enter a current Digital SAT practice score and a target to get a suggested study focus, weekly hours, and timeline."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH) },
}

export default function SatPlannerPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION, type: "WebApplication" })} />
      <Breadcrumbs items={[{ label: "Free Tools", href: "/tools" }, { label: "Digital SAT Score Planner", href: PATH }]} />
      <ToolHero id="planner-title" eyebrow="Free tool · Digital SAT" title="Digital SAT Score Goal Planner">
        <p>Enter a recent practice score and your goal. You&apos;ll get a suggested focus and weekly study time for your test date.</p>
      </ToolHero>
      <section aria-label="Planner" className="bg-warm pb-16">
        <div className="container max-w-3xl">
          <SatGoalPlanner />
        </div>
      </section>
    </>
  )
}

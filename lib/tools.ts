export type FreeTool = {
  slug: string
  title: string
  description: string
  test: "SHSAT" | "Digital SAT"
  kind: "Assessment" | "Dates" | "Planner"
}

/** Add a tool here and create app/tools/<slug>/page.tsx. The hub, sitemap, and homepage pick it up automatically. */
export const FREE_TOOLS: FreeTool[] = [
  {
    slug: "shsat-readiness-quiz",
    title: "SHSAT Readiness Quiz",
    description: "Ten short Math, ELA, and test-habit questions with a general readiness summary and next steps.",
    test: "SHSAT",
    kind: "Assessment",
  },
  {
    slug: "shsat-dates",
    title: "2026 SHSAT Dates & Deadline",
    description: "Verified NYC Public Schools registration deadline and test dates, with days remaining.",
    test: "SHSAT",
    kind: "Dates",
  },
  {
    slug: "digital-sat-score-planner",
    title: "Digital SAT Score Goal Planner",
    description: "Enter a current practice score and a target to get a suggested study focus and timeline.",
    test: "Digital SAT",
    kind: "Planner",
  },
]

export const toolPath = (slug: string) => `/tools/${slug}`

import type { ProgramId } from "@/lib/programs"

export type CaseStudy = {
  id: string
  /** Shown publicly only when BOTH `published` and `familyPermission` are true. */
  published: boolean
  /** Written permission from the family to publish this case study. */
  familyPermission: boolean
  /** Anonymous identifier or student type, e.g. "Grade 8 student, Queens" or "M.R." */
  studentLabel: string
  grade: string
  test: "SHSAT" | "Digital SAT"
  /** Exactly as recorded on the diagnostic, e.g. "1180" or "ELA 41 / Math 38 correct". */
  startingScore?: string
  laterScore?: string
  /** What the later score is from, e.g. "Full-length practice test, week 10" or "Official SAT, Dec 2026". */
  laterScoreSource?: string
  skillsImproved: string[]
  program: ProgramId
  quote?: { text: string; by: "Parent" | "Student" }
  /** ISO date the later score was recorded (YYYY-MM-DD). */
  date: string
}

/**
 * Single editable source for student results on /results, the homepage preview, and program pages.
 * The entry below is a TEMPLATE, not a real student. It stays hidden until you replace every field
 * with verified information and set both `published` and `familyPermission` to true.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "template-do-not-publish",
    published: false,
    familyPermission: false,
    studentLabel: "[Anonymous identifier, e.g. Grade 8 student]",
    grade: "[Grade]",
    test: "SHSAT",
    startingScore: "[Starting diagnostic score]",
    laterScore: "[Later score]",
    laterScoreSource: "[Where the later score is from]",
    skillsImproved: ["[Skill area]"],
    program: "shsat",
    quote: { text: "[Verbatim quote approved by the family]", by: "Parent" },
    date: "2026-01-01",
  },
]

export function getPublishedCaseStudies(test?: CaseStudy["test"]) {
  return CASE_STUDIES.filter((c) => c.published && c.familyPermission && (!test || c.test === test)).sort((a, b) =>
    b.date.localeCompare(a.date),
  )
}

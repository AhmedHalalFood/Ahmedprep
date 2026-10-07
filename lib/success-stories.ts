export type SuccessStory = {
  id: string
  /** Only stories with `published: true` AND written family permission are shown on the site. */
  published: boolean
  /** First name or initials only, e.g. "Sara K." or "M.R." */
  studentName: string
  program: "SHSAT" | "Digital SAT"
  startingScore?: string
  finalScore?: string
  /** e.g. "Admitted to Stuyvesant High School" */
  acceptance?: string
  studentQuote?: string
  parentQuote?: string
  parentName?: string
  /** Local path under /public, e.g. "/stories/sara.jpg" */
  photo?: string
  /** YouTube/Vimeo embed URL */
  videoUrl?: string
}

/**
 * CMS-style data source for student results. The entry below is a TEMPLATE, not a real student.
 * It stays hidden (published: false). Replace its fields with verified information, or copy it,
 * and set published to true once the family has approved publication.
 */
export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "template-do-not-publish",
    published: false,
    studentName: "[Student initials]",
    program: "SHSAT",
    startingScore: "[Diagnostic score]",
    finalScore: "[Final score]",
    acceptance: "[School acceptance]",
    studentQuote: "[Short student testimonial]",
    parentQuote: "[Parent testimonial]",
    parentName: "[Parent first name]",
  },
]

export function getPublishedStories(program?: SuccessStory["program"]) {
  return SUCCESS_STORIES.filter((s) => s.published && (!program || s.program === program))
}

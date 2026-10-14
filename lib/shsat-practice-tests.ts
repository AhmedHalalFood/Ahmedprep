import { NYCPS_SHSAT_URL } from "@/lib/resources-shsat-2026"

export const PRACTICE_LIBRARY_PATH = "/shsat-practice-tests"

/**
 * Verified 2026-10-13 from the NYCPS Specialized High Schools page, which directs families to the NYC SHSAT Portal
 * for "the Student Readiness Tool and practice tests". The portal lists four full-length grade 8 practice tests for
 * fall 2026, with answer explanations and no name required. Re-verify these URLs before changing them.
 */
export const OFFICIAL_SHSAT = {
  sourceUrl: NYCPS_SHSAT_URL,
  portalUrl: "https://nycshsat.myassessmentsupport.com/",
  practiceTestsUrl: "https://nycshsat.myassessmentsupport.com/practice-tests/",
  understandingTestUrl: "https://nycshsat.myassessmentsupport.com/understanding-the-test/",
  readinessToolUrl: "https://srt.testnav.com/ny-shsat/ny-shsat-srt.html",
  verified: "2026-10-13",
  testCount: 4,
} as const

export const OFFICIAL_TEST_PLAN = [
  { number: 1, use: "Use this as your first full diagnostic." },
  { number: 2, use: "Use after targeted Math and ELA review." },
  { number: 3, use: "Take under full timed conditions." },
  { number: 4, use: "Use as a final simulation before test day." },
] as const

export const PRACTICE_WORKFLOW = [
  "Test 1",
  "Analyze mistakes",
  "Targeted practice",
  "Test 2",
  "Review",
  "Test 3",
  "Final review",
  "Test 4",
] as const

/**
 * AhmedPrep original full-length tests. A slot shows as available only once it has real content
 * (at least `startUrl` or `pdfUrl`). Never fill these with placeholder or third-party material.
 */
export type AhmedPrepPracticeTest = {
  number: 1 | 2 | 3 | 4
  title: string
  startUrl?: string
  pdfUrl?: string
  answerKeyUrl?: string
  explanationsUrl?: string
  difficulty?: "Foundational" | "Medium" | "Medium-Hard" | "Hard"
  estimatedMinutes?: number
  breakdown?: { ela: number; math: number }
}

export const AHMEDPREP_PRACTICE_TESTS: AhmedPrepPracticeTest[] = [
  { number: 1, title: "AhmedPrep Practice Test 1" },
  { number: 2, title: "AhmedPrep Practice Test 2" },
  { number: 3, title: "AhmedPrep Practice Test 3" },
  { number: 4, title: "AhmedPrep Practice Test 4" },
]

export function isPublished(test: AhmedPrepPracticeTest) {
  return Boolean(test.startUrl || test.pdfUrl)
}

export const STRATEGY = [
  {
    phase: "Before the test",
    items: [
      "Use a quiet environment.",
      "Prepare scrap paper.",
      "Remove distractions.",
      "Plan for the full testing period.",
    ],
  },
  {
    phase: "During the test",
    items: [
      "Practice realistic pacing.",
      "Follow the current computer-adaptive navigation rules.",
      "Answer carefully before advancing.",
      "Use scrap paper strategically.",
    ],
  },
  {
    phase: "After the test",
    items: [
      "Review every incorrect question.",
      "Classify mistakes by topic.",
      "Separate content errors from pacing and careless errors.",
      "Create a targeted study list.",
      "Retest weak areas.",
    ],
  },
] as const

/** Summarized from NYCPS / NYC SHSAT Portal guidance, matching the facts verified in lib/resources-shsat-2026.ts. */
export const FORMAT_FACTS = [
  "Computer-adaptive, taken on a computer at the assigned testing site",
  "50 ELA questions and 50 Math questions",
  "180 minutes of standard testing time for the full test",
  "Multiple-choice, fill-in-the-blank and technology-enhanced items",
  "Students may choose which section to begin with",
  "Math and standalone ELA Revising & Editing questions cannot be revisited after advancing; passage-based questions can be revisited only within their set",
] as const

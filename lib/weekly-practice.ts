export const WEEKLY_PRACTICE_PATH = "/weekly-practice"

export type WeeklyPracticeTest = "SHSAT" | "Digital SAT"

export type WeeklyPracticeQuestion = {
  testType: WeeklyPracticeTest
  topic: string
  question: string
  /** Omit for grid-in / fill-in questions. */
  choices?: string[]
  correctAnswer: string
  explanation: string[]
  strategy: string
  /** YYYY-MM-DD. A question goes live on this date (New York time) and stays current until a newer one publishes. */
  publishedDate: string
  relatedSundayClass: string
  ctaUrl: string
}

/**
 * Editable source for weekly practice. To publish a new week, add an entry with a later publishedDate.
 * Entries with a future date are hidden until that date, so questions can be scheduled ahead.
 */
export const WEEKLY_PRACTICE: WeeklyPracticeQuestion[] = [
  {
    testType: "SHSAT",
    topic: "Ratios and proportions",
    question:
      "A recipe uses flour and sugar in a ratio of 5 to 3. If a baker uses 24 cups of flour and sugar combined, how many cups of flour does the baker use?",
    choices: ["9 cups", "12 cups", "15 cups", "18 cups"],
    correctAnswer: "15 cups",
    explanation: [
      "A ratio of 5 to 3 means every group contains 5 parts flour and 3 parts sugar, for 5 + 3 = 8 parts in total.",
      "The 24 cups are split into 8 equal parts, so each part is 24 ÷ 8 = 3 cups.",
      "Flour is 5 parts, so the baker uses 5 × 3 = 15 cups of flour. Check: sugar is 3 × 3 = 9 cups, and 15 + 9 = 24.",
    ],
    strategy:
      "When a ratio problem gives a total, add the ratio parts first. Dividing the total by the number of parts gives the value of one part, and every quantity follows from there. Watch for 9 cups: that is the sugar, a common trap answer.",
    publishedDate: "2026-10-12",
    relatedSundayClass: "Free SHSAT Math class: ratios, rates, and percents",
    ctaUrl: "/free-sunday-classes?class=shsat#rsvp",
  },
  {
    testType: "Digital SAT",
    topic: "Linear equations",
    question: "If 3x + 7 = 22, what is the value of 6x − 4?",
    choices: ["10", "22", "26", "30"],
    correctAnswer: "26",
    explanation: [
      "Subtract 7 from both sides: 3x = 15.",
      "The question asks for 6x − 4, not x. Since 6x is 2 × 3x, 6x = 2 × 15 = 30.",
      "Then 6x − 4 = 30 − 4 = 26.",
    ],
    strategy:
      "Read the last line of the question before solving. The SAT often asks for an expression, not the variable itself, and the answer choices include the value of x or 6x to catch students who stop early. Look for a shortcut that gets you directly to the expression.",
    publishedDate: "2026-10-05",
    relatedSundayClass: "Free Digital SAT Math class: Algebra and linear equations",
    ctaUrl: "/free-sunday-classes?class=digital_sat#rsvp",
  },
  {
    testType: "SHSAT",
    topic: "Revising/Editing: sentence boundaries",
    question:
      "Which revision of the sentence corrects the error in punctuation? “The students finished the practice test early, they reviewed every question they had skipped.”",
    choices: [
      "The students finished the practice test early they reviewed every question they had skipped.",
      "The students finished the practice test early; they reviewed every question they had skipped.",
      "The students finished the practice test early, and, they reviewed every question they had skipped.",
      "The students, finished the practice test early, they reviewed every question they had skipped.",
    ],
    correctAnswer:
      "The students finished the practice test early; they reviewed every question they had skipped.",
    explanation: [
      "The original sentence joins two complete sentences with only a comma. That is a comma splice.",
      "A semicolon can correctly join two closely related independent clauses, so choice B fixes the error.",
      "Choice A removes the comma and creates a run-on. Choice C adds an unnecessary comma after “and.” Choice D adds a comma between the subject and verb and keeps the splice.",
    ],
    strategy:
      "Cover the punctuation mark and check both sides. If each side could stand alone as a sentence, you need a period, a semicolon, or a comma plus a conjunction like “and,” “but,” or “so.”",
    publishedDate: "2026-09-28",
    relatedSundayClass: "Free SHSAT ELA class: Revising/Editing and grammar",
    ctaUrl: "/free-sunday-classes?class=shsat#rsvp",
  },
  {
    testType: "Digital SAT",
    topic: "Reading and Writing: transitions",
    question:
      "Bees pollinate many of the crops that people rely on for food. ______ a steep decline in bee populations could threaten food supplies around the world. Which choice completes the text with the most logical transition?",
    choices: ["However,", "Consequently,", "For instance,", "Similarly,"],
    correctAnswer: "Consequently,",
    explanation: [
      "The first sentence states a cause: bees pollinate crops people need. The second sentence states an effect: losing bees could threaten food supplies.",
      "“Consequently” signals a result, so it fits the cause-and-effect relationship.",
      "“However” signals contrast, “For instance” introduces an example, and “Similarly” introduces a comparison. None match how the two sentences relate.",
    ],
    strategy:
      "Before looking at the choices, describe the relationship between the sentences in your own words: contrast, example, addition, or result. Then pick the transition that matches your label.",
    publishedDate: "2026-09-21",
    relatedSundayClass: "Free Digital SAT Reading & Writing class: transitions and logic",
    ctaUrl: "/free-sunday-classes?class=digital_sat#rsvp",
  },
]

function todayInNewYork(now: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(now)
}

/** Published questions, newest first. */
export function getPublishedPractice(now = new Date()) {
  const today = todayInNewYork(now)
  return WEEKLY_PRACTICE.filter((q) => q.publishedDate <= today).sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
}

export function getCurrentPractice(now = new Date()) {
  return getPublishedPractice(now)[0]
}

export function formatPracticeDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${isoDate}T12:00:00Z`))
}

export const CHOICE_LETTERS = ["A", "B", "C", "D", "E", "F"]

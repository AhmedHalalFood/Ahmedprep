import { SHSAT_2026_GUIDES } from "./resources-shsat-2026"

export type ResourceBlock = {
  heading: string
  body: string[]
  list?: string[]
}

export type ResourceSection = ResourceBlock & {
  subsections?: ResourceBlock[]
}

export type Resource = {
  slug: string
  category: "SHSAT" | "Digital SAT"
  /** Short label shown on Resources cards, e.g. "Test Format". */
  topic?: string
  /** Featured guides get their own section on /resources. */
  featured?: boolean
  title: string
  cardTitle?: string
  metaTitle: string
  description: string
  cardDescription?: string
  datePublished?: string
  dateModified?: string
  intro?: string[]
  sections: ResourceSection[]
}

export const RESOURCES: Resource[] = [
  ...SHSAT_2026_GUIDES,
  {
    slug: "shsat-guide",
    category: "SHSAT",
    title: "The parent's guide to the SHSAT",
    metaTitle: "SHSAT Guide for NYC Parents",
    description: "What the SHSAT is, who takes it, how admissions work, and how to plan preparation without guesswork.",
    sections: [
      {
        heading: "What the SHSAT is",
        body: [
          "The Specialized High Schools Admissions Test (SHSAT) is the exam New York City uses for admission to eight of the nine Specialized High Schools. Fiorello H. LaGuardia High School of Music & Art and Performing Arts admits students through auditions instead.",
          "Offers to the eight test-based schools are made by ranking students according to their SHSAT score and the order in which they listed the schools. There is no interview, essay, or grade requirement for the test-based schools, so the test score carries the full weight of the decision.",
        ],
      },
      {
        heading: "Who takes it",
        body: [
          "NYC students take the SHSAT in 8th grade, and first-time 9th graders may also sit for it. Registration is handled through the student's school counselor and the NYC Public Schools enrollment process. Dates and registration windows change each year, so confirm them directly with your child's school and the official NYC Public Schools website.",
        ],
      },
      {
        heading: "What is on the test",
        body: ["The SHSAT has two sections, English Language Arts and Mathematics, completed in a single sitting."],
        list: [
          "ELA: Revising/Editing questions on grammar, sentence structure, and organization, plus Reading Comprehension passages across informational and literary texts.",
          "Math: Multiple-choice and grid-in questions covering arithmetic, algebra, geometry, probability, statistics, and word problems.",
          "Each section contains 57 questions, including some unscored field-test questions that students cannot identify.",
          "Students receive 180 minutes total and decide how to divide their time between the two sections.",
          "Calculators are not permitted.",
        ],
      },
      {
        heading: "When to start preparing",
        body: [
          "There is no single right start date. Students who are already strong in 7th-grade math and read widely often need a focused few months; students with gaps in fractions, ratios, algebra, or reading stamina benefit from starting earlier, often in the spring or summer before 8th grade.",
          "A diagnostic is the most reliable way to decide. It shows where your child stands today and how much ground there is to cover before test day.",
        ],
      },
      {
        heading: "How to plan preparation",
        body: ["Strong SHSAT preparation usually moves through the same stages:"],
        list: [
          "Diagnose: take a timed, realistic assessment and review every error.",
          "Rebuild foundations: close content gaps before drilling speed.",
          "Practice by section: targeted Math and ELA sets with explanations.",
          "Build stamina: full-length timed exams under test-day conditions.",
          "Refine strategy: pacing, section order, and guessing decisions.",
        ],
      },
    ],
  },
  {
    slug: "shsat-practice-test",
    category: "SHSAT",
    title: "How to use SHSAT practice tests",
    metaTitle: "SHSAT Practice Test Strategy",
    description: "Where to find realistic practice exams and how to turn each one into measurable improvement.",
    sections: [
      {
        heading: "Start with official material",
        body: [
          "The most realistic practice comes from the official SHSAT Student Handbook published by NYC Public Schools, which includes sample tests in the current format. Use these as benchmarks rather than everyday practice, because there are only a limited number of them.",
          "Supplement with high-quality practice sets for skill building, and save the official exams for checkpoints at the start, middle, and end of preparation.",
        ],
      },
      {
        heading: "Simulate test day",
        body: ["A practice test only tells you something useful if it is taken under real conditions."],
        list: [
          "One uninterrupted 180-minute sitting, timed by a parent or a clock.",
          "No calculator, phone, or notes.",
          "A quiet table, scratch paper, and pencils.",
          "The student chooses section order and pacing, just as on test day.",
        ],
      },
      {
        heading: "Review matters more than the score",
        body: [
          "Plan to spend at least as long reviewing a practice test as taking it. For every missed or guessed question, the student should identify why it went wrong and what they will do differently next time.",
        ],
        list: [
          "Content gap: the student did not know the concept.",
          "Careless error: misread the question or made an arithmetic slip.",
          "Timing: ran out of time or rushed at the end.",
          "Strategy: spent too long on one question or did not eliminate answer choices.",
        ],
      },
      {
        heading: "How often to test",
        body: [
          "Early in preparation, one full-length test every few weeks is enough; the rest of the time belongs to targeted practice. As test day approaches, weekly full-length tests help build stamina and confirm pacing. Taking tests back to back without review rarely produces improvement.",
        ],
      },
      {
        heading: "Track progress across tests",
        body: [
          "Keep a simple log of each test: the raw number correct per section, time remaining, and the top three error types. Patterns across several tests are far more informative than any single score.",
        ],
      },
    ],
  },
  {
    slug: "shsat-math-practice",
    category: "SHSAT",
    title: "SHSAT Math practice: topics and sample problems",
    metaTitle: "SHSAT Math Practice Problems",
    description: "The math topics the SHSAT emphasizes, with worked sample problems and the habits that prevent common mistakes.",
    sections: [
      {
        heading: "What SHSAT Math covers",
        body: ["The Math section draws on middle-school content, but questions often combine several ideas in one problem."],
        list: [
          "Number sense: fractions, decimals, percents, ratios, and rates.",
          "Algebra: expressions, linear equations, inequalities, and systems.",
          "Geometry: angles, area, perimeter, volume, and the Pythagorean theorem.",
          "Probability, statistics, and data interpretation.",
          "Multi-step word problems.",
        ],
      },
      {
        heading: "Sample problem: percent change",
        body: [
          "A jacket costs $80. It is discounted 25%, and then the sale price is discounted another 10%. What is the final price?",
          "Solution: 25% off leaves 75% of $80, which is $60. Another 10% off leaves 90% of $60, which is $54. The final price is $54, not $52. Successive discounts do not simply add together.",
        ],
      },
      {
        heading: "Sample problem: ratios",
        body: [
          "The ratio of boys to girls in a club is 3:5. If there are 40 students, how many are girls?",
          "Solution: The ratio has 3 + 5 = 8 parts, so each part is 40 ÷ 8 = 5 students. Girls make up 5 parts, or 25 students.",
        ],
      },
      {
        heading: "Sample problem: grid-in",
        body: [
          "If 3x − 7 = 2x + 5, what is the value of x?",
          "Solution: Subtract 2x from both sides to get x − 7 = 5, then add 7 to get x = 12. On grid-in questions there are no answer choices to check against, so substitute the answer back: 3(12) − 7 = 29 and 2(12) + 5 = 29.",
        ],
      },
      {
        heading: "Habits that raise math scores",
        body: [],
        list: [
          "Write every step; mental math causes most careless errors without a calculator.",
          "Re-read the question before choosing an answer to confirm what is being asked.",
          "Estimate first so unreasonable answers stand out.",
          "Skip and return to long problems instead of getting stuck.",
          "Keep an error log and review it weekly.",
        ],
      },
    ],
  },
  {
    slug: "shsat-ela-practice",
    category: "SHSAT",
    title: "SHSAT ELA practice: Revising/Editing and Reading",
    metaTitle: "SHSAT ELA Practice and Strategy",
    description: "How the SHSAT ELA section is structured and practical strategies for grammar and reading comprehension questions.",
    sections: [
      {
        heading: "Two parts of the ELA section",
        body: [
          "SHSAT ELA combines Revising/Editing questions, which test grammar, punctuation, sentence structure, and the organization of a short text, with Reading Comprehension questions based on longer informational and literary passages.",
        ],
      },
      {
        heading: "Revising/Editing strategy",
        body: ["These questions reward knowing a limited set of rules well."],
        list: [
          "Sentence boundaries: run-ons, fragments, and comma splices.",
          "Punctuation: commas with clauses, semicolons, and colons.",
          "Agreement: subject-verb and pronoun-antecedent.",
          "Modifiers: placement of descriptive phrases.",
          "Organization: transitions, sentence placement, and relevance to the paragraph's purpose.",
        ],
      },
      {
        heading: "Sample editing question",
        body: [
          "Which revision corrects the sentence? “The museum opened a new exhibit last week, it features artifacts from ancient Egypt.”",
          "Answer: “The museum opened a new exhibit last week; it features artifacts from ancient Egypt.” The original joins two complete sentences with only a comma, which is a comma splice. A semicolon, a period, or a conjunction such as “and” fixes it.",
        ],
      },
      {
        heading: "Reading comprehension strategy",
        body: [],
        list: [
          "Read actively: note the main idea of each paragraph in a few words.",
          "Identify the author's purpose and point of view.",
          "Answer from the text, not from outside knowledge.",
          "Eliminate choices that are too extreme, too narrow, or not supported.",
          "For evidence questions, find the exact lines that support your answer.",
        ],
      },
      {
        heading: "Build reading stamina",
        body: [
          "Strong readers perform better on the SHSAT. Daily reading of challenging nonfiction, such as science articles, history, and long-form journalism, builds vocabulary and the focus needed for a three-hour exam.",
        ],
      },
    ],
  },
  {
    slug: "digital-sat-guide",
    category: "Digital SAT",
    title: "The Digital SAT, explained",
    metaTitle: "Digital SAT Guide for Students and Parents",
    description: "How the adaptive Digital SAT works, what each section tests, and how scores are reported.",
    sections: [
      {
        heading: "The format",
        body: [
          "The SAT is taken on a laptop or tablet using the College Board's Bluebook app. The test has two sections, Reading and Writing, then Math, with a 10-minute break between them. Total testing time is about 2 hours and 14 minutes.",
        ],
        list: [
          "Reading and Writing: 54 questions in 64 minutes, split into two modules.",
          "Math: 44 questions in 70 minutes, split into two modules.",
          "Scores range from 400 to 1600, with each section scored from 200 to 800.",
        ],
      },
      {
        heading: "How adaptive testing works",
        body: [
          "Each section is section-adaptive. Every student gets a first module with a mix of easier and harder questions. Performance on that module determines whether the second module is easier or harder. A strong first module opens the door to the highest scores, so accuracy early in each section matters.",
        ],
      },
      {
        heading: "Reading and Writing",
        body: ["Every question is paired with a short passage, usually a paragraph, rather than long reading passages. Questions fall into four areas:"],
        list: [
          "Information and Ideas: main ideas, evidence, and inferences.",
          "Craft and Structure: vocabulary in context, text structure, and purpose.",
          "Expression of Ideas: transitions and rhetorical synthesis.",
          "Standard English Conventions: grammar, usage, and punctuation.",
        ],
      },
      {
        heading: "Math",
        body: [
          "A calculator is allowed on the entire Math section, and Bluebook includes a built-in Desmos graphing calculator. Most questions are multiple choice; the rest are student-produced responses. A reference sheet of common formulas is available.",
        ],
        list: [
          "Algebra",
          "Advanced Math, including quadratic, exponential, and polynomial functions",
          "Problem-Solving and Data Analysis",
          "Geometry and Trigonometry",
        ],
      },
      {
        heading: "Planning your test dates",
        body: [
          "Most students take the SAT for the first time in the spring of junior year, leaving time for a second attempt. Many colleges consider a student's highest scores, but policies vary, so check each college's requirements. Confirm current test dates and registration on the College Board website.",
        ],
      },
    ],
  },
  {
    slug: "digital-sat-math-practice",
    category: "Digital SAT",
    title: "Digital SAT Math practice and Desmos strategy",
    metaTitle: "Digital SAT Math Practice and Desmos Tips",
    description: "Sample Digital SAT Math problems with solutions, plus when to use Desmos and when to solve by hand.",
    sections: [
      {
        heading: "Sample problem: linear equations",
        body: [
          "A phone plan charges a $20 monthly fee plus $0.05 per text. If a bill is $27.50, how many texts were sent?",
          "Solution: 20 + 0.05t = 27.50, so 0.05t = 7.50 and t = 150 texts.",
        ],
      },
      {
        heading: "Sample problem: systems of equations",
        body: [
          "If 2x + y = 11 and x − y = 1, what is the value of x?",
          "Solution: Add the equations to eliminate y: 3x = 12, so x = 4. In Desmos, graphing both lines and clicking the intersection gives (4, 3) just as quickly.",
        ],
      },
      {
        heading: "Sample problem: quadratics",
        body: [
          "What are the solutions to x² − 5x + 6 = 0?",
          "Solution: Factor to (x − 2)(x − 3) = 0, so x = 2 or x = 3. Graphing y = x² − 5x + 6 in Desmos shows the same two x-intercepts.",
        ],
      },
      {
        heading: "When to use Desmos",
        body: ["Desmos is a powerful tool, but it is not always the fastest route."],
        list: [
          "Use it for systems of equations, intersections, and finding zeros of functions.",
          "Use it to check algebra when time allows.",
          "Use sliders to explore how changing a constant affects a graph.",
          "Solve simple linear equations by hand; typing them takes longer.",
          "Practice in Desmos before test day so the interface is familiar.",
        ],
      },
      {
        heading: "Student-produced responses",
        body: [
          "For questions without answer choices, enter answers carefully. Fractions and decimals are both accepted within the stated rules, and negative answers are allowed. Re-read the question to confirm the units and the quantity being asked for before submitting.",
        ],
      },
    ],
  },
  {
    slug: "digital-sat-reading-writing",
    category: "Digital SAT",
    title: "Digital SAT Reading and Writing strategies",
    metaTitle: "Digital SAT Reading and Writing Strategy",
    description: "How to approach short-passage questions, grammar rules to master, and how to pace the adaptive modules.",
    sections: [
      {
        heading: "Read the question first",
        body: [
          "Because each passage is short and paired with a single question, reading the question first tells you exactly what to look for: a main idea, a word's meaning, a supporting quotation, or a grammar fix.",
        ],
      },
      {
        heading: "Conventions questions",
        body: ["Standard English Conventions questions test a predictable set of rules:"],
        list: [
          "Sentence boundaries: periods, semicolons, and comma splices.",
          "Punctuation with nonessential information: matching commas, dashes, or parentheses.",
          "Subject-verb agreement, especially with long phrases in between.",
          "Verb tense consistency.",
          "Possessives and plurals: its vs. it's, and apostrophe placement.",
        ],
      },
      {
        heading: "Sample transition question",
        body: [
          "“Many plants require full sunlight to thrive. ______, ferns often grow best in shaded forest understories.” Which choice completes the text with the most logical transition?",
          "Answer: “In contrast.” The second sentence presents an exception to the first, so a contrast transition fits. Choices such as “Similarly” or “As a result” do not match the relationship between the ideas.",
        ],
      },
      {
        heading: "Evidence and inference",
        body: [
          "For evidence questions, choose the option that directly supports the specific claim, not one that is merely related to the topic. For inference questions, the correct answer is the one that must be true based on the text, not one that could be true.",
        ],
      },
      {
        heading: "Pacing the modules",
        body: [
          "Each Reading and Writing module gives 32 minutes for 27 questions, a little over a minute per question. Use Bluebook's mark-for-review tool to flag uncertain questions, answer every question before time ends, and return to flagged items if time remains. There is no penalty for wrong answers.",
        ],
      },
    ],
  },
]

export function getResource(slug: string) {
  return RESOURCES.find((r) => r.slug === slug)
}

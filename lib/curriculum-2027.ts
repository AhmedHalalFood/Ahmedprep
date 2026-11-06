/**
 * DRAFT 2027 curriculum (Master Plan section 5). Not owner-reviewed: every surface that renders this must label it
 * as a draft and stay out of search indexes, navigation, and the sitemap until the owner approves it.
 *
 * Syllabi are derived from the approved cohort calendars in `cohorts-2027`, so a calendar change (closure, makeup,
 * approval) flows into the dated syllabus automatically.
 */
import { type Cohort, type ProgramId, type ScheduledSession, findCohort, sessionCalendar } from "@/lib/cohorts-2027"

export const CURRICULUM_STATUS = "Draft for owner review — not final" as const

/** Approved three-hour session structure (minutes). Diagnostic and mock-exam sessions use the full period for testing. */
export const SESSION_BLOCKS = [
  { id: "math", label: "Math", minutes: 75 },
  { id: "verbal", label: "ELA / Reading and Writing", minutes: 75 },
  { id: "review", label: "Cumulative practice and review", minutes: 30 },
] as const

// ---------- SMART method (owner-supplied definition) ----------

export const SMART_METHOD = [
  { letter: "S", name: "Simplify", meaning: "Break each skill into a short, clear routine, modeled on one worked example." },
  { letter: "M", name: "Memorize meaningfully", meaning: "Learn rules, formulas, and vocabulary through understanding and connections, not rote repetition." },
  { letter: "A", name: "Apply", meaning: "Use the skill on practice questions that increase in difficulty." },
  { letter: "R", name: "Retrieve and review", meaning: "Recall earlier material from memory and correct errors using the error log." },
  { letter: "T", name: "Test strategically", meaning: "Practice under timed conditions with test-day strategies: pacing, elimination, and when to move on." },
] as const

export type SmartLetter = (typeof SMART_METHOD)[number]["letter"]

// ---------- Topics ----------

export type Topic = {
  title: string
  /** Official content area this topic is aligned to. */
  domain: string
  objective: string
  practice: string
  /** Digital SAT math only: the Desmos technique taught alongside the topic. */
  desmos?: string
  /** Difficult or heavily weighted topic: receives an additional advanced-practice session when the course has room. */
  priority?: boolean
}

// SHSAT content areas per the NYC Public Schools SHSAT Student Handbook: Math; ELA Revising/Editing Parts A and B and
// Reading Comprehension. Priority flags are AhmedPrep's instructional judgment (difficulty), not an official weighting.
const SHSAT_MATH: readonly Topic[] = [
  { title: "Number sense and operations", domain: "Number and operations", objective: "Apply order of operations, divisibility, primes, GCF and LCM accurately without a calculator.", practice: "Mixed number-sense set." },
  { title: "Fractions, decimals, and percents", domain: "Number and operations", objective: "Convert fluently among fractions, decimals, and percents and compute with rational numbers.", practice: "Fluency drill, then word-problem set." },
  { title: "Ratios, rates, and proportional reasoning", domain: "Ratios and proportional relationships", objective: "Set up and solve proportions, unit rates, and scale problems.", practice: "Proportion set.", priority: true },
  { title: "Percent applications", domain: "Ratios and proportional relationships", objective: "Solve percent change, discount, tax, and simple-interest problems.", practice: "Multi-step percent problems.", priority: true },
  { title: "Exponents, roots, and scientific notation", domain: "Expressions and equations", objective: "Use exponent rules, square and cube roots, and scientific notation.", practice: "Exponent rules drill and estimation items." },
  { title: "Algebraic expressions", domain: "Expressions and equations", objective: "Simplify, evaluate, and write expressions using properties of operations.", practice: "Translate-the-words set." },
  { title: "Linear equations in one variable", domain: "Expressions and equations", objective: "Solve multi-step linear equations, including variables on both sides.", practice: "Equation set with check-by-substitution.", priority: true },
  { title: "Inequalities and absolute value", domain: "Expressions and equations", objective: "Solve and interpret inequalities and absolute-value statements on a number line.", practice: "Inequality and number-line items." },
  { title: "Linear relationships and slope", domain: "Expressions and equations / functions", objective: "Interpret slope, intercepts, graphs, and simple systems of linear equations.", practice: "Graph-reading and system items." },
  { title: "Word problems: rate, work, and mixture", domain: "Problem solving", objective: "Translate multi-step word problems into equations and solve them efficiently.", practice: "Word-problem set.", priority: true },
  { title: "Angles, triangles, and the Pythagorean theorem", domain: "Geometry", objective: "Use angle relationships, triangle properties, and the Pythagorean theorem.", practice: "Diagram-based geometry set." },
  { title: "Area, circles, surface area, and volume", domain: "Geometry", objective: "Compute perimeter, area, circumference, surface area, and volume, including composite figures.", practice: "Composite-figure set.", priority: true },
  { title: "Coordinate geometry and transformations", domain: "Geometry", objective: "Work with points, distance, translations, reflections, rotations, and dilations.", practice: "Coordinate-plane set." },
  { title: "Statistics, probability, and counting", domain: "Statistics and probability", objective: "Find mean, median, mode, and range; compute probabilities and count outcomes.", practice: "Data and probability set.", priority: true },
]

const SHSAT_ELA: readonly Topic[] = [
  { title: "Sentence boundaries", domain: "Revising/Editing Part A", objective: "Identify and correct fragments, run-ons, and comma splices.", practice: "Revising/Editing Part A set." },
  { title: "Punctuation", domain: "Revising/Editing Part A", objective: "Apply commas, semicolons, colons, dashes, and apostrophes correctly.", practice: "Punctuation-in-context items.", priority: true },
  { title: "Agreement", domain: "Revising/Editing Part A", objective: "Correct subject-verb and pronoun-antecedent agreement errors.", practice: "Agreement error-spotting set." },
  { title: "Modifiers, parallelism, and verb tense", domain: "Revising/Editing Part A", objective: "Fix misplaced modifiers, faulty parallelism, and tense shifts.", practice: "Sentence-revision set." },
  { title: "Topic sentences and organization", domain: "Revising/Editing Part B", objective: "Choose the best topic sentence and order sentences logically within a passage.", practice: "Part B passage with questions." },
  { title: "Transitions and logical flow", domain: "Revising/Editing Part B", objective: "Select transitions that match the logical relationship between ideas.", practice: "Transition items in passage context." },
  { title: "Evidence, relevance, and conclusions", domain: "Revising/Editing Part B", objective: "Decide which sentence best supports, extends, or concludes an argument.", practice: "Part B add/delete/conclude items.", priority: true },
  { title: "Central idea and summary", domain: "Reading Comprehension — informational", objective: "Determine the central idea and the best summary of an informational passage.", practice: "Informational passage with questions." },
  { title: "Word and phrase meaning in context", domain: "Reading Comprehension", objective: "Determine meanings of words and phrases from context.", practice: "Vocabulary-in-context items." },
  { title: "Inference and textual evidence", domain: "Reading Comprehension", objective: "Draw supported inferences and identify the evidence that supports them.", practice: "Inference passage set.", priority: true },
  { title: "Text structure and author's purpose", domain: "Reading Comprehension", objective: "Analyze how a paragraph or sentence functions and why the author included it.", practice: "Structure and purpose set.", priority: true },
  { title: "Literary passages", domain: "Reading Comprehension — literary", objective: "Analyze character, theme, point of view, and how events develop.", practice: "Literary passage with questions." },
  { title: "Poetry", domain: "Reading Comprehension — literary", objective: "Interpret figurative language, tone, and structure in poems.", practice: "Poetry passage with questions.", priority: true },
  { title: "Dense texts and adaptive-test pacing", domain: "Reading Comprehension / test strategy", objective: "Manage 180 minutes across both sections and answer every item before moving on, as the computer-adaptive format requires.", practice: "Timed half-section.", priority: true },
]

// Digital SAT: College Board content domains. Math priority flags follow the official weighting (Algebra and Advanced
// Math are each about 35% of Math); Reading and Writing flags are AhmedPrep's instructional judgment.
const DSAT_MATH: readonly Topic[] = [
  { title: "Linear equations in one variable", domain: "Algebra", objective: "Create and solve linear equations in one variable from context.", practice: "Algebra module-style set.", desmos: "Graph both sides as y = and read the intersection." },
  { title: "Linear functions and equations in two variables", domain: "Algebra", objective: "Interpret slope and intercepts and write linear models from tables, graphs, and context.", practice: "Linear-model set.", desmos: "Use tables and regression (y1 ~ mx1 + b) to find a line from points.", priority: true },
  { title: "Systems of linear equations", domain: "Algebra", objective: "Solve systems and reason about no-solution and infinite-solution cases.", practice: "Systems set.", desmos: "Graph both equations; use sliders to test parallel or identical lines.", priority: true },
  { title: "Linear inequalities", domain: "Algebra", objective: "Create, solve, and interpret linear inequalities and systems of inequalities.", practice: "Inequality set.", desmos: "Graph shaded regions and test candidate points." },
  { title: "Equivalent expressions", domain: "Advanced Math", objective: "Rewrite, factor, and expand polynomial and rational expressions.", practice: "Equivalent-forms set.", desmos: "Check equivalence by graphing both expressions.", priority: true },
  { title: "Quadratic equations and functions", domain: "Advanced Math", objective: "Solve quadratics and connect vertex, factored, and standard forms to graphs.", practice: "Quadratics set.", desmos: "Find zeros, vertex, and intercepts by tapping graph points.", priority: true },
  { title: "Exponential, polynomial, radical, and rational equations", domain: "Advanced Math", objective: "Solve and interpret nonlinear equations, including exponential growth and decay.", practice: "Nonlinear set.", desmos: "Graph and intersect; spot extraneous solutions visually.", priority: true },
  { title: "Nonlinear functions and transformations", domain: "Advanced Math", objective: "Interpret function notation, composition, and graph transformations.", practice: "Function-notation set.", desmos: "Define f(x) and evaluate f(a) directly.", priority: true },
  { title: "Ratios, rates, proportions, units, and percentages", domain: "Problem-Solving and Data Analysis", objective: "Solve multi-step ratio, rate, unit-conversion, and percent problems.", practice: "PSDA set.", desmos: "Use the calculator line for fast multi-step arithmetic." },
  { title: "One-variable data", domain: "Problem-Solving and Data Analysis", objective: "Compare center and spread across distributions and interpret outliers.", practice: "Distributions set.", desmos: "Compute mean, median, and standard deviation from a list." },
  { title: "Two-variable data and models", domain: "Problem-Solving and Data Analysis", objective: "Interpret scatterplots, lines of best fit, and linear vs. exponential models.", practice: "Scatterplot set.", desmos: "Run linear and exponential regressions on tables." },
  { title: "Probability, sampling, and inference", domain: "Problem-Solving and Data Analysis", objective: "Compute probabilities and evaluate claims from samples, surveys, and experiments.", practice: "Inference and probability set.", desmos: "Use the calculator for two-way-table probabilities." },
  { title: "Area, volume, lines, angles, and triangles", domain: "Geometry and Trigonometry", objective: "Apply area, volume, angle, and similar-triangle relationships.", practice: "Geometry set.", desmos: "Model geometric constraints as equations and solve." },
  { title: "Right triangles, trigonometry, and circles", domain: "Geometry and Trigonometry", objective: "Use right-triangle trigonometry, radians, and circle equations.", practice: "Trig and circles set.", desmos: "Graph circle equations to read center and radius." },
]

const DSAT_RW: readonly Topic[] = [
  { title: "Words in context", domain: "Craft and Structure", objective: "Choose the most precise word or phrase for the context.", practice: "Words-in-context set.", priority: true },
  { title: "Text structure and purpose", domain: "Craft and Structure", objective: "Identify the function of a sentence and the main purpose of a text.", practice: "Structure and purpose set." },
  { title: "Cross-text connections", domain: "Craft and Structure", objective: "Compare how two authors would respond to each other's claims.", practice: "Paired-text set." },
  { title: "Central ideas and details", domain: "Information and Ideas", objective: "Determine the main idea and key supporting details of a short text.", practice: "Central-idea set." },
  { title: "Command of evidence: textual", domain: "Information and Ideas", objective: "Select the quotation or finding that best supports a claim.", practice: "Textual-evidence set.", priority: true },
  { title: "Command of evidence: quantitative", domain: "Information and Ideas", objective: "Use data from tables and graphs to complete or support a claim.", practice: "Graph and table set." },
  { title: "Inferences", domain: "Information and Ideas", objective: "Complete a text with the most logical, supported conclusion.", practice: "Inference set.", priority: true },
  { title: "Boundaries: linking clauses", domain: "Standard English Conventions", objective: "Punctuate independent clauses with periods, semicolons, colons, and conjunctions.", practice: "Boundaries set.", priority: true },
  { title: "Boundaries: supplements and lists", domain: "Standard English Conventions", objective: "Punctuate nonessential elements, appositives, and series correctly.", practice: "Comma and dash set.", priority: true },
  { title: "Form, structure, and sense: agreement and verbs", domain: "Standard English Conventions", objective: "Apply subject-verb agreement and appropriate verb tense and form.", practice: "Agreement and verbs set." },
  { title: "Form, structure, and sense: pronouns, possessives, modifiers", domain: "Standard English Conventions", objective: "Correct pronoun, possessive, plural, and modifier errors.", practice: "Form and sense set." },
  { title: "Transitions", domain: "Expression of Ideas", objective: "Select transitions that express the logical relationship between sentences.", practice: "Transitions set.", priority: true },
  { title: "Rhetorical synthesis", domain: "Expression of Ideas", objective: "Use student notes to accomplish a stated rhetorical goal.", practice: "Notes-based set." },
  { title: "Module strategy and pacing", domain: "Test strategy (adaptive two-module sections)", objective: "Pace each module, flag and return to items within a module, and navigate Bluebook efficiently.", practice: "Timed module." },
]

export const TOPICS: Record<ProgramId, { math: readonly Topic[]; verbal: readonly Topic[] }> = {
  SHSAT: { math: SHSAT_MATH, verbal: SHSAT_ELA },
  "Digital SAT": { math: DSAT_MATH, verbal: DSAT_RW },
}

export const VERBAL_LABEL: Record<ProgramId, string> = { SHSAT: "ELA", "Digital SAT": "Reading and Writing" }

// ---------- Official exam formats (verified November 2026; re-check against the current handbook before each term) ----------

export const EXAM_FORMAT: Record<ProgramId, { source: string; summary: string; simulation: string }> = {
  SHSAT: {
    source: "NYC Public Schools SHSAT Student Handbook and NYC SHSAT Portal",
    summary:
      "Computer-adaptive since fall 2026: 50 ELA and 50 Math items (each section includes unscored field-test items), 180 minutes total that students divide between sections. Students answer each item before moving on and generally cannot return, except within an ELA passage set.",
    simulation:
      "Full-length simulations keep the official 180-minute total and both sections. A paper test cannot reproduce adaptive item selection, so students practice the answer-before-moving-on rule instead.",
  },
  "Digital SAT": {
    source: "College Board Digital SAT specifications and Bluebook",
    summary:
      "Reading and Writing: two 32-minute modules, 54 questions. 10-minute break. Math: two 35-minute modules, 44 questions, with the built-in Desmos calculator. 2 hours 14 minutes of testing; multistage adaptive.",
    simulation:
      "Official Bluebook practice tests are administered in Bluebook with the official format and timing unchanged. Original AhmedPrep tests follow the same section and module timing but are not adaptive.",
  },
}

/**
 * Official full-length practice tests are used only after the owner verifies availability, suitability for the
 * current format, and permitted classroom use. Until then every full-length exam is an original AhmedPrep test.
 */
export const OFFICIAL_PRACTICE_TESTS: Record<ProgramId, { name: string; verified: boolean }> = {
  SHSAT: { name: "official NYC Public Schools SHSAT practice test (NYC SHSAT Portal)", verified: false },
  "Digital SAT": { name: "official College Board full-length practice test in Bluebook", verified: false },
}

export function fullLengthExam(program: ProgramId) {
  const official = OFFICIAL_PRACTICE_TESTS[program]
  if (program === "SHSAT") {
    return official.verified
      ? `Full-length SHSAT simulation (180 minutes): ${official.name}, administered with official timing`
      : "Full-length SHSAT simulation (180 minutes, ELA and Math): original AhmedPrep practice test on paper, scored with the manual GradeCam workflow"
  }
  return official.verified
    ? `Full-length Digital SAT practice test: ${official.name}, official format and timing unchanged`
    : "Full-length Digital SAT simulation (2 × 32 min Reading and Writing, 10-min break, 2 × 35 min Math): original AhmedPrep practice test, not adaptive, scored with the manual GradeCam workflow"
}

// ---------- Course shape ----------

export type AssessmentKind = "diagnostic" | "mock" | "quiz" | "quiz-note" | "cumulative" | "report" | "final"
export type Stage = "foundations" | "advanced" | "mixed"

export const STAGE_LABEL: Record<Stage, string> = {
  foundations: "Phase 1 · Foundations",
  advanced: "Phase 2 · Advanced practice",
  mixed: "Phase 3 · Mixed timed practice",
}

/** Mock-exam session numbers by course length; session 1 is always the diagnostic. */
const MOCK_SESSIONS: Record<number, readonly number[]> = { 16: [8, 15], 24: [12, 22], 32: [11, 21, 30] }
/** Cumulative unit checkpoints, held in the 30-minute review block. */
const CUMULATIVE_SESSIONS: Record<number, readonly number[]> = { 16: [6, 13], 24: [7, 17], 32: [8, 18, 27] }
/** Final instructional sessions reserved for mixed, timed question sets. */
const MIXED_SESSIONS: Record<number, number> = { 16: 2, 24: 3, 32: 4 }

export const mockSessionsFor = (sessions: number) => MOCK_SESSIONS[sessions] ?? []
export const cumulativeSessionsFor = (sessions: number) => CUMULATIVE_SESSIONS[sessions] ?? []

export type Slot = Topic & { stage: Stage }

/**
 * Phase 1 teaches every topic once (merging adjacent non-priority topics when the course is short). Phase 2 revisits
 * priority topics with harder problems. Phase 3 is mixed, timed practice across the whole sequence.
 */
export function planTrack(topics: readonly Topic[], instructional: number, mixed: number, track: "math" | "verbal", program: ProgramId): Slot[] {
  const topicSlots = instructional - mixed
  const groups: Topic[][] = topics.map((t) => [t])
  for (let i = groups.length - 1; i > 0 && groups.length > topicSlots; i--) {
    const [a, b] = [groups[i - 1], groups[i]]
    if (a.length === 1 && b.length === 1 && !a[0].priority && !b[0].priority) {
      groups.splice(i - 1, 2, [...a, ...b])
      i--
    }
  }
  const foundations: Slot[] = groups.map((g) =>
    g.length === 1
      ? { ...g[0], stage: "foundations" }
      : {
          title: g.map((t) => t.title).join(" + "),
          domain: [...new Set(g.map((t) => t.domain))].join("; "),
          objective: g.map((t) => t.objective).join(" "),
          practice: g.map((t) => t.practice).join(" "),
          desmos: g.map((t) => t.desmos).filter(Boolean).join(" ") || undefined,
          stage: "foundations",
        },
  )
  const revisitOrder = [...topics.filter((t) => t.priority), ...topics.filter((t) => !t.priority)]
  const advanced: Slot[] = Array.from({ length: Math.max(0, topicSlots - foundations.length) }, (_, i) => {
    const t = revisitOrder[i % revisitOrder.length]
    return {
      ...t,
      objective: `Harder, multi-step questions: ${t.objective}`,
      practice: `Challenge set on ${t.title.toLowerCase()}.`,
      stage: "advanced",
    }
  })
  const priorityTitles = topics.filter((t) => t.priority).map((t) => t.title.toLowerCase())
  const mixedSlots: Slot[] = Array.from({ length: mixed }, (_, i) => ({
    title: `Mixed timed set ${i + 1}`,
    domain: track === "math" ? "All Math domains" : `All ${VERBAL_LABEL[program]} areas`,
    objective: `Answer mixed questions from the full sequence at test pace, weighted toward ${priorityTitles.slice(i * 2, i * 2 + 2).join(" and ") || priorityTitles.slice(0, 2).join(" and ")}.`,
    practice: "Timed mixed set; log every miss in the error log.",
    desmos: program === "Digital SAT" && track === "math" ? "Decide item by item whether graphing or solving by hand is faster." : undefined,
    stage: "mixed",
  }))
  return [...foundations, ...advanced, ...mixedSlots]
}

// ---------- Syllabus ----------

export type SyllabusSession = ScheduledSession & {
  format: "instruction" | "diagnostic" | "mock"
  stage?: Stage
  math?: Slot
  verbal?: Slot
  smart: { letter: SmartLetter; activity: string }[]
  review: string
  homework: string
  assessments: { kind: AssessmentKind; label: string }[]
}

/** Monday of the calendar week containing `iso` (weeks run Monday–Sunday, so a Saturday–Sunday pair shares a week). */
export function weekOf(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

const QUIZ = (verbal: string) => `Weekly quiz (15 min in the review block, Math and ${verbal})`

function smartFor(program: ProgramId, m: Slot, v: Slot, stage: Stage): SyllabusSession["smart"] {
  const apply = {
    foundations: "Guided practice that moves from foundational questions to harder ones within each block.",
    advanced: "Harder, multi-step questions on a priority skill, with worked-solution comparison.",
    mixed: "Mixed questions from the full sequence; students identify the skill before solving.",
  }[stage]
  const strategy =
    program === "SHSAT"
      ? "Each block ends with a short timed set: pacing, elimination, and answering every item before moving on."
      : "Each block ends with a short timed set: module pacing, flag-and-return, and when Desmos is faster."
  return [
    { letter: "S", activity: `Model ${m.title.toLowerCase()} and ${v.title.toLowerCase()} as short step-by-step routines.` },
    { letter: "M", activity: "Students write a rule card for each skill, tied to the worked example, and explain it in their own words." },
    { letter: "A", activity: apply },
    { letter: "R", activity: "Review block opens with retrieval questions from earlier sessions and the student's error log." },
    { letter: "T", activity: strategy },
  ]
}

export function syllabusFor(cohort: Cohort): SyllabusSession[] {
  const calendar = sessionCalendar(cohort)
  const n = calendar.length
  const program = cohort.program
  const verbalName = VERBAL_LABEL[program]
  const mocks = new Set(mockSessionsFor(n))
  const cumulative = new Set(cumulativeSessionsFor(n))
  const instructionalCount = calendar.filter((s) => s.number !== 1 && !mocks.has(s.number)).length
  const mixed = MIXED_SESSIONS[n] ?? 0
  const math = planTrack(TOPICS[program].math, instructionalCount, mixed, "math", program)
  const verbal = planTrack(TOPICS[program].verbal, instructionalCount, mixed, "verbal", program)
  const exam = fullLengthExam(program)

  let taught = 0
  let mockCount = 0
  const sessions: SyllabusSession[] = calendar.map((s) => {
    if (s.number === 1) {
      return {
        ...s, format: "diagnostic", smart: [],
        assessments: [
          { kind: "diagnostic", label: `Initial diagnostic — ${exam}` },
          { kind: "report", label: "Parent progress report 1: diagnostic baseline" },
        ],
        review: "Full period: check-in, directions, and the diagnostic. Students start their error log from the results in the next session.",
        homework: "Error-log reflection on the diagnostic: mark each miss as content gap, careless error, or timing.",
      }
    }
    if (mocks.has(s.number)) {
      mockCount++
      return {
        ...s, format: "mock", smart: [],
        assessments: [
          { kind: "mock", label: `Mock exam ${mockCount} — ${exam}` },
          { kind: "report", label: `Parent progress report after mock exam ${mockCount}` },
        ],
        review: "Full period: full-length exam under official timing. Students mark guessed and time-pressure items for the debrief.",
        homework: "Log every missed and guessed item in the error log with the reason it was missed.",
      }
    }
    const m = math[taught]
    const v = verbal[taught]
    const prev = taught >= 2 ? [math[taught - 2], verbal[taught - 2]] : undefined
    taught++
    const afterMock = mocks.has(s.number - 1)
    const isLast = s.number === n
    const assessments: SyllabusSession["assessments"] = []
    if (cumulative.has(s.number)) assessments.push({ kind: "cumulative", label: "Cumulative review checkpoint (30 min, all topics taught so far)" })
    if (isLast) assessments.push({ kind: "final", label: "Final parent progress report" })

    const retrieval = prev && prev[0].stage !== "mixed" ? `${prev[0].title} and ${prev[1].title}` : "earlier sessions"
    const review = afterMock
      ? "Mock exam debrief: most-missed items, then error-log targets. Students who missed a skill repeatedly get a targeted reteach set."
      : cumulative.has(s.number)
        ? "Cumulative review checkpoint across every topic taught so far."
        : isLast
          ? "Course wrap-up: personal study plan for the weeks before test day, built from the error log."
          : `Retrieval practice on ${retrieval} plus error-log items. Students who missed these skills on the last quiz or exam work a targeted reteach set; others take an extension set.`
    const homework = isLast
      ? "Follow the personal study plan; retake missed error-log items."
      : `Math: ${m.practice} ${verbalName}: ${v.practice} Update the error log.`
    return {
      ...s, format: "instruction", stage: m.stage, math: m, verbal: v,
      smart: smartFor(program, m, v, m.stage), review, homework, assessments,
    }
  })

  // One weekly quiz per calendar week, placed explicitly; nothing is dropped silently.
  const weeks = new Map<string, SyllabusSession[]>()
  for (const s of sessions) weeks.set(weekOf(s.iso), [...(weeks.get(weekOf(s.iso)) ?? []), s])
  for (const week of weeks.values()) {
    const lessons = week.filter((s) => s.format === "instruction")
    if (lessons.length === 0) {
      const exam = week[week.length - 1]
      exam.assessments.push({ kind: "quiz-note", label: "No separate weekly quiz this week: the full-length exam covers it" })
      continue
    }
    const last = lessons[lessons.length - 1]
    const target = cumulative.has(last.number) ? (lessons.filter((s) => !cumulative.has(s.number)).at(-1) ?? last) : last
    const notes: string[] = []
    if (target !== last) notes.push(`moved from session ${last.number}, which holds the cumulative checkpoint`)
    else if (cumulative.has(target.number)) notes.push("taken in place of 15 minutes of the checkpoint review, which is shortened to 15 minutes")
    const weekEnd = week[week.length - 1]
    if (weekEnd.format === "mock") notes.push(`the week ends with mock exam on session ${weekEnd.number}`)
    target.assessments.unshift({ kind: "quiz", label: QUIZ(verbalName) + (notes.length ? ` — ${notes.join("; ")}` : "") })
  }
  return sessions
}

export const syllabusForId = (id: string) => {
  const cohort = findCohort(id)
  return cohort ? { cohort, sessions: syllabusFor(cohort) } : undefined
}

// ---------- Assessment plan (Master Plan section 6) ----------

export type AssessmentPlanRow = { assessment: string; frequency: string; purpose: string; scoring: string }

export const ASSESSMENT_PLAN: readonly AssessmentPlanRow[] = [
  { assessment: "Initial diagnostic", frequency: "Session 1 of every cohort (full period)", purpose: "Baseline score and topic-level gaps that set each student's priorities.", scoring: "Original AhmedPrep full-length test on paper, scanned and scored with the manual GradeCam workflow. Raw scores." },
  { assessment: "Weekly quiz", frequency: "Every calendar week with a regular lesson, on the week's last lesson. Moved to an earlier lesson that week if a checkpoint falls on that session; replaced only when the week has no regular lesson, and labeled as such.", purpose: "Check retention of that week's Math and verbal topics.", scoring: "15-minute paper quiz in the review block, manual GradeCam workflow. Raw scores." },
  { assessment: "Cumulative review checkpoint", frequency: "2 per 16- and 24-session cohort; 3 per 32-session cohort", purpose: "Retrieval practice across every topic taught so far.", scoring: "Paper, manual GradeCam workflow; results logged by topic." },
  { assessment: "Full-length mock exam", frequency: "2 per 16- and 24-session cohort; 3 per 32-session cohort (full period)", purpose: "Measure growth, pacing, and stamina under official timing.", scoring: "Original AhmedPrep test unless an official test is verified for use. Official Bluebook tests report College Board scaled scores; all other tests report raw scores." },
  { assessment: "Student error log", frequency: "Updated after every session, quiz, and exam; teacher-reviewed weekly", purpose: "Record why each item was missed (content gap, careless error, timing, guess) and drive targeted review.", scoring: "Not scored; reviewed for patterns." },
  { assessment: "Parent progress report", frequency: "After the diagnostic, after each mock exam, and at course end", purpose: "Scores, performance by area, attendance, homework, and next priorities.", scoring: "Prepared manually by the instructor on the AhmedPrep template." },
]

export const PROGRESS_INDICATORS: Record<ProgramId, readonly string[]> = {
  SHSAT: [
    "Math and ELA raw scores on each full-length exam compared with the diagnostic",
    "Accuracy by Math domain and by ELA area (Revising/Editing Part A, Part B, Reading Comprehension)",
    "Weekly quiz accuracy and trend",
    "Items left blank or guessed under time pressure",
    "Error-log categories: content gap, careless error, timing",
    "Attendance and homework completion",
  ],
  "Digital SAT": [
    "Raw scores on original tests; College Board scaled scores only from official Bluebook reports",
    "Accuracy by College Board content domain (four Math, four Reading and Writing)",
    "Weekly quiz accuracy and trend",
    "Desmos use: items solved by graphing vs. by hand",
    "Error-log categories: content gap, careless error, timing",
    "Attendance and homework completion",
  ],
}

export const GRADECAM_NOTE =
  "Paper quizzes, checkpoints, and original AhmedPrep exams are scanned and scored manually with AhmedPrep's existing GradeCam workflow. The website has no GradeCam integration; scores are entered and reported manually." as const

// ---------- Parent progress report template ----------

export const REPORT_AREAS: Record<ProgramId, { math: readonly string[]; verbal: readonly string[] }> = {
  SHSAT: {
    math: ["Number and operations", "Ratios and proportional relationships", "Expressions and equations", "Geometry", "Statistics and probability"],
    verbal: ["Revising/Editing Part A", "Revising/Editing Part B", "Reading Comprehension — informational", "Reading Comprehension — literary"],
  },
  "Digital SAT": {
    math: ["Algebra", "Advanced Math", "Problem-Solving and Data Analysis", "Geometry and Trigonometry"],
    verbal: ["Craft and Structure", "Information and Ideas", "Standard English Conventions", "Expression of Ideas"],
  },
}

export const SCORE_RULES: Record<ProgramId, string> = {
  SHSAT:
    "Report raw scores (correct out of scored items) for each section. AhmedPrep does not convert raw scores to SHSAT scaled scores; scaled scores are reported only if official materials provide them.",
  "Digital SAT":
    "Original AhmedPrep tests: report raw scores (correct out of total) per section. Official Bluebook practice tests: copy the College Board section and total scaled scores exactly as reported. AhmedPrep does not convert raw scores to scaled scores.",
}

// ---------- Calendar and makeup review ----------

export type CalendarFinding = { dates: string; cohorts: string; finding: string; status: "No conflict found" | "Owner decision needed" }

export const CALENDAR_REVIEW: readonly CalendarFinding[] = [
  { dates: "All proposed makeups", cohorts: "Winter and Spring weekday; Summer weekend", finding: "Each falls on a day its cohort has no other class and preserves exactly one 3-hour session. Saturday evening makeups (5:30–8:30 PM) start after the same-day weekend cohorts end (5 PM), a 30-minute gap if one instructor teaches both.", status: "No conflict found" },
  { dates: "Aug 29 (Sun)", cohorts: "Summer weekday intensive (both)", finding: "July 4, 2027 is a Sunday, so the federal holiday is observed Monday July 5. The intensive begins Tuesday July 6, so July 5 was never a scheduled class. August 29 is an additional scheduled instructional session that completes the approved 32 sessions and 96 hours, not a makeup for a lost class. Still not yet approved.", status: "Owner decision needed" },
  { dates: "Aug 28 (Sat)", cohorts: "Summer weekend (both)", finding: "Makeup for the July 4 closure. Falls before the August 30 summer break; no overlap with the intensive cohorts.", status: "No conflict found" },
  { dates: "Mar 9 (Tue) closure", cohorts: "Winter Digital SAT weekday", finding: "Closure reason is pending. Eid al-Fitr 2027 is expected around March 9–10 depending on moon sighting; if it falls on Wednesday March 10, the Winter SHSAT weekday class meets that day.", status: "Owner decision needed" },
  { dates: "May 17 (Mon) closure", cohorts: "Spring SHSAT weekday", finding: "Closure reason is pending. Eid al-Adha 2027 is expected around May 16–17; if it falls on Sunday May 16, both Spring weekend cohorts meet that day.", status: "Owner decision needed" },
  { dates: "Mar 28 (Sun)", cohorts: "Winter weekend (both)", finding: "The final winter weekend session falls on Easter Sunday.", status: "Owner decision needed" },
  { dates: "Jun 19 (Sat)", cohorts: "Spring weekend (both)", finding: "Juneteenth falls on Saturday (federal observance Friday June 18); both Spring weekend cohorts meet.", status: "Owner decision needed" },
  { dates: "Feb 6 (Sat)", cohorts: "Winter weekend (both)", finding: "Lunar New Year falls on Saturday; both Winter weekend cohorts meet.", status: "Owner decision needed" },
]

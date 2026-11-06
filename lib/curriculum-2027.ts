/**
 * DRAFT 2027 curriculum (Master Plan section 5). Not owner-reviewed: every surface that renders this must label it
 * as a draft and stay out of search indexes until the owner approves it.
 *
 * Syllabi are derived from the approved cohort calendars in `cohorts-2027`, so a calendar change (closure, makeup,
 * approval) flows into the dated syllabus automatically.
 */
import { type Cohort, type ProgramId, type ScheduledSession, findCohort, sessionCalendar } from "@/lib/cohorts-2027"

export const CURRICULUM_STATUS = "Draft for owner review — not final" as const

/** Approved three-hour session structure (minutes). */
export const SESSION_BLOCKS = [
  { id: "math", label: "Math", minutes: 75 },
  { id: "verbal", label: "ELA / Reading and Writing", minutes: 75 },
  { id: "review", label: "Cumulative practice and review", minutes: 30 },
] as const

export type Topic = {
  title: string
  /** Official content area this topic is aligned to. */
  domain: string
  objective: string
  practice: string
  /** Digital SAT math only: the Desmos technique taught alongside the topic. */
  desmos?: string
}

// ---------- SHSAT (NYC DOE SHSAT Student Handbook content: Math; ELA Revising/Editing Parts A and B, Reading Comprehension) ----------

const SHSAT_MATH: readonly Topic[] = [
  { title: "Number sense and operations", domain: "Number and operations", objective: "Apply order of operations, divisibility, primes, GCF and LCM accurately without a calculator.", practice: "Mixed multiple-choice set plus two grid-ins." },
  { title: "Fractions, decimals, and percents", domain: "Number and operations", objective: "Convert fluently among fractions, decimals, and percents and compute with rational numbers.", practice: "Timed fluency drill, then word-problem set." },
  { title: "Ratios, rates, and proportional reasoning", domain: "Ratios and proportional relationships", objective: "Set up and solve proportions, unit rates, and scale problems.", practice: "Proportion set with grid-in answers." },
  { title: "Percent applications", domain: "Ratios and proportional relationships", objective: "Solve percent change, discount, tax, and simple-interest problems.", practice: "Multi-step percent problems." },
  { title: "Exponents, roots, and scientific notation", domain: "Expressions and equations", objective: "Use exponent rules, square and cube roots, and scientific notation.", practice: "Exponent rules drill and estimation items." },
  { title: "Algebraic expressions", domain: "Expressions and equations", objective: "Simplify, evaluate, and write expressions using properties of operations.", practice: "Translate-the-words set." },
  { title: "Linear equations in one variable", domain: "Expressions and equations", objective: "Solve multi-step linear equations, including variables on both sides.", practice: "Equation set with check-by-substitution." },
  { title: "Inequalities and absolute value", domain: "Expressions and equations", objective: "Solve and interpret inequalities and absolute-value statements on a number line.", practice: "Inequality and number-line items." },
  { title: "Linear relationships and slope", domain: "Expressions and equations / functions", objective: "Interpret slope, intercepts, graphs, and simple systems of linear equations.", practice: "Graph-reading and system items." },
  { title: "Word problems: rate, work, and mixture", domain: "Problem solving", objective: "Translate multi-step word problems into equations and solve them efficiently.", practice: "Timed word-problem set." },
  { title: "Angles, triangles, and the Pythagorean theorem", domain: "Geometry", objective: "Use angle relationships, triangle properties, and the Pythagorean theorem.", practice: "Diagram-based geometry set." },
  { title: "Area, circles, surface area, and volume", domain: "Geometry", objective: "Compute perimeter, area, circumference, surface area, and volume, including composite figures.", practice: "Composite-figure set with grid-ins." },
  { title: "Coordinate geometry and transformations", domain: "Geometry", objective: "Work with points, distance, translations, reflections, rotations, and dilations.", practice: "Coordinate-plane set." },
  { title: "Statistics, probability, and counting", domain: "Statistics and probability", objective: "Find mean, median, mode, and range; compute probabilities and count outcomes.", practice: "Data and probability set." },
]

const SHSAT_ELA: readonly Topic[] = [
  { title: "Sentence boundaries", domain: "Revising/Editing Part A", objective: "Identify and correct fragments, run-ons, and comma splices.", practice: "Revising/Editing Part A set." },
  { title: "Punctuation", domain: "Revising/Editing Part A", objective: "Apply commas, semicolons, colons, dashes, and apostrophes correctly.", practice: "Punctuation-in-context items." },
  { title: "Agreement", domain: "Revising/Editing Part A", objective: "Correct subject-verb and pronoun-antecedent agreement errors.", practice: "Agreement error-spotting set." },
  { title: "Modifiers, parallelism, and verb tense", domain: "Revising/Editing Part A", objective: "Fix misplaced modifiers, faulty parallelism, and tense shifts.", practice: "Sentence-revision set." },
  { title: "Topic sentences and organization", domain: "Revising/Editing Part B", objective: "Choose the best topic sentence and order sentences logically within a passage.", practice: "Part B passage with questions." },
  { title: "Transitions and logical flow", domain: "Revising/Editing Part B", objective: "Select transitions that match the logical relationship between ideas.", practice: "Transition items in passage context." },
  { title: "Evidence, relevance, and conclusions", domain: "Revising/Editing Part B", objective: "Decide which sentence best supports, extends, or concludes an argument.", practice: "Part B add/delete/conclude items." },
  { title: "Central idea and summary", domain: "Reading Comprehension — informational", objective: "Determine the central idea and the best summary of an informational passage.", practice: "Informational passage with questions." },
  { title: "Inference and textual evidence", domain: "Reading Comprehension", objective: "Draw supported inferences and identify the evidence that supports them.", practice: "Inference passage set." },
  { title: "Word and phrase meaning in context", domain: "Reading Comprehension", objective: "Determine meanings of words and phrases from context.", practice: "Vocabulary-in-context items." },
  { title: "Text structure and author's purpose", domain: "Reading Comprehension", objective: "Analyze how a paragraph or sentence functions and why the author included it.", practice: "Structure and purpose set." },
  { title: "Literary passages", domain: "Reading Comprehension — literary", objective: "Analyze character, theme, point of view, and how events develop.", practice: "Literary passage with questions." },
  { title: "Poetry", domain: "Reading Comprehension — literary", objective: "Interpret figurative language, tone, and structure in poems.", practice: "Poetry passage with questions." },
  { title: "Complex texts and section pacing", domain: "Reading Comprehension / test strategy", objective: "Manage time across the ELA section and handle dense informational texts.", practice: "Timed half-section." },
]

// ---------- Digital SAT (College Board Digital SAT content domains) ----------

const DSAT_MATH: readonly Topic[] = [
  { title: "Linear equations in one variable", domain: "Algebra", objective: "Create and solve linear equations in one variable from context.", practice: "Algebra module-style set.", desmos: "Graph both sides as y = and read the intersection." },
  { title: "Linear functions and equations in two variables", domain: "Algebra", objective: "Interpret slope and intercepts and write linear models from tables, graphs, and context.", practice: "Linear-model set.", desmos: "Use tables and regression (y1 ~ mx1 + b) to find a line from points." },
  { title: "Systems of linear equations", domain: "Algebra", objective: "Solve systems and reason about no-solution and infinite-solution cases.", practice: "Systems set.", desmos: "Graph both equations; use sliders to test parallel or identical lines." },
  { title: "Linear inequalities", domain: "Algebra", objective: "Create, solve, and interpret linear inequalities and systems of inequalities.", practice: "Inequality set.", desmos: "Graph shaded regions and test candidate points." },
  { title: "Equivalent expressions", domain: "Advanced Math", objective: "Rewrite, factor, and expand polynomial and rational expressions.", practice: "Equivalent-forms set.", desmos: "Check equivalence by graphing both expressions." },
  { title: "Quadratic equations and functions", domain: "Advanced Math", objective: "Solve quadratics and connect vertex, factored, and standard forms to graphs.", practice: "Quadratics set.", desmos: "Find zeros, vertex, and intercepts by tapping graph points." },
  { title: "Exponential, polynomial, radical, and rational equations", domain: "Advanced Math", objective: "Solve and interpret nonlinear equations, including exponential growth and decay.", practice: "Nonlinear set.", desmos: "Graph and intersect; spot extraneous solutions visually." },
  { title: "Nonlinear functions and transformations", domain: "Advanced Math", objective: "Interpret function notation, composition, and graph transformations.", practice: "Function-notation set.", desmos: "Define f(x) and evaluate f(a) directly." },
  { title: "Ratios, rates, proportions, units, and percentages", domain: "Problem-Solving and Data Analysis", objective: "Solve multi-step ratio, rate, unit-conversion, and percent problems.", practice: "PSDA set.", desmos: "Use the calculator line for fast multi-step arithmetic." },
  { title: "One-variable data", domain: "Problem-Solving and Data Analysis", objective: "Compare center and spread across distributions and interpret outliers.", practice: "Distributions set.", desmos: "Compute mean, median, and standard deviation from a list." },
  { title: "Two-variable data and models", domain: "Problem-Solving and Data Analysis", objective: "Interpret scatterplots, lines of best fit, and linear vs. exponential models.", practice: "Scatterplot set.", desmos: "Run linear and exponential regressions on tables." },
  { title: "Probability, sampling, and inference", domain: "Problem-Solving and Data Analysis", objective: "Compute probabilities and evaluate claims from samples, surveys, and experiments.", practice: "Inference and probability set.", desmos: "Use the calculator for two-way-table probabilities." },
  { title: "Area, volume, lines, angles, and triangles", domain: "Geometry and Trigonometry", objective: "Apply area, volume, angle, and similar-triangle relationships.", practice: "Geometry set.", desmos: "Model geometric constraints as equations and solve." },
  { title: "Right triangles, trigonometry, and circles", domain: "Geometry and Trigonometry", objective: "Use right-triangle trigonometry, radians, and circle equations.", practice: "Trig and circles set.", desmos: "Graph circle equations to read center and radius." },
]

const DSAT_RW: readonly Topic[] = [
  { title: "Words in context", domain: "Craft and Structure", objective: "Choose the most precise word or phrase for the context.", practice: "Words-in-context set." },
  { title: "Text structure and purpose", domain: "Craft and Structure", objective: "Identify the function of a sentence and the main purpose of a text.", practice: "Structure and purpose set." },
  { title: "Cross-text connections", domain: "Craft and Structure", objective: "Compare how two authors would respond to each other's claims.", practice: "Paired-text set." },
  { title: "Central ideas and details", domain: "Information and Ideas", objective: "Determine the main idea and key supporting details of a short text.", practice: "Central-idea set." },
  { title: "Command of evidence: textual", domain: "Information and Ideas", objective: "Select the quotation or finding that best supports a claim.", practice: "Textual-evidence set." },
  { title: "Command of evidence: quantitative", domain: "Information and Ideas", objective: "Use data from tables and graphs to complete or support a claim.", practice: "Graph and table set." },
  { title: "Inferences", domain: "Information and Ideas", objective: "Complete a text with the most logical, supported conclusion.", practice: "Inference set." },
  { title: "Boundaries: linking clauses", domain: "Standard English Conventions", objective: "Punctuate independent clauses with periods, semicolons, colons, and conjunctions.", practice: "Boundaries set." },
  { title: "Boundaries: supplements and lists", domain: "Standard English Conventions", objective: "Punctuate nonessential elements, appositives, and series correctly.", practice: "Comma and dash set." },
  { title: "Form, structure, and sense: agreement and verbs", domain: "Standard English Conventions", objective: "Apply subject-verb agreement and appropriate verb tense and form.", practice: "Agreement and verbs set." },
  { title: "Form, structure, and sense: pronouns, possessives, modifiers", domain: "Standard English Conventions", objective: "Correct pronoun, possessive, plural, and modifier errors.", practice: "Form and sense set." },
  { title: "Transitions", domain: "Expression of Ideas", objective: "Select transitions that express the logical relationship between sentences.", practice: "Transitions set." },
  { title: "Rhetorical synthesis", domain: "Expression of Ideas", objective: "Use student notes to accomplish a stated rhetorical goal.", practice: "Notes-based set." },
  { title: "Module strategy and pacing", domain: "Test strategy (adaptive two-module sections)", objective: "Pace each module, flag and return to items, and navigate Bluebook efficiently.", practice: "Timed module." },
]

export const TOPICS: Record<ProgramId, { math: readonly Topic[]; verbal: readonly Topic[] }> = {
  SHSAT: { math: SHSAT_MATH, verbal: SHSAT_ELA },
  "Digital SAT": { math: DSAT_MATH, verbal: DSAT_RW },
}

export const VERBAL_LABEL: Record<ProgramId, string> = { SHSAT: "ELA", "Digital SAT": "Reading and Writing" }

// ---------- Assessments ----------

export type AssessmentKind = "diagnostic" | "mock" | "quiz" | "cumulative" | "final"

/** Mock-exam session numbers by course length; session 1 is always the diagnostic. */
const MOCK_SESSIONS: Record<number, readonly number[]> = { 16: [8, 15], 24: [12, 22], 32: [11, 21, 30] }
/** Cumulative unit checkpoints, held in the 30-minute review block. */
const CUMULATIVE_SESSIONS: Record<number, readonly number[]> = { 16: [6, 13], 24: [7, 17], 32: [8, 18, 27] }

export const mockSessionsFor = (sessions: number) => MOCK_SESSIONS[sessions] ?? []

const exam = (program: ProgramId) =>
  program === "SHSAT"
    ? "Full-length, timed SHSAT practice exam (official NYC DOE practice test), scored by section"
    : "Full-length, adaptive Digital SAT practice test in Bluebook (students bring laptops)"

export type SyllabusSession = ScheduledSession & {
  kind: ScheduledSession["kind"]
  /** "instruction" for normal sessions; otherwise the full-session assessment taking the place of instruction. */
  format: "instruction" | "diagnostic" | "mock"
  math?: Topic & { part?: number }
  verbal?: Topic & { part?: number }
  review: string
  homework: string
  assessments: { kind: AssessmentKind; label: string }[]
}

const unitLabel = (topics: readonly Topic[]) => topics.map((t) => t.title).join(" + ")

/** Spread `count` instructional sessions across the ordered topic list (combining or splitting topics as needed). */
function allocate(topics: readonly Topic[], count: number): (Topic & { part?: number })[] {
  const L = topics.length
  const slots: (Topic & { part?: number })[] = []
  for (let i = 0; i < count; i++) {
    const from = Math.floor((i * L) / count)
    const to = Math.max(from + 1, Math.floor(((i + 1) * L) / count))
    const group = topics.slice(from, to)
    if (group.length === 1) {
      const t = group[0]
      const part = slots.filter((s) => s.title === t.title).length + 1
      slots.push({ ...t, part: count > L ? part : undefined })
    } else {
      slots.push({
        title: unitLabel(group),
        domain: [...new Set(group.map((t) => t.domain))].join("; "),
        objective: group.map((t) => t.objective).join(" "),
        practice: group.map((t) => t.practice).join(" "),
        desmos: group.map((t) => t.desmos).filter(Boolean).join(" ") || undefined,
      })
    }
  }
  // A topic split across two sessions: part 1 teaches, part 2 applies at test speed.
  return slots.map((s, i, all) => (s.part === 1 && all[i + 1]?.title !== s.title ? { ...s, part: undefined } : s))
}

export function syllabusFor(cohort: Cohort): SyllabusSession[] {
  const calendar = sessionCalendar(cohort)
  const n = calendar.length
  const mocks = new Set(mockSessionsFor(n))
  const cumulative = new Set(CUMULATIVE_SESSIONS[n] ?? [])
  const perWeek = cohort.weekdays.length
  const instructional = calendar.filter((s) => s.number !== 1 && !mocks.has(s.number))
  const math = allocate(TOPICS[cohort.program].math, instructional.length)
  const verbal = allocate(TOPICS[cohort.program].verbal, instructional.length)
  const verbalName = VERBAL_LABEL[cohort.program]
  let taught = 0
  let mockCount = 0

  return calendar.map((s) => {
    const assessments: SyllabusSession["assessments"] = []
    const isLast = s.number === n
    if (s.number === 1) {
      assessments.push({ kind: "diagnostic", label: `Initial diagnostic: ${exam(cohort.program)}` })
      return {
        ...s, format: "diagnostic" as const, assessments,
        review: "Orientation: course goals, error-log setup, and how progress reports work.",
        homework: "Complete the error-log reflection for the diagnostic; bring questions on any unfinished items.",
      }
    }
    if (mocks.has(s.number)) {
      mockCount++
      assessments.push({ kind: "mock", label: `Mock exam ${mockCount}: ${exam(cohort.program)}` })
      return {
        ...s, format: "mock" as const, assessments,
        review: "Post-exam reflection: students mark guesses and time-pressure items for the debrief.",
        homework: "Log every missed and guessed item in the error log with the reason it was missed.",
      }
    }
    const m = math[taught]
    const v = verbal[taught]
    taught++
    const afterMock = mocks.has(s.number - 1)
    if (cumulative.has(s.number)) assessments.push({ kind: "cumulative", label: "Cumulative review checkpoint (all topics taught so far)" })
    else if (s.number % perWeek === 0 || perWeek === 1) assessments.push({ kind: "quiz", label: "Weekly quiz (15 minutes, Math and " + verbalName + ")" })
    if (isLast) assessments.push({ kind: "final", label: "Final progress report issued to parents" })

    const review = afterMock
      ? "Mock exam debrief: review the most-missed items and update error-log targets."
      : isLast
        ? "Course wrap-up: personal study plan for the remaining weeks before test day."
        : "Cumulative retrieval practice: mixed questions from earlier sessions and the student's error-log topics."
    const homework = isLast
      ? "Follow the personal study plan; retake missed error-log items."
      : `Math: ${m.practice} ${verbalName}: ${v.practice} Update the error log.`
    return { ...s, format: "instruction" as const, math: m, verbal: v, review, homework, assessments }
  })
}

export const syllabusForId = (id: string) => {
  const cohort = findCohort(id)
  return cohort ? { cohort, sessions: syllabusFor(cohort) } : undefined
}

// ---------- Assessment plan (Master Plan section 6) ----------

export type AssessmentPlanRow = { assessment: string; frequency: string; purpose: string; scoring: string }

export const ASSESSMENT_PLAN: readonly AssessmentPlanRow[] = [
  { assessment: "Initial diagnostic", frequency: "Session 1 of every cohort", purpose: "Baseline score and topic-level gaps that set each student's priorities.", scoring: "SHSAT: paper answer sheet scored with the existing GradeCam workflow. Digital SAT: Bluebook score report." },
  { assessment: "Weekly quiz", frequency: "Once per week (second session of a two-day week; fourth session of the Monday–Thursday intensive)", purpose: "Check retention of that week's Math and verbal topics.", scoring: "15-minute paper quiz in the review block, scored with the existing GradeCam workflow." },
  { assessment: "Cumulative review checkpoint", frequency: "2 per 16- and 24-session cohort; 3 per 32-session cohort", purpose: "Retrieval practice across every topic taught so far.", scoring: "Paper, scored with the existing GradeCam workflow; results logged by topic." },
  { assessment: "Full-length mock exam", frequency: "2 per 16- and 24-session cohort; 3 per 32-session cohort", purpose: "Measure score growth, pacing, and stamina under test conditions.", scoring: "SHSAT: official NYC DOE practice test on paper, GradeCam workflow. Digital SAT: Bluebook practice test." },
  { assessment: "Student error log", frequency: "Updated after every session, quiz, and mock; teacher-reviewed weekly", purpose: "Record why each item was missed (content, careless, timing, guess) and drive cumulative review.", scoring: "Not scored; reviewed for patterns." },
  { assessment: "Parent progress report", frequency: "After the diagnostic, after each mock exam, and at course end", purpose: "Show scores, growth by topic, error-log patterns, attendance, and next priorities.", scoring: "Prepared by the instructor from the results above." },
]

export const PROGRESS_INDICATORS: Record<ProgramId, readonly string[]> = {
  SHSAT: [
    "Math and ELA raw scores on each full-length exam compared with the diagnostic",
    "Accuracy by Math domain and by ELA area (Revising/Editing A, Revising/Editing B, Reading Comprehension)",
    "Weekly quiz accuracy and trend",
    "Questions left blank or guessed under time pressure",
    "Error-log categories: content gap, careless error, timing",
    "Attendance and homework completion",
  ],
  "Digital SAT": [
    "Section and total scores on each Bluebook practice test compared with the diagnostic",
    "Accuracy by College Board content domain (four Math, four Reading and Writing)",
    "Weekly quiz accuracy and trend",
    "Module 2 difficulty reached in each section",
    "Desmos use: items solved by graphing vs. by hand",
    "Error-log categories; attendance and homework completion",
  ],
}

export const GRADECAM_NOTE =
  "Paper quizzes, checkpoints, and SHSAT exams are designed to work with AhmedPrep's existing GradeCam scanning workflow. The website has no GradeCam integration; scores are entered and reported manually." as const

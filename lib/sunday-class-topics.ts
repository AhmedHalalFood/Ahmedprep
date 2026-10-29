/**
 * Free Sunday Test Prep Series: class topics.
 *
 * Edit these lists to change upcoming topics. Each list rotates in order, one topic per class of that type,
 * and wraps back to the top when it reaches the end. Add, remove, or reorder lines freely.
 *
 * Schedule (set in lib/free-class.ts):
 *   1st and 3rd Sundays of the month  -> SHSAT
 *   2nd and 4th Sundays of the month  -> Digital SAT
 *   5th Sunday (when a month has one) -> Special Workshop
 */

export const SHSAT_TOPICS = [
  "SHSAT Math Word Problems",
  "SHSAT Reading Comprehension",
  "Algebra & Geometry",
  "Revising & Editing",
  "Timed SHSAT Mini-Test",
  "Pacing & Test Strategy",
]

export const DIGITAL_SAT_TOPICS = [
  "Desmos for Digital SAT Math",
  "Advanced Algebra",
  "Digital SAT Grammar",
  "Reading & Writing Strategy",
  "Timed Digital SAT Mini-Test",
  "Pacing & Bluebook Strategy",
]

/** 2027 schedule (every other Sunday, Math only). Each list advances one topic per class Sunday. */
export const SHSAT_MATH_TOPICS = [
  "SHSAT Math Word Problems",
  "Ratios, Rates & Percents",
  "Algebra: Equations & Inequalities",
  "Geometry & Measurement",
  "Probability & Data",
  "Timed SHSAT Math Mini-Test & Pacing",
]

export const DIGITAL_SAT_MATH_TOPICS = [
  "Desmos for Digital SAT Math",
  "Linear Equations & Systems",
  "Advanced Algebra: Quadratics & Functions",
  "Problem Solving & Data Analysis",
  "Geometry & Trigonometry",
  "Timed Digital SAT Math Mini-Test & Pacing",
]

export const WORKSHOP_TOPICS = ["Parent Q&A: SHSAT & SAT Planning", "Diagnostic Mini-Test & Review", "Test-Day Strategy Workshop"]

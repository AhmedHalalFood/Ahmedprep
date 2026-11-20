export type DigitalSATChallengeQuestion = {
  id: string
  area: "Math" | "Reading & Writing"
  difficulty: "Hard" | "Super Hard"
  topic: string
  passage?: string
  question: string
  choices: [string, string, string, string]
  correctIndex: number
  explanation: string[]
  strategy: string
}
export type DigitalSATChallengeSet = { publishedDate: string; questions: DigitalSATChallengeQuestion[] }

/** Original AhmedPrep practice, not official College Board items or a Bluebook adaptive test.
 * Add and academically review a fresh set before each Monday's release.
 * Keeping an old set visible until a new set is published prevents invented or unreviewed questions.
 */
export const DIGITAL_SAT_CHALLENGE_SETS: DigitalSATChallengeSet[] = [
  {
    "publishedDate": "2026-11-16",
    "questions": [
      {
        "id": "DSAT-W20261116-01",
        "area": "Math",
        "difficulty": "Hard",
        "topic": "Algebra: linear systems",
        "question": "The lines 2x + 3y = 19 and 4x − y = 3 intersect at point P. A third line with slope −2 passes through P. What is the y-intercept of the third line?",
        "choices": [
          "5",
          "7",
          "9",
          "11"
        ],
        "correctIndex": 2,
        "explanation": [
          "From 4x − y = 3, obtain y = 4x − 3. Substitute: 2x + 3(4x − 3) = 19, so 14x = 28 and x = 2; then y = 5.",
          "A line with slope −2 through (2, 5) has equation y − 5 = −2(x − 2), or y = −2x + 9. Its y-intercept is 9."
        ],
        "strategy": "Find the intersection first, then use point-slope form; do not confuse the intersection's y-coordinate with the new line's intercept."
      },
      {
        "id": "DSAT-W20261116-02",
        "area": "Reading & Writing",
        "difficulty": "Hard",
        "topic": "Expression of Ideas: transitions",
        "passage": "At one restored wetland, the return of native grasses was followed by increased sightings of several bird species. ______ researchers caution that the observations alone cannot establish whether the grasses caused the increase, since regional bird populations were rising during the same period.",
        "question": "Which choice completes the text with the most logical transition?",
        "choices": [
          "Consequently,",
          "Nevertheless,",
          "For example,",
          "Similarly,"
        ],
        "correctIndex": 1,
        "explanation": [
          "The second sentence qualifies the encouraging observation in the first: a regional trend is an alternative explanation. “Nevertheless” signals that contrast.",
          "“Consequently” implies a result, “for example” introduces an illustration, and “similarly” indicates resemblance. None expresses the needed qualification."
        ],
        "strategy": "Decide the relationship between the complete sentences before comparing transition words."
      },
      {
        "id": "DSAT-W20261116-03",
        "area": "Math",
        "difficulty": "Hard",
        "topic": "Advanced Math: exponential functions",
        "question": "A function has the form f(x) = abˣ, where a and b are positive constants. If f(1) = 18 and f(3) = 72, what is f(0)?",
        "choices": [
          "6",
          "9",
          "12",
          "15"
        ],
        "correctIndex": 1,
        "explanation": [
          "Divide f(3) by f(1): (ab³)/(ab) = b² = 72/18 = 4. Since b is positive, b = 2.",
          "Then ab = 18 means a = 9. Because f(0) = a·b⁰ = a, the answer is 9."
        ],
        "strategy": "Divide two exponential outputs to eliminate the initial value and isolate the growth factor."
      },
      {
        "id": "DSAT-W20261116-04",
        "area": "Reading & Writing",
        "difficulty": "Hard",
        "topic": "Information and Ideas: quantitative evidence",
        "passage": "In a city's travel survey, the share of commuters who bicycled to work rose from 8% in 2018 to 14% in 2022. Over the same period, the shares commuting by bus changed from 22% to 19%, by walking from 12% to 11%, and by car from 58% to 56%.",
        "question": "Which statement is best supported by the survey results?",
        "choices": [
          "Bicycling had the greatest percentage-point increase among the listed commuting modes.",
          "The total number of bicycle commuters nearly doubled.",
          "Bus commuting accounted for fewer than one in ten commuters in 2022.",
          "Car commuting declined by more than five percentage points."
        ],
        "correctIndex": 0,
        "explanation": [
          "The bicycling share increased by 14 − 8 = 6 percentage points, while the shares of the other three modes all declined.",
          "The survey provides percentages rather than the total number of commuters, so a claim about the number bicycling cannot be established."
        ],
        "strategy": "Keep percentage points distinct from percent change, and do not infer absolute counts from shares."
      },
      {
        "id": "DSAT-W20261116-05",
        "area": "Math",
        "difficulty": "Hard",
        "topic": "Problem-Solving and Data Analysis: residuals",
        "question": "A regression model predicts a value of y using ŷ = 2.4x + 8. For one observation, x = 15 and the actual y-value is 39. What is the residual, defined as actual y minus predicted y?",
        "choices": [
          "−5",
          "−3",
          "3",
          "5"
        ],
        "correctIndex": 0,
        "explanation": [
          "At x = 15, the predicted value is 2.4(15) + 8 = 44.",
          "The residual is actual minus predicted: 39 − 44 = −5. The negative sign shows that the observation is below the fitted line."
        ],
        "strategy": "Compute the predicted value first, then subtract predicted from actual in the order specified."
      },
      {
        "id": "DSAT-W20261116-06",
        "area": "Reading & Writing",
        "difficulty": "Super Hard",
        "topic": "Craft and Structure: cross-text reasoning",
        "passage": "Text 1: A study of restored shorelines found that plots planted with salt-tolerant grasses retained more sediment after storms than nearby unplanted plots. The researchers concluded that the grasses helped stabilize the shore.\n\nText 2: Another research group notes that planted plots in several shoreline studies were also at higher elevations, where waves struck less forcefully. The group argues that studies comparing plots at similar elevations are needed to isolate the contribution of the vegetation.",
        "question": "How would the authors of Text 2 most likely respond to the conclusion in Text 1?",
        "choices": [
          "They would argue that sediment retention cannot be measured reliably.",
          "They would accept the conclusion as established because planted plots retained more sediment.",
          "They would suggest that elevation differences may partly account for the reported effect.",
          "They would claim that grass roots necessarily increase wave force."
        ],
        "correctIndex": 2,
        "explanation": [
          "Text 2 offers a possible confounding factor: higher elevation can reduce exposure to wave force, independently of vegetation.",
          "The authors are not dismissing sediment measurements or asserting that grasses increase wave force. They are questioning whether the study isolates the cause of the observed difference."
        ],
        "strategy": "In paired texts, identify which assumption the second author challenges rather than simply whether the authors agree."
      },
      {
        "id": "DSAT-W20261116-07",
        "area": "Math",
        "difficulty": "Super Hard",
        "topic": "Geometry and Trigonometry: tangent lines",
        "question": "The circle (x − 6)² + y² = 9 has two distinct tangent lines that pass through the origin. What is the product of the slopes of these tangent lines?",
        "choices": [
          "−3",
          "−1/3",
          "1/3",
          "3"
        ],
        "correctIndex": 1,
        "explanation": [
          "A line through the origin with slope m has equation mx − y = 0. The circle has center (6, 0) and radius 3.",
          "For tangency, the distance from (6, 0) to the line must equal 3: |6m|/√(m² + 1) = 3.",
          "Squaring gives 36m² = 9(m² + 1), so 27m² = 9 and m² = 1/3. The two slopes are √(1/3) and −√(1/3), whose product is −1/3."
        ],
        "strategy": "Use the radius-to-tangent perpendicular-distance condition instead of solving the entire circle–line system."
      },
      {
        "id": "DSAT-W20261116-08",
        "area": "Reading & Writing",
        "difficulty": "Super Hard",
        "topic": "Expression of Ideas: rhetorical synthesis",
        "passage": "A student has taken these notes:\n• Scientist Mara Chen developed a new method for mapping urban heat in 2018 using satellite images.\n• Her method measured broad temperature patterns across entire neighborhoods.\n• In 2024, scientist Luis Ortega used portable sensors to record temperatures street by street.\n• Ortega's method captured small local differences that satellite images can miss.\n• Both methods are used to study urban heat.",
        "question": "The student wants to emphasize how Ortega's work complements rather than replaces Chen's. Which choice most effectively uses relevant information from the notes?",
        "choices": [
          "Chen's 2018 method and Ortega's 2024 method both concern urban temperatures, but their collection dates differ.",
          "Because satellite images cannot measure urban heat, Ortega developed sensors that made Chen's method obsolete.",
          "Chen's satellite maps reveal neighborhood-wide patterns, while Ortega's street-level sensors capture smaller variations, making the approaches complementary.",
          "Ortega's portable sensors collect temperature measurements, and his method was developed in 2024, six years after Chen's."
        ],
        "correctIndex": 2,
        "explanation": [
          "The chosen sentence identifies the distinct spatial scales at which the two methods operate and explains how those strengths complement each other.",
          "The other choices focus mainly on dates or introduce unsupported claims that satellite measurements are ineffective or obsolete."
        ],
        "strategy": "When the question specifies a rhetorical goal, select evidence that directly fulfills that goal, not merely accurate background."
      },
      {
        "id": "DSAT-W20261116-09",
        "area": "Math",
        "difficulty": "Super Hard",
        "topic": "Advanced Math: quadratic parameters",
        "question": "For exactly two distinct real values of k, the equation x² − (k + 1)x + k² = 0 has exactly one real solution for x. What is the sum of those two values of k?",
        "choices": [
          "−2/3",
          "1/3",
          "2/3",
          "4/3"
        ],
        "correctIndex": 2,
        "explanation": [
          "A quadratic has exactly one real root when its discriminant is zero. Here, D = (k + 1)² − 4k² = −3k² + 2k + 1.",
          "Set D = 0: 3k² − 2k − 1 = 0, or (3k + 1)(k − 1) = 0. Thus k = −1/3 or k = 1.",
          "Their sum is −1/3 + 1 = 2/3."
        ],
        "strategy": "When a parameter controls the number of real solutions, start with the discriminant and then solve for the parameter."
      },
      {
        "id": "DSAT-W20261116-10",
        "area": "Reading & Writing",
        "difficulty": "Super Hard",
        "topic": "Standard English Conventions: sentence boundaries",
        "passage": "The research team initially attributed the decline in insect activity to cooler temperatures. After reviewing measurements from the same period, ______ the team found that the decline began before the temperature changed.",
        "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
        "choices": [
          "however,",
          "however;",
          "however",
          "however:"
        ],
        "correctIndex": 0,
        "explanation": [
          "The introductory phrase 'After reviewing measurements from the same period' is followed by the interrupter 'however,' and then the independent clause 'the team found ...'. A comma after 'however' marks its introductory use.",
          "A semicolon or colon after 'however' would incorrectly separate the introductory material from the main clause. Omitting punctuation after 'however' makes the introductory adverb insufficiently set off."
        ],
        "strategy": "Identify the introductory phrase and the main clause; punctuation should separate those parts rather than break apart a clause."
      }
    ]
  }
]
export function currentDigitalSATChallenge(today: string): DigitalSATChallengeSet | undefined {
  return DIGITAL_SAT_CHALLENGE_SETS.filter(s => s.publishedDate <= today)
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))[0]
}

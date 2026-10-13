import type { Resource } from "./resources"
import { NYC_SHSAT_PORTAL_URL } from "./resources-shsat-2026"

const PUBLISHED = "2026-10-13"

/**
 * Comprehensive SHSAT Math and ELA practice hubs. These replace the shorter guides at the
 * same URLs, so existing links and rankings are preserved. All practice questions are original.
 */
export const SHSAT_MATH_PRACTICE: Resource = {
  slug: "shsat-math-practice",
  category: "SHSAT",
  topic: "Math Practice",
  title: "SHSAT Math Practice: Topics, Questions & Worked Solutions",
  cardTitle: "SHSAT Math practice questions with worked solutions",
  metaTitle: "SHSAT Math Practice Questions, Topics & Pacing",
  description:
    "Original SHSAT Math practice questions with step-by-step explanations, plus the topics tested, question types, pacing for the digital test, and the mistakes that cost points.",
  cardDescription: "Ten original problems with worked explanations, question types, pacing, and common mistakes.",
  datePublished: "2026-10-09",
  dateModified: PUBLISHED,
  intro: [
    "SHSAT Math tests middle-school content, but rarely in a straightforward way. A single question might combine a ratio, a percent, and a careful reading of what is being asked. Students who score well have made the core skills automatic and have practiced enough real problems to recognize the traps.",
    "This page brings that practice together in one place: what the Math section covers, the kinds of questions to expect, ten original practice problems with full explanations, and how to pace yourself on the computer-adaptive test.",
  ],
  sections: [
    {
      heading: "SHSAT Math topics at a glance",
      body: [
        "The Math section has 50 questions drawn from content most students see in 6th through 8th grade. Calculators are not allowed, so accurate arithmetic matters as much as knowing the concept.",
      ],
      list: [
        "Number sense: fractions, decimals, percents, exponents, factors, and multiples.",
        "Ratios, rates, and proportional reasoning, including percent change and unit rates.",
        "Expressions, linear equations, inequalities, and simple systems.",
        "Geometry and measurement: angles, triangles, the Pythagorean theorem, area, perimeter, and volume.",
        "Probability, statistics, and reading data from tables and graphs.",
        "Multi-step word problems that combine several of the topics above.",
        "For a detailed review list, see our [SHSAT Math topics checklist](/resources/shsat-math-topics).",
      ],
    },
    {
      heading: "Common SHSAT Math question types",
      body: [
        "On the Fall 2026 computer-adaptive SHSAT, Math questions appear in a few formats. Knowing each one ahead of time keeps test-day surprises to a minimum.",
      ],
      subsections: [
        {
          heading: "Multiple choice",
          body: [
            "Most questions offer four answer choices. Wrong choices are often the result of a predictable mistake, such as adding percents that should be multiplied or answering for the wrong quantity. Estimating first helps rule out choices that cannot be right.",
          ],
        },
        {
          heading: "Fill-in-the-blank",
          body: [
            "Some questions ask students to type a numerical answer with no choices to check against. Plugging the answer back into the problem is the best protection, because Math questions cannot be revisited after advancing.",
          ],
        },
        {
          heading: "Technology-enhanced items",
          body: [
            `These questions use the computer interface in ways a paper test cannot, for example asking students to select more than one correct answer. The [Student Readiness Tool on the NYC SHSAT Portal](${NYC_SHSAT_PORTAL_URL}) is the best way to see these formats before test day.`,
          ],
        },
        {
          heading: "Multi-step word problems",
          body: [
            "Word problems appear in every format. The challenge is usually translating the words into math, not the calculation itself. Before solving, write down what the question asks for in a few words.",
          ],
        },
      ],
    },
    {
      heading: "SHSAT Math practice questions",
      body: [
        "Try each problem on scratch paper without a calculator before opening the explanation. Time yourself: on test day, most students have a little under two minutes per Math question.",
      ],
      questions: [
        {
          topic: "Percents",
          prompt: "A $40 jacket is marked up 15%. The store then offers 15% off the new price. What is the final price?",
          choices: ["$40.00", "$39.10", "$38.50", "$34.00"],
          answer: "$39.10",
          explanation: [
            "The markup gives 40 × 1.15 = $46. The discount is taken from $46, not $40: 46 × 0.85 = $39.10.",
            "Trap: choosing $40.00 because +15% and −15% seem to cancel. They do not, because each percent is applied to a different amount.",
          ],
        },
        {
          topic: "Ratios",
          prompt: "A recipe uses flour and sugar in a ratio of 5:2. If the recipe uses 21 cups of flour and sugar combined, how many more cups of flour than sugar does it use?",
          choices: ["3", "6", "9", "15"],
          answer: "9",
          explanation: [
            "The ratio has 5 + 2 = 7 parts, so each part is 21 ÷ 7 = 3 cups. Flour is 5 × 3 = 15 cups and sugar is 2 × 3 = 6 cups. The difference is 15 − 6 = 9 cups.",
            "Trap: answering 15 or 6, which are the amounts of each ingredient rather than the difference the question asks for.",
          ],
        },
        {
          topic: "Rates",
          prompt: "Maya walks 3 miles to the library at 4 miles per hour and returns the same way at 6 miles per hour. What is her average speed for the whole trip, in miles per hour?",
          choices: ["4.8", "5", "5.2", "5.5"],
          answer: "4.8",
          explanation: [
            "Average speed is total distance divided by total time. The trip there takes 3 ÷ 4 = 0.75 hours and the trip back takes 3 ÷ 6 = 0.5 hours, for 1.25 hours total. Total distance is 6 miles, so the average speed is 6 ÷ 1.25 = 4.8 mph.",
            "Trap: averaging the two speeds to get 5. She spends more time at the slower speed, so the average is pulled below 5.",
          ],
        },
        {
          topic: "Linear equations (fill-in-the-blank)",
          prompt: "If 4(x − 3) = 2x + 10, what is the value of x?",
          answer: "11",
          explanation: [
            "Distribute: 4x − 12 = 2x + 10. Subtract 2x from both sides: 2x − 12 = 10. Add 12: 2x = 22, so x = 11.",
            "Check before advancing: 4(11 − 3) = 32 and 2(11) + 10 = 32. Both sides match.",
          ],
        },
        {
          topic: "Inequalities",
          prompt: "What is the greatest integer n that satisfies −3n + 5 > 17?",
          choices: ["−3", "−4", "−5", "−6"],
          answer: "−5",
          explanation: [
            "Subtract 5 from both sides: −3n > 12. Divide by −3 and flip the inequality sign: n < −4. The greatest integer less than −4 is −5.",
            "Traps: forgetting to flip the sign when dividing by a negative, or choosing −4, which is not included because the inequality is strict.",
          ],
        },
        {
          topic: "Geometry: right triangles",
          prompt: "A right triangle has legs of length 9 and 12. What is its perimeter?",
          choices: ["21", "30", "36", "54"],
          answer: "36",
          explanation: [
            "By the Pythagorean theorem, the hypotenuse is √(9² + 12²) = √(81 + 144) = √225 = 15. The perimeter is 9 + 12 + 15 = 36.",
            "Recognizing 9-12-15 as a multiple of the 3-4-5 triangle saves time. Trap: 54 is the area, not the perimeter.",
          ],
        },
        {
          topic: "Geometry: angles",
          prompt: "Two parallel lines are cut by a transversal. Two same-side interior angles measure (3x + 10)° and (2x + 20)°. What is the measure of the larger angle?",
          choices: ["30°", "80°", "100°", "110°"],
          answer: "100°",
          explanation: [
            "Same-side interior angles are supplementary, so (3x + 10) + (2x + 20) = 180. That gives 5x + 30 = 180, so x = 30. The angles are 3(30) + 10 = 100° and 2(30) + 20 = 80°. The larger angle is 100°.",
            "Trap: stopping at x = 30. The question asks for an angle, not for x.",
          ],
        },
        {
          topic: "Statistics (fill-in-the-blank)",
          prompt: "The mean of Dev's first five test scores is 84. What score does he need on his sixth test to raise his mean to 86?",
          answer: "96",
          explanation: [
            "Work with totals instead of averages. Five tests at a mean of 84 total 5 × 84 = 420 points. Six tests at a mean of 86 total 6 × 86 = 516 points. He needs 516 − 420 = 96.",
          ],
        },
        {
          topic: "Probability",
          prompt: "A bag holds 4 red marbles and 6 blue marbles. Two marbles are drawn at random without replacement. What is the probability that both are red?",
          choices: ["4/25", "2/15", "1/5", "2/5"],
          answer: "2/15",
          explanation: [
            "The first draw is red with probability 4/10. With one red marble gone, the second draw is red with probability 3/9. Multiply: (4/10) × (3/9) = 12/90 = 2/15.",
            "Trap: 4/25 is the answer if the first marble were put back. \"Without replacement\" changes the second fraction.",
          ],
        },
        {
          topic: "Number sense: multiples",
          prompt: "One bus leaves a station every 12 minutes and another leaves every 18 minutes. Both leave at 8:00 a.m. When is the next time they leave together?",
          choices: ["8:30 a.m.", "8:36 a.m.", "8:54 a.m.", "9:12 a.m."],
          answer: "8:36 a.m.",
          explanation: [
            "The buses leave together at multiples of both 12 and 18. The least common multiple is 36 (12 = 2² × 3 and 18 = 2 × 3², so the LCM is 2² × 3² = 36). They next leave together 36 minutes after 8:00, at 8:36 a.m.",
          ],
        },
      ],
    },
    {
      heading: "Pacing SHSAT Math on the digital test",
      body: [
        "Students get 180 minutes for both subjects and decide how to split the time. A common starting point is about 90 minutes for Math, which works out to just under two minutes per question. The right split depends on the student, so test it on full-length practice exams before test day.",
        "Because Math questions cannot be revisited after advancing, the familiar paper-test strategy of skipping a hard problem and coming back later does not apply. Pacing has to happen one question at a time.",
      ],
      list: [
        "Set a personal time ceiling, such as three minutes. If a problem is still unsolved, eliminate what you can, choose the best remaining answer, and advance.",
        "Use checkpoints. For example, aim to be around question 25 by the 45-minute mark of your Math time.",
        "Spend the seconds you save on easier questions checking fill-in-the-blank answers, where there are no choices to catch a mistake.",
        "Practice the full 180 minutes in one sitting so the second subject does not suffer from fatigue.",
      ],
    },
    {
      heading: "Common SHSAT Math mistakes and how to fix them",
      body: [],
      list: [
        "Answering a different question: solving for x when the question asks for 2x, or for one part of a ratio when it asks for the difference. Fix: underline the final ask before calculating.",
        "Adding percents that should be multiplied: successive discounts or markups apply to a new amount each time.",
        "Averaging rates directly: average speed is total distance over total time.",
        "Sign errors with inequalities: flip the sign when multiplying or dividing by a negative number.",
        "Arithmetic slips without a calculator: write each step on scratch paper instead of doing it in your head.",
        "Spending too long on one problem: since you cannot return, a stuck question costs time on every question after it.",
        "Not checking fill-in answers: substitute your answer back into the original problem before advancing.",
      ],
    },
    {
      heading: "How to keep practicing SHSAT Math",
      body: [
        "Practice is most effective when it targets the topics where a student actually loses points. A short error log, reviewed weekly, shows those patterns quickly. Pair focused topic practice with periodic full-length tests, and review each test as carefully as you took it. Our guide on [how to use SHSAT practice tests](/resources/how-to-use-shsat-practice-tests) walks through a review routine.",
        "If you would like an outside view of where your child stands, our [free SHSAT diagnostic](/free-diagnostic) in Astoria identifies the Math and ELA skills that will move the score most. Students can also join the [free Sunday SHSAT class](/free-sunday-classes), where we work through problems like these live. For structured, week-by-week preparation, see our [SHSAT prep program](/shsat).",
        "Preparing for the other half of the test? Continue with our [SHSAT ELA practice](/resources/shsat-ela-practice) guide.",
      ],
    },
  ],
}

const TREE_PASSAGE = [
  "(1) On a summer afternoon, two blocks in the same neighborhood can feel like different climates. One is lined with mature trees; the other is bare asphalt and brick. Researchers who measure street-level temperatures have found that shaded sidewalks can be many degrees cooler than unshaded ones, even when the blocks are only a short walk apart.",
  "(2) Trees cool a street in two ways. Their canopies block sunlight before it can heat pavement and walls, and their leaves release water vapor, a process that draws heat from the surrounding air. Together, these effects temper the worst of the afternoon heat, especially for people waiting at bus stops or walking to work.",
  "(3) Planting trees is not a simple fix, however. A young sapling provides little shade for years, and trees on city streets must survive compacted soil, road salt, and damaged roots. For that reason, some city planners argue that protecting the mature trees a neighborhood already has is just as important as planting new ones.",
]

export const SHSAT_ELA_PRACTICE: Resource = {
  slug: "shsat-ela-practice",
  category: "SHSAT",
  topic: "ELA Practice",
  title: "SHSAT ELA Practice: Reading, Grammar & Test Strategy",
  cardTitle: "SHSAT ELA practice: reading, grammar, and strategy",
  metaTitle: "SHSAT ELA Practice: Reading, Grammar & Revising/Editing",
  description:
    "Practice SHSAT ELA with original Reading Comprehension and Revising/Editing questions, the grammar rules that matter most, passage strategy, pacing, and common traps.",
  cardDescription: "Original reading and grammar questions with explanations, plus passage strategy, pacing, and common traps.",
  datePublished: "2026-10-09",
  dateModified: PUBLISHED,
  intro: [
    "The SHSAT ELA section rewards two things: knowing a focused set of grammar and writing rules well, and reading carefully enough to answer from the text rather than from impression. Both can be practiced, and both improve faster with clear explanations of why an answer is right.",
    "This guide covers each part of the ELA section, the strategies that work on a screen, and original practice questions for Revising/Editing and Reading Comprehension with full explanations.",
  ],
  sections: [
    {
      heading: "How SHSAT ELA is structured",
      body: [
        "The ELA section has 50 questions in two broad groups: Revising/Editing, which tests grammar, punctuation, sentence structure, and the organization of short texts, and Reading Comprehension, which is based on longer informational and literary passages.",
        "On the Fall 2026 computer-adaptive SHSAT, every question must be answered before advancing. Standalone Revising/Editing questions cannot be revisited. Questions tied to a passage can be reviewed and changed within that passage set until the set is submitted. Our guide to [how the digital SHSAT works](/resources/digital-shsat-2026) explains these rules in more detail.",
      ],
    },
    {
      heading: "Reading Comprehension",
      body: [
        "Reading Comprehension passages include informational texts, such as science and history, and literary texts, such as fiction excerpts and poetry. Each passage is followed by several questions.",
      ],
      subsections: [
        {
          heading: "What the questions ask",
          body: [],
          list: [
            "Central idea: what the passage or a paragraph is mainly about.",
            "Inference: what the text suggests without stating directly.",
            "Evidence: which line or sentence best supports a claim.",
            "Structure and purpose: why the author includes a paragraph, detail, or comparison.",
            "Point of view and tone, especially in literary passages.",
            "Vocabulary in context: what a word means as it is used in the passage.",
          ],
        },
        {
          heading: "How to approach them",
          body: [
            "The correct answer is always supported by the passage. If you cannot point to the words that prove an answer, it is probably not the right one. Answer choices that are too extreme, too narrow, or that bring in outside knowledge are the most common wrong answers.",
          ],
        },
      ],
    },
    {
      heading: "Revising/Editing",
      body: [
        "Revising/Editing questions come in two forms. Some are standalone sentences or short paragraphs with one question. Others are based on a longer draft text, with several questions asking how to improve it.",
      ],
      list: [
        "Editing questions focus on conventions: grammar, usage, and punctuation.",
        "Revising questions focus on writing quality: transitions, combining sentences, adding or removing information, and placing a sentence where it fits best.",
        "For revising questions, ask what the paragraph is trying to do. The best choice supports that purpose clearly and concisely.",
      ],
    },
    {
      heading: "SHSAT grammar rules to know",
      body: [
        "SHSAT grammar questions draw on a fairly predictable set of rules. Mastering these covers most of what students will see.",
      ],
      list: [
        "Sentence boundaries: recognizing run-ons, comma splices, and fragments, and fixing them with a period, semicolon, or conjunction.",
        "Commas: setting off introductory phrases and nonessential information, and separating items in a list.",
        "Semicolons and colons: a semicolon joins two complete sentences; a colon introduces an explanation or list after a complete sentence.",
        "Subject-verb agreement, especially when a long phrase separates the subject from the verb.",
        "Pronouns: clear antecedents and correct case, such as \"between you and me.\"",
        "Modifiers: a descriptive phrase should sit next to the word it describes.",
        "Verb tense consistency within a sentence or paragraph.",
        "Parallel structure in lists and comparisons.",
        "Possessives and contractions: its and it's, their and they're.",
      ],
    },
    {
      heading: "Vocabulary in context",
      body: [
        "Vocabulary questions rarely test obscure words. More often, they ask what a common word means in a specific sentence, where it may carry a less familiar meaning. To answer, cover the word, reread the sentence, and predict a replacement in your own words before looking at the choices.",
        "Long-term vocabulary growth comes from reading. Regular reading of challenging nonfiction, such as science articles, history, and long-form journalism, builds both vocabulary and the stamina needed for the full exam.",
      ],
    },
    {
      heading: "Passage strategy on a screen",
      body: ["On the digital test, students scroll through passages instead of flipping pages. A few habits make that easier:"],
      list: [
        "Read the whole passage first at a steady pace, noting the main idea of each paragraph on scratch paper in a few words.",
        "Pay extra attention to the first and last paragraphs, where the central idea and the author's conclusion usually appear.",
        "For each question, go back to the relevant lines before choosing an answer.",
        "Use the passage-set review window: before submitting the set, revisit any answer you were unsure about.",
      ],
    },
    {
      heading: "Pacing the ELA section",
      body: [
        "Students divide the 180 minutes between ELA and Math themselves. A common starting point is about 90 minutes for ELA, but students who read slowly may need more and students who are faster with grammar may need less.",
      ],
      list: [
        "Move efficiently through standalone Revising/Editing questions; many can be answered in under a minute once the rules are familiar.",
        "Budget most of your ELA time for Reading Comprehension, where reading the passage carefully pays off across several questions.",
        "Set checkpoints, such as finishing a passage set within a target time, and practice them on full-length tests.",
        "Decide in advance whether to start with ELA or Math, and keep that order consistent in practice.",
      ],
    },
    {
      heading: "Common SHSAT ELA traps",
      body: [],
      list: [
        "True but irrelevant: an answer choice that is accurate according to the passage but does not answer the question asked.",
        "Too extreme: words like always, never, or only, when the passage is more measured.",
        "Too narrow: a choice that describes one detail when the question asks for the central idea.",
        "Outside knowledge: a choice that sounds reasonable but is not stated or supported in the text.",
        "Sounds right, reads wrong: a grammar choice that matches how people talk but breaks a rule, such as a comma splice.",
        "Wordy revisions: when two choices are both correct, the clearer and more concise one is usually best.",
      ],
    },
    {
      heading: "SHSAT Revising/Editing practice questions",
      body: ["Read each sentence carefully and choose the best answer before opening the explanation."],
      questions: [
        {
          topic: "Sentence boundaries",
          prompt: "Which revision corrects the sentence? \"The library extended its hours during exam week, students filled every table until midnight.\"",
          choices: [
            "NO CHANGE",
            "The library extended its hours during exam week; students filled every table until midnight.",
            "The library extended its hours during exam week, and so, students filled every table until midnight.",
            "The library extended its hours during exam week students filled every table until midnight.",
          ],
          answer: "The library extended its hours during exam week; students filled every table until midnight.",
          explanation: [
            "The original joins two complete sentences with only a comma, which is a comma splice. A semicolon correctly joins two related independent clauses. Removing the comma entirely creates a run-on, and \"and so,\" adds an unnecessary comma after the conjunction.",
          ],
        },
        {
          topic: "Subject-verb agreement",
          prompt: "Which choice completes the sentence correctly? \"The collection of rare maps, along with several old letters, ______ displayed in the main hall.\"",
          choices: ["are", "were", "is", "have been"],
          answer: "is",
          explanation: [
            "The subject is \"collection,\" which is singular. The phrases \"of rare maps\" and \"along with several old letters\" do not change the subject, so the verb must be singular: \"is.\" Cross out the phrases between the subject and verb to see the agreement clearly.",
          ],
        },
        {
          topic: "Modifiers",
          prompt: "Which revision corrects the sentence? \"Walking into the auditorium, the stage lights blinded the students.\"",
          choices: [
            "NO CHANGE",
            "Walking into the auditorium, the students were blinded by the stage lights.",
            "The stage lights, walking into the auditorium, blinded the students.",
            "Walking into the auditorium, the blinding stage lights were seen by the students.",
          ],
          answer: "Walking into the auditorium, the students were blinded by the stage lights.",
          explanation: [
            "The phrase \"Walking into the auditorium\" must describe whoever comes right after the comma. In the original, it describes the stage lights, which cannot walk. Only the second choice places \"the students\" directly after the phrase.",
          ],
        },
        {
          topic: "Transitions",
          prompt: "Which transition best completes the text? \"Many people assume that deserts are nearly lifeless. ______, the Sonoran Desert supports a wide variety of plants and animals.\"",
          choices: ["Similarly", "Therefore", "However", "Additionally"],
          answer: "However",
          explanation: [
            "The second sentence contradicts the assumption in the first, so a contrast transition is needed. \"Similarly\" and \"Additionally\" signal agreement, and \"Therefore\" signals a result.",
          ],
        },
        {
          topic: "Parallel structure",
          prompt: "Which revision corrects the sentence? \"The coach told the team to stretch, hydrate, and that they should rest before the game.\"",
          choices: [
            "NO CHANGE",
            "The coach told the team to stretch, hydrate, and rest before the game.",
            "The coach told the team stretching, hydrating, and to rest before the game.",
            "The coach told the team to stretch, to hydrate, and that resting before the game.",
          ],
          answer: "The coach told the team to stretch, hydrate, and rest before the game.",
          explanation: [
            "Items in a list should share the same grammatical form. \"Stretch, hydrate, and rest\" are all base verbs following \"to.\" The other choices mix verb forms or clauses.",
          ],
        },
      ],
    },
    {
      heading: "SHSAT Reading Comprehension practice",
      body: ["Read the original passage below, then answer the questions that follow."],
      passageTitle: "City Trees and Summer Heat",
      passage: TREE_PASSAGE,
      questions: [
        {
          topic: "Central idea",
          prompt: "Which statement best expresses the central idea of the passage?",
          choices: [
            "Street trees help cool city blocks, but their benefits depend on long-term care and protection.",
            "Asphalt and brick are the main causes of summer heat in cities.",
            "City planners should stop planting new trees and focus only on old ones.",
            "Bus stops are the hottest places in most neighborhoods.",
          ],
          answer: "Street trees help cool city blocks, but their benefits depend on long-term care and protection.",
          explanation: [
            "Paragraphs 1 and 2 explain how trees cool streets, and paragraph 3 explains why that benefit takes time and protection. The first choice covers the whole passage. The third choice is too extreme: planners argue protecting trees is \"just as important,\" not that planting should stop. The others are details or unsupported claims.",
          ],
        },
        {
          topic: "Vocabulary in context",
          prompt: "As used in paragraph 2, the word \"temper\" most nearly means",
          choices: ["anger", "moderate", "harden", "measure"],
          answer: "moderate",
          explanation: [
            "The sentence describes trees reducing \"the worst of the afternoon heat,\" so \"temper\" means to soften or moderate. \"Anger\" is a different meaning of the word that does not fit here.",
          ],
        },
        {
          topic: "Inference",
          prompt: "Which conclusion is best supported by paragraph 3?",
          choices: [
            "Newly planted trees will not significantly cool a street right away.",
            "Road salt is the greatest threat to city trees.",
            "Mature trees do not need any care to survive.",
            "Most city planners oppose planting new trees.",
          ],
          answer: "Newly planted trees will not significantly cool a street right away.",
          explanation: [
            "Paragraph 3 says \"a young sapling provides little shade for years,\" which directly supports the first choice. Road salt is listed as one challenge among several, not the greatest. The passage never says mature trees need no care, and it describes only \"some\" planners.",
          ],
        },
        {
          topic: "Evidence",
          prompt: "Which sentence from the passage best supports the idea that trees cool streets in more than one way?",
          choices: [
            "\"One is lined with mature trees; the other is bare asphalt and brick.\"",
            "\"Their canopies block sunlight before it can heat pavement and walls, and their leaves release water vapor, a process that draws heat from the surrounding air.\"",
            "\"A young sapling provides little shade for years.\"",
            "\"Planting trees is not a simple fix, however.\"",
          ],
          answer:
            "\"Their canopies block sunlight before it can heat pavement and walls, and their leaves release water vapor, a process that draws heat from the surrounding air.\"",
          explanation: [
            "This sentence names two separate cooling effects: shade and water vapor. The other sentences describe the contrast between blocks or the challenges of planting, not the ways trees cool a street.",
          ],
        },
      ],
    },
    {
      heading: "How to keep practicing SHSAT ELA",
      body: [
        "Short, regular practice works better than occasional long sessions. A few Revising/Editing questions each day keeps grammar rules fresh, while one or two timed passages a week builds reading accuracy and pacing. Keep an error log that records why each answer was wrong, not only that it was wrong, and use [official practice tests](/resources/how-to-use-shsat-practice-tests) as checkpoints.",
        "If you are not sure which ELA skills are holding your child back, our [free SHSAT diagnostic](/free-diagnostic) in Astoria gives a clear picture. Students can also join our [free Sunday SHSAT class](/free-sunday-classes), which works through reading and grammar questions live, or enroll in our full [SHSAT prep program](/shsat) for structured weekly instruction.",
        "Working on the Math section too? Continue with our [SHSAT Math practice questions](/resources/shsat-math-practice).",
      ],
    },
  ],
}

import type { Resource } from "./resources"

export const NYCPS_SHSAT_URL = "https://www.schools.nyc.gov/enrollment/enroll-grade-by-grade/specialized-high-schools"
export const NYC_SHSAT_PORTAL_URL = "https://nycshsat.myassessmentsupport.com"

const PUBLISHED = "2026-10-09"

/**
 * Body paragraphs and list items support inline links written as [anchor text](/path).
 * External links open in a new tab automatically.
 */
export const SHSAT_2026_GUIDES: Resource[] = [
  {
    slug: "2026-shsat-dates-registration-deadline",
    category: "SHSAT",
    topic: "Dates & Registration",
    featured: true,
    title: "2026 SHSAT Dates, Registration Deadline & What Parents Need to Know",
    cardTitle: "2026 SHSAT dates and registration deadline",
    metaTitle: "2026 SHSAT Dates & Registration Deadline for NYC Families",
    description:
      "SHSAT registration closes October 30, 2026. See every fall 2026 test date, who tests when, and the steps NYC parents should take before the deadline.",
    cardDescription: "Registration windows, every November test date, and a parent checklist for the weeks before the SHSAT.",
    datePublished: PUBLISHED,
    intro: [
      "The SHSAT is the only factor used for admission to the eight testing NYC Specialized High Schools, so missing a deadline is the one mistake a family cannot study its way out of. This guide collects the fall 2026 dates in one place and explains what each step means for your child.",
      `Dates are set by NYC Public Schools and can change. Before you plan around any date below, confirm it on the [official NYC Public Schools Specialized High Schools page](${NYCPS_SHSAT_URL}).`,
    ],
    sections: [
      {
        heading: "Key 2026 SHSAT dates at a glance",
        body: ["These are the current dates published by NYC Public Schools for the fall 2026 SHSAT administration:"],
        list: [
          "October 6, 2026: SHSAT registration opens in MySchools.",
          "October 30, 2026: SHSAT registration closes.",
          "November 14 and 15, 2026: Weekend testing at central NYC Public Schools locations.",
          "November 18, 2026: School-day SHSAT for eligible 8th graders at their current school.",
          "November 21, 2026: Saturday testing for registered 9th graders at central locations.",
        ],
      },
      {
        heading: "How SHSAT registration works",
        body: [
          "Registration happens in MySchools, the same NYC Public Schools account families use for high school applications. Your child's school counselor can help, and a Family Welcome Center can assist if you do not have an account.",
        ],
        subsections: [
          {
            heading: "Who is eligible",
            body: [
              "To register, a student must be a New York City resident and either a current 8th grader or a first-time (not repeating) 9th grader. Students attending public, charter, private, and parochial schools, as well as homeschooled students, can register.",
            ],
          },
          {
            heading: "Ranking the Specialized High Schools",
            body: [
              "During registration, families list the testing Specialized High Schools in order of preference. This ranking matters as much as the score itself. Offers are made in descending score order: each student is offered their highest-ranked school that still has seats. A student is never considered for a school they did not list.",
              "Rank schools in the order your child truly prefers them. Listing a school lower to \"play it safe\" does not improve the chances of getting into it, and leaving a school off means it cannot be offered.",
            ],
          },
          {
            heading: "Testing accommodations",
            body: [
              "Students with IEPs or 504 Plans, current English Language Learners, and recently exited ELLs may be eligible for testing accommodations. Accommodations are entered or confirmed by your child's school during the registration window, and documentation for some students must be submitted weeks before the deadline. Talk to the school counselor early rather than in the final days of October.",
            ],
          },
        ],
      },
      {
        heading: "Which test date applies to your child",
        body: ["Students do not choose their test date. It depends on grade and school type:"],
        list: [
          "8th graders at a public NYC middle school that ends in 8th grade typically test at their own school during the school day on Wednesday, November 18.",
          "8th graders at 6–12 or K–12 schools, charter, private, parochial, or independent schools, and homeschooled students typically test at a central NYC Public Schools location on Saturday, November 14 or Sunday, November 15.",
          "Registered 9th graders test at a central location on Saturday, November 21. NYC Public Schools provides an alternate date for students who cannot test on Saturday.",
        ],
      },
      {
        heading: "Your test ticket",
        body: [
          "After the registration deadline, each registered student receives a test ticket showing the assigned date, time, and location, plus any approved accommodations. Check the ticket as soon as it is available. If anything looks wrong, especially accommodations, contact your school counselor right away.",
          "For Queens families testing on a weekend, the assigned site depends on the district where your child attends school. Check the ticket rather than assuming the nearest high school.",
        ],
      },
      {
        heading: "A parent checklist for October and November",
        body: [],
        list: [
          "Confirm your MySchools login works before registration gets busy.",
          "Discuss and finalize the order of Specialized High Schools with your child.",
          "Submit registration well before October 30 and save a confirmation.",
          "Ask the school counselor to confirm any testing accommodations.",
          `Have your child try the official digital practice materials so the format is familiar. Our guide to [how the digital SHSAT works](/resources/digital-shsat-2026) explains the format.`,
          "Download or print the test ticket and plan travel to the test site.",
        ],
      },
      {
        heading: "Making the most of the weeks before the test",
        body: [
          `With registration open, there are only a few weeks left before test day. That window is best used for targeted review, not for learning everything from scratch. A [free SHSAT diagnostic](/free-diagnostic) can show which Math and ELA areas will move the score most in the time remaining.`,
          `For students who want structured, test-focused practice in the final stretch, AhmedPrep runs the [2026 SHSAT Final 5-Week Intensive](/shsat-final-intensive-2026) at our location in Astoria, Queens, and we serve students from across NYC.`,
        ],
      },
    ],
  },
  {
    slug: "digital-shsat-2026",
    category: "SHSAT",
    topic: "Test Format",
    featured: true,
    title: "How the Digital SHSAT Works in 2026",
    cardTitle: "How the digital SHSAT works in 2026",
    metaTitle: "Digital SHSAT 2026: Format, Timing & How to Prepare",
    description:
      "The SHSAT is now computer-based. Learn the digital SHSAT format: ELA and Math, 50 questions each, 180 minutes, DOE computers, and official practice tools.",
    cardDescription: "The computer-based format, section structure, timing, and the official tools students should practice with.",
    datePublished: PUBLISHED,
    intro: [
      "The SHSAT is no longer a paper-and-pencil test. Students now take it on a computer, which changes how they read passages, work math problems, and manage their time. The content is still middle-school English and Math, but practicing in the right format has become part of good SHSAT preparation.",
      `This guide covers what NYC Public Schools has published about the digital SHSAT. For the most current details, read the official guide on the [NYC SHSAT Portal](${NYC_SHSAT_PORTAL_URL}).`,
    ],
    sections: [
      {
        heading: "The digital SHSAT at a glance",
        body: [],
        list: [
          "The test is computer-based and taken on DOE-provided computers at the testing site.",
          "There are two sections: English Language Arts (ELA) and Mathematics.",
          "Each section has 50 questions.",
          "Standard testing time is 180 minutes for the full test.",
          "Students can choose which section to begin with.",
        ],
      },
      {
        heading: "The two sections",
        body: [],
        subsections: [
          {
            heading: "English Language Arts",
            body: [
              "The ELA section measures how well students read and revise written English. Expect questions on grammar, sentence structure, and the organization of short texts, along with reading comprehension questions based on informational and literary passages. On a screen, students scroll through passages instead of flipping pages, which makes active reading habits more important.",
            ],
          },
          {
            heading: "Mathematics",
            body: [
              `The Math section draws on middle-school content such as ratios, percents, algebra, geometry, and data. Many questions require several steps. Our guide to [SHSAT Math topics](/resources/shsat-math-topics) breaks down what to review.`,
            ],
          },
        ],
      },
      {
        heading: "Timing and section order",
        body: [
          "Students have 180 minutes of standard testing time for both sections together. Because they can choose which section to start with, they also decide how to divide their time. That flexibility helps students who plan ahead and can hurt students who drift.",
          "A practical approach is to decide on a section order and a rough time split before test day, then practice that plan on full-length tests. Some students prefer to start with their stronger section to build momentum; others start with the section that requires more energy. Either can work if the student has rehearsed it.",
        ],
        subsections: [
          {
            heading: "Extended time and accommodations",
            body: [
              `Students with approved testing accommodations may receive extended time and other supports. For example, eligible English Language Learners receive extended testing time and translated directions. Details are listed on the [NYC Public Schools Specialized High Schools page](${NYCPS_SHSAT_URL}), and approved accommodations appear on the student's test ticket.`,
            ],
          },
        ],
      },
      {
        heading: "What changes when the test is on a computer",
        body: ["The skills being tested are the same, but the experience is different. Students should be ready for:"],
        list: [
          "Reading long passages on a screen and keeping track of where key details appear.",
          "Working math problems on scratch paper and then entering answers on the computer.",
          "Navigating between questions and using on-screen tools to mark questions to revisit.",
          "Watching an on-screen timer and pacing without a paper booklet to flip through.",
        ],
      },
      {
        heading: "Official practice resources",
        body: [
          `NYC Public Schools provides digital sample tests and preparation resources, including a Student Readiness Tool, on the [NYC SHSAT Portal](${NYC_SHSAT_PORTAL_URL}). The Student Readiness Tool lets students practice using the testing platform itself, and the sample tests show the real question formats.`,
          "Use these official materials as benchmarks. Because the number of official sample tests is limited, save them for checkpoints rather than everyday drilling.",
        ],
      },
      {
        heading: "How to prepare for the digital format",
        body: [],
        list: [
          "Complete the Student Readiness Tool early so the interface is familiar.",
          "Practice reading passages on a computer screen, not only on paper.",
          "Take full-length practice tests in one sitting with a 180-minute timer.",
          "Settle on a section order and time split, and use it consistently.",
          `Review every practice test carefully. Our guide on [how to use SHSAT practice tests](/resources/how-to-use-shsat-practice-tests) explains a review routine that works.`,
        ],
      },
      {
        heading: "Getting support",
        body: [
          `At AhmedPrep in Astoria, Queens, our [SHSAT prep program](/shsat) builds content skills and test-day habits together, including timed practice in the digital format. If you are not sure where your child stands, a [free SHSAT diagnostic](/free-diagnostic) is a low-pressure way to find out.`,
        ],
      },
    ],
  },
  {
    slug: "shsat-math-topics",
    category: "SHSAT",
    topic: "SHSAT Math",
    featured: true,
    title: "SHSAT Math Topics to Master Before Test Day",
    cardTitle: "SHSAT Math topics to master before test day",
    metaTitle: "SHSAT Math Topics to Master: A Review Checklist",
    description:
      "A clear checklist of SHSAT Math topics, from ratios and percents to algebra, geometry, and probability, plus the mistakes that cost students points.",
    cardDescription: "Number sense, algebra, geometry, and data topics to review, with the habits that prevent careless errors.",
    datePublished: PUBLISHED,
    intro: [
      "SHSAT Math rarely asks anything a strong middle-school student has never seen. What makes it hard is that questions combine several ideas, reward careful reading, and must be answered accurately under time pressure. The goal of review is to make the core topics automatic so students can spend their thinking on the problem itself.",
      `The official SHSAT guide on the [NYC SHSAT Portal](${NYC_SHSAT_PORTAL_URL}) is the authoritative source for what can appear on the test. The topics below reflect the middle-school math that SHSAT questions commonly draw on.`,
    ],
    sections: [
      {
        heading: "Number sense and operations",
        body: ["Most SHSAT Math questions depend on fast, accurate work with numbers. Students should be comfortable with:"],
        list: [
          "Fractions, decimals, and percents, and converting between them.",
          "Order of operations, including negative numbers and exponents.",
          "Factors, multiples, prime factorization, greatest common factor, and least common multiple.",
          "Divisibility rules and remainders.",
          "Scientific notation and square roots.",
        ],
      },
      {
        heading: "Ratios, rates, and percents",
        body: [
          "Ratio and percent reasoning shows up in many forms, often inside word problems. Students who can set up a ratio table or a proportion quickly have a real advantage.",
        ],
        subsections: [
          {
            heading: "What to practice",
            body: [],
            list: [
              "Part-to-part and part-to-whole ratios.",
              "Unit rates, speed, and work problems.",
              "Percent increase and decrease, including successive discounts.",
              "Simple interest, tax, tip, and markup.",
              "Scale drawings and unit conversions.",
            ],
          },
          {
            heading: "A common trap",
            body: [
              "A price that rises 20% and then falls 20% does not return to the original price. The second change is applied to a different amount. Students who multiply by 1.20 and then by 0.80 see the final price is 96% of the original.",
            ],
          },
        ],
      },
      {
        heading: "Expressions, equations, and inequalities",
        body: [],
        list: [
          "Combining like terms and using the distributive property.",
          "Solving one-step, two-step, and multi-step linear equations.",
          "Solving and graphing inequalities, including flipping the sign when multiplying or dividing by a negative.",
          "Writing equations from word problems.",
          "Slope, linear relationships, and reading graphs of lines.",
          "Simple systems of equations.",
        ],
      },
      {
        heading: "Geometry and measurement",
        body: ["Geometry questions often involve a figure and require more than one formula."],
        list: [
          "Angle relationships: supplementary, complementary, vertical angles, and angles formed by parallel lines.",
          "Triangle angle sums and properties of isosceles and equilateral triangles.",
          "The Pythagorean theorem and common right-triangle side lengths.",
          "Area and perimeter of triangles, rectangles, trapezoids, circles, and composite shapes.",
          "Volume and surface area of rectangular prisms, cylinders, and other solids.",
          "The coordinate plane, distance, and transformations.",
        ],
      },
      {
        heading: "Probability, statistics, and data",
        body: [],
        list: [
          "Mean, median, mode, and range, including how a new data point changes them.",
          "Probability of single and combined events.",
          "Counting principles and organized lists.",
          "Reading tables, bar graphs, line graphs, and other data displays.",
        ],
      },
      {
        heading: "Word problems and multi-step reasoning",
        body: [
          "Word problems pull all of these topics together. The most reliable approach is to slow down at the start: identify exactly what the question asks, write down the given information, and only then begin calculating. Many wrong answers on SHSAT Math are correct answers to a different question.",
        ],
      },
      {
        heading: "Habits that protect SHSAT Math points",
        body: [],
        list: [
          "Write each step on scratch paper instead of relying on mental math.",
          "Underline or note what the question is asking before solving.",
          "Estimate first so an unreasonable answer stands out.",
          "Plug answers back into the original problem when time allows.",
          "Skip a problem that stalls you and return to it later.",
          "Keep an error log and review it every week.",
        ],
      },
      {
        heading: "How to build a Math review plan",
        body: [
          `Start by finding the gaps. A timed diagnostic shows which topics need rebuilding and which only need practice. AhmedPrep offers a [free SHSAT diagnostic](/free-diagnostic) at our Astoria location, and our [free Sunday SHSAT class](/free-shsat-class) works through SHSAT Math and ELA problems live each week.`,
          `For a broader view of how the test is structured, see [how the digital SHSAT works](/resources/digital-shsat-2026).`,
        ],
      },
    ],
  },
  {
    slug: "how-to-use-shsat-practice-tests",
    category: "SHSAT",
    topic: "Practice Strategy",
    featured: true,
    title: "How to Use SHSAT Practice Tests Effectively",
    cardTitle: "How to use SHSAT practice tests effectively",
    metaTitle: "How to Use SHSAT Practice Tests Effectively",
    description:
      "Taking more SHSAT practice tests is not the same as improving. Learn when to test, how to simulate test day, and a review routine that raises scores.",
    cardDescription: "When to take full-length tests, how to simulate the digital SHSAT, and a review routine that turns mistakes into points.",
    datePublished: PUBLISHED,
    intro: [
      "SHSAT practice tests are one of the most valuable preparation tools available, and one of the most misused. A practice test only measures where a student is. Improvement comes from what the student does in the hours after the test, not from the test itself.",
      "This guide explains how to plan practice tests across your preparation, how to take them in realistic conditions, and how to review them so each one leads to a measurable change.",
    ],
    sections: [
      {
        heading: "Start with official SHSAT practice tests",
        body: [
          `NYC Public Schools publishes digital sample tests and a Student Readiness Tool on the [NYC SHSAT Portal](${NYC_SHSAT_PORTAL_URL}). These are the closest match to the real test in content and format, so they are the best benchmarks.`,
          "Because there are only a few official tests, plan where each one goes: one near the start of preparation, one in the middle, and one or two in the final weeks. Use other high-quality practice material for skill building in between.",
        ],
      },
      {
        heading: "Simulate test day",
        body: ["A practice test only tells you something useful when it is taken under real conditions."],
        list: [
          "Take the full test in one sitting with a 180-minute limit.",
          "Practice on a computer whenever possible, since the real SHSAT is digital.",
          "Use only scratch paper and pencils: no phone, notes, or help.",
          "Choose a section order and time split ahead of time, just as on test day.",
          "Pick a quiet space and a start time similar to the real test.",
        ],
      },
      {
        heading: "Review matters more than the score",
        body: [
          "Plan to spend at least as long reviewing a practice test as taking it. Review every question the student missed, and every question they guessed on, even if the guess was correct.",
        ],
        subsections: [
          {
            heading: "Sort every error",
            body: ["For each missed or guessed question, the student should decide why it went wrong:"],
            list: [
              "Content gap: did not know the concept or rule.",
              "Careless error: misread the question or made an arithmetic slip.",
              "Timing: ran out of time or rushed.",
              "Strategy: spent too long on one question or did not eliminate choices.",
            ],
          },
          {
            heading: "Fix the cause, not just the question",
            body: [
              "Each error type has a different fix. Content gaps need instruction and targeted practice. Careless errors need habits, such as rereading the question or writing every step. Timing problems need pacing practice. Writing the correct answer next to a wrong one, without understanding why, rarely changes anything.",
            ],
          },
        ],
      },
      {
        heading: "How often to take a full-length test",
        body: [
          "Early in preparation, a full-length SHSAT practice test every few weeks is plenty. Most time should go to learning content and practicing specific question types. As test day approaches, a weekly full-length test helps build stamina and lock in pacing.",
          "Taking tests back to back without review is the most common way students plateau. If there is no time to review a test, it is usually better to skip it and do targeted practice instead.",
        ],
      },
      {
        heading: "Track progress across tests",
        body: ["Keep a simple log after every full-length test. Patterns across several tests are far more informative than any single result."],
        list: [
          "Number correct in ELA and in Math.",
          "Time remaining, or how many questions were rushed at the end.",
          "The top three error types from that test.",
          "One specific change to try on the next test.",
        ],
      },
      {
        heading: "How parents can help",
        body: [
          "Parents do not need to know the content to support practice tests. Helpful roles include protecting the time for a full sitting, keeping the testing space quiet, and asking about the review afterward. A question like \"What is one thing you will do differently next time?\" is often more useful than asking about the score.",
        ],
      },
      {
        heading: "Getting expert feedback",
        body: [
          `Many students benefit from someone else reviewing their tests with them, because patterns are easier to see from the outside. At AhmedPrep in Astoria, Queens, our [SHSAT prep program](/shsat) includes timed practice exams with detailed review, and our [free SHSAT diagnostic](/free-diagnostic) gives families a clear starting point.`,
          `If you are preparing for the 2026 test, see our guide to [SHSAT Math topics](/resources/shsat-math-topics) for a review checklist.`,
        ],
      },
    ],
  },
  {
    slug: "shsat-prep-queens-when-to-start",
    category: "SHSAT",
    topic: "Queens Families",
    featured: true,
    title: "SHSAT Prep in Queens: When Should Students Start?",
    cardTitle: "SHSAT prep in Queens: when should students start?",
    metaTitle: "SHSAT Prep in Queens: When Should Students Start?",
    description:
      "When should Queens students start SHSAT prep: 6th grade, 7th grade, or 8th grade? A practical timeline for families in Astoria and across NYC.",
    cardDescription: "A grade-by-grade timeline for SHSAT preparation, and how to decide what is right for your child.",
    datePublished: PUBLISHED,
    intro: [
      "Queens families often ask when SHSAT prep should begin. There is no single right answer: the best start date depends on where your child is today, not on what a neighbor's child did. What matters is leaving enough time to close gaps before building speed.",
      "Below is a practical timeline, along with the questions that help families decide. AhmedPrep is based in Astoria, Queens, and works with students from across NYC, so this guide reflects the questions we hear most from local parents.",
    ],
    sections: [
      {
        heading: "The short answer",
        body: [
          "Most students benefit from starting focused SHSAT preparation somewhere between the spring of 7th grade and the summer before 8th grade. Students with strong math and reading skills may need less time. Students with gaps in fractions, ratios, algebra, or reading stamina usually benefit from starting earlier.",
          `The most reliable way to decide is a timed diagnostic. A [free SHSAT diagnostic](/free-diagnostic) shows where your child stands and how much ground there is to cover.`,
        ],
      },
      {
        heading: "A grade-by-grade timeline",
        body: [],
        subsections: [
          {
            heading: "6th grade: build the foundation",
            body: [
              "Formal test prep is usually not necessary yet. The best preparation in 6th grade is strong schoolwork, daily reading of challenging books and articles, and solid number sense. Students who are curious about the SHSAT can try a few practice problems to see what the test looks like.",
            ],
          },
          {
            heading: "7th grade: learn the test",
            body: [
              "7th grade is a good time to learn the SHSAT format, take a first diagnostic, and start closing content gaps. Many students begin structured SHSAT preparation in the spring of 7th grade, which leaves time for steady progress without burnout.",
            ],
          },
          {
            heading: "Summer before 8th grade: focused preparation",
            body: [
              "For many families, the summer is the most productive stretch. Without daily homework, students can work consistently on SHSAT Math and ELA and begin taking full-length practice tests.",
            ],
          },
          {
            heading: "Fall of 8th grade: final preparation",
            body: [
              `Registration opens in October, and the test follows in November. This period is for full-length practice tests, pacing, and targeted review. Students who start in the fall can still improve with a focused plan, such as our [2026 SHSAT Final 5-Week Intensive](/shsat-final-intensive-2026).`,
            ],
          },
          {
            heading: "9th grade: a second opportunity",
            body: [
              "First-time 9th graders can also take the SHSAT. Students who did not test in 8th grade, or who want another path into the Specialized High Schools, should plan their preparation over the summer and fall of 9th grade.",
            ],
          },
        ],
      },
      {
        heading: "Signs your child may need to start earlier",
        body: [],
        list: [
          "Fractions, percents, or negative numbers still cause hesitation.",
          "Word problems are harder than straightforward calculations.",
          "Your child reads slowly or avoids longer nonfiction.",
          "Grammar and punctuation are not yet consistent in schoolwork.",
          "Your child loses focus during long assignments or tests.",
        ],
      },
      {
        heading: "Planning around the Queens school calendar",
        body: [
          `Families in Queens are balancing SHSAT preparation with schoolwork, state tests, activities, and commutes. A realistic weekly routine that a student can sustain is worth more than an ambitious plan that falls apart by October. Confirm the current year's registration and test dates on the [official NYC Public Schools page](https://www.schools.nyc.gov/enrollment/enroll-grade-by-grade/specialized-high-schools), and see our [2026 SHSAT dates guide](/resources/2026-shsat-dates-registration-deadline) for this year's calendar.`,
          "Queens High School for the Sciences at York College is one of the eight testing NYC Specialized High Schools, and Queens students can rank any of the eight during registration.",
        ],
      },
      {
        heading: "What good SHSAT prep in Queens should include",
        body: ["Whether you choose a class, a tutor, or independent study, strong SHSAT preparation usually includes:"],
        list: [
          "A diagnostic at the start and regular progress checks.",
          "Instruction that rebuilds weak content areas before drilling speed.",
          "Targeted practice in both SHSAT Math and ELA.",
          "Full-length, timed practice in the digital format.",
          "Clear communication with parents about progress.",
        ],
      },
      {
        heading: "SHSAT prep in Astoria",
        body: [
          `AhmedPrep offers [SHSAT prep in Astoria](/shsat) for students across Queens and NYC. Families who want to see our teaching before committing can attend the [free Sunday SHSAT class](/free-shsat-class), and more guides are available in our [SHSAT resources](/resources).`,
        ],
      },
    ],
  },
]

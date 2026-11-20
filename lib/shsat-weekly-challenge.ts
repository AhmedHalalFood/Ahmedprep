export type SHSATChallengeQuestion = {
  id: string
  area: "Math" | "ELA"
  topic: string
  passage?: string
  question: string
  choices: [string, string, string, string]
  correctIndex: number
  explanation: string[]
  strategy: string
}

export type SHSATChallengeSet = {
  publishedDate: string
  questions: SHSATChallengeQuestion[]
}

/** Original AhmedPrep practice, not official NYCPS questions.
 * Release dates are Mondays in America/New_York. Add a new approved set before each next Monday.
 * Never silently recycle previously used questions.
 */
export const SHSAT_CHALLENGE_SETS: SHSATChallengeSet[] = [
  {
    "publishedDate": "2026-11-16",
    "questions": [
      {
        "id": "SHSAT-W20261116-01",
        "area": "Math",
        "topic": "Successive percentage changes",
        "question": "A jacket costs $250. A store reduces its price by 20%, then offers an additional 10% discount on the reduced price. Sales tax of 8% is applied after both discounts. What is the final cost?",
        "choices": [
          "$180.00",
          "$194.40",
          "$198.00",
          "$216.00"
        ],
        "correctIndex": 1,
        "explanation": [
          "First discount: $250 × 0.80 = $200. The additional discount applies to $200, giving $200 × 0.90 = $180.",
          "Tax is charged on $180: $180 × 1.08 = $194.40. The discounts cannot be added together as 30% of the original price."
        ],
        "strategy": "Apply each percentage change to the new amount, in sequence."
      },
      {
        "id": "SHSAT-W20261116-02",
        "area": "Math",
        "topic": "Ratios and equations",
        "question": "The ratio of boys to girls in a club is 2:3. After 8 boys join and 3 girls leave, the ratio becomes 4:3. How many students were originally in the club?",
        "choices": [
          "24",
          "30",
          "36",
          "42"
        ],
        "correctIndex": 1,
        "explanation": [
          "Let the original numbers be 2k boys and 3k girls. Then (2k + 8)/(3k − 3) = 4/3.",
          "Cross-multiply: 3(2k + 8) = 4(3k − 3), so 6k + 24 = 12k − 12. Therefore k = 6.",
          "The original club had 2k + 3k = 5k = 30 students. Check: 12 boys and 18 girls become 20 and 15, a 4:3 ratio."
        ],
        "strategy": "Express both groups in terms of one scale factor and check the new ratio."
      },
      {
        "id": "SHSAT-W20261116-03",
        "area": "Math",
        "topic": "Geometry and algebra",
        "question": "A rectangle has a perimeter of 34 units and a diagonal of 13 units. What is its area, in square units?",
        "choices": [
          "48",
          "60",
          "65",
          "72"
        ],
        "correctIndex": 1,
        "explanation": [
          "Let the side lengths be a and b. Since 2(a + b) = 34, a + b = 17. The diagonal gives a² + b² = 13² = 169.",
          "Use (a + b)² = a² + b² + 2ab: 289 = 169 + 2ab. Thus 2ab = 120 and the area ab is 60 square units."
        ],
        "strategy": "Combine the perimeter and the Pythagorean theorem with a useful algebraic identity."
      },
      {
        "id": "SHSAT-W20261116-04",
        "area": "Math",
        "topic": "Remainders and divisibility",
        "question": "What is the smallest positive integer that is divisible by 4, leaves a remainder of 2 when divided by 5, and leaves a remainder of 3 when divided by 7?",
        "choices": [
          "32",
          "42",
          "52",
          "72"
        ],
        "correctIndex": 2,
        "explanation": [
          "Numbers leaving remainder 2 upon division by 5 are 2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, ...",
          "Among those divisible by 4, check 12, 32, and 52 in increasing order. Their remainders when divided by 7 are 5, 4, and 3 respectively.",
          "Therefore the smallest number satisfying all conditions is 52."
        ],
        "strategy": "Start with one divisibility requirement, then test candidates in ascending order."
      },
      {
        "id": "SHSAT-W20261116-05",
        "area": "Math",
        "topic": "Probability without replacement",
        "question": "A bag contains 4 red marbles, 5 blue marbles, and 3 green marbles. Two marbles are drawn at random without replacement. What is the probability they have the same color?",
        "choices": [
          "3/11",
          "19/66",
          "5/18",
          "5/22"
        ],
        "correctIndex": 1,
        "explanation": [
          "There are 12 marbles and C(12, 2) = 66 equally likely unordered pairs.",
          "Matching-color pairs: C(4, 2) = 6 red, C(5, 2) = 10 blue, and C(3, 2) = 3 green, giving 19 favorable pairs.",
          "Therefore the probability is 19/66."
        ],
        "strategy": "Count favorable unordered pairs and divide by all unordered pairs; avoid replacing the first marble."
      },
      {
        "id": "SHSAT-W20261116-06",
        "area": "ELA",
        "topic": "Reading comprehension: central claim",
        "passage": "When the city proposed restoring the narrow tidal creek, some residents dismissed the plan as cosmetic. Its banks had been lined with concrete for decades, and the water rarely looked inviting. Yet the engineers argued that restoring marsh plants would do more than improve the view. Their roots could hold sediment in place, and shallow pools could slow rainwater before it reached streets downstream. The first winter after planting brought several heavy storms. Flooding did not disappear, but water receded more quickly in nearby blocks than it had in previous years. Researchers cautioned that a single season could not prove lasting success. Still, the modest improvement persuaded several skeptical neighbors to volunteer for the next planting.",
        "question": "Which statement best expresses the passage’s central claim?",
        "choices": [
          "Planting marsh vegetation may provide practical flood-control benefits, although longer study is needed.",
          "Concrete-lined creeks are the main cause of every urban flood.",
          "The restoration project succeeded chiefly because the creek became more attractive.",
          "The first winter proved that the restored creek permanently eliminated flooding."
        ],
        "correctIndex": 0,
        "explanation": [
          "The passage connects marsh roots and shallow pools to flood reduction, reports encouraging results, and explicitly cautions that one winter cannot establish lasting success.",
          "The other choices exaggerate the evidence, ignore the stated practical benefits, or claim complete success that the passage rejects."
        ],
        "strategy": "Select the claim that captures both the evidence and the author’s qualification."
      },
      {
        "id": "SHSAT-W20261116-07",
        "area": "ELA",
        "topic": "Reading comprehension: evidence",
        "passage": "When the city proposed restoring the narrow tidal creek, some residents dismissed the plan as cosmetic. Its banks had been lined with concrete for decades, and the water rarely looked inviting. Yet the engineers argued that restoring marsh plants would do more than improve the view. Their roots could hold sediment in place, and shallow pools could slow rainwater before it reached streets downstream. The first winter after planting brought several heavy storms. Flooding did not disappear, but water receded more quickly in nearby blocks than it had in previous years. Researchers cautioned that a single season could not prove lasting success. Still, the modest improvement persuaded several skeptical neighbors to volunteer for the next planting.",
        "question": "Which detail most directly supports the engineers’ prediction about downstream effects?",
        "choices": [
          "The creek had been lined with concrete for decades.",
          "The water rarely looked inviting.",
          "Water receded more quickly in nearby blocks after the storms.",
          "Several neighbors volunteered for another planting."
        ],
        "correctIndex": 2,
        "explanation": [
          "The engineers predicted slower runoff and less severe downstream effects. Faster water recession in nearby blocks directly addresses that predicted outcome.",
          "The other details provide background, aesthetic context, or a reaction to the project, but they do not directly measure stormwater behavior."
        ],
        "strategy": "Match evidence to the exact prediction or claim being tested."
      },
      {
        "id": "SHSAT-W20261116-08",
        "area": "ELA",
        "topic": "Reading comprehension: author’s purpose",
        "passage": "When the city proposed restoring the narrow tidal creek, some residents dismissed the plan as cosmetic. Its banks had been lined with concrete for decades, and the water rarely looked inviting. Yet the engineers argued that restoring marsh plants would do more than improve the view. Their roots could hold sediment in place, and shallow pools could slow rainwater before it reached streets downstream. The first winter after planting brought several heavy storms. Flooding did not disappear, but water receded more quickly in nearby blocks than it had in previous years. Researchers cautioned that a single season could not prove lasting success. Still, the modest improvement persuaded several skeptical neighbors to volunteer for the next planting.",
        "question": "Why does the author include the researchers’ caution that one season cannot prove lasting success?",
        "choices": [
          "To imply that volunteers did more harm than good.",
          "To qualify an encouraging result without dismissing it.",
          "To show that the engineers abandoned the restoration plan.",
          "To establish that the storms were unusually weak."
        ],
        "correctIndex": 1,
        "explanation": [
          "The caution limits how strongly readers should interpret a single season of data while leaving the positive observation intact.",
          "It does not accuse volunteers, describe abandoning the plan, or characterize the storms as weak."
        ],
        "strategy": "Ask how a sentence changes the strength, scope, or certainty of the preceding claim."
      },
      {
        "id": "SHSAT-W20261116-09",
        "area": "ELA",
        "topic": "Revising and editing: parallel structure",
        "question": "Which revision best corrects the sentence? “The committee’s plan is to reduce traffic, improving safety, and that public spaces will be expanded.”",
        "choices": [
          "The committee’s plan is to reduce traffic, improving safety, and expand public spaces.",
          "The committee’s plan is reducing traffic, to improve safety, and public spaces will expand.",
          "The committee’s plan is to reduce traffic, improve safety, and expand public spaces.",
          "The committee’s plan is to reduce traffic, safety improvement, and expanding public spaces."
        ],
        "correctIndex": 2,
        "explanation": [
          "Each item should have the same grammatical structure after “plan is”: to reduce, (to) improve, and (to) expand. The repeated “to” may be omitted after the first verb.",
          "Only the third choice makes the three actions parallel and maintains a clear shared meaning."
        ],
        "strategy": "Identify the common introductory phrase, then make every item in the series fit it."
      },
      {
        "id": "SHSAT-W20261116-10",
        "area": "ELA",
        "topic": "Revising and editing: logical transitions",
        "question": "Choose the transition that best completes the paragraph: “The museum digitized thousands of fragile maps so researchers could examine them remotely. ______, staff members continued to preserve the paper originals in climate-controlled storage, since the digital copies could not replace the historical artifacts.”",
        "choices": [
          "For example",
          "As a result",
          "Nevertheless",
          "Similarly"
        ],
        "correctIndex": 2,
        "explanation": [
          "The second sentence contrasts increased digital access with the continuing need to protect originals. “Nevertheless” introduces that contrasting continuation.",
          "“For example” would promise an illustration, “as a result” would suggest direct causation, and “similarly” would suggest matching actions."
        ],
        "strategy": "Determine whether the second sentence contrasts, explains, exemplifies, or results from the first."
      }
    ]
  },
  {
    "publishedDate": "2026-11-23",
    "questions": [
      {
        "id": "SHSAT-W20261123-01",
        "area": "Math",
        "topic": "Combined work rates",
        "question": "One pump can fill a tank in 6 hours; a second pump can fill the same tank in 9 hours. If both pumps work together at constant rates, how many hours will they take to fill the empty tank?",
        "choices": [
          "3 hours",
          "3 3/5 hours",
          "4 hours",
          "5 hours"
        ],
        "correctIndex": 1,
        "explanation": [
          "The first pump fills 1/6 of the tank per hour and the second fills 1/9.",
          "Their combined rate is 1/6 + 1/9 = 5/18 of the tank per hour. The time for one whole tank is 1 ÷ (5/18) = 18/5 hours = 3 3/5 hours."
        ],
        "strategy": "Add rates, then take the reciprocal to find time."
      },
      {
        "id": "SHSAT-W20261123-02",
        "area": "Math",
        "topic": "Conditional probability",
        "question": "Two fair six-sided dice are rolled. Given that their sum is 8, what is the probability that at least one die shows 3?",
        "choices": [
          "1/5",
          "2/5",
          "1/3",
          "1/2"
        ],
        "correctIndex": 1,
        "explanation": [
          "Once the sum is known to be 8, the equally likely ordered outcomes are (2,6), (3,5), (4,4), (5,3), and (6,2).",
          "Exactly two of these five outcomes contain a 3, so the conditional probability is 2/5."
        ],
        "strategy": "Restrict the sample space to outcomes satisfying the given condition before counting favorable outcomes."
      },
      {
        "id": "SHSAT-W20261123-03",
        "area": "Math",
        "topic": "Geometry: composite areas",
        "question": "A circle is inscribed inside a square with side length 10 units. What is the area inside the square but outside the circle?",
        "choices": [
          "100 − 10π",
          "100 − 25π",
          "25π − 100",
          "100 − 50π"
        ],
        "correctIndex": 1,
        "explanation": [
          "An inscribed circle touches all four sides, so its diameter is the side length, 10; therefore its radius is 5.",
          "The square has area 10² = 100 and the circle has area π(5²) = 25π. The required region has area 100 − 25π square units."
        ],
        "strategy": "Draw the shapes and identify which area is being subtracted."
      },
      {
        "id": "SHSAT-W20261123-04",
        "area": "Math",
        "topic": "Consecutive integers",
        "question": "Three consecutive positive even integers are arranged from least to greatest. The product of the least and greatest is 192. What is the middle integer?",
        "choices": [
          "12",
          "14",
          "16",
          "18"
        ],
        "correctIndex": 1,
        "explanation": [
          "Let the integers be x, x + 2, x + 4. Then x(x + 4) = 192.",
          "The positive factors 12 and 16 are four apart and multiply to 192, so x = 12. The middle integer is 14.",
          "Check: 12 × 16 = 192, and the consecutive even integers are 12, 14, 16."
        ],
        "strategy": "Exploit the fixed difference between the least and greatest values."
      },
      {
        "id": "SHSAT-W20261123-05",
        "area": "Math",
        "topic": "Systems of equations",
        "question": "At a book fair, 5 books and 3 notebooks cost $82. At the same prices, 3 books and 5 notebooks cost $78. What is the cost of 2 books and 1 notebook?",
        "choices": [
          "$29",
          "$31",
          "$33",
          "$35"
        ],
        "correctIndex": 1,
        "explanation": [
          "Let b be the price of one book and n the price of one notebook. We have 5b + 3n = 82 and 3b + 5n = 78.",
          "Subtract the second equation from the first: 2b − 2n = 4, so b − n = 2. Thus b = n + 2.",
          "Substitute: 5(n + 2) + 3n = 82, giving 8n = 72 and n = 9; therefore b = 11. The requested cost is 2(11) + 9 = $31."
        ],
        "strategy": "Subtract equations when their coefficients differ by the same amount."
      },
      {
        "id": "SHSAT-W20261123-06",
        "area": "ELA",
        "topic": "Reading comprehension: inference",
        "passage": "The archivist had expected the old harbor charts to settle a disagreement about when the lighthouse was built. Instead, the earliest chart showed only an empty point of land. On a later chart, a tiny square appeared beside the notation “signal station.” The team initially assumed the square represented the lighthouse, until another researcher found a shipping ledger describing a temporary wooden platform erected there years before the stone tower. The charts were not useless; they had simply recorded a more complicated sequence than anyone had anticipated. Rather than announce a precise construction year, the archivist presented the documents together and explained which conclusions remained uncertain.",
        "question": "Which inference about the archivist is best supported by the passage?",
        "choices": [
          "The archivist values a conclusion that acknowledges uncertainty over an unsupported exact date.",
          "The archivist believes the earliest harbor chart was deliberately falsified.",
          "The archivist considers all written records less useful than maps.",
          "The archivist is unwilling to revise the team’s first interpretation."
        ],
        "correctIndex": 0,
        "explanation": [
          "The archivist declines to announce an exact date and instead explains what the combined evidence does and does not establish.",
          "The passage gives no evidence of falsification or distrust of written sources, and it explicitly shows the initial interpretation being revised."
        ],
        "strategy": "Distinguish what a character demonstrably does from motives or claims the passage never establishes."
      },
      {
        "id": "SHSAT-W20261123-07",
        "area": "ELA",
        "topic": "Reading comprehension: vocabulary in context",
        "passage": "The archivist had expected the old harbor charts to settle a disagreement about when the lighthouse was built. Instead, the earliest chart showed only an empty point of land. On a later chart, a tiny square appeared beside the notation “signal station.” The team initially assumed the square represented the lighthouse, until another researcher found a shipping ledger describing a temporary wooden platform erected there years before the stone tower. The charts were not useless; they had simply recorded a more complicated sequence than anyone had anticipated. Rather than announce a precise construction year, the archivist presented the documents together and explained which conclusions remained uncertain.",
        "question": "In the context of the passage, “settle” most nearly means",
        "choices": [
          "finance",
          "resolve",
          "occupy",
          "construct"
        ],
        "correctIndex": 1,
        "explanation": [
          "The archivist hoped the charts would resolve the dispute about the construction date. In this context, “settle a disagreement” means bring it to a conclusion.",
          "The other meanings of “settle” or associated verbs do not fit the phrase “settle a disagreement.”"
        ],
        "strategy": "Replace the word with each choice and reread the whole phrase, not the isolated word."
      },
      {
        "id": "SHSAT-W20261123-08",
        "area": "ELA",
        "topic": "Reading comprehension: function of a detail",
        "passage": "The archivist had expected the old harbor charts to settle a disagreement about when the lighthouse was built. Instead, the earliest chart showed only an empty point of land. On a later chart, a tiny square appeared beside the notation “signal station.” The team initially assumed the square represented the lighthouse, until another researcher found a shipping ledger describing a temporary wooden platform erected there years before the stone tower. The charts were not useless; they had simply recorded a more complicated sequence than anyone had anticipated. Rather than announce a precise construction year, the archivist presented the documents together and explained which conclusions remained uncertain.",
        "question": "What is the main function of the shipping ledger in the passage?",
        "choices": [
          "It confirms that the lighthouse was constructed on an empty point of land.",
          "It proves that every harbor chart was drawn after the stone tower was built.",
          "It introduces evidence that challenges the team’s first interpretation of a map symbol.",
          "It demonstrates that merchants stopped using the harbor before the lighthouse existed."
        ],
        "correctIndex": 2,
        "explanation": [
          "The ledger describes a wooden platform predating the stone lighthouse, so it challenges the assumption that the earlier map square had to represent the lighthouse.",
          "It does not establish that all charts postdate the tower, prove a construction site was empty at that time, or discuss the end of harbor trade."
        ],
        "strategy": "Track how a piece of evidence changes the interpretation of earlier information."
      },
      {
        "id": "SHSAT-W20261123-09",
        "area": "ELA",
        "topic": "Revising and editing: sentence boundaries",
        "question": "Which sentence uses punctuation correctly to join two independent clauses?",
        "choices": [
          "The experiment seemed successful, however the researchers repeated it.",
          "The experiment seemed successful; however, the researchers repeated it.",
          "The experiment seemed successful however; the researchers repeated it.",
          "The experiment seemed successful, however; the researchers repeated it."
        ],
        "correctIndex": 1,
        "explanation": [
          "“The experiment seemed successful” and “the researchers repeated it” are independent clauses. A semicolon can join them, and the conjunctive adverb “however” is followed by a comma.",
          "A comma alone before “however” creates a comma splice, and placing the semicolon after “however” does not correctly separate the independent clauses."
        ],
        "strategy": "When “however” links two full sentences, check for a semicolon before it and a comma after it."
      },
      {
        "id": "SHSAT-W20261123-10",
        "area": "ELA",
        "topic": "Revising and editing: sentence placement",
        "passage": "(1) The neighborhood library began lending out seed packets in early spring. (2) Residents could borrow vegetable or flower seeds without paying a fee. (3) At the end of the growing season, participants were encouraged to collect seeds from healthy plants and return some to the library. (4) By the following spring, several varieties had become available because local gardeners had contributed them.",
        "question": "Where should the sentence “In this way, the program could replenish its supply without purchasing every new packet.” be inserted to create the clearest progression?",
        "choices": [
          "Before sentence 1",
          "After sentence 1",
          "After sentence 3",
          "After sentence 4"
        ],
        "correctIndex": 2,
        "explanation": [
          "Sentence 3 explains how participants return seeds; the proposed sentence describes the resulting benefit to the library’s supply. Placing it immediately after sentence 3 keeps cause and effect together.",
          "Sentence 4 then provides a concrete later outcome. Earlier positions would introduce replenishment before explaining the return process."
        ],
        "strategy": "Find the sentence that supplies the cause or process referenced by “In this way.”"
      }
    ]
  }
]

export function currentSHSATChallenge(today: string): SHSATChallengeSet | undefined {
  return SHSAT_CHALLENGE_SETS.filter((s) => s.publishedDate <= today).sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))[0]
}

"use client"

import { useRef, useState } from "react"
import { ArrowUpRight, Check, X } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { FREE_CLASS } from "@/lib/free-class"

type Question = {
  id: string
  area: "Math" | "ELA" | "Test habits"
  prompt: string
  options: string[]
  /** Index of the correct option, or per-option habit points (0–2) for habit questions. */
  answer: number | number[]
  explain: string
}

const QUESTIONS: Question[] = [
  { id: "m1", area: "Math", prompt: "What is 3/4 of 48?", options: ["32", "36", "38", "64"], answer: 1, explain: "48 ÷ 4 = 12, and 12 × 3 = 36." },
  { id: "m2", area: "Math", prompt: "If 2x + 7 = 23, what is x?", options: ["6", "8", "15", "16"], answer: 1, explain: "Subtract 7 to get 2x = 16, then divide by 2." },
  {
    id: "m3",
    area: "Math",
    prompt: "A class of 40 students has a boy-to-girl ratio of 3:5. How many girls are in the class?",
    options: ["15", "24", "25", "30"],
    answer: 2,
    explain: "3 + 5 = 8 parts, so each part is 5 students. Girls = 5 × 5 = 25.",
  },
  {
    id: "m4",
    area: "Math",
    prompt: "A price rises from $80 to $100. What is the percent increase?",
    options: ["20%", "25%", "80%", "125%"],
    answer: 1,
    explain: "The increase is $20, and 20 ÷ 80 = 0.25, or 25%. Always divide by the original amount.",
  },
  {
    id: "m5",
    area: "Math",
    prompt: "A rectangle has a perimeter of 30 and a length of 9. What is its area?",
    options: ["54", "81", "135", "270"],
    answer: 0,
    explain: "2 × (9 + w) = 30, so w = 6. Area = 9 × 6 = 54.",
  },
  {
    id: "e1",
    area: "ELA",
    prompt: "Which choice completes the sentence correctly? \u201cNeither of the students ___ ready for the quiz.\u201d",
    options: ["were", "was", "are", "have been"],
    answer: 1,
    explain: "\u201cNeither\u201d is singular, so it takes the singular verb \u201cwas.\u201d",
  },
  {
    id: "e2",
    area: "ELA",
    prompt: "Which sentence is punctuated correctly?",
    options: [
      "After the game ended the team, celebrated.",
      "After the game ended, the team celebrated.",
      "After the game, ended the team celebrated.",
      "After, the game ended the team celebrated.",
    ],
    answer: 1,
    explain: "The comma belongs after the introductory clause \u201cAfter the game ended.\u201d",
  },
  {
    id: "e3",
    area: "ELA",
    prompt:
      "\u201cCity rooftops were once wasted space. Today, rooftop gardens grow vegetables, cool buildings in summer, and give bees a place to feed.\u201d What is the main idea?",
    options: [
      "Bees prefer rooftops to parks.",
      "Rooftops are now being used in helpful ways.",
      "Buildings are too hot in summer.",
      "Vegetables grow best in cities.",
    ],
    answer: 1,
    explain: "The other choices are details or claims the passage doesn\u2019t make. The main idea covers the whole passage.",
  },
  {
    id: "h1",
    area: "Test habits",
    prompt: "How many full-length, timed SHSAT practice tests has your student completed?",
    options: ["None yet", "1 or 2", "3 or more"],
    answer: [0, 1, 2],
    explain: "Full-length timed practice builds pacing and stamina for the real test.",
  },
  {
    id: "h2",
    area: "Test habits",
    prompt: "On the computer-adaptive 2026 SHSAT, what should you do when you\u2019re stuck on a Math question?",
    options: [
      "Skip it and come back at the end",
      "Eliminate what you can, choose the best answer, and move on",
      "Leave it blank to save time",
    ],
    answer: [0, 2, 0],
    explain:
      "Math questions can\u2019t be revisited after you advance, so you need to commit to your best answer before moving on. Practice making that decision quickly.",
  },
]

const KNOWLEDGE = QUESTIONS.filter((q) => typeof q.answer === "number")
const HABITS = QUESTIONS.filter((q) => Array.isArray(q.answer))

function summarize(knowledgeCorrect: number, habitPoints: number) {
  const pct = knowledgeCorrect / KNOWLEDGE.length
  const habitsStrong = habitPoints >= HABITS.length * 1.5
  if (pct >= 0.85)
    return {
      level: "Strong foundation",
      body: habitsStrong
        ? "Your student handled these fundamentals well and has solid test habits. The next step is harder, test-level questions under time pressure."
        : "Your student handled these fundamentals well. Building timed, full-length practice and adaptive-test habits is the next step.",
    }
  if (pct >= 0.5)
    return {
      level: "Building",
      body: "Your student has some core skills in place, with a few gaps. A diagnostic will show exactly which topics to focus on first.",
    }
  return {
    level: "Getting started",
    body: "Several fundamentals need work, which is common early on. Starting with the core Math and ELA skills will make the biggest difference.",
  }
}

export function ReadinessQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const answeredAll = QUESTIONS.every((q) => answers[q.id] !== undefined)

  const choose = (id: string, index: number) => {
    if (!started.current) {
      started.current = true
      trackEvent(EVENTS.readinessQuizStarted, {})
    }
    setAnswers((prev) => ({ ...prev, [id]: index }))
  }

  const knowledgeCorrect = KNOWLEDGE.filter((q) => answers[q.id] === q.answer).length
  const habitPoints = HABITS.reduce((sum, q) => sum + ((q.answer as number[])[answers[q.id]] ?? 0), 0)
  const summary = summarize(knowledgeCorrect, habitPoints)

  const submit = () => {
    setSubmitted(true)
    trackEvent(EVENTS.readinessQuizCompleted, { correct: knowledgeCorrect, total: KNOWLEDGE.length, level: summary.level })
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  return (
    <div className="flex flex-col gap-8">
      <ol className="flex flex-col gap-6">
        {QUESTIONS.map((q, qi) => {
          const chosen = answers[q.id]
          const isKnowledge = typeof q.answer === "number"
          return (
            <li key={q.id}>
              <fieldset className="border border-line bg-white p-5">
                <legend className="sr-only">Question {qi + 1}</legend>
                <p className="text-xs font-extrabold uppercase tracking-widest text-brand">
                  {qi + 1}. {q.area}
                </p>
                <p className="mt-2 font-bold leading-relaxed text-navy">{q.prompt}</p>
                <div className="mt-4 flex flex-col gap-2">
                  {q.options.map((option, oi) => {
                    const correct = isKnowledge && oi === q.answer
                    const wrongPick = submitted && isKnowledge && chosen === oi && !correct
                    return (
                      <label
                        key={option}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-2 text-sm text-ink transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/30 ${
                          submitted && correct ? "border-brand bg-brand-soft" : "border-line"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={chosen === oi}
                          onChange={() => choose(q.id, oi)}
                          disabled={submitted}
                          className="h-4 w-4 shrink-0 accent-[var(--blue)]"
                        />
                        <span className="flex-1">{option}</span>
                        {submitted && correct && <Check size={16} aria-label="Correct answer" className="text-brand" />}
                        {wrongPick && <X size={16} aria-label="Your answer, incorrect" className="text-error" />}
                      </label>
                    )
                  })}
                </div>
                {submitted && <p className="mt-3 text-sm leading-relaxed text-subtle">{q.explain}</p>}
              </fieldset>
            </li>
          )
        })}
      </ol>

      {!submitted ? (
        <div className="flex flex-col gap-2">
          <button type="button" onClick={submit} disabled={!answeredAll} className="button button-gold button-lg justify-center disabled:cursor-not-allowed disabled:opacity-60">
            See My Readiness Summary
          </button>
          {!answeredAll && (
            <p className="text-center text-sm text-subtle">
              Answer all {QUESTIONS.length} questions to see your summary.
            </p>
          )}
        </div>
      ) : (
        <div ref={resultRef} tabIndex={-1} aria-live="polite" className="border-t-4 border-t-gold bg-navy p-6 text-primary-foreground outline-none md:p-8">
          <p className="eyebrow gold">Your readiness summary</p>
          <h2 className="mt-2 text-2xl font-extrabold">{summary.level}</h2>
          <p className="mt-1 text-sm opacity-80">
            {knowledgeCorrect} of {KNOWLEDGE.length} skill questions correct
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed">{summary.body}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed opacity-80">
            This is a general check of a few core skills, not an SHSAT score prediction. A full diagnostic gives a much more accurate
            picture.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <TrackedLink href="/free-diagnostic" event={EVENTS.diagnosticCtaClick} eventProps={{ location: "readiness_quiz_result" }} className="button button-gold">
              Book Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href={FREE_CLASS.path}
              event={EVENTS.sundayClassCtaClick}
              eventProps={{ location: "readiness_quiz_result" }}
              className="inline-flex min-h-12 items-center gap-2 font-bold text-primary-foreground underline-offset-4 hover:underline"
            >
              Join a Free Sunday Class <ArrowUpRight size={16} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      )}
    </div>
  )
}

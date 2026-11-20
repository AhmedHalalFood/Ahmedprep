"use client"

import { useMemo, useState } from "react"
import type { DigitalSATChallengeSet } from "@/lib/digital-sat-weekly-challenge"

type Props = { set: DigitalSATChallengeSet }
const LETTERS = ["A", "B", "C", "D"]

export function DigitalSATWeeklyQuiz({ set }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const total = set.questions.length
  const answered = set.questions.filter((q) => answers[q.id] !== undefined).length
  const score = useMemo(
    () => set.questions.filter((q) => answers[q.id] === q.correctIndex).length,
    [answers, set.questions],
  )
  const math = set.questions.filter((q) => q.area === "Math")
  const rw = set.questions.filter((q) => q.area === "Reading & Writing")
  const mathScore = math.filter((q) => answers[q.id] === q.correctIndex).length
  const rwScore = rw.filter((q) => answers[q.id] === q.correctIndex).length
  const hard = set.questions.filter((q) => q.difficulty === "Hard")
  const superHard = set.questions.filter((q) => q.difficulty === "Super Hard")
  const hardScore = hard.filter((q) => answers[q.id] === q.correctIndex).length
  const superHardScore = superHard.filter((q) => answers[q.id] === q.correctIndex).length

  function reset() {
    setAnswers({})
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-line bg-warm p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-navy">Advanced Digital SAT · 1600 Challenge</p>
            <p className="mt-1 text-sm text-ink">5 Math + 5 Reading & Writing · 5 Hard + 5 Super Hard · Suggested time: 20–25 minutes · Calculator allowed for Math</p>
          </div>
          <span aria-live="polite" className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-extrabold text-navy">
            {submitted ? "Submitted" : `${answered} / ${total} answered`}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-subtle">
          Answer every question, then submit to unlock your score, the complete answer key, worked solutions and strategy tips.
          This original AhmedPrep practice is not an official College Board test, an adaptive module, or a predictor of a 1600 score.
        </p>
      </div>

      {submitted && (
        <section aria-labelledby="challenge-score-title" role="status" className="rounded-xl border-2 border-gold bg-white p-5 sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Your results</p>
          <h2 id="challenge-score-title" className="mt-2 text-3xl font-extrabold text-navy">{score} / {total} correct</h2>
          <p className="mt-2 text-base font-semibold text-ink">Math: {mathScore} / {math.length} · Reading &amp; Writing: {rwScore} / {rw.length}</p>
          <p className="mt-1 text-base font-semibold text-ink">Hard: {hardScore} / {hard.length} · Super Hard: {superHardScore} / {superHard.length}</p>
          <p className="mt-3 text-sm text-subtle">Review the complete answer key beneath the questions. Your answers are checked on this device and are not sent to AhmedPrep.</p>
          <button type="button" onClick={reset} className="button button-outline mt-4">Retake this challenge</button>
        </section>
      )}

      <form onSubmit={(event) => { event.preventDefault(); if (answered === total) setSubmitted(true) }}>
        <ol className="space-y-5">
          {set.questions.map((q, index) => (
            <li key={q.id} className="rounded-xl border border-line bg-white p-5 sm:p-6">
              <fieldset disabled={submitted} className="min-w-0">
                <legend className="text-xs font-extrabold uppercase tracking-wider text-brand">
                  Question {index + 1} · {q.area} · {q.topic}{submitted ? ` · ${q.difficulty}` : ""}
                </legend>
                {q.passage && (
                  <blockquote className="mt-3 whitespace-pre-wrap rounded-lg border-l-4 border-brand bg-warm p-4 text-sm leading-relaxed text-ink">
                    {q.passage}
                  </blockquote>
                )}
                <p className="mt-3 text-base font-bold leading-relaxed text-navy">{q.question}</p>
                <div className="mt-4 space-y-2">
                  {q.choices.map((choice, choiceIndex) => {
                    const selected = answers[q.id] === choiceIndex
                    const correct = submitted && choiceIndex === q.correctIndex
                    const wrong = submitted && selected && choiceIndex !== q.correctIndex
                    return (
                      <label key={choiceIndex} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-relaxed transition-colors ${correct ? "border-emerald-600 bg-emerald-50 text-emerald-900" : wrong ? "border-red-600 bg-red-50 text-red-900" : selected ? "border-navy bg-blue-50 text-navy" : "border-line bg-white text-ink hover:bg-warm"}`}>
                        <input
                          type="radio"
                          name={q.id}
                          value={choiceIndex}
                          checked={selected}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: choiceIndex }))}
                          className="mt-1 size-4 shrink-0 accent-[#0b2e52]"
                        />
                        <span><strong className="mr-2">{LETTERS[choiceIndex]}.</strong> {choice}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              {submitted && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="font-extrabold text-navy">
                    {answers[q.id] === q.correctIndex ? "Correct" : "Review needed"} · Answer: {LETTERS[q.correctIndex]}
                  </p>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
                    {q.explanation.map((paragraph, k) => <p key={k}>{paragraph}</p>)}
                  </div>
                  <div className="mt-3 rounded-lg border-l-4 border-gold bg-warm p-3 text-sm leading-relaxed text-navy">
                    <strong>AhmedPrep strategy:</strong> {q.strategy}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
        {!submitted && (
          <div className="mt-6 rounded-xl border border-line bg-white p-5">
            <p className="mb-4 text-sm text-subtle" aria-live="polite">
              {answered < total ? `Answer the remaining ${total - answered} question${total - answered === 1 ? "" : "s"} to submit.` : "All 10 answers recorded. Ready to submit and reveal explanations."}
            </p>
            <button type="submit" disabled={answered !== total} className="button button-gold button-lg w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
              Submit all 10 answers and reveal solutions
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

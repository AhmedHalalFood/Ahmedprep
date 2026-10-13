import { ChevronDown } from "lucide-react"
import type { PracticeQuestion } from "@/lib/resources"

const LETTERS = ["A", "B", "C", "D", "E", "F"]

export function PracticePassage({ title, paragraphs }: { title?: string; paragraphs: string[] }) {
  return (
    <figure className="border border-line bg-warm p-5 md:p-6">
      {title && <figcaption className="text-sm font-extrabold uppercase tracking-wider text-navy">{title}</figcaption>}
      <div className="mt-3 flex flex-col gap-3">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)} className="leading-relaxed text-ink">
            {p}
          </p>
        ))}
      </div>
    </figure>
  )
}

export function PracticeQuestions({ questions }: { questions: PracticeQuestion[] }) {
  return (
    <ol className="flex flex-col gap-5">
      {questions.map((q, i) => (
        <li key={q.prompt} className="border border-line bg-white p-5 md:p-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand">
            Question {i + 1} <span className="text-subtle">· {q.topic}</span>
          </p>
          <p className="mt-2 font-semibold leading-relaxed text-navy">{q.prompt}</p>
          {q.choices ? (
            <ol className="mt-4 flex flex-col gap-2" aria-label="Answer choices">
              {q.choices.map((choice, c) => (
                <li key={choice} className="flex gap-3 leading-relaxed text-ink">
                  <span className="font-extrabold text-navy" aria-hidden="true">
                    {LETTERS[c]}.
                  </span>
                  <span>
                    <span className="sr-only">Choice {LETTERS[c]}: </span>
                    {choice}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm italic text-subtle">Fill in the blank: no answer choices.</p>
          )}
          <details className="group mt-5 border-t border-line pt-4">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-extrabold text-brand [&::-webkit-details-marker]:hidden">
              Show answer and explanation
              <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              <p className="font-bold text-navy">
                Answer:{" "}
                {q.choices && q.choices.indexOf(q.answer) >= 0 ? `${LETTERS[q.choices.indexOf(q.answer)]}. ` : ""}
                {q.answer}
              </p>
              {q.explanation.map((e) => (
                <p key={e.slice(0, 40)} className="leading-relaxed text-ink">
                  {e}
                </p>
              ))}
            </div>
          </details>
        </li>
      ))}
    </ol>
  )
}

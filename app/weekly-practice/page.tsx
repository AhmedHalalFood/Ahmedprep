import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { TrackedLink } from "@/components/tracked-link"
import { WeeklyPracticeViewTracker } from "@/components/weekly-practice/weekly-practice-view-tracker"
import { EVENTS } from "@/lib/analytics"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"
import {
  CHOICE_LETTERS,
  WEEKLY_PRACTICE_PATH,
  formatPracticeDate,
  getPublishedPractice,
  type WeeklyPracticeQuestion,
} from "@/lib/weekly-practice"

const TITLE = "Free SHSAT & Digital SAT Practice | AhmedPrep"
const DESCRIPTION =
  "Try a free SHSAT or Digital SAT practice question each week from AhmedPrep in Astoria, Queens, with a full worked explanation and a test-taking strategy."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(WEEKLY_PRACTICE_PATH) },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl(WEEKLY_PRACTICE_PATH) },
}

// Hourly so a newly scheduled question goes live shortly after its publication date.
export const revalidate = 3600

function answerLabel(q: WeeklyPracticeQuestion) {
  const index = q.choices?.indexOf(q.correctAnswer) ?? -1
  return index >= 0 ? `${CHOICE_LETTERS[index]}. ${q.correctAnswer}` : q.correctAnswer
}

function Choices({ q }: { q: WeeklyPracticeQuestion }) {
  if (!q.choices) return <p className="mt-3 text-sm italic text-subtle">Grid-in: no answer choices.</p>
  return (
    <ol className="mt-4 flex flex-col gap-2" aria-label="Answer choices">
      {q.choices.map((choice, c) => (
        <li key={choice} className="flex gap-3 leading-relaxed text-ink">
          <span className="font-extrabold text-navy" aria-hidden="true">
            {CHOICE_LETTERS[c]}.
          </span>
          <span>
            <span className="sr-only">Choice {CHOICE_LETTERS[c]}: </span>
            {choice}
          </span>
        </li>
      ))}
    </ol>
  )
}

function Explanation({ q }: { q: WeeklyPracticeQuestion }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-bold text-navy">Answer: {answerLabel(q)}</p>
      {q.explanation.map((e) => (
        <p key={e.slice(0, 40)} className="leading-relaxed text-ink">
          {e}
        </p>
      ))}
      <div className="mt-2 border-l-4 border-gold bg-warm p-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">Strategy</p>
        <p className="mt-1 leading-relaxed text-ink">{q.strategy}</p>
      </div>
    </div>
  )
}

function Meta({ q }: { q: WeeklyPracticeQuestion }) {
  return (
    <p className="text-xs font-extrabold uppercase tracking-wider text-brand">
      {q.testType} <span className="text-subtle">· {q.topic} · </span>
      <time dateTime={q.publishedDate} className="text-subtle">
        {formatPracticeDate(q.publishedDate)}
      </time>
    </p>
  )
}

export default function WeeklyPracticePage() {
  const [current, ...previous] = getPublishedPractice()

  return (
    <>
      <JsonLd data={webPageSchema({ path: WEEKLY_PRACTICE_PATH, name: TITLE, description: DESCRIPTION })} />
      <Breadcrumbs items={[{ label: "Weekly Practice", href: WEEKLY_PRACTICE_PATH }]} />

      <section aria-labelledby="weekly-practice-title" className="border-b border-line bg-white py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="eyebrow blue">Free weekly practice</p>
          <h1
            id="weekly-practice-title"
            className="mt-3 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl"
          >
            AhmedPrep Weekly Practice
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-subtle">
            Try a new SHSAT or Digital SAT question each week, then review the explanation and strategy.
          </p>
        </div>
      </section>

      {current && (
        <section aria-labelledby="current-practice-title" className="bg-warm py-14">
          <WeeklyPracticeViewTracker testType={current.testType} week={current.publishedDate} />
          <div className="container flex max-w-3xl flex-col gap-6">
            <h2 id="current-practice-title" className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep">
              This Week&apos;s Question
            </h2>
            <article className="border border-line border-t-4 border-t-gold bg-white p-6 md:p-8">
              <Meta q={current} />
              <p className="mt-3 text-pretty text-lg font-semibold leading-relaxed text-navy">{current.question}</p>
              <Choices q={current} />
              <div className="mt-6 border-t border-line pt-6">
                <h3 className="mb-3 text-lg font-extrabold text-navy">Answer &amp; Explanation</h3>
                <Explanation q={current} />
              </div>
            </article>

            <div className="flex flex-col gap-4 border border-line bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex flex-col gap-1">
                <p className="text-pretty text-lg font-extrabold leading-snug text-navy">
                  Want more practice like this? Join this Sunday&apos;s free live class.
                </p>
                <p className="text-sm leading-relaxed text-subtle">{current.relatedSundayClass}</p>
              </div>
              <TrackedLink
                href={current.ctaUrl}
                event={EVENTS.weeklyPracticeSundayCta}
                eventProps={{ location: "weekly_practice", test_type: current.testType, week: current.publishedDate }}
                className="button button-gold button-lg shrink-0 justify-center"
              >
                Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
              </TrackedLink>
            </div>
          </div>
        </section>
      )}

      {previous.length > 0 && (
        <section aria-labelledby="previous-practice-title" className="bg-white py-14">
          <div className="container flex max-w-3xl flex-col gap-6">
            <h2 id="previous-practice-title" className="text-balance text-3xl font-extrabold tracking-tight text-navy">
              Previous Practice Questions
            </h2>
            <ol className="flex flex-col gap-5">
              {previous.map((q) => (
                <li key={q.publishedDate} className="border border-line bg-white p-5 md:p-6">
                  <Meta q={q} />
                  <p className="mt-2 font-semibold leading-relaxed text-navy">{q.question}</p>
                  <Choices q={q} />
                  <details className="group mt-5 border-t border-line pt-4">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-extrabold text-brand [&::-webkit-details-marker]:hidden">
                      Show answer and explanation
                      <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-3">
                      <Explanation q={q} />
                    </div>
                  </details>
                </li>
              ))}
            </ol>
            <p className="leading-relaxed text-ink">
              Want a full set?{" "}
              <Link href="/resources" className="font-bold text-brand underline-offset-4 hover:underline">
                Browse free SHSAT and Digital SAT practice guides
              </Link>
              .
            </p>
          </div>
        </section>
      )}
    </>
  )
}

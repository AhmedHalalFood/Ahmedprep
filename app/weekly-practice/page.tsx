import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { TrackedLink } from "@/components/tracked-link"
import { AnswerReveal } from "@/components/weekly-practice/answer-reveal"
import { WeeklyPracticeViewTracker } from "@/components/weekly-practice/weekly-practice-view-tracker"
import { EVENTS } from "@/lib/analytics"
import { CLASS_TYPES, FREE_CLASS, getNextClass, getUpcomingClasses, rsvpHref } from "@/lib/free-class"
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
  "Try free weekly SHSAT and Digital SAT practice questions from AhmedPrep with answers, explanations and test-taking strategies."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(WEEKLY_PRACTICE_PATH) },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl(WEEKLY_PRACTICE_PATH) },
}

// Hourly so a newly scheduled question and the next Sunday class go live on time.
export const revalidate = 3600

const PROGRAMS = {
  SHSAT: { href: "/shsat", label: "Explore the AhmedPrep SHSAT program", classType: "shsat" },
  "Digital SAT": { href: "/digital-sat", label: "Explore the AhmedPrep Digital SAT program", classType: "digital_sat" },
} as const

function letterFor(choices: string[] | undefined, answer: string) {
  const index = choices?.indexOf(answer) ?? -1
  return index >= 0 ? `${CHOICE_LETTERS[index]}. ${answer}` : answer
}

function Choices({ choices }: { choices?: string[] }) {
  if (!choices) return <p className="mt-3 text-sm italic text-subtle">Grid-in: no answer choices.</p>
  return (
    <ol className="mt-4 flex flex-col gap-2" aria-label="Answer choices">
      {choices.map((choice, c) => (
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
      <p className="font-bold text-navy">Correct answer: {letterFor(q.choices, q.correctAnswer)}</p>
      {q.explanation.map((e) => (
        <p key={e.slice(0, 40)} className="leading-relaxed text-ink">
          {e}
        </p>
      ))}
      <div className="mt-2 flex flex-col gap-2 border-l-4 border-gold bg-warm p-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold-deep">{q.testType} Strategy Tip</h3>
        <p className="leading-relaxed text-ink">{q.strategy}</p>
        {q.strategyPrompt && <p className="font-semibold leading-relaxed text-navy">{q.strategyPrompt}</p>}
        {q.strategyExample && (
          <dl className="flex flex-col gap-1 leading-relaxed text-ink">
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-extrabold text-navy">Expected:</dt>
              <dd>{q.strategyExample.expected}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-extrabold text-navy">Instead:</dt>
              <dd>{q.strategyExample.instead}</dd>
            </div>
            <p className="mt-1 font-semibold text-navy">{q.strategyExample.conclusion}</p>
          </dl>
        )}
      </div>
    </div>
  )
}

function Meta({ q, showDate = true }: { q: WeeklyPracticeQuestion; showDate?: boolean }) {
  return (
    <p className="text-xs font-extrabold uppercase tracking-wider text-brand">
      {q.label ?? `${q.testType} · ${q.topic}`}
      {showDate && (
        <>
          {" "}
          <span className="text-subtle">· </span>
          <time dateTime={q.publishedDate} className="text-subtle">
            {formatPracticeDate(q.publishedDate)}
          </time>
        </>
      )}
    </p>
  )
}

function nextClassFor(q: WeeklyPracticeQuestion) {
  const type = PROGRAMS[q.testType].classType
  const next = getNextClass()
  const session = getUpcomingClasses(6).find((c) => c.type === type) ?? next
  if (!session) return undefined
  const isThisSunday = session.isoDate === next?.isoDate
  return { session, when: isThisSunday ? `this Sunday, ${session.compactLabel},` : `on Sunday, ${session.compactLabel},` }
}

function SundayClassCta({ q, tracking }: { q: WeeklyPracticeQuestion; tracking: { test_type: string; week: string } }) {
  const next = nextClassFor(q)
  if (!next) return null
  const { session, when } = next
  return (
    <div className="flex flex-col gap-4 border border-line bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-pretty text-xl font-extrabold leading-snug text-navy">Want More {q.testType} Practice?</h2>
        <p className="leading-relaxed text-ink">
          Join AhmedPrep&apos;s {CLASS_TYPES[session.type].title} {when} from {session.timeLabel}. Practice {q.testType}-style
          questions, learn test-taking strategies and review common reading traps live.
        </p>
      </div>
      <TrackedLink
        href={rsvpHref(session)}
        event={EVENTS.weeklyPracticeSundayCta}
        eventProps={{ location: "weekly_practice", class_type: session.type, class_date: session.isoDate, ...tracking }}
        className="button button-gold button-lg shrink-0 justify-center"
      >
        Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
      </TrackedLink>
    </div>
  )
}

function CurrentPractice({ q }: { q: WeeklyPracticeQuestion }) {
  const tracking = { test_type: q.testType, week: q.publishedDate }
  const program = PROGRAMS[q.testType]

  return (
    <section aria-labelledby="current-practice-title" className="bg-warm py-14">
      <WeeklyPracticeViewTracker testType={q.testType} week={q.publishedDate} />
      <div className="container flex max-w-3xl flex-col gap-6">
        <article className="border border-line border-t-4 border-t-gold bg-white p-6 md:p-8">
          <Meta q={q} />
          <h2 id="current-practice-title" className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
            {q.heading ?? `${q.testType} Question of the Week`}
          </h2>
          {q.image && (
            <Image
              src={q.image.src}
              alt={q.image.alt}
              width={q.image.width}
              height={q.image.height}
              sizes="(min-width: 768px) 704px, 100vw"
              priority
              className="mt-5 h-auto w-full border border-line"
            />
          )}
          {q.stem && (
            <blockquote className="mt-5 border-l-4 border-brand bg-brand-soft p-4 text-pretty text-lg leading-relaxed text-navy">
              {q.stem}
            </blockquote>
          )}
          <p className="mt-5 text-pretty text-lg font-semibold leading-relaxed text-navy">{q.question}</p>
          <Choices choices={q.choices} />
          <div className="mt-6 border-t border-line pt-6">
            <AnswerReveal trackingProps={{ location: "weekly_practice_main", ...tracking }}>
              <Explanation q={q} />
            </AnswerReveal>
          </div>
        </article>

        {q.challenge && (
          <article aria-labelledby="challenge-title" className="border border-line bg-white p-6 md:p-8">
            <h2 id="challenge-title" className="text-xl font-extrabold tracking-tight text-navy">
              Try This Quick Challenge
            </h2>
            <p className="mt-3 font-semibold leading-relaxed text-navy">{q.challenge.question}</p>
            <Choices choices={q.challenge.choices} />
            <div className="mt-5">
              <AnswerReveal label="Show Answer" trackingProps={{ location: "weekly_practice_challenge", ...tracking }}>
                <p className="font-bold text-navy">
                  Correct answer: {letterFor(q.challenge.choices, q.challenge.correctAnswer)}
                </p>
              </AnswerReveal>
            </div>
          </article>
        )}

        <SundayClassCta q={q} tracking={tracking} />

        <div className="flex flex-col gap-4 border border-line bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-pretty text-lg font-extrabold leading-snug text-navy">Need a personalized study plan?</h2>
            <p className="leading-relaxed text-ink">
              Take the Free AhmedPrep Diagnostic to identify strengths, weaknesses and priority areas.
            </p>
          </div>
          <TrackedLink
            href="/free-diagnostic"
            event={EVENTS.weeklyPracticeDiagnosticCta}
            eventProps={{ location: "weekly_practice", ...tracking }}
            className="button button-outline button-lg shrink-0 justify-center"
          >
            Book a Free Diagnostic <ArrowUpRight size={17} aria-hidden="true" />
          </TrackedLink>
        </div>

        <Link href={program.href} className="text-link self-start">
          {program.label} <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
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
            Try a new SHSAT or Digital SAT question each week, then review the answer, explanation and strategy.
          </p>
        </div>
      </section>

      {current && <CurrentPractice q={current} />}

      {previous.length > 0 && (
        <section aria-labelledby="previous-practice-title" className="bg-white py-14">
          <div className="container flex max-w-3xl flex-col gap-6">
            <h2 id="previous-practice-title" className="text-balance text-3xl font-extrabold tracking-tight text-navy">
              Previous Practice Questions
            </h2>
            <ol className="flex flex-col gap-5">
              {previous.map((q) => (
                <li key={q.publishedDate} className="border border-line bg-white p-5 md:p-6">
                  <Meta q={q} showDate={false} />
                  {q.stem && <p className="mt-2 leading-relaxed text-ink">{q.stem}</p>}
                  <p className="mt-2 font-semibold leading-relaxed text-navy">{q.question}</p>
                  <Choices choices={q.choices} />
                  <div className="mt-5 border-t border-line pt-4">
                    <AnswerReveal
                      trackingProps={{ location: "weekly_practice_previous", test_type: q.testType, week: q.publishedDate }}
                    >
                      <Explanation q={q} />
                    </AnswerReveal>
                  </div>
                </li>
              ))}
            </ol>
            <p className="leading-relaxed text-ink">
              Want a full set?{" "}
              <Link href="/resources" className="font-bold text-brand underline-offset-4 hover:underline">
                Browse free SHSAT and Digital SAT practice guides
              </Link>{" "}
              or{" "}
              <Link href="/shsat-practice-tests" className="font-bold text-brand underline-offset-4 hover:underline">
                explore free SHSAT practice tests
              </Link>
              .
            </p>
          </div>
        </section>
      )}
    </>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check, ExternalLink } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { PracticeLibraryViewTracker } from "@/components/practice-tests/practice-library-view-tracker"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { CLASS_TYPES, FREE_CLASS, getNextClass, getUpcomingClasses, rsvpHref } from "@/lib/free-class"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"
import {
  AHMEDPREP_PRACTICE_TESTS,
  FORMAT_FACTS,
  OFFICIAL_SHSAT,
  OFFICIAL_TEST_PLAN,
  PRACTICE_LIBRARY_PATH,
  PRACTICE_WORKFLOW,
  STRATEGY,
  isPublished,
  type AhmedPrepPracticeTest,
} from "@/lib/shsat-practice-tests"
import { WEEKLY_PRACTICE_PATH } from "@/lib/weekly-practice"

const TITLE = "Free SHSAT Practice Tests 2026 | Digital Tests & Practice | AhmedPrep"
const DESCRIPTION =
  "Practice for the 2026 computer-adaptive SHSAT with official NYC Public Schools digital sample tests, AhmedPrep practice sets, Math and ELA practice, explanations and study guidance."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PRACTICE_LIBRARY_PATH) },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl(PRACTICE_LIBRARY_PATH) },
}

// Hourly so the Sunday session rolls over on time.
export const revalidate = 3600

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const

const AHMEDPREP_PRACTICE = [
  {
    title: "SHSAT Math Practice",
    body: "Original medium-to-hard SHSAT Math questions with worked explanations and pacing strategies.",
    href: "/resources/shsat-math-practice",
    cta: "Practice SHSAT Math questions",
    event: EVENTS.shsatMathPracticeClick,
  },
  {
    title: "SHSAT ELA Practice",
    body: "Reading comprehension, revising/editing, grammar and strategy practice with explanations.",
    href: "/resources/shsat-ela-practice",
    cta: "Practice SHSAT ELA questions",
    event: EVENTS.shsatElaPracticeClick,
  },
  {
    title: "Weekly SHSAT Practice",
    body: "A new AhmedPrep practice question with explanation and strategy.",
    href: WEEKLY_PRACTICE_PATH,
    cta: "Try this week\u2019s practice question",
    event: EVENTS.weeklyPracticeClick,
  },
] as const

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex max-w-3xl flex-col gap-3">
      <p className="eyebrow blue">{eyebrow}</p>
      <h2 id={id} className="text-balance text-3xl font-extrabold tracking-tight text-navy">
        {title}
      </h2>
      {children && <div className="text-pretty leading-relaxed text-ink">{children}</div>}
    </div>
  )
}

function AhmedPrepTestCard({ test }: { test: AhmedPrepPracticeTest }) {
  const published = isPublished(test)
  const links = [
    { href: test.startUrl, label: "Start Test" },
    { href: test.pdfUrl, label: "Download PDF" },
    { href: test.answerKeyUrl, label: "Answer Key" },
    { href: test.explanationsUrl, label: "Detailed Explanations" },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href))

  return (
    <li className="flex h-full flex-col gap-3 border border-line bg-white p-5">
      <h3 className="text-lg font-extrabold text-navy">{test.title}</h3>
      {published ? (
        <>
          <dl className="flex flex-col gap-1 text-sm leading-relaxed text-ink">
            {test.difficulty && (
              <div className="flex gap-2">
                <dt className="font-bold text-navy">Difficulty:</dt>
                <dd>{test.difficulty}</dd>
              </div>
            )}
            {test.estimatedMinutes && (
              <div className="flex gap-2">
                <dt className="font-bold text-navy">Estimated time:</dt>
                <dd>{test.estimatedMinutes} minutes</dd>
              </div>
            )}
            {test.breakdown && (
              <div className="flex gap-2">
                <dt className="font-bold text-navy">Breakdown:</dt>
                <dd>
                  {test.breakdown.ela} ELA / {test.breakdown.math} Math
                </dd>
              </div>
            )}
          </dl>
          <ul className="mt-auto flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-link">
                  {l.label} <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm font-semibold uppercase tracking-wider text-subtle">In preparation</p>
      )}
    </li>
  )
}

export default function ShsatPracticeTestsPage() {
  const session = getUpcomingClasses(6).find((c) => c.type === "shsat") ?? getNextClass()
  const anyPublished = AHMEDPREP_PRACTICE_TESTS.some(isPublished)

  return (
    <>
      <JsonLd data={webPageSchema({ path: PRACTICE_LIBRARY_PATH, name: TITLE, description: DESCRIPTION })} />
      <Breadcrumbs items={[{ label: "SHSAT Practice Tests", href: PRACTICE_LIBRARY_PATH }]} />
      <PracticeLibraryViewTracker />

      <section aria-labelledby="practice-library-title" className="border-b border-line bg-white py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="eyebrow blue">Free SHSAT practice</p>
          <h1
            id="practice-library-title"
            className="mt-3 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl"
          >
            Free SHSAT Practice Tests &amp; Practice Resources
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-subtle">
            Prepare for the computer-adaptive SHSAT with official NYC Public Schools practice tests, AhmedPrep original
            practice sets, Math and ELA practice, and detailed explanations.
          </p>
          <p className="mt-5 border-l-4 border-line pl-4 text-sm leading-relaxed text-subtle">
            Official SHSAT tests are provided by New York City Public Schools. AhmedPrep is an independent tutoring provider
            and is not affiliated with NYC Public Schools.
          </p>
        </div>
      </section>

      <section aria-labelledby="official-tests-title" className="bg-warm py-14">
        <div className="container flex flex-col gap-8">
          <SectionHeading id="official-tests-title" eyebrow="From NYC Public Schools" title="Official Digital SHSAT Practice Tests">
            <p>
              NYC Public Schools currently provides four full-length digital SHSAT sample tests designed to help students
              become familiar with the current computer-based testing experience.
            </p>
          </SectionHeading>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-5 border border-line border-t-4 border-t-brand bg-white p-6 md:p-8 lg:col-span-2">
              <h3 className="text-2xl font-extrabold tracking-tight text-navy">Official NYCPS Digital SHSAT Practice Tests</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  `${OFFICIAL_SHSAT.testCount} full-length digital sample tests`,
                  "Current computer-based format",
                  "ELA + Math",
                  "Answer summaries and explanations",
                  "No login required",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 leading-relaxed text-ink">
                    <Check size={18} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div>
                <TrackedLink
                  href={OFFICIAL_SHSAT.practiceTestsUrl}
                  event={EVENTS.officialShsatTestClick}
                  eventProps={{ location: "official_card", destination: "practice_tests" }}
                  className="button button-gold button-lg justify-center"
                  {...EXTERNAL}
                >
                  Open Official SHSAT Practice Tests <ExternalLink size={17} aria-hidden="true" />
                  <span className="sr-only">(opens NYC SHSAT Portal in a new tab)</span>
                </TrackedLink>
              </div>
              <p className="text-sm leading-relaxed text-subtle">
                Hosted on the official NYC SHSAT Portal, linked from the{" "}
                <a href={OFFICIAL_SHSAT.sourceUrl} className="font-bold text-brand underline-offset-4 hover:underline" {...EXTERNAL}>
                  NYC Public Schools Specialized High Schools page
                </a>
                .
              </p>
            </div>

            <div className="flex flex-col gap-4 border border-line bg-white p-6 md:p-8">
              <h3 className="text-xl font-extrabold tracking-tight text-navy">Student Readiness Tool</h3>
              <p className="leading-relaxed text-ink">
                Explore the official digital test interface, tools and navigation before you take a full practice test.
              </p>
              <TrackedLink
                href={OFFICIAL_SHSAT.readinessToolUrl}
                event={EVENTS.officialShsatTestClick}
                eventProps={{ location: "official_card", destination: "student_readiness_tool" }}
                className="button button-outline button-lg mt-auto justify-center"
                {...EXTERNAL}
              >
                Practice the Digital Test Interface <ExternalLink size={17} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="official-plan-title" className="bg-white py-14">
        <div className="container flex flex-col gap-8">
          <SectionHeading id="official-plan-title" eyebrow="Study plan" title="How to Use the 4 Official Tests" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OFFICIAL_TEST_PLAN.map((t) => (
              <li key={t.number} className="flex h-full flex-col gap-3 border border-line border-t-4 border-t-gold bg-white p-5">
                <h3 className="text-lg font-extrabold text-navy">Official Practice Test {t.number}</h3>
                <p className="leading-relaxed text-ink">{t.use}</p>
                <TrackedLink
                  href={OFFICIAL_SHSAT.practiceTestsUrl}
                  event={EVENTS.officialShsatTestClick}
                  eventProps={{ location: "test_plan", test_number: t.number }}
                  className="text-link mt-auto"
                  {...EXTERNAL}
                >
                  Open on NYC SHSAT Portal <ExternalLink size={15} aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </TrackedLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 bg-brand-soft p-5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-navy">Suggested workflow</h3>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold text-navy">
              {PRACTICE_WORKFLOW.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  {i > 0 && <ArrowRight size={14} className="text-subtle" aria-hidden="true" />}
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="ahmedprep-practice-title" className="bg-warm py-14">
        <div className="container flex flex-col gap-8">
          <SectionHeading id="ahmedprep-practice-title" eyebrow="Original AhmedPrep practice" title="AhmedPrep SHSAT Practice" />
          <ul className="grid gap-6 md:grid-cols-3">
            {AHMEDPREP_PRACTICE.map((p) => (
              <li key={p.href}>
                <TrackedLink
                  href={p.href}
                  event={p.event}
                  eventProps={{ location: "practice_library" }}
                  className="group flex h-full flex-col gap-3 border border-line border-t-4 border-t-gold bg-white p-6 hover:border-brand"
                >
                  <span className="text-xl font-extrabold text-navy group-hover:text-brand">{p.title}</span>
                  <span className="leading-relaxed text-ink">{p.body}</span>
                  <span className="text-link mt-auto">
                    {p.cta} <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="ahmedprep-tests-title" className="bg-white py-14">
        <div className="container flex flex-col gap-8">
          <SectionHeading id="ahmedprep-tests-title" eyebrow="Coming soon" title="AhmedPrep Full-Length Practice Tests">
            {!anyPublished && (
              <p>
                AhmedPrep original full-length practice tests are being prepared. In the meantime, use the official NYCPS
                digital tests above and our Math, ELA and weekly practice resources.
              </p>
            )}
          </SectionHeading>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AHMEDPREP_PRACTICE_TESTS.map((t) => (
              <AhmedPrepTestCard key={t.number} test={t} />
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="strategy-title" className="bg-warm py-14">
        <div className="container flex flex-col gap-8">
          <SectionHeading id="strategy-title" eyebrow="Strategy" title="How to Get the Most From an SHSAT Practice Test" />
          <div className="grid gap-6 md:grid-cols-3">
            {STRATEGY.map((s) => (
              <div key={s.phase} className="flex flex-col gap-3 border border-line bg-white p-6">
                <h3 className="text-lg font-extrabold text-navy">{s.phase}</h3>
                <ul className="flex flex-col gap-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 leading-relaxed text-ink">
                      <Check size={16} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 border border-line bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <h3 className="text-pretty text-xl font-extrabold leading-snug text-navy">Not sure what your results mean?</h3>
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.practiceDiagnosticCta}
              eventProps={{ location: "practice_library_strategy" }}
              className="button button-outline button-lg shrink-0 justify-center"
            >
              Book a Free AhmedPrep Diagnostic <ArrowUpRight size={17} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="format-title" className="bg-white py-14">
        <div className="container max-w-3xl">
          <div className="flex flex-col gap-4 border border-line border-l-4 border-l-brand bg-white p-6 md:p-8">
            <h2 id="format-title" className="text-2xl font-extrabold tracking-tight text-navy">
              2026 SHSAT Format
            </h2>
            <ul className="flex flex-col gap-2">
              {FORMAT_FACTS.map((fact) => (
                <li key={fact} className="flex items-start gap-2 leading-relaxed text-ink">
                  <Check size={16} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-subtle">
              Source:{" "}
              <a href={OFFICIAL_SHSAT.sourceUrl} className="font-bold text-brand underline-offset-4 hover:underline" {...EXTERNAL}>
                NYC Public Schools Specialized High Schools
              </a>{" "}
              and{" "}
              <a
                href={OFFICIAL_SHSAT.understandingTestUrl}
                className="font-bold text-brand underline-offset-4 hover:underline"
                {...EXTERNAL}
              >
                NYC SHSAT Portal: Understanding the Test
              </a>
              . Always confirm details with NYC Public Schools. Read our{" "}
              <Link href="/resources/digital-shsat-2026" className="font-bold text-brand underline-offset-4 hover:underline">
                guide to the 2026 SHSAT format
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="sunday-title" className="bg-warm py-14">
        <div className="container">
          <div className="flex flex-col gap-4 border border-line bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex flex-col gap-2">
              <h2 id="sunday-title" className="text-pretty text-xl font-extrabold leading-snug text-navy">
                Want to Review SHSAT Questions Live?
              </h2>
              <p className="leading-relaxed text-ink">
                Next session: {CLASS_TYPES[session.type].title}, Sunday {session.compactLabel}, {FREE_CLASS.timeLabel}.
              </p>
            </div>
            <TrackedLink
              href={rsvpHref(session)}
              event={EVENTS.practiceSundayCta}
              eventProps={{ location: "practice_library", class_type: session.type, class_date: session.isoDate }}
              className="button button-gold button-lg shrink-0 justify-center"
            >
              Reserve My Free Seat <ArrowUpRight size={17} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/seo"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs, JsonLd, Section } from "@/components/landing/primitives"
import { ProgramHero } from "@/components/landing/program-hero"
import { SuccessStories } from "@/components/landing/success-stories"
import { EVENTS } from "@/lib/analytics"
import { NOT_AFFILIATED_NOTE, SITE_URL } from "@/lib/business"

export const metadata: Metadata = {
  title: { absolute: "Digital SAT Prep in Queens, NY | AhmedPrep Astoria" },
  description:
    "Digital SAT prep in Astoria, Queens with a free diagnostic, adaptive test strategy, Desmos instruction, and Reading & Writing and Math preparation.",
  alternates: { canonical: absoluteUrl("/digital-sat") },
  openGraph: {
    title: "Digital SAT Prep in Queens, NY | AhmedPrep Astoria",
    description: "Free Digital SAT diagnostic and personalized Math and Reading & Writing preparation in Astoria, Queens.",
    url: absoluteUrl("/digital-sat"),
  },
}

const benefits = [
  "Free Digital SAT diagnostic",
  "Score analysis by section and skill",
  "Personalized study plan",
  "Adaptive test strategy",
  "Desmos calculator instruction",
]

const reasons = [
  {
    title: "Strategy for an adaptive test",
    body: "The Digital SAT adjusts difficulty between modules. Students learn why first-module accuracy matters and how to pace each module.",
  },
  {
    title: "Math taught by a mathematician",
    body: "Founder Tariq Ahmed holds an M.S. in Mathematics and is an NYC DOE educator with 12+ years of teaching and test-prep experience.",
  },
  {
    title: "Plans built from a diagnostic",
    body: "A full-length adaptive diagnostic shows exactly which skills and question types hold a score back.",
  },
  {
    title: "Practice in the real format",
    body: "Students practice with official Bluebook tests so the interface, timing, and tools feel familiar on test day.",
  },
]

const steps = [
  ["Diagnose", "A full-length adaptive diagnostic establishes a baseline score for each section."],
  ["Analyze", "We break the score down by skill area and question type and set a realistic target."],
  ["Teach and practice", "Focused instruction on the highest-impact skills, plus Desmos and pacing strategy."],
  ["Test and refine", "Full-length adaptive practice tests track growth and guide the next priorities."],
]

const faqs: FaqItem[] = [
  {
    q: "How is the Digital SAT structured?",
    a: "The Digital SAT has two sections, Reading and Writing (54 questions, 64 minutes) and Math (44 questions, 70 minutes), each split into two modules. Total testing time is about 2 hours and 14 minutes, with a 10-minute break.",
  },
  {
    q: "What does adaptive testing mean?",
    a: "Each section is section-adaptive. Performance on the first module determines whether the second module is easier or harder, which affects the score range a student can reach.",
  },
  {
    q: "Is a calculator allowed?",
    a: "Yes. A calculator is allowed on the entire Math section, and the Bluebook app includes a built-in Desmos graphing calculator. We teach students when Desmos is faster and when to solve by hand.",
  },
  {
    q: "When should my child take the SAT?",
    a: "Many students take the SAT for the first time in the spring of junior year, which leaves time for a second attempt. The diagnostic helps choose a test date that fits your child's starting point and goals.",
  },
  {
    q: "What happens during the free SAT diagnostic?",
    a: "Your child takes a timed Digital SAT diagnostic. We review the results with you, explain strengths and gaps by section, and recommend a study plan. There is no cost or obligation.",
  },
  {
    q: "Is AhmedPrep affiliated with the College Board?",
    a: "No. AhmedPrep is an independent test preparation provider. SAT is a trademark of the College Board, which is not affiliated with AhmedPrep.",
  },
]

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Digital SAT Prep in Astoria, Queens",
  description: "Diagnostic-based Digital SAT preparation covering Reading and Writing and Math, adaptive strategy, and Desmos instruction.",
  url: `${SITE_URL}/digital-sat`,
  provider: { "@id": `${SITE_URL}/#organization` },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Onsite",
    location: { "@type": "Place", name: "AhmedPrep, Astoria, Queens" },
  },
}

export default function DigitalSatPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Digital SAT Prep", href: "/digital-sat" }]} />
      <ProgramHero
        location="digital_sat"
        eyebrow="Digital SAT Prep · Astoria, Queens"
        title="Improve Your Digital SAT Score With a Personalized Plan."
        intro="Start with a free diagnostic. We'll analyze your score by section and skill and build a plan around the gains that matter most."
        benefitsTitle="Every Digital SAT student receives"
        benefits={benefits}
        ctaLabel="Book a Free SAT Diagnostic"
        ctaEvent={EVENTS.digitalSatCtaClick}
      />

      <Section id="why" eyebrow="Why AhmedPrep" title="Digital SAT preparation built around the student">
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {reasons.map((reason) => (
            <article key={reason.title} className="bg-white p-6 md:p-8">
              <h3 className="text-lg font-extrabold text-navy">{reason.title}</h3>
              <p className="mt-3 leading-relaxed text-subtle">{reason.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="how-it-works" tone="warm" eyebrow="How SAT preparation works" title="From baseline score to target score">
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-3 border-t-4 border-navy bg-white p-6">
              <span className="text-sm font-extrabold text-brand">Step {i + 1}</span>
              <h3 className="text-xl font-extrabold text-navy">{title}</h3>
              <p className="leading-relaxed text-subtle">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="sections" eyebrow="Reading & Writing and Math" title="Preparation for both sections">
        <div className="grid gap-8 md:grid-cols-2">
          <article className="border border-line p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">Reading and Writing</h3>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Short-passage reading: main idea, inference, and evidence</li>
              <li>Vocabulary in context and text structure</li>
              <li>Transitions and rhetorical synthesis</li>
              <li>Grammar, punctuation, and sentence boundaries</li>
            </ul>
            <Link href="/resources/digital-sat-reading-writing" className="text-link mt-6">
              Reading & Writing strategies <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className="border border-line p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">Math</h3>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Algebra and Advanced Math</li>
              <li>Problem-Solving and Data Analysis</li>
              <li>Geometry and Trigonometry</li>
              <li>Desmos graphing calculator strategy</li>
            </ul>
            <Link href="/resources/digital-sat-math-practice" className="text-link mt-6">
              Digital SAT Math practice <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </Section>

      <Section
        id="practice-tests"
        tone="warm"
        eyebrow="Adaptive practice testing"
        title="Practice tests in the real Bluebook format"
        intro="Students take full-length adaptive practice tests using the College Board's Bluebook app, then review every question by skill so each test leads to a clear next step."
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {["Pace each module with confidence", "Use Desmos efficiently", "Track section scores over time"].map((item) => (
            <li key={item} className="border-l-4 border-gold bg-white p-5 font-bold text-navy">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <SuccessStories program="Digital SAT" title="Digital SAT student results" />
      <Faq title="Digital SAT prep FAQ" items={faqs} />
      <LocationSection location="digital_sat" />
      <DiagnosticSection
        program="Digital SAT"
        location="digital_sat"
        title="Book a free SAT diagnostic"
        intro="Complete the form and we'll contact you to confirm a diagnostic time at our Astoria location."
      />
      <p className="container py-6 text-xs leading-relaxed text-subtle">{NOT_AFFILIATED_NOTE}</p>
      <JsonLd data={courseSchema} />
    </>
  )
}

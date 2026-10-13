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
import { ThisSundayStrip } from "@/components/sunday-classes/this-sunday-strip"
import { TeachingVideos } from "@/components/videos/teaching-videos"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { NOT_AFFILIATED_NOTE, SITE_URL } from "@/lib/business"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"
import { NYCPS_SHSAT_URL } from "@/lib/resources-shsat-2026"

export const metadata: Metadata = {
  title: { absolute: "SHSAT Prep in Queens, NY | AhmedPrep Astoria" },
  description:
    "SHSAT prep in Astoria, Queens with a free diagnostic, targeted Math and ELA instruction, full-length practice exams, and progress reports for parents.",
  alternates: { canonical: absoluteUrl("/shsat") },
  openGraph: {
    title: "SHSAT Prep in Queens, NY | AhmedPrep Astoria",
    description: "Free SHSAT diagnostic, personalized Math and ELA preparation, and practice exams in Astoria, Queens.",
    url: absoluteUrl("/shsat"),
  },
}

const benefits = [
  "Free SHSAT diagnostic",
  "Personalized study plan",
  "Practice exams",
  "Targeted Math and ELA instruction",
  "Progress reports for parents",
]

const reasons = [
  {
    title: "Instruction led by an NYC educator",
    body: "Founder Tariq Ahmed is an NYC DOE educator with 12+ years of teaching and test-prep experience.",
  },
  {
    title: "Plans built from a diagnostic",
    body: "Every student starts with a timed diagnostic, so preparation targets real gaps instead of repeating what they already know.",
  },
  {
    title: "Small, focused sessions",
    body: "Students get direct feedback on their work and know exactly what to practice before the next session.",
  },
  {
    title: "Parents stay informed",
    body: "Regular progress reports show practice scores, growth by topic, and the next priorities.",
  },
]

const steps = [
  ["Diagnose", "A timed, SHSAT-style diagnostic measures current Math and ELA performance and pacing."],
  ["Plan", "We review results with parents and build a study plan around the student's goals and calendar."],
  ["Teach and practice", "Direct instruction and targeted practice close content gaps and build accuracy."],
  ["Test and refine", "Full-length practice exams build stamina, sharpen pacing, and guide the next adjustments."],
]

const faqs: FaqItem[] = [
  {
    q: "Who takes the SHSAT?",
    a: "NYC 8th graders, and first-time 9th graders, take the SHSAT to apply to eight of the nine testing Specialized High Schools. Families register in MySchools; for the Fall 2026 test the deadline is October 30. Confirm current dates on the official NYC Public Schools Specialized High Schools page.",
  },
  {
    q: "What does the SHSAT test?",
    a: "Beginning in Fall 2026, the SHSAT is a computer-adaptive test with 50 English Language Arts questions (Revising/Editing and Reading Comprehension) and 50 Math questions. Questions include multiple-choice, fill-in-the-blank, and technology-enhanced items. Standard testing time is 180 minutes, students choose which subject to begin with, and calculators are not allowed. Students test on NYCPS-provided computers, except for limited approved paper accommodations.",
  },
  {
    q: "Can students skip questions or go back on the computer-adaptive SHSAT?",
    a: "No skipping: every question must be answered before advancing. Math and standalone ELA questions cannot be revisited after the student advances. Passage-based ELA questions can be revisited within their passage set until the set is submitted. Once a subject is submitted, it cannot be reopened.",
  },
  {
    q: "When should my child start SHSAT preparation?",
    a: "It depends on where your child is starting. Many families begin in the spring or summer before 8th grade. The free diagnostic shows how much ground there is to cover so you can choose a realistic start date.",
  },
  {
    q: "What happens during the free SHSAT diagnostic?",
    a: "Your child takes a timed, SHSAT-style assessment at our Astoria location. We then review the results with you, explain strengths and gaps in Math and ELA, and recommend next steps. There is no cost or obligation.",
  },
  {
    q: "Do you offer full-length practice exams?",
    a: "Yes. Students take full-length, timed practice exams under test-day conditions, followed by a detailed review of every error so each test leads to improvement.",
  },
  {
    q: "How will I know if my child is improving?",
    a: "Parents receive progress reports with practice test results, growth by topic, and the priorities for the coming weeks.",
  },
  {
    q: "Is AhmedPrep affiliated with the Specialized High Schools?",
    a: "No. AhmedPrep is an independent test preparation provider and is not affiliated with NYC Public Schools or any Specialized High School.",
  },
]

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "SHSAT Prep in Astoria, Queens",
  description: "Diagnostic-based SHSAT preparation covering Math and ELA, with full-length practice exams and parent progress reports.",
  url: `${SITE_URL}/shsat`,
  provider: { "@id": `${SITE_URL}/#organization` },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Onsite",
    location: { "@type": "Place", name: "AhmedPrep, Astoria, Queens" },
  },
}

export default function ShsatPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "SHSAT Prep", href: "/shsat" }]} />
      <ProgramHero
        location="shsat"
        eyebrow="SHSAT Prep · Astoria, Queens"
        title="SHSAT Prep in Astoria, Queens: Start With a Free Diagnostic"
        intro="Your child receives a full SHSAT-style assessment, a breakdown of strengths and weaknesses, and a personalized plan for improvement."
        benefitsTitle="Every SHSAT student receives"
        benefits={benefits}
        ctaLabel="Reserve a Free SHSAT Diagnostic"
        ctaEvent={EVENTS.shsatCtaClick}
      />

      <aside aria-label="2026 SHSAT Final Intensive" className="border-y-4 border-gold bg-academic text-white">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-1">
            <p className="eyebrow gold">Now enrolling</p>
            <p className="text-lg font-extrabold leading-snug md:text-xl">
              60 hours of live SHSAT prep · 20 classes · Oct. 12–Nov. 12, 2026 · $1,000
            </p>
          </div>
          <TrackedLink
            href={INTENSIVE_PATH}
            event={EVENTS.shsatIntensiveClick}
            eventProps={{ location: "shsat_page_intensive_promo" }}
            className="button button-gold button-lg shrink-0 justify-center uppercase"
          >
            2026 SHSAT Final Intensive <ArrowUpRight size={16} aria-hidden="true" />
          </TrackedLink>
        </div>
      </aside>

      <Section id="why" eyebrow="Why AhmedPrep" title="Focused SHSAT preparation in Astoria">
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {reasons.map((reason) => (
            <article key={reason.title} className="bg-white p-6 md:p-8">
              <h3 className="text-lg font-extrabold text-navy">{reason.title}</h3>
              <p className="mt-3 leading-relaxed text-subtle">{reason.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="how-it-works"
        tone="warm"
        eyebrow="How SHSAT preparation works"
        title="A clear path from diagnostic to test day"
      >
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

      <Section id="math-ela" eyebrow="SHSAT Math & ELA" title="Instruction for both sections of the test">
        <div className="grid gap-8 md:grid-cols-2">
          <article className="border border-line p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">SHSAT Math</h3>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Fractions, ratios, rates, and percents</li>
              <li>Algebraic expressions, equations, and inequalities</li>
              <li>Geometry, probability, and statistics</li>
              <li>Multi-step word problems and fill-in-the-blank questions</li>
              <li>Accurate calculation without a calculator</li>
            </ul>
            <div className="mt-6 flex flex-col items-start gap-3">
              <Link href="/resources/shsat-math-practice" className="text-link">
                SHSAT Math practice questions <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/resources/shsat-math-topics" className="text-link">
                SHSAT Math topics checklist <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
          <article className="border border-line p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">SHSAT ELA</h3>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Revising/Editing: grammar, punctuation, and sentence structure</li>
              <li>Organization, transitions, and text relevance</li>
              <li>Reading comprehension across informational and literary texts</li>
              <li>Main idea, inference, and evidence questions</li>
              <li>Reading stamina and active annotation</li>
            </ul>
            <Link href="/resources/shsat-ela-practice" className="text-link mt-6">
              SHSAT ELA practice: reading and grammar <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </Section>

      <Section id="fall-2026-format" title="New for Fall 2026: The Computer-Adaptive SHSAT">
        <ul className="flex max-w-3xl list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
          <li>
            The Fall 2026 SHSAT is computer-adaptive and taken on NYCPS-provided computers, except for limited approved
            paper accommodations.
          </li>
          <li>50 English Language Arts questions and 50 Math questions.</li>
          <li>180 minutes of standard testing time.</li>
          <li>Students may choose whether to begin with ELA or Math.</li>
          <li>Multiple-choice, fill-in-the-blank, and technology-enhanced items.</li>
          <li>Students must answer each question before advancing.</li>
          <li>Math and standalone ELA questions cannot be revisited after advancing.</li>
          <li>
            Passage-set ELA questions can be reviewed within the passage set until that set is submitted.
          </li>
        </ul>
        <p className="mt-6 max-w-3xl leading-relaxed text-subtle">
          Confirm current details on the official{" "}
          <a
            href={NYCPS_SHSAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-navy underline underline-offset-4"
          >
            NYC Public Schools SHSAT page
          </a>
          , or read{" "}
          <Link href="/resources/digital-shsat-2026" className="font-bold text-navy underline underline-offset-4">
            how the Fall 2026 SHSAT works
          </Link>
          .
        </p>
      </Section>

      <Section
        id="practice-exams"
        tone="warm"
        eyebrow="Practice exams"
        title="Full-length practice under test-day conditions"
        intro="Students take timed, full-length SHSAT practice exams in our Astoria classroom. Every exam is followed by a review of each missed question, so students understand whether an error came from content, timing, or strategy."
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {["Build stamina for a 180-minute exam", "Practice answer-before-advancing pacing", "Track scores from test to test"].map((item) => (
            <li key={item} className="border-l-4 border-gold bg-white p-5 font-bold text-navy">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <ThisSundayStrip location="shsat" />
      <TeachingVideos page="shsat" title="Short SHSAT lessons from AhmedPrep" />
      <SuccessStories program="SHSAT" title="SHSAT student results" />
      <Faq title="SHSAT prep FAQ" items={faqs} />
      <LocationSection location="shsat" />
      <DiagnosticSection
        program="SHSAT"
        location="shsat"
        title="Reserve a free SHSAT diagnostic"
        intro="Complete the form and we'll contact you to confirm a diagnostic time at our Astoria location."
      />
      <p className="container py-6 text-xs leading-relaxed text-subtle">{NOT_AFFILIATED_NOTE}</p>
      <JsonLd data={courseSchema} />
    </>
  )
}

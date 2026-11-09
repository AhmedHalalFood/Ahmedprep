import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/seo"
import Link from "next/link"
import { ArrowUpRight, Laptop } from "lucide-react"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs, JsonLd, Section } from "@/components/landing/primitives"
import { ProgramHero } from "@/components/landing/program-hero"
import { courseInstances2027 } from "@/components/landing/program-cohorts-2027"
import { SuccessStories } from "@/components/landing/success-stories"
import { ThisSundayStrip } from "@/components/sunday-classes/this-sunday-strip"
import { TeachingVideos } from "@/components/videos/teaching-videos"
import { ClassStructure } from "@/components/program-page/class-structure"
import { EnrollmentSteps } from "@/components/program-page/enrollment-steps"
import { FeatureGrid, ResourceLinks } from "@/components/program-page/feature-grid"
import { ProgramCtas } from "@/components/program-page/program-ctas"
import { ProgramTuition } from "@/components/program-page/program-tuition"
import { EVENTS } from "@/lib/analytics"
import { SITE_URL } from "@/lib/business"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"

const PATH = "/digital-sat-prep"
const TITLE = "Digital SAT Prep in Astoria, Queens | AhmedPrep"
const DESCRIPTION =
  "Digital SAT tutoring in Astoria, Queens. Small-group Math and Reading & Writing classes, Bluebook practice, Desmos strategies, and 2027 enrollment."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), type: "website" },
}

const LAPTOP_NOTE = "Digital SAT students must bring their own laptop to every class."

const benefits = [
  "A free Digital SAT diagnostic with score analysis",
  `Small in-person classes, maximum ${MAX_CLASS_SIZE} students`,
  "Math and Reading & Writing in every class",
  "Bluebook practice and Desmos strategies",
  "Regular progress updates for parents",
]

const testFacts = [
  { label: "Reading and Writing", value: "54 questions · 64 minutes · 2 modules" },
  { label: "Math", value: "44 questions · 70 minutes · 2 modules" },
  { label: "Total testing time", value: "About 2 hours 14 minutes, plus a 10-minute break" },
  { label: "Calculator", value: "Allowed on all of Math; Desmos is built into Bluebook" },
]

const method = [
  { title: "Diagnostic and score analysis", body: "A timed diagnostic sets a baseline for each section, broken down by skill area and question type." },
  { title: "Bluebook practice", body: "Students practice in the College Board's Bluebook app so the interface and tools feel familiar on test day." },
  { title: "Timed adaptive-module drills", body: "Module-length timed sets build pacing and first-module accuracy, which shapes the second module." },
  { title: "Desmos strategies", body: "Students learn when the built-in Desmos graphing calculator is faster and when to solve by hand." },
  { title: "Homework and cumulative review", body: "Targeted homework and recurring mixed review keep earlier skills from slipping." },
  { title: "Mock exams and parent updates", body: "Full-length practice tests track section scores, and parents receive regular progress updates." },
]

const resources = [
  { href: "/resources/digital-sat-reading-writing", label: "Reading & Writing strategies", body: "How to approach each Reading and Writing question type." },
  { href: "/resources/digital-sat-math-practice", label: "Digital SAT Math practice", body: "Practice questions across the four Math content areas." },
  { href: "/weekly-practice", label: "Weekly practice question", body: "A free Digital SAT question with a full explanation." },
  { href: "/tools", label: "Free tools", body: "Score planner and other free planning tools." },
]

const faqs: FaqItem[] = [
  {
    q: "How is the Digital SAT structured?",
    a: "The Digital SAT has two sections, Reading and Writing (54 questions, 64 minutes) and Math (44 questions, 70 minutes), each split into two modules. Total testing time is about 2 hours and 14 minutes, with a 10-minute break between sections.",
  },
  {
    q: "What does adaptive testing mean on the Digital SAT?",
    a: "Each section is adaptive by module. Performance on the first module determines whether the second module is easier or harder, which affects the score range a student can reach. That is why first-module accuracy matters.",
  },
  {
    q: "Is a calculator allowed?",
    a: "Yes. A calculator is allowed on the entire Math section, and the Bluebook app includes a built-in Desmos graphing calculator. We teach students when Desmos saves time and when solving by hand is faster.",
  },
  {
    q: "Does my child need to bring a laptop?",
    a: "Yes. Digital SAT students must bring their own laptop to every class so they can practice in Bluebook. AhmedPrep does not supply devices.",
  },
  {
    q: "How is each three-hour Digital SAT class structured?",
    a: "Every class includes 75 minutes of Math, 75 minutes of Reading and Writing, and 30 minutes of cumulative review.",
  },
  {
    q: "How many students are in each class?",
    a: `Every Digital SAT cohort has a maximum of ${MAX_CLASS_SIZE} students.`,
  },
  {
    q: "Does an enrollment inquiry reserve my child's seat?",
    a: "No. An inquiry tells us which cohort you are interested in. A seat is confirmed only after registration is complete and payment has been received and confirmed by AhmedPrep.",
  },
  {
    q: "When should my child take the SAT?",
    a: "Many students take the SAT for the first time in the spring of junior year, which leaves time for a second attempt. The diagnostic helps choose a test date that fits your child's starting point and goals.",
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
  description: DESCRIPTION,
  url: `${SITE_URL}${PATH}`,
  provider: { "@id": `${SITE_URL}/#organization` },
  hasCourseInstance: courseInstances2027("Digital SAT"),
}

export default function DigitalSatPrepPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Digital SAT Prep", href: PATH }]} />
      <ProgramHero
        location="digital_sat"
        eyebrow="SAT tutoring in NYC · Astoria, Queens"
        title="Digital SAT Prep in Astoria, Queens"
        serviceArea={`Small-group, in-person Digital SAT prep in Astoria for high school students across Queens and NYC. Maximum ${MAX_CLASS_SIZE} students per class.`}
        intro="Math and Reading & Writing instruction built from a free diagnostic, with Bluebook practice, Desmos strategies, and timed adaptive-module drills."
        benefitsTitle="Every Digital SAT student receives"
        benefits={benefits}
        ctaLabel="Book Free Diagnostic"
        ctaEvent={EVENTS.digitalSatCtaClick}
        actions={<ProgramCtas program="Digital SAT" location="digital_sat_hero" diagnosticEvent={EVENTS.digitalSatCtaClick} />}
      />

      <Section
        id="overview"
        eyebrow="Digital SAT overview"
        title="How the computer-based Digital SAT works"
        intro="Students take the Digital SAT on a laptop or tablet in the College Board's Bluebook app. Both sections adapt by module: how a student performs on the first module determines the difficulty of the second."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <dl className="flex flex-col border-t-2 border-navy">
            {testFacts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="font-extrabold text-navy">{f.label}</dt>
                <dd className="text-pretty leading-relaxed text-ink sm:text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-extrabold text-navy">Why preparation starts with a diagnostic</h3>
            <p className="leading-relaxed text-subtle">
              Because the second module depends on the first, small accuracy gains early in each section matter. A
              timed diagnostic shows which skills and question types hold a score back, so class time focuses on the
              changes most likely to raise it.
            </p>
            <p className="leading-relaxed text-subtle">
              Classes are led by founder Tariq Ahmed, an NYC DOE educator with 12+ years of teaching and test-prep
              experience, in groups of {MAX_CLASS_SIZE} or fewer.
            </p>
            <p className="flex items-start gap-3 border border-line bg-warm p-4 font-bold leading-relaxed text-navy">
              <Laptop size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              {LAPTOP_NOTE} AhmedPrep does not supply devices.
            </p>
          </div>
        </div>
      </Section>

      <Section id="curriculum" tone="warm" eyebrow="Digital SAT curriculum" title="What students learn in Math and Reading & Writing">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="flex flex-col gap-4 border border-line bg-background p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">Math</h3>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Algebra: linear equations, inequalities, and systems</li>
              <li>Advanced Math: quadratics, exponentials, and nonlinear functions</li>
              <li>Problem-Solving and Data Analysis: ratios, percentages, and statistics</li>
              <li>Geometry and Trigonometry: area, volume, circles, and right triangles</li>
            </ul>
            <Link href="/resources/digital-sat-math-practice" className="text-link mt-auto">
              Digital SAT Math practice <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className="flex flex-col gap-4 border border-line bg-background p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">Reading and Writing</h3>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Information and Ideas: central ideas, inferences, and evidence</li>
              <li>Craft and Structure: words in context and text structure</li>
              <li>Expression of Ideas: transitions and rhetorical synthesis</li>
              <li>Standard English Conventions: grammar, punctuation, and sentence boundaries</li>
            </ul>
            <Link href="/resources/digital-sat-reading-writing" className="text-link mt-auto">
              Reading &amp; Writing strategies <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </Section>

      <ClassStructure
        title="How every Digital SAT class is structured"
        intro="Each three-hour class covers both sections of the test and ends with cumulative review."
        blocks={[
          { minutes: 75, title: "Math", body: "Instruction and timed practice, including Desmos strategies where they help." },
          { minutes: 75, title: "Reading and Writing", body: "Skill-by-skill instruction across all four Reading and Writing domains." },
          { minutes: 30, title: "Cumulative review", body: "Mixed review of earlier skills and analysis of missed questions." },
        ]}
      />

      <Section id="method" tone="warm" eyebrow="Our teaching approach" title="Practice that mirrors the real test">
        <FeatureGrid items={method} />
      </Section>

      <ProgramTuition program="Digital SAT" note={LAPTOP_NOTE} />

      <EnrollmentSteps program="Digital SAT" location="digital_sat_enrollment" diagnosticEvent={EVENTS.digitalSatCtaClick} />

      <Section id="free-resources" eyebrow="Free Digital SAT resources" title="Free practice and planning tools">
        <ResourceLinks items={resources} />
      </Section>

      <ThisSundayStrip location="digital_sat" />
      <TeachingVideos page="digital_sat" title="Short Digital SAT lessons from AhmedPrep" />
      <SuccessStories program="Digital SAT" title="Digital SAT student results" />
      <Faq title="Digital SAT prep FAQ" items={faqs} />
      <LocationSection location="digital_sat" />
      <DiagnosticSection
        program="Digital SAT"
        location="digital_sat"
        title="Book a free Digital SAT diagnostic"
        intro="Complete the form and we'll contact you to confirm a diagnostic time at our Astoria location."
      />
      <JsonLd data={courseSchema} />
    </>
  )
}

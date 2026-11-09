import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/seo"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs, JsonLd, Section } from "@/components/landing/primitives"
import { ProgramHero } from "@/components/landing/program-hero"
import { courseInstances2027 } from "@/components/landing/program-cohorts-2027"
import { SuccessStories } from "@/components/landing/success-stories"
import { ThisSundayStrip } from "@/components/sunday-classes/this-sunday-strip"
import { TeachingVideos } from "@/components/videos/teaching-videos"
import { TrackedLink } from "@/components/tracked-link"
import { TuitionScheduleLink } from "@/components/landing/tuition-schedule-link"
import { ClassStructure } from "@/components/program-page/class-structure"
import { EnrollmentSteps } from "@/components/program-page/enrollment-steps"
import { FeatureGrid, ResourceLinks } from "@/components/program-page/feature-grid"
import { ProgramCtas } from "@/components/program-page/program-ctas"
import { ProgramTuition } from "@/components/program-page/program-tuition"
import { EVENTS } from "@/lib/analytics"
import { SITE_URL } from "@/lib/business"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"
import { intensiveSitewidePromoActive } from "@/lib/intensive-promo"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"
import { NYCPS_SHSAT_URL } from "@/lib/resources-shsat-2026"

const PATH = "/shsat-prep"
const TITLE = "SHSAT Prep in Astoria, Queens | AhmedPrep"
const DESCRIPTION =
  "Small-group SHSAT prep in Astoria, Queens. Math and ELA instruction, diagnostic assessments, timed practice, and 2027 programs. Maximum 12 students per class."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), type: "website" },
}

const benefits = [
  "A free, timed SHSAT-style diagnostic",
  `Small in-person classes, maximum ${MAX_CLASS_SIZE} students`,
  "Instruction led by founder Tariq Ahmed",
  "Math and ELA in every three-hour class",
  "Timed quizzes, mock exams, and progress updates",
]

const approach = [
  {
    title: "Begin with a diagnostic",
    body: "A timed, SHSAT-style diagnostic shows exactly which Math and ELA skills need work, so class time targets real gaps instead of repeating what a student already knows.",
  },
  {
    title: `Small groups of ${MAX_CLASS_SIZE} or fewer`,
    body: `Every SHSAT cohort is capped at ${MAX_CLASS_SIZE} students. That keeps classes focused and lets every student get direct feedback on their work.`,
  },
  {
    title: "Founder-led instruction",
    body: "Classes are led by founder Tariq Ahmed, an NYC DOE educator with 12+ years of teaching and test-prep experience.",
  },
]

const method = [
  { title: "Diagnostic testing", body: "Students start with a timed diagnostic that sets a baseline for Math, ELA, and pacing." },
  { title: "Targeted instruction", body: "Lessons focus on the question types and skills each diagnostic identifies as priorities." },
  { title: "Homework", body: "Short, focused assignments between classes reinforce the skills taught that week." },
  { title: "Timed quizzes", body: "Regular timed quizzes build accuracy under pressure and show what to review next." },
  { title: "Mock examinations", body: "Full-length practice exams under test-day conditions build stamina for the 180-minute test." },
  { title: "Progress tracking", body: "Parents receive updates on quiz and practice-exam results, growth by topic, and next priorities." },
]

const resources = [
  { href: "/shsat-practice-tests", label: "SHSAT practice tests", body: "Official digital practice tests and AhmedPrep practice." },
  { href: "/weekly-practice", label: "Weekly practice question", body: "A free SHSAT question with a full explanation every week." },
  { href: "/free-sunday-classes", label: "Free Sunday Zoom classes", body: "Free live SHSAT lessons for families anywhere in NYC." },
  { href: "/resources", label: "All free resources", body: "Guides on the test format, Math topics, and ELA skills." },
]

const faqs: FaqItem[] = [
  {
    q: "Who takes the SHSAT?",
    a: "NYC 8th graders, and first-time 9th graders, take the SHSAT to apply to eight of the nine Specialized High Schools. Admission to those schools is based on the SHSAT score and the student's ranked school choices. Families register through MySchools; confirm current dates on the official NYC Public Schools Specialized High Schools page.",
  },
  {
    q: "What does the SHSAT test?",
    a: "Beginning in Fall 2026, the SHSAT is a computer-adaptive test with 50 English Language Arts questions (Revising/Editing and Reading Comprehension) and 50 Math questions. Standard testing time is 180 minutes, students choose which subject to begin with, and calculators are not allowed.",
  },
  {
    q: "Can students skip questions or go back on the computer-adaptive SHSAT?",
    a: "No skipping: every question must be answered before advancing. Math and standalone ELA questions cannot be revisited after the student advances. Passage-based ELA questions can be revisited within their passage set until the set is submitted.",
  },
  {
    q: "How is each three-hour SHSAT class structured?",
    a: "Every class includes 75 minutes of Math, 75 minutes of ELA, and 30 minutes of cumulative practice, review, and error analysis.",
  },
  {
    q: "How many students are in each class?",
    a: `Every SHSAT cohort has a maximum of ${MAX_CLASS_SIZE} students.`,
  },
  {
    q: "Does an enrollment inquiry reserve my child's seat?",
    a: "No. An inquiry tells us which cohort you are interested in. A seat is confirmed only after registration is complete and payment has been received and confirmed by AhmedPrep.",
  },
  {
    q: "Is founding-family tuition available for every term?",
    a: "No. Founding-family tuition applies to Winter 2027 cohorts only. Spring and Summer 2027 cohorts offer an early full-payment discount. Discounts do not combine.",
  },
  {
    q: "When should my child start SHSAT preparation?",
    a: "It depends on the starting point. Many families begin in the winter, spring, or summer before 8th grade. The free diagnostic shows how much ground there is to cover so you can choose a realistic cohort.",
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
  description: DESCRIPTION,
  url: `${SITE_URL}${PATH}`,
  provider: { "@id": `${SITE_URL}/#organization` },
  hasCourseInstance: courseInstances2027("SHSAT"),
}

export default async function ShsatPrepPage() {
  const showIntensive = await intensiveSitewidePromoActive()
  return (
    <>
      <Breadcrumbs items={[{ label: "SHSAT Prep", href: PATH }]} />
      <ProgramHero
        location="shsat"
        eyebrow="SHSAT tutoring in Astoria · Queens, NY"
        title="SHSAT Prep in Astoria, Queens"
        serviceArea={`Small-group, in-person SHSAT prep in Astoria for families across Queens and NYC. Maximum ${MAX_CLASS_SIZE} students per class.`}
        intro="Math and ELA instruction built from a free diagnostic, with timed practice, mock exams, and regular progress updates for parents."
        benefitsTitle="Every SHSAT student receives"
        benefits={benefits}
        ctaLabel="Book Free Diagnostic"
        ctaEvent={EVENTS.shsatCtaClick}
        actions={<ProgramCtas program="SHSAT" location="shsat_hero" diagnosticEvent={EVENTS.shsatCtaClick} />}
      />

      {showIntensive && (
        <aside aria-label="SHSAT Final Intensive 2026" className="border-y-4 border-gold bg-academic text-primary-foreground">
          <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex flex-col gap-1">
              <p className="eyebrow gold">Classes in progress · Late enrollment open</p>
              <p className="text-lg font-extrabold leading-snug md:text-xl">
                From Oct. 22: Mon–Thu, 5:00–8:00 PM Eastern, in person, through Nov. 12 · Prorated tuition: $50 per remaining 3-hour class
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={INTENSIVE_PATH}
                event={EVENTS.shsatIntensiveClick}
                eventProps={{ location: "shsat_page_intensive_promo" }}
                className="button button-gold button-lg shrink-0 justify-center uppercase"
              >
                SHSAT Final Intensive 2026 <ArrowUpRight size={16} aria-hidden="true" />
              </TrackedLink>
              <TuitionScheduleLink location="shsat_page_intensive_promo" className="button-lg shrink-0 justify-center" />
            </div>
          </div>
        </aside>
      )}

      <Section
        id="overview"
        eyebrow="SHSAT program overview"
        title="How the SHSAT works"
        intro="The Specialized High Schools Admissions Test (SHSAT) is taken by NYC 8th graders, and first-time 9th graders, applying to eight of the nine Specialized High Schools. Admission to those schools is based on the SHSAT score and each student's ranked school choices."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-extrabold text-navy">The Fall 2026 computer-adaptive format</h3>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Taken on NYCPS-provided computers, except for limited approved paper accommodations.</li>
              <li>50 English Language Arts questions and 50 Math questions.</li>
              <li>180 minutes of standard testing time; students choose which subject to begin with.</li>
              <li>Multiple-choice, fill-in-the-blank, and technology-enhanced items. No calculators.</li>
              <li>Every question must be answered before advancing. Math and standalone ELA questions cannot be revisited.</li>
            </ul>
            <p className="leading-relaxed text-subtle">
              Confirm current details on the official{" "}
              <a href={NYCPS_SHSAT_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-navy underline underline-offset-4">
                NYC Public Schools SHSAT page
              </a>
              , or read{" "}
              <Link href="/resources/digital-shsat-2026" className="font-bold text-navy underline underline-offset-4">
                how the Fall 2026 SHSAT works
              </Link>
              .
            </p>
          </div>
          <ul className="flex flex-col gap-px border border-line bg-line">
            {approach.map((item) => (
              <li key={item.title} className="bg-warm p-6">
                <h3 className="text-lg font-extrabold text-navy">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-subtle">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="curriculum" tone="warm" eyebrow="SHSAT curriculum" title="What students learn in Math and ELA">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="flex flex-col gap-4 border border-line bg-background p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">SHSAT Math</h3>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Arithmetic and number sense</li>
              <li>Algebraic expressions, equations, and inequalities</li>
              <li>Ratios, rates, and percentages</li>
              <li>Geometry and measurement</li>
              <li>Multi-step word problems</li>
              <li>Statistics, probability, and quantitative reasoning</li>
            </ul>
            <div className="mt-auto flex flex-col items-start gap-2">
              <Link href="/resources/shsat-math-practice" className="text-link">
                SHSAT Math practice questions <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/resources/shsat-math-topics" className="text-link">
                SHSAT Math topics checklist <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
          <article className="flex flex-col gap-4 border border-line bg-background p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-navy">SHSAT ELA</h3>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
              <li>Revising and Editing: grammar, punctuation, and organization</li>
              <li>Reading comprehension</li>
              <li>Literary analysis of fiction and poetry</li>
              <li>Informational passages</li>
              <li>Vocabulary in context</li>
              <li>Evidence-based reasoning</li>
            </ul>
            <div className="mt-auto flex flex-col items-start gap-2">
              <Link href="/resources/shsat-ela-practice" className="text-link">
                SHSAT ELA practice: reading and grammar <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </Section>

      <ClassStructure
        title="How every SHSAT class is structured"
        intro="Each three-hour class covers both sections of the test, then closes with cumulative work so skills from earlier weeks stay sharp."
        blocks={[
          { minutes: 75, title: "Math", body: "Direct instruction and guided practice on the week's Math topics." },
          { minutes: 75, title: "ELA", body: "Revising and Editing skills plus reading comprehension practice." },
          {
            minutes: 30,
            title: "Cumulative practice and review",
            body: "Mixed review, timed practice, and error analysis of the questions students missed.",
          },
        ]}
      />

      <Section id="method" tone="warm" eyebrow="Our teaching approach" title="Diagnostic-based teaching with structured practice">
        <FeatureGrid items={method} />
      </Section>

      <ProgramTuition program="SHSAT" />

      <EnrollmentSteps program="SHSAT" location="shsat_enrollment" diagnosticEvent={EVENTS.shsatCtaClick} />

      <Section id="free-resources" eyebrow="Free SHSAT resources" title="Practice tests and free SHSAT help">
        <ResourceLinks items={resources} />
      </Section>

      <ThisSundayStrip location="shsat" />
      <TeachingVideos page="shsat" title="Short SHSAT lessons from AhmedPrep" />
      <SuccessStories program="SHSAT" title="SHSAT student results" />
      <Faq title="SHSAT prep FAQ" items={faqs} />
      <LocationSection location="shsat" />
      <DiagnosticSection
        program="SHSAT"
        location="shsat"
        title="Book a free SHSAT diagnostic"
        intro="Complete the form and we'll contact you to confirm a diagnostic time at our Astoria location."
      />
      <JsonLd data={courseSchema} />
    </>
  )
}

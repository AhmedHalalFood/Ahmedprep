import type { Metadata } from "next"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
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
import { SatIntensiveAnnouncement } from "@/components/sat-intensive/announcement"
import { TeachingVideos } from "@/components/videos/teaching-videos"
import { ClassStructure } from "@/components/program-page/class-structure"
import { EnrollmentSteps } from "@/components/program-page/enrollment-steps"
import { FeatureGrid, ResourceLinks } from "@/components/program-page/feature-grid"
import { ProgramCtas } from "@/components/program-page/program-ctas"
import { ProgramTuition } from "@/components/program-page/program-tuition"
import { OfficialExamSources } from "@/components/program-page/official-exam-sources"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS, SITE_URL } from "@/lib/business"
import { MAX_CLASS_SIZE, cohortsFor, cohortInquiryHref, priceFor, dollars } from "@/lib/cohorts-2027"

export const revalidate = 3600

const PATH = "/digital-sat-prep"
const TITLE = "Digital SAT Prep in Queens & Online | AhmedPrep"
const DESCRIPTION = `Prepare for the Digital SAT with AhmedPrep. Live online classes nationwide and in-person tutoring in Astoria, Queens. Small groups, max ${MAX_CLASS_SIZE}. Free diagnostic.`

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  robots: { index: true, follow: true },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH) },
}

const LAPTOP_NOTE = "Digital SAT students need a compatible laptop for online classes and must bring a laptop to in-person classes."

const benefits = [
  "A free Digital SAT diagnostic with score analysis",
  `Live online or in-person small groups, maximum ${MAX_CLASS_SIZE} students`,
  "Every class personally taught by founder Tariq Ahmed",
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
    a: "Yes. Online students need a compatible laptop and reliable internet for live Zoom instruction and independent Bluebook practice. In-person students must bring their own laptop. AhmedPrep does not supply devices.",
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
    q: "Where are Digital SAT classes and tutoring held?",
    a: `Winter 2027 weekday Digital SAT classes are live online via Zoom on Tuesdays and Thursdays, 6:30–9:30 PM Eastern, and welcome students throughout the continental United States. Winter weekend SAT classes are in person at ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}. Spring and Summer follow their separately published schedules. Contact AhmedPrep for private tutoring arrangements.`,
  },
  {
    q: "Is AhmedPrep affiliated with the College Board?",
    a: "No. AhmedPrep is an independent test preparation provider. SAT is a trademark of the College Board, which is not affiliated with AhmedPrep.",
  },
]

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Digital SAT Prep: Live Online and In Person",
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
        balancedActions
        eyebrow="SAT tutoring in NYC · Astoria, Queens"
        title="Digital SAT Prep: Live Online or In Person"
        serviceArea={`Winter weekday Digital SAT classes are live online nationwide; weekend classes meet in person in Astoria, Queens. Maximum ${MAX_CLASS_SIZE} students per class.`}
        intro="Math and Reading & Writing instruction built from a free diagnostic, with Bluebook practice, Desmos strategies, and timed adaptive-module drills."
        benefitsTitle="Every Digital SAT student receives"
        benefits={benefits}
        ctaLabel="Book Free Diagnostic"
        ctaEvent={EVENTS.digitalSatCtaClick}
        actions={<ProgramCtas program="Digital SAT" location="digital_sat_hero" diagnosticEvent={EVENTS.digitalSatCtaClick} compact />}
      />

      <SatIntensiveAnnouncement />

      <section aria-labelledby="dsat-winter-enrollment" className="bg-site-canvas py-6 md:py-8">
        <div className="container">
          <div className="rounded-2xl border border-[#D7E4EE] bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Winter 2027 · Now enrolling</p>
            <h2 id="dsat-winter-enrollment" className="mt-2 text-2xl font-extrabold text-navy md:text-3xl">
              Winter Digital SAT classes: online or in Astoria
            </h2>
            <p className="mt-2 text-ink">
              Weekday classes meet live online via Zoom (nationwide); weekend classes meet in person in Astoria. Both offer 12 weeks, 24 meetings, 72 instructional hours, maximum {MAX_CLASS_SIZE} students per class.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {cohortsFor("Digital SAT", "winter").map((cohort) => {
                const tuition = priceFor(cohort)
                return (
                  <article key={cohort.id} className="rounded-xl border border-[#D7E4EE] bg-[#F5FAFE] p-4">
                    <h3 className="text-lg font-extrabold text-navy">Digital SAT {cohort.label} · {cohort.id === "winter-dsat-weekday" ? "Live online (Zoom)" : "In person (Astoria)"}</h3>
                    <p className="mt-1 font-semibold text-ink">{cohort.days}, {cohort.time} ET</p>
                    <p className="mt-1 text-sm text-subtle">Starts {cohort.firstIso === "2027-01-09" ? "January 9" : "January 12"}, 2027</p>
                    <p className="mt-3 text-sm text-ink">
                      Regular tuition: {dollars(tuition.regular)} · Founding-family: {dollars(tuition.founding!)}
                    </p>
                    <Link href={cohortInquiryHref(cohort)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold px-5 py-2 font-extrabold text-navy hover:bg-gold/90">
                      Request {cohort.label.toLowerCase()} enrollment <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </article>
                )
              })}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-subtle">
              Founding-family tuition is limited to the first five fully paid students per class, with full payment by December 12, 2026 at 11:59 PM ET, subject to seat availability. Regular tuition is paid in full before enrollment is confirmed. An inquiry does not reserve a seat.
            </p>
            <Link href="/enroll-2027" className="mt-3 inline-flex items-center gap-2 font-bold text-brand underline underline-offset-4">
              Compare all 2027 class schedules and tuition <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Section
        id="overview"
        eyebrow="Digital SAT overview"
        title="How the Digital SAT works"
        intro="Students take the Digital SAT on a laptop or tablet in the College Board's Bluebook app. Both sections adapt by module: how a student performs on the first module determines the difficulty of the second."
      >
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#D7E4EE] border-t-4 border-t-brand bg-[#F5FAFE] p-4 sm:p-6">
            <h3 className="mb-3 text-lg font-extrabold tracking-tight text-navy sm:mb-4">Digital SAT format at a glance</h3>
            <dl className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              {testFacts.map((f) => (
                <div key={f.label} className="rounded-xl border border-[#DCE8F1] border-l-4 border-l-brand bg-white px-4 py-3 shadow-sm sm:px-4 sm:py-4">
                  <dt className="text-sm font-extrabold leading-snug text-navy">{f.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-[#E6E1D5] border-t-4 border-t-gold bg-[#FFFCF6] p-5 sm:p-6">
            <h3 className="text-xl font-extrabold text-navy">Why preparation starts with a diagnostic</h3>
            <p className="leading-relaxed text-ink">
              Because the second module depends on the first, small accuracy gains early in each section matter. A
              timed diagnostic shows which skills and question types hold a score back, so class time focuses on the
              changes most likely to raise it.
            </p>
            <p className="leading-relaxed text-subtle">
              Classes are personally taught by founder Tariq Ahmed, who has 12+ years of teaching and test-prep
              experience, in groups of {MAX_CLASS_SIZE} or fewer.
            </p>
            <div className="mt-auto flex items-start gap-3 rounded-xl border border-[#D7E4EE] bg-white p-4">
              <Laptop size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <p className="font-bold leading-relaxed text-navy">
                {LAPTOP_NOTE} AhmedPrep does not supply devices.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="sat-mastery"
        eyebrow="AhmedPrep Integrated Digital SAT Mastery"
        title="Foundation through the 1600 Challenge, in every cohort"
        intro="Winter, Spring, and Summer cohorts cover the full Digital SAT curriculum. Students enter based on a diagnostic and receive skill-level assignments within the same small group. No student must wait for a particular season to study advanced topics."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Foundation", detail: "Repair essential algebra, grammar, reading, and problem-solving gaps.", tone: "border-blue-200 bg-blue-50" },
            { name: "Advanced Mastery", detail: "Build stronger reasoning across all Math and Reading & Writing domains.", tone: "border-emerald-200 bg-emerald-50" },
            { name: "Intensive Application", detail: "Practice difficult, mixed-domain questions with timing and error analysis.", tone: "border-amber-200 bg-amber-50" },
            { name: "1600 Challenge", detail: "Pursue near-perfect accuracy on the hardest exam-relevant questions and modules.", tone: "border-slate-200 bg-slate-50" },
          ].map((tier) => (
            <article key={tier.name} className={`rounded-xl border p-5 ${tier.tone}`}>
              <h3 className="text-lg font-extrabold text-navy">{tier.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">{tier.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-subtle">
          Every cohort includes 75 minutes of Math, 75 minutes of Reading &amp; Writing, and 30 minutes of guided practice per class. Official Bluebook testing and targeted performance reviews help students prepare for their selected SAT date. Our goal is each student’s highest attainable score, with 1600 as the top challenge, never a guaranteed result.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-subtle">
          Additional test-date-specific Final SAT Intensives are planned, with schedules and tuition announced separately.
        </p>
        <Link href="/programs-2027" className="text-link mt-4">
          Compare Digital SAT classes and schedules <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
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

      <OfficialExamSources exam="Digital SAT" />

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
        intro="Complete the form and we'll contact you to arrange a diagnostic. Winter weekday SAT classes are live online; weekend classes meet in Astoria."
      />
      <JsonLd data={courseSchema} />
    </>
  )
}

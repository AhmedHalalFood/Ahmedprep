import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"
import { intensivePromoActive } from "@/lib/intensive-promo"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { IntensiveHero } from "@/components/landing/intensive-hero"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs, JsonLd, Section } from "@/components/landing/primitives"
import { ShsatIntensive } from "@/components/landing/shsat-intensive"
import { BUSINESS, NOT_AFFILIATED_NOTE, SITE_URL } from "@/lib/business"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import {
  CLASS_DATES,
  HOURS_PER_CLASS,
  INTENSIVE_NAME,
  CLASS_SCHEDULE,
  INTENSIVE_PATH,
  ORIGINAL_HOURS,
  ORIGINAL_TUITION,
  TUITION_PER_CLASS,
  enrollmentSnapshot,
  formatClassDate,
  formatUsd,
  type EnrollmentSnapshot,
} from "@/lib/shsat-intensive"

export const revalidate = 300

const TITLE = "SHSAT Final Intensive 2026 | Late Enrollment Open | Ahmed Prep NYC"
const DESCRIPTION =
  "SHSAT Final Intensive classes in progress in Astoria, Queens. From Oct. 22: Mon–Thu 5–8 PM through Nov. 12, in person only. Late enrollment open: prorated tuition of $50 per remaining 3-hour class."
const PAGE_URL = absoluteUrl(INTENSIVE_PATH)

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: PAGE_URL },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

function lateEnrollmentAnswer(snapshot: EnrollmentSnapshot) {
  if (!snapshot.nextClass) return "All scheduled classes have been held, so the Intensive is no longer accepting enrollments. Call or text us about year-round SHSAT tutoring."
  return `Yes. Late enrollment is open. If your child starts at the next class, ${formatClassDate(snapshot.nextClass, "long")}, they attend the ${snapshot.classes} remaining classes (${snapshot.hours} instructional hours) for ${formatUsd(snapshot.tuition)}.`
}

const buildFaqs = (snapshot: EnrollmentSnapshot): FaqItem[] => [
  {
    q: "Who is the SHSAT Final Intensive 2026 for?",
    a: "NYC students taking the SHSAT in November 2026 who want structured, focused preparation in the final five weeks before test day. Students should already be registered for the SHSAT through their school counselor.",
  },
  {
    q: "Where are classes held?",
    a: `All 20 classes are held in person at Ahmed Prep, ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}.`,
  },
  {
    q: "What is the schedule?",
    a: "Beginning Thursday, October 22, 2026, classes meet Monday through Thursday, 5:00 PM to 8:00 PM Eastern, in person only, through November 12, 2026. Classes from October 12 through October 21 met 6:00 PM to 9:00 PM. Every class is 3 hours: 20 classes and 60 hours of live instruction in total.",
  },
  {
    q: "Can my child still join now that classes have started?",
    a: lateEnrollmentAnswer(snapshot),
  },
  {
    q: "How is late-enrollment tuition calculated?",
    a: `The original program is ${ORIGINAL_HOURS} instructional hours for ${formatUsd(ORIGINAL_TUITION)}, which is ${formatUsd(TUITION_PER_CLASS)} per ${HOURS_PER_CLASS}-hour class. Late-enrollment tuition is ${formatUsd(TUITION_PER_CLASS)} for each scheduled class from your child\u2019s first class through November 12. Classes held before your child joins are not included and are not charged.`,
  },
  {
    q: "How do I enroll?",
    a: "Use the Enroll in SHSAT Intensive form on this page, call 347-479-5020, or send us a text. We\u2019ll follow up to confirm your child\u2019s first class and prorated tuition.",
  },
]

const buildEventSchema = (snapshot: EnrollmentSnapshot) => ({
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: INTENSIVE_NAME,
  description:
    `A 5-week, in-person SHSAT intensive course in Astoria, Queens: ${CLASS_DATES.length} live classes and ${ORIGINAL_HOURS} hours of SHSAT Math, ELA, timed practice, error review, pacing, and test-day strategy.`,
  url: PAGE_URL,
  image: [`${SITE_URL}/ahmedprep-hero.png`],
  startDate: `${CLASS_SCHEDULE[0].date}T${CLASS_SCHEDULE[0].start}:00-04:00`,
  endDate: `${CLASS_SCHEDULE[CLASS_SCHEDULE.length - 1].date}T${CLASS_SCHEDULE[CLASS_SCHEDULE.length - 1].end}:00-05:00`,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  educationalLevel: "Middle school",
  location: {
    "@type": "Place",
    name: BUSINESS.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
  },
  organizer: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    url: SITE_URL,
    telephone: BUSINESS.phoneE164,
  },
  performer: { "@type": "Person", name: "Tariq Ahmed" },
  ...(snapshot.nextClass && {
    offers: {
      "@type": "Offer",
      url: PAGE_URL,
      name: `Late enrollment from ${formatClassDate(snapshot.nextClass, "long")} (${snapshot.classes} remaining classes, ${snapshot.hours} instructional hours)`,
      price: snapshot.tuition,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }),
})

export default async function ShsatFinalIntensivePage() {
  if (!(await intensivePromoActive())) redirect(ENROLLMENT_2027.requestHref)
  const snapshot = enrollmentSnapshot()
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "SHSAT Prep", href: "/shsat" },
          { label: INTENSIVE_NAME, href: INTENSIVE_PATH },
        ]}
      />
      <IntensiveHero snapshot={snapshot} />

      <Section
        id="overview"
        eyebrow="For NYC parents"
        title="A focused SHSAT intensive course for the final weeks"
        intro={
          <>
            The SHSAT is in November, and the last five weeks matter. Our 2026 SHSAT prep program gives your child a clear schedule, live
            instruction four evenings a week, and steady feedback, so preparation is structured instead of scattered. Families come to us
            for SHSAT prep in Astoria from across Queens and the rest of New York City.
          </>
        }
      >
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          <article className="bg-white p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-navy">SHSAT Math prep</h3>
            <p className="mt-3 leading-relaxed text-subtle">
              Word problems, ratios and percents, algebra, geometry, and fill-in-the-blank questions, practiced without a calculator, with
              answer-before-advancing strategies for the computer-adaptive SHSAT.
            </p>
          </article>
          <article className="bg-white p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-navy">SHSAT ELA prep</h3>
            <p className="mt-3 leading-relaxed text-subtle">
              Revising/Editing and reading comprehension, with elimination strategies, evidence-based answers, and the reading stamina the
              exam demands.
            </p>
          </article>
          <article className="bg-white p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-navy">Timed practice and review</h3>
            <p className="mt-3 leading-relaxed text-subtle">
              Timed SHSAT practice builds pacing for the 180-minute test. Every mistake is reviewed so your child knows what to fix before
              test day.
            </p>
          </article>
        </div>
      </Section>

      <ShsatIntensive variant="page" snapshot={snapshot} />

      <Section
        id="why-ahmed-prep"
        tone="warm"
        eyebrow="Why Ahmed Prep"
        title="NYC SHSAT preparation from a local educator"
        intro={
          <>
            Classes are led by founder Tariq Ahmed, an NYC DOE educator with 12+ years of teaching and test-prep
            experience. Parents receive progress updates throughout the five weeks, so you always know where your child stands. If you are
            comparing options for SHSAT prep in Queens, call or text us. We&apos;re happy to answer questions.
          </>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-8">
          <Link href="/shsat" className="text-link">
            Year-round SHSAT tutoring in Queens <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/free-diagnostic" className="text-link">
            Book a free SHSAT diagnostic <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </Section>

      <Faq title="SHSAT Final Intensive 2026 FAQ" items={buildFaqs(snapshot)} />
      <LocationSection location="shsat_intensive_page" />
      <p className="container py-6 text-xs leading-relaxed text-subtle">{NOT_AFFILIATED_NOTE}</p>
      <JsonLd data={buildEventSchema(snapshot)} />
    </>
  )
}

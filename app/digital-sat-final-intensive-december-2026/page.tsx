import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { SatIntensiveCurriculum } from "@/components/sat-intensive/curriculum"
import { SatIntensiveEnrollment } from "@/components/sat-intensive/enrollment"
import { SatIntensiveHero } from "@/components/sat-intensive/hero"
import { SatIntensiveMobileBar } from "@/components/sat-intensive/mobile-enroll-bar"
import { SatIntensiveDetails } from "@/components/sat-intensive/program-details"
import { SatIntensiveTimeline } from "@/components/sat-intensive/timeline"
import { BUSINESS, NOT_AFFILIATED_NOTE } from "@/lib/business"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import {
  CLASS_DATES,
  PRICE_PER_CLASS_CENTS,
  SAT_INTENSIVE_CAPACITY,
  SAT_INTENSIVE_NAME,
  SAT_INTENSIVE_PATH,
  WHAT_TO_BRING,
  formatUsd,
  quoteFor,
} from "@/lib/sat-final-intensive"
import { absoluteUrl } from "@/lib/seo"

export const dynamic = "force-dynamic"

const TITLE = "Digital SAT Final Intensive | December 5, 2026 SAT | AhmedPrep Astoria"
const DESCRIPTION =
  "In-person Digital SAT Final Intensive in Astoria, Queens for the December 5, 2026 SAT. Nov 16–Dec 3, Mon–Thu 6–9 PM, max 12 students. Rolling enrollment: $75 per remaining class."
const PAGE_URL = absoluteUrl(SAT_INTENSIVE_PATH)

// Preview-only until the owner approves launch: never indexed, and the route itself 404s on Production.
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

const FULL = quoteFor(CLASS_DATES[0])

const FAQS: FaqItem[] = [
  {
    q: "How does rolling enrollment work?",
    a: `Students can join on any class date that has not started yet. Tuition is ${formatUsd(PRICE_PER_CLASS_CENTS)} per 3-hour class, so you pay only for the classes that remain from your chosen first class. Starting November 16 covers all ${FULL.remainingClasses} classes (${FULL.remainingHours} hours) for ${formatUsd(FULL.tuitionCents)}.`,
  },
  {
    q: "Can we pay per class or in installments?",
    a: "No. Tuition for all remaining classes is paid in full and upfront to confirm a seat. Individual drop-in classes are not offered.",
  },
  {
    q: "Is there an online option?",
    a: `No. All classes are in person at ${BUSINESS.address.street}, ${BUSINESS.address.city}. There is no online or hybrid option.`,
  },
  {
    q: "How many students are in each class?",
    a: `A maximum of ${SAT_INTENSIVE_CAPACITY} students, so instructors can give personalized feedback on practice work.`,
  },
  {
    q: "Does this register my student for the SAT?",
    a: "No. Students must register for the December 5, 2026 SAT separately through the College Board. You can still enroll if registration is in progress.",
  },
  {
    q: "Is there a class on Thanksgiving?",
    a: "No. There is no class on Thursday, November 26.",
  },
  { q: "What should my student bring?", a: `${WHAT_TO_BRING.join("; ")}.` },
]

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: SAT_INTENSIVE_NAME,
  description: DESCRIPTION,
  url: PAGE_URL,
  provider: { "@type": "EducationalOrganization", name: BUSINESS.name, url: absoluteUrl("/") },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "onsite",
    startDate: `${CLASS_DATES[0]}T18:00:00-05:00`,
    endDate: `${CLASS_DATES[CLASS_DATES.length - 1]}T21:00:00-05:00`,
    location: {
      "@type": "Place",
      name: BUSINESS.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.city,
        addressRegion: BUSINESS.address.region,
        postalCode: BUSINESS.address.postalCode,
        addressCountry: "US",
      },
    },
  },
  offers: { "@type": "Offer", price: (FULL.tuitionCents / 100).toFixed(2), priceCurrency: "USD", category: "Paid" },
}

export default function DigitalSatFinalIntensivePage() {
  if (!internalPreviewAllowed()) notFound()

  return (
    <>
      <p className="bg-gold px-4 py-2 text-center text-xs font-extrabold uppercase tracking-wider text-navy">
        Preview only · Not public · Test registrations only, no payment collected
      </p>
      <Breadcrumbs items={[{ label: "Digital SAT Final Intensive", href: SAT_INTENSIVE_PATH }]} />
      <SatIntensiveHero />
      <SatIntensiveDetails />
      <SatIntensiveCurriculum />
      <SatIntensiveTimeline />
      <SatIntensiveEnrollment renderedAt={new Date().toISOString()} />
      <Faq title="Digital SAT Final Intensive FAQ" items={FAQS} />
      <LocationSection location="sat_intensive_page" />
      <p className="container py-6 text-xs leading-relaxed text-subtle">
        SAT is a registered trademark of the College Board, which is not affiliated with AhmedPrep. {NOT_AFFILIATED_NOTE}
      </p>
      <SatIntensiveMobileBar />
      <JsonLd data={courseSchema} />
    </>
  )
}

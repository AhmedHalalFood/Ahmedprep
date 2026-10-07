import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Faq, type FaqItem } from "@/components/landing/faq"
import { IntensiveHero } from "@/components/landing/intensive-hero"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs, JsonLd, Section } from "@/components/landing/primitives"
import { ShsatIntensive } from "@/components/landing/shsat-intensive"
import { BUSINESS, NOT_AFFILIATED_NOTE, SITE_URL } from "@/lib/business"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import { INTENSIVE_NAME, INTENSIVE_PATH } from "@/lib/shsat-intensive"

const TITLE = "2026 SHSAT Final Intensive | 60 Hours | Ahmed Prep NYC"
const DESCRIPTION =
  "5-week SHSAT intensive in Astoria, Queens. 20 live classes, 60 hours of Math, ELA, timed practice and strategy for $1,000. Oct. 12-Nov. 12."
const PAGE_URL = absoluteUrl(INTENSIVE_PATH)

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: PAGE_URL },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

const faqs: FaqItem[] = [
  {
    q: "Who is the 2026 SHSAT Final Intensive for?",
    a: "NYC students taking the SHSAT in November 2026 who want structured, focused preparation in the final five weeks before test day. Students should already be registered for the SHSAT through their school counselor.",
  },
  {
    q: "Where are classes held?",
    a: `All 20 classes are held in person at Ahmed Prep, ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}.`,
  },
  {
    q: "What is the schedule?",
    a: "Classes meet Monday through Thursday, 6:00 PM to 9:00 PM, from October 12 to November 12, 2026: 20 classes and 60 hours of live instruction in total.",
  },
  {
    q: "How much does the Intensive cost?",
    a: "The complete program is $1,000, about $16.67 per live instructional hour. Families can pay in full or in 2 payments of $500.",
  },
  {
    q: "How do I reserve a seat?",
    a: "Use the Reserve My Child\u2019s Seat form on this page, call 347-479-5020, or send us a text. We\u2019ll follow up to confirm enrollment and payment details.",
  },
]

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: INTENSIVE_NAME,
  description:
    "A 5-week, in-person SHSAT intensive course in Astoria, Queens: 20 live classes and 60 hours of SHSAT Math, ELA, timed practice, error review, pacing, and test-day strategy.",
  url: PAGE_URL,
  image: [`${SITE_URL}/ahmedprep-hero.png`],
  startDate: "2026-10-12T18:00:00-04:00",
  endDate: "2026-11-12T21:00:00-05:00",
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
  offers: {
    "@type": "Offer",
    url: PAGE_URL,
    price: 1000,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
}

export default function ShsatFinalIntensivePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "SHSAT Prep", href: "/shsat" },
          { label: "2026 SHSAT Final Intensive", href: INTENSIVE_PATH },
        ]}
      />
      <IntensiveHero />

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
              Word problems, ratios and percents, algebra, geometry, and grid-ins, practiced without a calculator, with strategies for
              accuracy under time pressure.
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

      <ShsatIntensive variant="page" />

      <Section
        id="why-ahmed-prep"
        tone="warm"
        eyebrow="Why Ahmed Prep"
        title="NYC SHSAT preparation from a local educator"
        intro={
          <>
            Classes are led by founder Tariq Ahmed, an NYC DOE educator with an M.S. in Mathematics and 12+ years of teaching and test-prep
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

      <Faq title="2026 SHSAT Final Intensive FAQ" items={faqs} />
      <LocationSection location="shsat_intensive_page" />
      <p className="container py-6 text-xs leading-relaxed text-subtle">{NOT_AFFILIATED_NOTE}</p>
      <JsonLd data={eventSchema} />
    </>
  )
}

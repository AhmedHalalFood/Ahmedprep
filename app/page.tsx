import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Programs } from "@/components/programs"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return <main><Header /><Hero /><About /><Programs /><Testimonials /><CTA /><Contact /><Footer /></main>
}

export const metadata = {
  title: "AhmedPrep | SHSAT & Digital SAT Prep in NYC",
  description: "Specialized SHSAT tutoring and Digital SAT preparation for ambitious New York students, led by Tariq Ahmed.",
}

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "AhmedPrep",
  description: "Specialized SHSAT and Digital SAT preparation in New York City.",
  areaServed: "New York City",
}

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1d35" }

export function JsonLd() { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /> }


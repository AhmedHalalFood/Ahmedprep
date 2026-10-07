import type { Metadata } from "next"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import { Contact } from "@/components/contact"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs } from "@/components/landing/primitives"

export const metadata: Metadata = {
  title: "Contact AhmedPrep in Astoria, Queens",
  description: "Call, text, or send a message to AhmedPrep at 20-65 47th Street, Astoria, NY. SHSAT and Digital SAT prep consultations.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/contact") },
}

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <h1 className="sr-only">Contact AhmedPrep</h1>
      <Contact />
      <LocationSection location="contact" />
    </>
  )
}

import type { Metadata } from "next"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { GoogleReviews } from "@/components/landing/google-reviews"
import { LocationSection } from "@/components/landing/location-section"
import { Breadcrumbs } from "@/components/landing/primitives"

export const metadata: Metadata = {
  title: "About AhmedPrep and Founder Tariq Ahmed",
  description:
    "AhmedPrep is an Astoria, Queens test prep center founded by Tariq Ahmed, an NYC DOE educator with an M.S. in Mathematics and 12+ years of experience.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/about") },
}

const credentials = [
  ["Education", "B.S., New York University"],
  ["Graduate degree", "M.S. Mathematics, Hunter College"],
  ["Classroom", "NYC DOE Educator"],
  ["Experience", "12+ Years of Teaching & Test-Prep Experience"],
]

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
      <section aria-labelledby="about-title" className="founder-section">
        <div className="container founder-grid">
          <div className="founder-intro">
            <p className="eyebrow blue">About AhmedPrep</p>
            <h1 id="about-title" className="mt-3 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
              Tariq Ahmed
            </h1>
            <p className="founder-role">Founder & Lead Instructor</p>
            <p className="founder-text">
              AhmedPrep provides New York students with focused, individualized instruction built around their starting point, goals, and
              progress. From our classroom in Astoria, Queens, we prepare students for the SHSAT and the Digital SAT with a simple approach:
              diagnose carefully, plan realistically, teach directly, and measure progress.
            </p>
          </div>
          <dl className="credentials" aria-label="Credentials">
            {credentials.map(([dt, dd]) => (
              <div key={dt}>
                <dt>{dt}</dt>
                <dd>{dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <GoogleReviews />
      <LocationSection location="about" />
      <DiagnosticSection location="about" />
    </>
  )
}

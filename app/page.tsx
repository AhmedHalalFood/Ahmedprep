import type { Metadata } from "next"
import Image from "next/image"
import { ArrowUpRight, MessageSquare, Phone } from "lucide-react"
import { CampaignBanner } from "@/components/landing/campaign-banner"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { Enrollment2027 } from "@/components/landing/enrollment-2027"
import { GoogleReviews } from "@/components/landing/google-reviews"
import { ProgramsPreview } from "@/components/landing/programs-preview"
import { ResultsPreview } from "@/components/landing/results-preview"
import { ToolsResources } from "@/components/landing/tools-resources"
import { WhyFamilies } from "@/components/landing/why-families"
import { PracticeLibraryCard } from "@/components/practice-tests/practice-library-card"
import { ThisSundayStrip } from "@/components/sunday-classes/this-sunday-strip"
import { TrackedLink } from "@/components/tracked-link"
import { WeeklyPracticeCard } from "@/components/weekly-practice/weekly-practice-card"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: "AhmedPrep | January 2027 SHSAT & Digital SAT Enrollment in Astoria, Queens" },
  description:
    "January 2027 enrollment for SHSAT and Digital SAT Prep in Astoria, Queens: 12-week small-group programs with a maximum of 10 students, free diagnostics, and clear tuition.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/") },
}

// Hourly so the "Next free Sunday class" card rolls over shortly after each Sunday class ends.
export const revalidate = 3600

export default function Home() {
  return (
    <>
      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-image" aria-hidden="true">
          <Image
            src="/ahmedprep-hero.png"
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 800px) 970px, 100vw"
          />
        </div>
        <div className="hero-panel">
          <p className="eyebrow blue">{ENROLLMENT_2027.eyebrow}</p>
          <h1 id="hero-title">
            Big Goals. Small Classes. <em>Real Progress.</em>
          </h1>
          <p className="hero-copy">
            Expert-led SHSAT and Digital SAT preparation in Astoria, Queens. Personalized instruction, measurable progress, and
            affordable tuition.
          </p>
          <div className="hero-actions">
            <TrackedLink
              href={ENROLLMENT_2027.requestHref}
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_hero", cta: "request_enrollment_info" }}
              className="button button-gold button-lg"
            >
              Request Enrollment Information <ArrowUpRight size={17} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href={ENROLLMENT_2027.diagnosticHref}
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_hero_secondary" }}
              className="button button-outline button-lg"
            >
              Book a Free Diagnostic
            </TrackedLink>
          </div>
          <div className="hero-contact">
            <span>Questions?</span>
            <TrackedLink
              href={BUSINESS.phoneHref}
              event={EVENTS.phoneClick}
              eventProps={{ location: "home_hero" }}
              aria-label={`Call AhmedPrep at ${BUSINESS.phoneDisplay}`}
            >
              <Phone size={14} aria-hidden="true" />
              Call {BUSINESS.phoneDisplay}
            </TrackedLink>
            <TrackedLink
              href={BUSINESS.smsHref}
              event={EVENTS.textClick}
              eventProps={{ location: "home_hero" }}
              aria-label={`Text AhmedPrep at ${BUSINESS.phoneDisplay}`}
            >
              <MessageSquare size={14} aria-hidden="true" />
              Text us
            </TrackedLink>
          </div>
          <p className="hero-trust">
            SHSAT Preparation <span aria-hidden="true">•</span> Digital SAT Preparation
          </p>
          <p className="hero-trust">
            Astoria <span aria-hidden="true">•</span> Queens <span aria-hidden="true">•</span> NYC-Wide Online{" "}
            <span aria-hidden="true">•</span> Digital SAT Across NYC &amp; Long Island
          </p>
        </div>
      </section>

      <Enrollment2027 />

      <CampaignBanner />

      <ResultsPreview />

      <ThisSundayStrip location="home" />

      <WeeklyPracticeCard location="home" />
      <PracticeLibraryCard />

      <WhyFamilies />

      <ToolsResources />

      <ProgramsPreview />

      <GoogleReviews />

      <DiagnosticSection
        location="home"
        title="Start with a free diagnostic"
        intro="Choose SHSAT or Digital SAT and tell us about your student. We'll contact you to confirm a diagnostic time at our Astoria location."
      />
    </>
  )
}

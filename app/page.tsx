import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Sparkle } from "lucide-react"
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
import { ENROLLMENT_2027 } from "@/lib/enrollment-2027"
import { intensivePromoActive } from "@/lib/intensive-promo"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: "AhmedPrep | January 2027 SHSAT & Digital SAT Enrollment in Astoria, Queens" },
  description:
    "January 2027 enrollment for SHSAT and Digital SAT Prep in Astoria, Queens: 12-week small-group programs with a maximum of 12 students, free diagnostics, and clear tuition.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/") },
}

// Hourly so the "Next free Sunday class" card rolls over shortly after each Sunday class ends.
export const revalidate = 3600

export default async function Home() {
  const showIntensive = await intensivePromoActive()
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
          <p className="hero-announce">
            <Sparkle className="hero-sparkle" size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            New SHSAT &amp; Digital SAT Cohorts
            <Sparkle className="hero-sparkle" size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </p>
          <h1 id="hero-title">
            <span className="hero-launch-date">January 2027</span>
            <span className="hero-slogan">
              <span className="hero-slogan-lead">Big Goals. Small Classes.</span>
              <span className="hero-slogan-accent">Real Progress.</span>
            </span>
          </h1>
          <p className="hero-support">
            Personalized instruction <span aria-hidden="true">•</span> 12-week programs{" "}
            <span aria-hidden="true">•</span> 72 instructional hours
          </p>
          <div className="hero-actions">
            <TrackedLink
              href={ENROLLMENT_2027.requestHref}
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_hero", cta: "request_enrollment_info" }}
              className="button button-lg hero-cta"
            >
              Request Enrollment Information <ArrowRight size={18} aria-hidden="true" />
            </TrackedLink>
          </div>
        </div>
      </section>

      {showIntensive && (
        <aside aria-label="2026 SHSAT Final Intensive" className="border-b border-gold/40 bg-cream">
          <p className="mx-auto w-[min(1180px,calc(100%-32px))] py-3 text-center text-sm leading-relaxed text-ink md:text-base">
            Preparing for the November 2026 SHSAT?{" "}
            <TrackedLink
              href={ENROLLMENT_2027.intensive2026Href}
              event={EVENTS.shsatIntensiveClick}
              eventProps={{ location: "home_below_hero" }}
              className="inline-flex min-h-11 items-center gap-1 font-bold text-navy underline underline-offset-4"
            >
              Explore our Final Intensive <ArrowUpRight size={15} aria-hidden="true" />
            </TrackedLink>
          </p>
        </aside>
      )}

      <Enrollment2027 showIntensive={showIntensive} />

      <CampaignBanner />

      <ResultsPreview />

      <ThisSundayStrip location="home" />

      <WeeklyPracticeCard location="home" />
      <PracticeLibraryCard />

      <WhyFamilies />

      <ToolsResources />

      <ProgramsPreview showIntensive={showIntensive} />

      <GoogleReviews />

      <DiagnosticSection
        location="home"
        title="Start with a free diagnostic"
        intro="Choose SHSAT or Digital SAT and tell us about your student. We'll contact you to confirm a diagnostic time at our Astoria location."
      />
    </>
  )
}

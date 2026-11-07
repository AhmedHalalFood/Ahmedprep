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
import { intensiveSitewidePromoActive } from "@/lib/intensive-promo"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: "AhmedPrep | SHSAT & Digital SAT Prep in Astoria, Queens — Serving NYC & Long Island" },
  description:
    "AhmedPrep is an SHSAT and Digital SAT preparation center in Astoria, Queens serving NYC and Long Island. Winter, Spring & Summer 2027 small-group classes, max 12 students, $20 per class hour, free diagnostic.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    ...baseOpenGraph,
    url: absoluteUrl("/"),
    title: "AhmedPrep | SHSAT & Digital SAT Prep — NYC & Long Island",
    description:
      "SHSAT and Digital SAT preparation center in Astoria, Queens serving NYC and Long Island. Small-group 2027 classes, max 12 students. Book a free diagnostic.",
  },
}

// Hourly so the "Next free Sunday class" card rolls over shortly after each Sunday class ends.
export const revalidate = 3600

export default async function Home() {
  const showIntensive = await intensiveSitewidePromoActive()
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
            AhmedPrep · Astoria, Queens
            <Sparkle className="hero-sparkle" size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </p>
          <h1 id="hero-title" className="hero-headline">
            SHSAT &amp; Digital SAT Prep
          </h1>
          <nav aria-label="2027 seasons" className="hero-launch-date">
            <a href="/programs-2027#winter" className="hero-season-link">Winter</a>
            <span className="hero-season-sep" aria-hidden="true">•</span>
            <a href="/programs-2027#spring" className="hero-season-link">Spring</a>
            <span className="hero-season-sep" aria-hidden="true">•</span>
            <a href="/programs-2027#summer" className="hero-season-link">Summer</a>
            <span className="hero-season-year">2027</span>
          </nav>
          <p className="hero-support">
            Small-group SHSAT and Digital SAT preparation in Astoria, Queens. Math, ELA, and Reading &amp; Writing
            instruction. Maximum 12 students per class.
          </p>
          <ul className="hero-programs" aria-label="Choose a program">
            <li>
              <TrackedLink
                href="/shsat#classes-2027"
                event={EVENTS.shsatCtaClick}
                eventProps={{ location: "home_hero" }}
                className="hero-program"
              >
                <span className="hero-program-name">SHSAT Preparation</span>
                <span className="hero-program-subjects">Math + ELA</span>
                <ArrowRight className="hero-program-arrow" size={18} aria-hidden="true" />
              </TrackedLink>
            </li>
            <li>
              <TrackedLink
                href="/digital-sat#classes-2027"
                event={EVENTS.digitalSatCtaClick}
                eventProps={{ location: "home_hero" }}
                className="hero-program"
              >
                <span className="hero-program-name">Digital SAT Preparation</span>
                <span className="hero-program-subjects">Math + Reading &amp; Writing</span>
                <ArrowRight className="hero-program-arrow" size={18} aria-hidden="true" />
              </TrackedLink>
            </li>
          </ul>
          <div className="hero-actions">
            <TrackedLink
              href="/programs-2027"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_hero", cta: "view_programs_pricing" }}
              className="button button-lg hero-cta"
            >
              View Programs &amp; Pricing <ArrowRight size={18} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_hero" }}
              className="hero-secondary"
            >
              Book Free Diagnostic
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="hero-slogan-band" aria-labelledby="hero-slogan-title">
        <h2 id="hero-slogan-title" className="hero-slogan">
          <span className="hero-slogan-lead">Big Goals. Small Classes.</span>{" "}
          <span className="hero-slogan-accent">Real Progress.</span>
        </h2>
        <p className="hero-slogan-detail">
          Classes start January 9, April 3 &amp; July 3 <span aria-hidden="true">•</span> Max 12 students{" "}
          <span aria-hidden="true">•</span> $20 per class hour
        </p>
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

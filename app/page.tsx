import type { Metadata } from "next"
import Image from "next/image"
import { ArrowUpRight, Check, MessageSquare, Phone } from "lucide-react"
import { CampaignBanner } from "@/components/landing/campaign-banner"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { GoogleReviews } from "@/components/landing/google-reviews"
import { ProgramsPreview } from "@/components/landing/programs-preview"
import { ResultsPreview } from "@/components/landing/results-preview"
import { ToolsResources } from "@/components/landing/tools-resources"
import { WhyFamilies } from "@/components/landing/why-families"
import { ThisSundayStrip } from "@/components/sunday-classes/this-sunday-strip"
import { TrackedLink } from "@/components/tracked-link"
import { WeeklyPracticeCard } from "@/components/weekly-practice/weekly-practice-card"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS } from "@/lib/business"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: "AhmedPrep | SHSAT & Digital SAT Prep in Astoria, Queens" },
  description:
    "AhmedPrep provides SHSAT and Digital SAT preparation in Astoria, Queens and online, with personalized instruction, diagnostic testing, timed practice, and free weekly SHSAT classes.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/") },
}

// Hourly so the "Next free Sunday class" card rolls over shortly after each Sunday class ends.
export const revalidate = 3600

const programs = [
  {
    title: "SHSAT Prep",
    kicker: "Specialized High School admissions",
    body: "Build confidence, master difficult concepts, and prepare strategically for NYC Specialized High School admissions.",
    points: ["Diagnostic assessment", "Targeted Math and ELA practice", "Full-length testing and pacing"],
    cta: "Free SHSAT Diagnostic",
    href: "/shsat",
    event: EVENTS.shsatCtaClick,
  },
  {
    title: "Digital SAT Prep",
    kicker: "Adaptive test preparation",
    body: "Improve your score through targeted practice, adaptive testing strategies, and personalized feedback.",
    points: ["Reading & Writing and Math", "Desmos and digital test strategy", "Practice testing and score analysis"],
    cta: "Free SAT Diagnostic",
    href: "/digital-sat",
    event: EVENTS.digitalSatCtaClick,
  },
]

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
          <p className="eyebrow blue">Astoria, Queens · Serving students across NYC</p>
          <h1 id="hero-title">
            SHSAT & Digital SAT Prep <em>in Astoria, Queens</em>
          </h1>
          <p className="hero-copy">
            Personalized preparation that helps NYC students build confidence, strengthen skills, and prepare for competitive exams.
          </p>
          <div className="hero-actions">
            <TrackedLink
              href="#diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_hero" }}
              className="button button-gold button-lg"
            >
              Book a Free Diagnostic <ArrowUpRight size={17} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/shsat"
              event={EVENTS.shsatCtaClick}
              eventProps={{ location: "home_hero_secondary" }}
              className="button button-outline button-lg"
            >
              Explore SHSAT Prep
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
        </div>
      </section>

      <section id="programs" className="section programs-section" aria-labelledby="programs-title">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Choose a program</p>
              <h2 id="programs-title">
                Two tests.
                <br />
                <span>Focused preparation.</span>
              </h2>
            </div>
            <p>Every program starts with a free diagnostic, so students know exactly what to practice and why it matters.</p>
          </div>
          <div className="program-grid">
            {programs.map((program) => (
              <TrackedLink
                key={program.title}
                href={program.href}
                event={program.event}
                eventProps={{ location: "home_program_card" }}
                className="program-card"
              >
                <p className="eyebrow blue">{program.kicker}</p>
                <h3>{program.title}</h3>
                <p className="program-body">{program.body}</p>
                <ul>
                  {program.points.map((point) => (
                    <li key={point}>
                      <Check size={15} aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="button button-gold button-lg program-cta">
                  {program.cta} <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>

      <CampaignBanner />

      <ResultsPreview />

      <ThisSundayStrip location="home" />

      <WeeklyPracticeCard location="home" />

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

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { CampaignBanner } from "@/components/landing/campaign-banner"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { FreeClassPromo } from "@/components/landing/free-class-promo"
import { GoogleReviews } from "@/components/landing/google-reviews"
import { ShsatIntensive } from "@/components/landing/shsat-intensive"
import { SuccessStories } from "@/components/landing/success-stories"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { RESOURCES } from "@/lib/resources"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"

export const metadata: Metadata = {
  title: { absolute: "AhmedPrep | SHSAT & Digital SAT Prep in Astoria, Queens" },
  description:
    "AhmedPrep provides SHSAT and Digital SAT preparation in Astoria, Queens and online, with personalized instruction, diagnostic testing, timed practice, and free weekly SHSAT classes.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/") },
}

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

const method = [
  ["01", "Diagnose", "Understand the starting point through a focused diagnostic and careful review of strengths and gaps."],
  ["02", "Plan", "Build a clear, realistic preparation roadmap around the student's goals, schedule, and school demands."],
  ["03", "Teach", "Deliver direct instruction, guided practice, and feedback that makes difficult material manageable."],
  ["04", "Measure", "Track progress with purposeful practice, testing, and the next right adjustment."],
]

export default function Home() {
  const featuredResources = RESOURCES.slice(0, 3)
  return (
    <>
      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-panel">
          <p className="eyebrow blue">Astoria, Queens · Serving students across NYC</p>
          <h1 id="hero-title">
            SHSAT & Digital SAT Prep <em>in Astoria, Queens</em>
          </h1>
          <p className="hero-copy">
            Personalized test preparation that helps NYC students build confidence, improve scores, and reach their academic goals.
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
            <CallTextLinks location="home_hero" />
          </div>
        </div>
      </section>

      <ShsatIntensive />

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

      <FreeClassPromo />

      <CampaignBanner />

      <section id="method" className="method-section" aria-labelledby="method-title">
        <div className="container">
          <div className="method-intro">
            <p className="eyebrow gold">The AhmedPrep method</p>
            <h2 id="method-title">
              Preparation built
              <br />
              <span>around the student.</span>
            </h2>
            <p>
              Effective preparation starts with knowing where a student stands, then building instruction, practice, and assessment around
              measurable progress.
            </p>
          </div>
          <div className="method-grid">
            {method.map(([number, title, body]) => (
              <article key={title} className="method-card">
                <span className="method-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SuccessStories />

      <section id="about" className="founder-section" aria-labelledby="founder-title">
        <div className="container founder-grid">
          <div className="founder-intro">
            <p className="eyebrow blue">Meet the founder</p>
            <h2 id="founder-title">Tariq Ahmed</h2>
            <p className="founder-role">Founder & Lead Instructor</p>
            <p className="founder-text">
              AhmedPrep provides New York students with focused, individualized instruction built around their starting point, goals, and
              progress.
            </p>
            <Link href="/about" className="text-link">
              More about AhmedPrep <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <dl className="credentials" aria-label="Credentials">
            <div>
              <dt>Education</dt>
            <dd>New York University</dd>
          </div>
            <div>
              <dt>Classroom</dt>
              <dd>NYC DOE Educator</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>12+ Years of Teaching & Test-Prep Experience</dd>
            </div>
          </dl>
        </div>
      </section>

      <GoogleReviews />

      <DiagnosticSection
        location="home"
        title="Start with a free diagnostic"
        intro="Choose SHSAT or Digital SAT and tell us about your student. We'll contact you to confirm a diagnostic time at our Astoria location."
      />

      <section id="resources" className="resources-section" aria-labelledby="resources-heading">
        <div className="container">
          <div className="resources-heading flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Resources</p>
              <h2 id="resources-heading">
                Know the test.
                <br />
                <span>Know the next step.</span>
              </h2>
            </div>
            <Link href="/resources" className="text-link">
              All resources <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="resource-grid">
            {featuredResources.map((item) => (
              <Link key={item.slug} href={`/resources/${item.slug}`} className="resource-item">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

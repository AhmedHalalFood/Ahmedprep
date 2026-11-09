import type { Metadata } from "next"
import Image from "next/image"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Leaf,
  List,
  type LucideIcon,
  Snowflake,
  Star,
  Sun,
} from "lucide-react"
import { TERMS_2027, type TermId, termSummary } from "@/lib/cohorts-2027"
import { DiagnosticSection } from "@/components/landing/diagnostic-section"
import { ProgramsPreview } from "@/components/landing/programs-preview"
import { ReviewInvite } from "@/components/landing/review-invite"
import { ToolsResources } from "@/components/landing/tools-resources"
import { WhyFamilies } from "@/components/landing/why-families"
import { TrackedLink } from "@/components/tracked-link"
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

const SEASON_ICONS: Record<TermId, LucideIcon> = { winter: Snowflake, spring: Leaf, summer: Sun }

const longDay = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric" })

const HERO_SEASONS = TERMS_2027.map((term) => {
  const summary = termSummary(term)
  const hoursVary = new Set(term.cohorts.map((c) => c.hours)).size > 1
  return {
    id: term.id,
    name: `${term.name} Programs`,
    dates: `${longDay(summary.startIso)} – ${longDay(summary.endIso)}, ${summary.endIso.slice(0, 4)}`,
    hours: `${summary.hoursLabel.replace(" hours", "")} scheduled hours${hoursVary ? ", depending on cohort" : ""}`,
    Icon: SEASON_ICONS[term.id],
  }
})

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
            <span className="hero-stars" aria-hidden="true">
              <Star size={14} fill="currentColor" strokeWidth={0} />
              <Star size={14} fill="currentColor" strokeWidth={0} />
            </span>
            AhmedPrep · Astoria, Queens
          </p>
          <h1 id="hero-title" className="hero-headline">
            SHSAT &amp; Digital SAT Prep
          </h1>
          <p className="hero-support">
            Small-group SHSAT and Digital SAT preparation in Astoria, Queens.{" "}
            <br className="hero-support-break" />
            Math, ELA, and Reading &amp; Writing instruction. Maximum 12 students per class.
          </p>
          <nav aria-label="2027 seasons">
            <ul className="hero-seasons">
              {HERO_SEASONS.map((season) => (
                <li key={season.id}>
                  <a
                    href={`/programs-2027#${season.id}`}
                    className="hero-season-card"
                    data-season={season.id}
                  >
                    <span className="hero-season-head">
                      <span className="hero-season-icon" aria-hidden="true">
                        <season.Icon size={26} strokeWidth={2.2} />
                      </span>
                      <span className="hero-season-name">{season.name}</span>
                    </span>
                    <span className="hero-season-row hero-season-dates">
                      <CalendarDays size={16} aria-hidden="true" />
                      {season.dates}
                    </span>
                    <span className="hero-season-row hero-season-hours">
                      <Clock size={16} aria-hidden="true" />
                      {season.hours}
                    </span>
                    <span className="hero-season-cta">
                      View Programs
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hero-actions">
            <TrackedLink
              href="/programs-2027"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_hero", cta: "view_programs_pricing" }}
              className="button button-lg hero-cta"
            >
              <List size={20} aria-hidden="true" />
              View Programs &amp; Pricing <ArrowRight size={18} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink
              href="/free-diagnostic"
              event={EVENTS.diagnosticCtaClick}
              eventProps={{ location: "home_hero" }}
              className="hero-secondary"
            >
              <CalendarDays size={20} aria-hidden="true" />
              Book Free Diagnostic <ArrowRight size={18} aria-hidden="true" />
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

      <WhyFamilies />

      <ProgramsPreview />

      <DiagnosticSection
        location="home"
        title="Book Free Diagnostic"
        intro="Choose SHSAT or Digital SAT and tell us about your student. We'll contact you to confirm a diagnostic time at our Astoria location."
      />

      <ToolsResources />

      <ReviewInvite />
    </>
  )
}

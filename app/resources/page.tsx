import type { Metadata } from "next"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Breadcrumbs, Section } from "@/components/landing/primitives"
import { ThisSundayStrip } from "@/components/sunday-classes/this-sunday-strip"
import { TeachingVideos } from "@/components/videos/teaching-videos"
import { RESOURCES, type Resource } from "@/lib/resources"
import { toolPath } from "@/lib/tools"

export const metadata: Metadata = {
  title: "Free SHSAT & Digital SAT Resources",
  description:
    "Free SHSAT and Digital SAT resources for NYC families: practice tests, weekly practice, readiness quiz, score planner, SHSAT dates, guides, and free Sunday Zoom classes.",
  alternates: { canonical: absoluteUrl("/resources") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/resources") },
}

const groups: { category: Resource["category"]; title: string; href: string; cta: string }[] = [
  { category: "SHSAT", title: "SHSAT resources", href: "/shsat", cta: "SHSAT Prep program" },
  { category: "Digital SAT", title: "Digital SAT resources", href: "/digital-sat", cta: "Digital SAT Prep program" },
]

const PRACTICE_SLUGS = ["shsat-math-practice", "shsat-ela-practice"]

type CategoryLink = { label: string; href: string; note?: string }

const CATEGORIES: { id: string; title: string; links: CategoryLink[] }[] = [
  {
    id: "practice-tests",
    title: "Practice Tests",
    links: [
      { label: "SHSAT practice tests", href: "/shsat-practice-tests" },
      { label: "Weekly SHSAT practice", href: "/weekly-practice" },
      { label: "SHSAT Math practice", href: "/resources/shsat-math-practice" },
      { label: "SHSAT ELA practice", href: "/resources/shsat-ela-practice" },
      { label: "Digital SAT Math practice", href: "/resources/digital-sat-math-practice" },
    ],
  },
  {
    id: "free-tools",
    title: "Free Tools",
    links: [
      { label: "SHSAT readiness quiz", href: toolPath("shsat-readiness-quiz") },
      { label: "Digital SAT score goal planner", href: toolPath("digital-sat-score-planner") },
      { label: "All free tools", href: "/tools" },
    ],
  },
  {
    id: "test-dates-guides",
    title: "Test Dates & Guides",
    links: [
      { label: "SHSAT dates & deadline", href: toolPath("shsat-dates"), note: "Fall 2026 test cycle" },
      { label: "SHSAT guide", href: "/resources/shsat-guide" },
      { label: "Digital SAT guide", href: "/resources/digital-sat-guide" },
      { label: "Digital SAT Reading & Writing", href: "/resources/digital-sat-reading-writing" },
    ],
  },
  {
    id: "free-sunday-classes",
    title: "Free Sunday Zoom Classes",
    links: [
      { label: "SHSAT & Digital SAT free Zoom sessions", href: "/free-sunday-classes", note: "Schedule & RSVP" },
      { label: "Free Sunday classes FAQ & updates", href: "/updates" },
    ],
  },
]

export default function ResourcesPage() {
  const featured = RESOURCES.filter((r) => r.featured)
  const practiceGuides = PRACTICE_SLUGS.map((slug) => RESOURCES.find((r) => r.slug === slug)).filter(
    (r): r is Resource => Boolean(r),
  )
  return (
    <>
      <Breadcrumbs items={[{ label: "Resources", href: "/resources" }]} />
      <section aria-labelledby="resources-title" className="border-b border-line bg-white py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="eyebrow blue">Resources</p>
          <h1 id="resources-title" className="mt-3 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
            Know the test. Know the next step.
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-subtle">
            Practical guides for NYC families preparing for the SHSAT and the Digital SAT, written by the AhmedPrep team in Astoria, Queens.
          </p>
        </div>
      </section>

      <section aria-labelledby="resource-categories-title" className="border-b border-line bg-warm py-12 md:py-16">
        <div className="container flex flex-col gap-6">
          <h2 id="resource-categories-title" className="text-2xl font-extrabold text-navy md:text-3xl">
            Browse by category
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <li key={category.id} id={category.id} className="flex scroll-mt-24 flex-col gap-4 border border-line bg-white p-5 md:p-6">
                <h3 className="text-lg font-extrabold text-navy">{category.title}</h3>
                <ul className="flex flex-col gap-1">
                  {category.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex min-h-11 items-center justify-between gap-3 border-b border-line py-2 text-sm font-semibold leading-snug text-ink transition-colors hover:text-brand"
                      >
                        <span>
                          {link.label}
                          {link.note && <span className="block text-xs font-normal text-subtle">{link.note}</span>}
                        </span>
                        <ArrowUpRight size={15} aria-hidden="true" className="shrink-0 text-brand" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section
        id="shsat-2026"
        tone="warm"
        eyebrow="Fall 2026 SHSAT"
        title="2026 SHSAT guides for NYC families"
        intro="Dates, the digital test format, SHSAT Math review, practice test strategy, and planning advice for Queens families."
      >
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {featured.map((resource) => (
            <li key={resource.slug} className="bg-white">
              <Link href={`/resources/${resource.slug}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-brand-soft md:p-8">
                <p className="eyebrow blue">{resource.topic}</p>
                <h3 className="text-balance text-xl font-extrabold leading-snug text-navy group-hover:text-brand">
                  {resource.cardTitle ?? resource.title}
                </h3>
                <p className="text-pretty leading-relaxed text-subtle">{resource.cardDescription ?? resource.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-extrabold uppercase tracking-wider text-brand">
                  Read guide <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="shsat-practice"
        tone="white"
        eyebrow="SHSAT practice"
        title="Practice SHSAT Math and ELA"
        intro="Original practice questions with worked explanations, plus pacing and strategy for each section of the digital test."
      >
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
          {practiceGuides.map((resource) => (
            <li key={resource.slug} className="bg-white">
              <Link href={`/resources/${resource.slug}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-brand-soft md:p-8">
                <p className="eyebrow blue">{resource.topic}</p>
                <h3 className="text-balance text-xl font-extrabold leading-snug text-navy group-hover:text-brand">{resource.title}</h3>
                <p className="text-pretty leading-relaxed text-subtle">{resource.cardDescription ?? resource.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-extrabold uppercase tracking-wider text-brand">
                  Start practicing <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/weekly-practice" className="text-link mt-8">
          AhmedPrep Weekly Practice: a new SHSAT or Digital SAT question each week <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <Link href="/shsat-practice-tests" className="text-link mt-3">
          Free SHSAT practice tests: official NYCPS digital tests and AhmedPrep practice <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </Section>

      {groups.map((group, i) => (
        <Section key={group.category} id={group.category === "SHSAT" ? "shsat" : "digital-sat"} tone={i % 2 ? "warm" : "white"} title={group.title}>
          <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
            {RESOURCES.filter((r) => r.category === group.category && !r.featured).map((resource) => (
              <li key={resource.slug} className="bg-white">
                <Link href={`/resources/${resource.slug}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-brand-soft md:p-8">
                  <h2 className="text-xl font-extrabold text-navy group-hover:text-brand">{resource.title}</h2>
                  <p className="leading-relaxed text-subtle">{resource.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-extrabold uppercase tracking-wider text-brand">
                    Read guide <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={group.href} className="text-link mt-8">
            {group.cta} <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </Section>
      ))}
      <TeachingVideos page="resources" />
      <ThisSundayStrip location="resources" />
    </>
  )
}

import type { Metadata } from "next"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Breadcrumbs, Section } from "@/components/landing/primitives"
import { RESOURCES, type Resource } from "@/lib/resources"

export const metadata: Metadata = {
  title: "SHSAT & Digital SAT Resources",
  description:
    "Free SHSAT and Digital SAT guides for NYC families: 2026 SHSAT dates, the digital SHSAT format, SHSAT Math topics, practice test strategy, and ELA tips.",
  alternates: { canonical: absoluteUrl("/resources") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/resources") },
}

const groups: { category: Resource["category"]; title: string; href: string; cta: string }[] = [
  { category: "SHSAT", title: "SHSAT resources", href: "/shsat", cta: "SHSAT Prep program" },
  { category: "Digital SAT", title: "Digital SAT resources", href: "/digital-sat", cta: "Digital SAT Prep program" },
]

export default function ResourcesPage() {
  const featured = RESOURCES.filter((r) => r.featured)
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
    </>
  )
}

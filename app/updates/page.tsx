import type { Metadata } from "next"
import Link from "next/link"
import { Rss } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { OfficialDates } from "@/components/updates/official-dates"
import { UpdateCard } from "@/components/updates/update-card"
import { SITE_URL } from "@/lib/business"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import { UPDATE_FILTERS, UPDATES, updatesChronological, type UpdateFilter } from "@/lib/updates"

const TITLE = "SHSAT & Digital SAT Updates for NYC Students | AhmedPrep"
const DESCRIPTION =
  "Verified SHSAT and Digital SAT dates, registration deadlines, NYC admissions deadlines, and official preparation resources for NYC families, with sources."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/updates"),
    types: { "application/atom+xml": [{ url: absoluteUrl("/updates/feed.xml"), title: "AhmedPrep SHSAT & SAT Updates" }] },
  },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl("/updates") },
}

const isFilter = (value: unknown): value is UpdateFilter => UPDATE_FILTERS.some((f) => f.slug === value)

export default async function UpdatesPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams
  const active = isFilter(topic) ? topic : undefined
  const updates = updatesChronological(active ? UPDATES.filter((u) => u.filter === active) : UPDATES)
  const filters = [{ slug: undefined, label: "All updates" }, ...UPDATE_FILTERS]

  return (
    <>
      <Breadcrumbs items={[{ label: "Updates", href: "/updates" }]} />
      <section className="bg-white py-14 md:py-20" aria-labelledby="updates-title">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div>
            <p className="eyebrow blue">Verified against official sources</p>
            <h1 id="updates-title" className="mt-3 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
              Latest SHSAT & Digital SAT Updates
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-subtle">
              Test dates, registration deadlines, admissions deadlines, and official preparation resources for NYC families. Every date is
              checked against NYC Public Schools or College Board, and each update names its source.
            </p>

            <nav aria-label="Filter updates" className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {filters.map((f) => {
                  const current = f.slug === active
                  return (
                    <li key={f.label}>
                      <Link
                        href={f.slug ? `/updates?topic=${f.slug}` : "/updates"}
                        aria-current={current ? "page" : undefined}
                        className={`inline-flex border px-4 py-2 text-sm font-bold transition-colors ${
                          current ? "border-navy bg-navy" : "border-line bg-white hover:border-navy"
                        }`}
                      >
                        <span style={{ color: current ? "var(--color-primary-foreground)" : "var(--navy)" }}>{f.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <h2 className="sr-only">{active ? `${filters.find((f) => f.slug === active)?.label} updates` : "All updates"}</h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-2">
              {updates.map((update) => (
                <li key={update.slug}>
                  <UpdateCard update={update} />
                </li>
              ))}
            </ol>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start" aria-label="Official dates and how we verify">
            <OfficialDates />
            <div className="border border-line bg-warm p-6">
              <h2 className="text-base font-extrabold text-navy">How we verify updates</h2>
              <p className="mt-2 text-sm leading-relaxed text-subtle">
                Dates and policies come only from NYC Public Schools and College Board. Every update is reviewed by a person against
                the official source before it appears here, and each update links to that source.
              </p>
              <a href="/updates/feed.xml" className="text-link mt-4">
                <Rss size={15} aria-hidden="true" /> Subscribe to the updates feed
              </a>
            </div>
            <nav aria-label="In-depth guides" className="border border-line p-6">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-subtle">In-depth guides</h2>
              <ul className="mt-4 flex flex-col gap-3 font-bold leading-snug text-navy">
                <li><Link href="/resources/2026-shsat-dates-registration-deadline" className="hover:text-brand">2026 SHSAT dates and registration</Link></li>
                <li><Link href="/resources/digital-shsat-2026" className="hover:text-brand">How the digital SHSAT works</Link></li>
                <li><Link href="/resources/digital-sat-guide" className="hover:text-brand">Digital SAT guide for families</Link></li>
                <li><Link href="/resources" className="hover:text-brand">All resources</Link></li>
              </ul>
            </nav>
          </aside>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: `${SITE_URL}/updates`,
          publisher: { "@id": `${SITE_URL}/#organization` },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: updatesChronological().map((u, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/updates/${u.slug}`,
              name: u.title,
            })),
          },
        }}
      />
    </>
  )
}

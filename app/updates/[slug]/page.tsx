import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight, ExternalLink, ShieldCheck } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { RichText } from "@/components/resources/rich-text"
import { TrackedLink } from "@/components/tracked-link"
import { OfficialDates } from "@/components/updates/official-dates"
import { EVENTS } from "@/lib/analytics"
import { BUSINESS, SITE_URL } from "@/lib/business"
import { getSource } from "@/lib/official-sources"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import { UPDATES, filterLabel, formatDate, getUpdate, updatesChronological } from "@/lib/updates"

export const revalidate = 86400

export function generateStaticParams() {
  return UPDATES.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const update = getUpdate(slug)
  if (!update) return {}
  const url = absoluteUrl(`/updates/${update.slug}`)
  return {
    title: { absolute: `${update.metaTitle} | AhmedPrep` },
    description: update.description,
    alternates: { canonical: url },
    openGraph: {
      ...baseOpenGraph,
      title: update.metaTitle,
      description: update.description,
      type: "article",
      url,
      publishedTime: update.datePublished,
      modifiedTime: update.dateModified,
    },
  }
}

export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const update = getUpdate(slug)
  if (!update) notFound()

  const source = getSource(update.sourceId)
  const url = `${SITE_URL}/updates/${update.slug}`
  const isSat = update.filter === "digital-sat"
  const programHref = isSat ? "/digital-sat" : "/shsat"
  const related = updatesChronological().filter((u) => u.slug !== update.slug).slice(0, 4)

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Updates", href: "/updates" },
          { label: update.title, href: `/updates/${update.slug}` },
        ]}
      />
      <article className="bg-white py-14 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div className="max-w-2xl">
            <p className="eyebrow blue">
              {filterLabel(update.filter)} · {update.topic}
            </p>
            <h1 className="mt-3 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">{update.title}</h1>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold uppercase tracking-wider text-subtle">
              <span>
                Published <time dateTime={update.datePublished}>{formatDate(update.datePublished)}</time>
              </span>
              {update.dateModified !== update.datePublished && (
                <span>
                  Updated <time dateTime={update.dateModified}>{formatDate(update.dateModified)}</time>
                </span>
              )}
            </p>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-subtle">{update.summary}</p>

            <div className="mt-6 flex items-start gap-3 border border-line bg-warm p-4 text-sm leading-relaxed text-ink">
              <ShieldCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-gold-deep" />
              <p>
                {source.official ? (
                  <>
                    Verified against{" "}
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-bold text-brand underline underline-offset-2">
                      {source.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>{" "}
                    on <time dateTime={source.lastVerified}>{formatDate(source.lastVerified)}</time>. Always confirm with the official source
                    before acting on a deadline.
                  </>
                ) : (
                  <>This is an AhmedPrep program announcement, not an official NYC Public Schools or College Board notice.</>
                )}
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-10">
              {update.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-extrabold tracking-tight text-navy">{section.heading}</h2>
                  {section.list && (
                    <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-gold-deep">
                      {section.list.map((item) => (
                        <li key={item}>
                          <RichText text={item} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.paragraphs?.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-ink">
                      <RichText text={p} />
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <nav aria-label="More updates" className="mt-14 border-t border-line pt-8">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-subtle">More updates</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {related.map((u) => (
                  <li key={u.slug}>
                    <Link href={`/updates/${u.slug}`} className="font-bold leading-snug text-navy hover:text-brand">
                      {u.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/updates" className="text-link">
                    All SHSAT & SAT updates <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start" aria-label="Official dates and next steps">
            <OfficialDates />
            <div className="border border-line border-t-4 border-t-gold bg-warm p-6">
              <p className="text-lg font-extrabold text-navy">Find out where your student stands</p>
              <p className="mt-2 text-sm leading-relaxed text-subtle">
                A free {isSat ? "Digital SAT" : "SHSAT"} diagnostic at our Astoria location shows strengths, gaps, and a realistic plan.
              </p>
              <TrackedLink
                href={`${programHref}#diagnostic`}
                event={isSat ? EVENTS.digitalSatCtaClick : EVENTS.shsatCtaClick}
                eventProps={{ location: `update_${update.slug}` }}
                className="button button-gold mt-5 w-full justify-center"
              >
                Book a Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
              </TrackedLink>
              <div className="mt-4">
                <CallTextLinks location={`update_${update.slug}`} />
              </div>
            </div>
            {source.official && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline"
              >
                View the official {source.publisher} page <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </aside>
        </div>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: update.title,
          description: update.description,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          image: [`${SITE_URL}/ahmedprep-hero.png`],
          inLanguage: "en-US",
          datePublished: update.datePublished,
          dateModified: update.dateModified,
          articleSection: filterLabel(update.filter),
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BUSINESS.name, url: SITE_URL },
          publisher: {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: BUSINESS.name,
            url: SITE_URL,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/ahmedprep-logo.png` },
          },
          ...(source.official && { citation: { "@type": "WebPage", name: source.name, url: source.url } }),
        }}
      />
    </>
  )
}

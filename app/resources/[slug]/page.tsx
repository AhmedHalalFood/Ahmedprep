import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { SITE_URL } from "@/lib/business"
import { RESOURCES, getResource } from "@/lib/resources"

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resource = getResource(slug)
  if (!resource) return {}
  return {
    title: resource.metaTitle,
    description: resource.description,
    alternates: { canonical: `/resources/${resource.slug}` },
    openGraph: { title: resource.metaTitle, description: resource.description, type: "article", url: `/resources/${resource.slug}` },
  }
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resource = getResource(slug)
  if (!resource) notFound()

  const isShsat = resource.category === "SHSAT"
  const programHref = isShsat ? "/shsat" : "/digital-sat"
  const related = RESOURCES.filter((r) => r.category === resource.category && r.slug !== resource.slug)

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Resources", href: "/resources" },
          { label: resource.title, href: `/resources/${resource.slug}` },
        ]}
      />
      <article className="bg-white py-14 md:py-20">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="max-w-2xl">
            <p className="eyebrow blue">{resource.category} guide</p>
            <h1 className="mt-3 text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">{resource.title}</h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-subtle">{resource.description}</p>
            <div className="mt-10 flex flex-col gap-10">
              {resource.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-extrabold tracking-tight text-navy">{section.heading}</h2>
                  {section.body.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-ink">
                      {p}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start" aria-label="Next steps">
            <div className="border border-line border-t-4 border-t-gold bg-warm p-6">
              <p className="text-lg font-extrabold text-navy">Find out where your student stands</p>
              <p className="mt-2 text-sm leading-relaxed text-subtle">
                A free {resource.category} diagnostic at our Astoria location shows strengths, gaps, and a realistic plan.
              </p>
              <TrackedLink
                href={`${programHref}#diagnostic`}
                event={isShsat ? EVENTS.shsatCtaClick : EVENTS.digitalSatCtaClick}
                eventProps={{ location: `resource_${resource.slug}` }}
                className="button button-gold mt-5 w-full justify-center"
              >
                Book a Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
              </TrackedLink>
              <div className="mt-4">
                <CallTextLinks location={`resource_${resource.slug}`} />
              </div>
            </div>
            {related.length > 0 && (
              <nav aria-label="Related guides" className="border border-line p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider text-subtle">More {resource.category} guides</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/resources/${r.slug}`} className="font-bold leading-snug text-navy hover:text-brand">
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
        </div>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: resource.title,
          description: resource.description,
          url: `${SITE_URL}/resources/${resource.slug}`,
          author: { "@id": `${SITE_URL}/#organization` },
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />
    </>
  )
}

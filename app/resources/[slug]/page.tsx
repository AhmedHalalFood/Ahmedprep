import type { Metadata } from "next"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { CallTextLinks } from "@/components/call-text-links"
import { RichText } from "@/components/resources/rich-text"
import { ShsatHelpCta } from "@/components/resources/shsat-help-cta"
import { ResourceNextSteps } from "@/components/resources/next-steps"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { SITE_URL } from "@/lib/business"
import { RESOURCES, getResource, type ResourceBlock } from "@/lib/resources"
import { PracticePassage, PracticeQuestions } from "@/components/resources/practice-questions"

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resource = getResource(slug)
  if (!resource) return {}
  const url = absoluteUrl(`/resources/${resource.slug}`)
  return {
    title: resource.metaTitle,
    description: resource.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      ...baseOpenGraph,
      title: resource.metaTitle,
      description: resource.description,
      type: "article",
      url,
      ...(resource.datePublished && {
        publishedTime: resource.datePublished,
        modifiedTime: resource.dateModified ?? resource.datePublished,
      }),
    },
  }
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resource = getResource(slug)
  if (!resource) notFound()

  const isShsat = resource.category === "SHSAT"
  const isPastRegistrationGuide = resource.slug === "2026-shsat-dates-registration-deadline"
  const programHref = isShsat ? "/shsat-prep" : "/digital-sat-prep"
  const related = RESOURCES.filter((r) => r.category === resource.category && r.slug !== resource.slug && r.slug !== "2026-shsat-dates-registration-deadline").slice(0, 6)
  const updated = resource.dateModified ?? resource.datePublished
  const url = `${SITE_URL}/resources/${resource.slug}`

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
            <div className="flex flex-col gap-4">
            <p className="eyebrow blue">{resource.category} guide</p>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">{resource.title}</h1>
            {updated && (
              <p className="text-xs font-bold uppercase tracking-wider text-subtle">
                Updated <time dateTime={updated}>{formatDate(updated)}</time>
              </p>
            )}
            {isPastRegistrationGuide && (
              <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-navy">
                Archived information: This article covers the completed Fall 2026 SHSAT registration period. Check NYC Public Schools for current registration dates and AhmedPrep&apos;s 2027 programs for current classes.
              </p>
            )}
            {resource.intro ? (
              resource.intro.map((p) => (
                <p key={p.slice(0, 40)} className="text-pretty text-lg leading-relaxed text-subtle">
                  <RichText text={p} />
                </p>
              ))
            ) : (
              <p className="text-pretty text-lg leading-relaxed text-subtle">{resource.description}</p>
            )}
            </div>
            {resource.category === "Digital SAT" && (
              <section aria-labelledby="sat-winter-enrollment-title" className="mt-8 rounded-xl border border-gold/50 bg-warm p-5 sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider text-brand">Winter 2027 · Digital SAT classes</p>
                <h2 id="sat-winter-enrollment-title" className="mt-1 text-xl font-extrabold text-navy">
                  Turn SAT practice into a structured study plan
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  In-person Digital SAT preparation in Astoria, Queens, personally taught by AhmedPrep&apos;s founder.
                  Small groups of up to 12 students, with Math and Reading &amp; Writing practice.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <TrackedLink
                    href="/digital-sat-prep"
                    event={EVENTS.digitalSatCtaClick}
                    eventProps={{ location: `resource_${resource.slug}_winter_2027` }}
                    className="button button-gold"
                  >
                    Explore Digital SAT Classes <ArrowUpRight size={15} aria-hidden="true" />
                  </TrackedLink>
                  <TrackedLink
                    href="/enroll-2027"
                    event={EVENTS.programCtaClick}
                    eventProps={{ location: `resource_${resource.slug}_winter_2027`, cta: "winter_enrollment" }}
                    className="button button-outline"
                  >
                    Winter 2027 Enrollment
                  </TrackedLink>
                </div>
              </section>
            )}
            {resource.slug === "shsat-math-practice" && (
              <section aria-labelledby="weekly-shsat-challenge-promo" className="mt-6 rounded-xl border-2 border-gold bg-[#FFF9E9] p-5 sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider text-brand">New · Free weekly quiz</p>
                <h2 id="weekly-shsat-challenge-promo" className="mt-1 text-xl font-extrabold text-navy">10 advanced SHSAT questions, one complete quiz</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink">Five Math and five ELA questions. Answer all 10 first, then reveal your score, detailed worked solutions, and strategy tips.</p>
                <Link href="/weekly-shsat-challenge" className="button button-gold mt-4">Start the weekly challenge <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </section>
            )}
            {resource.slug === "shsat-math-practice" && (
              <section aria-labelledby="math-winter-enrollment-title" className="mt-8 rounded-xl border border-gold/50 bg-warm p-5 sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider text-brand">Winter 2027 · Enrollment open</p>
                <h2 id="math-winter-enrollment-title" className="mt-1 text-xl font-extrabold text-navy">
                  Build SHSAT Math skills with small-group instruction
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  In-person SHSAT preparation in Astoria, personally taught by AhmedPrep&apos;s founder.
                  12 weeks, 72 instructional hours, maximum 12 students per class.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <TrackedLink
                    href="/enroll-2027"
                    event={EVENTS.programCtaClick}
                    eventProps={{ location: "resource_shsat_math_practice_winter_2027", cta: "winter_enrollment" }}
                    className="button button-gold"
                  >
                    Explore Winter Classes <ArrowUpRight size={15} aria-hidden="true" />
                  </TrackedLink>
                  <TrackedLink
                    href="/free-diagnostic"
                    event={EVENTS.diagnosticCtaClick}
                    eventProps={{ location: "resource_shsat_math_practice_winter_2027" }}
                    className="button button-outline"
                  >
                    Free Diagnostic
                  </TrackedLink>
                </div>
              </section>
            )}
            <div className="mt-10 flex flex-col gap-10">
              {resource.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-extrabold tracking-tight text-navy">{section.heading}</h2>
                  <BlockContent block={section} />
                  {section.subsections?.map((sub) => (
                    <div key={sub.heading} className="mt-6">
                      <h3 className="text-lg font-extrabold text-navy">{sub.heading}</h3>
                      <BlockContent block={sub} />
                    </div>
                  ))}
                </section>
              ))}
            </div>
            {isShsat && <ShsatHelpCta location={`resource_${resource.slug}`} />}
            <ResourceNextSteps category={resource.category} />
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
                        {r.cardTitle ?? r.title}
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
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          image: `${SITE_URL}/ahmedprep-hero.jpg`,
          inLanguage: "en-US",
          ...(resource.datePublished && {
            datePublished: resource.datePublished,
            dateModified: resource.dateModified ?? resource.datePublished,
          }),
          author: { "@id": `${SITE_URL}/#organization` },
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />
    </>
  )
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
}

function BlockContent({ block: { body, list, passage, passageTitle, questions } }: { block: ResourceBlock }) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {body.map((p) => (
        <p key={p.slice(0, 40)} className="leading-relaxed text-ink">
          <RichText text={p} />
        </p>
      ))}
      {list && (
        <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink marker:text-brand">
          {list.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      )}
      {passage && <PracticePassage title={passageTitle} paragraphs={passage} />}
      {questions && <PracticeQuestions questions={questions} />}
    </div>
  )
}

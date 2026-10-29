import type { Metadata } from "next"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { ProgramCard } from "@/components/programs/program-card"
import { CallTextLinks } from "@/components/call-text-links"
import { intensivePromoActive } from "@/lib/intensive-promo"
import { visiblePrograms } from "@/lib/programs"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"

const TITLE = "Programs & Pricing | SHSAT & Digital SAT Prep in Queens"
const DESCRIPTION =
  "Compare AhmedPrep programs: free diagnostic, free Sunday classes, SHSAT and Digital SAT preparation, private tutoring, and seasonal intensives in Astoria, Queens."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/programs") },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl("/programs") },
}

export default async function ProgramsPage() {
  const showIntensive = await intensivePromoActive()
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/programs", name: TITLE, description: DESCRIPTION })} />
      <Breadcrumbs items={[{ label: "Programs & Pricing", href: "/programs" }]} />

      <section aria-labelledby="programs-title" className="bg-warm py-14 md:py-20">
        <div className="container flex max-w-3xl flex-col gap-5">
          <p className="eyebrow blue">Programs & pricing</p>
          <h1 id="programs-title" className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
            Find the right way to prepare
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-subtle">
            Start free, then choose the level of support that fits your student. Where a price isn&apos;t listed, it depends on the
            schedule and format, so contact us for a quote.
          </p>
        </div>
      </section>

      <section aria-label="Programs" className="bg-white py-14">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePrograms(showIntensive).map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      <section aria-labelledby="programs-questions" className="border-t border-line bg-warm py-12">
        <div className="container flex flex-col gap-4">
          <h2 id="programs-questions" className="text-2xl font-extrabold text-navy">
            Not sure which program fits?
          </h2>
          <p className="max-w-2xl leading-relaxed text-subtle">Call or text and we&apos;ll help you choose based on your student&apos;s goals and test date.</p>
          <CallTextLinks location="programs_page" />
        </div>
      </section>
    </>
  )
}

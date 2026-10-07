import type { Metadata } from "next"
import { absoluteUrl, baseOpenGraph } from "@/lib/seo"
import { DiagnosticForm } from "@/components/diagnostic-form"
import { Breadcrumbs } from "@/components/landing/primitives"
import { CallTextLinks } from "@/components/call-text-links"
import { ADDRESS_LINE_1, ADDRESS_LINE_2 } from "@/lib/business"

export const metadata: Metadata = {
  title: "Book a Free SHSAT or Digital SAT Diagnostic",
  description: "Reserve a free SHSAT or Digital SAT diagnostic at AhmedPrep in Astoria, Queens. Get a breakdown of strengths, gaps, and a personalized plan.",
  alternates: { canonical: absoluteUrl("/free-diagnostic") },
  openGraph: { ...baseOpenGraph, url: absoluteUrl("/free-diagnostic") },
}

export default function FreeDiagnosticPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Free Diagnostic", href: "/free-diagnostic" }]} />
      <section id="diagnostic" aria-labelledby="free-diagnostic-title" className="scroll-mt-4 bg-warm py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="eyebrow blue">Free diagnostic</p>
            <h1 id="free-diagnostic-title" className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
              Book a free diagnostic
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-subtle">
              Your student takes a timed SHSAT or Digital SAT assessment at our Astoria location. We then review the results with you and
              recommend a clear plan. There is no cost or obligation.
            </p>
            <div className="border-t border-line pt-6">
              <p className="text-sm font-semibold text-ink">Questions first?</p>
              <div className="mt-3">
                <CallTextLinks location="free_diagnostic_page" />
              </div>
              <p className="mt-4 text-sm text-subtle">
                {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
              </p>
            </div>
          </div>
          <DiagnosticForm location="free_diagnostic_page" />
        </div>
      </section>
    </>
  )
}

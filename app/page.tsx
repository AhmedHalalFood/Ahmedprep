import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { ProgramsPreview } from "@/components/landing/programs-preview"
import { Winter2027Promo } from "@/components/landing/winter-2027-promo"
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
    "AhmedPrep offers in-person SHSAT and Digital SAT prep in Astoria, Queens, plus live online Winter weekday Digital SAT nationwide. Winter, Spring & Summer 2027 small-group classes, max 12 students, $20 per class hour, free diagnostic.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    ...baseOpenGraph,
    url: absoluteUrl("/"),
    title: "AhmedPrep | In-Person SHSAT & Digital SAT Prep in Astoria, Queens",
    description:
      "In-person SHSAT and Digital SAT prep in Astoria, Queens for students from across NYC and Long Island. Small-group 2027 classes, max 12 students. Book a free diagnostic.",
  },
}

// Hourly so the "Next free Sunday class" card rolls over shortly after each Sunday class ends.
export const revalidate = 3600


export default async function Home() {
  const showIntensive = await intensiveSitewidePromoActive()
  return (
    <>
      <Winter2027Promo />

      <ProgramsPreview />

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

      <ToolsResources />

      <WhyFamilies />
    </>
  )
}

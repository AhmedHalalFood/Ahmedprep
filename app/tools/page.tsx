import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/landing/primitives"
import { ToolHero } from "@/components/tools/tool-hero"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { absoluteUrl, baseOpenGraph, webPageSchema } from "@/lib/seo"
import { FREE_TOOLS, toolPath } from "@/lib/tools"

const TITLE = "Free SHSAT & Digital SAT Tools"
const DESCRIPTION = "Free SHSAT readiness quiz, verified 2026 SHSAT dates, and a Digital SAT score goal planner from AhmedPrep."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/tools") },
  openGraph: { ...baseOpenGraph, title: TITLE, description: DESCRIPTION, url: absoluteUrl("/tools") },
}

export default function ToolsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/tools", name: TITLE, description: DESCRIPTION, type: "CollectionPage" })} />
      <Breadcrumbs items={[{ label: "Free Tools", href: "/tools" }]} />
      <ToolHero id="tools-title" eyebrow="Free tools" title="Free tools for SHSAT and Digital SAT families">
        <p>Quick, honest tools that help you decide what to do next. No sign-up required.</p>
      </ToolHero>
      <section aria-label="Tools" className="bg-white py-14">
        <ul className="container grid gap-6 md:grid-cols-3">
          {FREE_TOOLS.map((tool) => (
            <li key={tool.slug}>
              <TrackedLink
                href={toolPath(tool.slug)}
                event={EVENTS.toolOpen}
                eventProps={{ location: "tools_hub", tool: tool.slug }}
                className="group flex h-full flex-col gap-3 border border-line border-t-4 border-t-gold bg-white p-6 hover:border-brand"
              >
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand">
                  {tool.test} <span aria-hidden="true">·</span> {tool.kind}
                </span>
                <span className="text-xl font-extrabold text-navy group-hover:text-brand">{tool.title}</span>
                <span className="text-sm leading-relaxed text-subtle">{tool.description}</span>
                <span className="text-link mt-auto">
                  Open tool <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

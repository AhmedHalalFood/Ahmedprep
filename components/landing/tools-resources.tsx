import { ArrowRight, ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, type EventName } from "@/lib/analytics"
import { scheduleSummary } from "@/lib/free-class"
import { toolPath } from "@/lib/tools"

export function ToolsResources() {
  const sunday = scheduleSummary()
  const items: { label: string; title: string; body: string; href: string; event: EventName }[] = [
    {
      label: "Practice tests",
      title: "Free SHSAT Practice Tests",
      body: "Official NYCPS digital practice tests plus AhmedPrep Math and ELA practice.",
      href: "/shsat-practice-tests",
      event: EVENTS.toolOpen,
    },
    {
      label: "Free tool · SHSAT",
      title: "SHSAT Readiness Quiz",
      body: "Ten short Math, ELA, and test-habit questions with a summary and next steps.",
      href: toolPath("shsat-readiness-quiz"),
      event: EVENTS.toolOpen,
    },
    {
      label: "Free tool · Digital SAT",
      title: "Digital SAT Score Goal Planner",
      body: "Enter a current practice score and a target to see a suggested study plan.",
      href: toolPath("digital-sat-score-planner"),
      event: EVENTS.toolOpen,
    },
    {
      label: "Live on Zoom",
      title: "Free Sunday Zoom Classes",
      body: `${sunday.cadence}. ${sunday.times}. RSVP required.`,
      href: "/free-sunday-classes",
      event: EVENTS.sundayClassCtaClick,
    },
  ]

  return (
    <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-4 bg-white py-12 md:py-16">
      <div className="container flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="eyebrow blue">Free Resources</p>
          <h2 id="resources-heading" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
            Practice, Plan &amp; Learn for Free
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.href}>
              <TrackedLink
                href={item.href}
                event={item.event}
                eventProps={{ location: "home_resources_preview" }}
                className="group flex h-full flex-col gap-2 border border-line bg-white p-5 transition-colors hover:border-brand hover:bg-brand-soft"
              >
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand">{item.label}</span>
                <span className="text-lg font-extrabold leading-snug text-navy">{item.title}</span>
                <span className="text-pretty text-sm leading-relaxed text-subtle">{item.body}</span>
                <ArrowUpRight size={16} aria-hidden="true" className="mt-auto self-end text-brand" />
              </TrackedLink>
            </li>
          ))}
        </ul>
        <TrackedLink
          href="/resources"
          event={EVENTS.toolOpen}
          eventProps={{ location: "home_resources_preview", cta: "explore_all" }}
          className="button button-navy-outline button-lg min-h-12 self-start"
        >
          Explore All Free Resources <ArrowRight size={18} aria-hidden="true" />
        </TrackedLink>
      </div>
    </section>
  )
}

import { ArrowRight, FileText, type LucideIcon, Target, TrendingUp, Video } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, type EventName } from "@/lib/analytics"
import { toolPath } from "@/lib/tools"

const ITEMS: { title: string; href: string; event: EventName; Icon: LucideIcon }[] = [
  { title: "SHSAT Practice Tests", href: "/shsat-practice-tests", event: EVENTS.toolOpen, Icon: FileText },
  { title: "SHSAT Readiness Quiz", href: toolPath("shsat-readiness-quiz"), event: EVENTS.toolOpen, Icon: Target },
  {
    title: "Digital SAT Score Planner",
    href: toolPath("digital-sat-score-planner"),
    event: EVENTS.toolOpen,
    Icon: TrendingUp,
  },
  { title: "Free Sunday Zoom Classes", href: "/free-sunday-classes", event: EVENTS.sundayClassCtaClick, Icon: Video },
]

export function ToolsResources() {
  return (
    <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-4 bg-background py-6">
      <div className="container flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex shrink-0 flex-col gap-1 lg:w-56 xl:w-64">
          <p className="eyebrow blue">Free resources</p>
          <h2 id="resources-heading" className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-navy">
            Practice, Plan &amp; Learn for Free
          </h2>
        </div>
        <ul className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ title, href, event, Icon }) => (
            <li key={href}>
              <TrackedLink
                href={href}
                event={event}
                eventProps={{ location: "home_resources_preview" }}
                className="flex h-full min-h-14 items-center gap-3 rounded-md border border-line bg-brand-soft/40 px-3 py-2 text-[0.95rem] font-bold leading-snug text-navy shadow-sm transition-colors hover:border-brand hover:bg-brand-soft"
              >
                <Icon size={26} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-brand" />
                <span className="text-pretty">{title}</span>
              </TrackedLink>
            </li>
          ))}
        </ul>
        <TrackedLink
          href="/resources"
          event={EVENTS.toolOpen}
          eventProps={{ location: "home_resources_preview", cta: "explore_all" }}
          className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 self-start rounded-md border-2 border-navy bg-background px-5 text-center font-extrabold leading-snug text-navy transition-colors hover:bg-navy hover:text-primary-foreground lg:max-w-44 lg:self-auto"
        >
          <span>Explore All Free Resources</span> <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
        </TrackedLink>
      </div>
    </section>
  )
}

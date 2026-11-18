import { ArrowRight, FileText, type LucideIcon, Target, TrendingUp, Video } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, type EventName } from "@/lib/analytics"
import { toolPath } from "@/lib/tools"

const ITEMS: { title: string; href: string; event: EventName; Icon: LucideIcon }[] = [
  { title: "SHSAT Practice Tests", href: "/shsat-practice-tests", event: EVENTS.toolOpen, Icon: FileText },
  { title: "SHSAT Readiness Quiz", href: toolPath("shsat-readiness-quiz"), event: EVENTS.toolOpen, Icon: Target },
  { title: "Digital SAT Score Planner", href: toolPath("digital-sat-score-planner"), event: EVENTS.toolOpen, Icon: TrendingUp },
  { title: "Free Sunday Zoom Classes", href: "/free-sunday-classes", event: EVENTS.sundayClassCtaClick, Icon: Video },
]

export function ToolsResources() {
  return (
    <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-4 bg-site-canvas pb-12 pt-10 md:pb-14 md:pt-12">
      <div className="container rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7 md:p-8">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <p className="eyebrow blue">Free student resources</p>
            <h2 id="resources-heading" className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl">
              Practice and prepare with confidence
            </h2>
          </div>
          <TrackedLink href="/resources" event={EVENTS.toolOpen} eventProps={{ location: "home_resources_preview", cta: "explore_all" }}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm font-extrabold text-brand underline underline-offset-4 hover:text-navy sm:self-end">
            Explore all free resources <ArrowRight size={17} aria-hidden="true" />
          </TrackedLink>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ title, href, event, Icon }) => (
            <li key={href}>
              <TrackedLink
                href={href}
                event={event}
                eventProps={{ location: "home_resources_preview" }}
                className="group flex h-full min-h-24 items-center gap-3 rounded-xl border border-[#DCE6EE] bg-[#F6F9FC] p-4 text-sm font-extrabold leading-snug text-navy transition-colors hover:border-brand hover:bg-[#EAF4FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                <Icon size={24} strokeWidth={1.7} aria-hidden="true" className="shrink-0 text-brand" />
                <span className="flex-1">{title}</span>
                <ArrowRight size={15} aria-hidden="true" className="shrink-0 text-brand opacity-70 transition-transform group-hover:translate-x-0.5" />
              </TrackedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

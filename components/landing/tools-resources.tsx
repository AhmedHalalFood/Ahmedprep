import { ArrowRight, FileText, type LucideIcon, Target, TrendingUp, Video } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, type EventName } from "@/lib/analytics"
import { toolPath } from "@/lib/tools"

const ITEMS: { title: string; detail: string; href: string; event: EventName; Icon: LucideIcon }[] = [
  { title: "SHSAT Practice Tests", detail: "Practice with test-style questions", href: "/shsat-practice-tests", event: EVENTS.toolOpen, Icon: FileText },
  { title: "SHSAT Readiness Quiz", detail: "Check where to focus next", href: toolPath("shsat-readiness-quiz"), event: EVENTS.toolOpen, Icon: Target },
  { title: "Digital SAT Score Planner", detail: "Set goals and track progress", href: toolPath("digital-sat-score-planner"), event: EVENTS.toolOpen, Icon: TrendingUp },
  { title: "Free Sunday Zoom Classes", detail: "Join live SHSAT and Digital SAT lessons", href: "/free-sunday-classes", event: EVENTS.sundayClassCtaClick, Icon: Video },
]

export function ToolsResources() {
  return (
    <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-4 bg-[#F2F4F7] py-2 md:py-3">
      <div className="container">
        <div className="overflow-hidden rounded-xl border border-[#C9D6E2] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0C355E] px-4 py-3 text-white md:px-5">
            <div className="min-w-0 border-l-4 border-[#F2C747] pl-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#F2C747]">Free student resources</p>
              <h2 id="resources-heading" className="text-lg font-extrabold leading-tight sm:text-xl">Practice and prepare with confidence</h2>
            </div>
            <TrackedLink href="/resources" event={EVENTS.toolOpen} eventProps={{ location: "home_resources_preview", cta: "explore_all" }}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#F3C746] px-4 py-2 text-sm font-bold text-[#082C50] transition-colors hover:bg-[#FFDC73] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Explore all free resources <ArrowRight size={17} aria-hidden="true" />
            </TrackedLink>
          </div>
          <ul className="grid grid-cols-1 divide-y divide-[#DCE5ED] px-3 py-2 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {ITEMS.map(({ title, detail, href, event, Icon }) => (
              <li key={href} className="min-w-0">
                <TrackedLink href={href} event={event} eventProps={{ location: "home_resources_preview" }}
                  className="group flex min-h-16 items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-[#EDF5FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy lg:border-r lg:border-[#DCE5ED] lg:last:border-r-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FC] text-[#126AA4]"><Icon size={22} aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold leading-snug text-navy">{title}</span>
                    <span className="block text-xs leading-snug text-subtle">{detail}</span>
                  </span>
                  <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-brand transition-transform group-hover:translate-x-1" />
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

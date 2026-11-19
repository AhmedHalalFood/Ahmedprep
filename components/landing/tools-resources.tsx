import { ArrowRight, FileText, type LucideIcon, Target, TrendingUp, Video } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS, type EventName } from "@/lib/analytics"
import { toolPath } from "@/lib/tools"

const ITEMS: { title: string; detail: string; href: string; event: EventName; Icon: LucideIcon; card: string; iconBg: string }[] = [
  { title: "SHSAT Practice Tests", detail: "Practice with test-style questions", href: "/shsat-practice-tests", event: EVENTS.toolOpen, Icon: FileText, card: "border-t-[#2C72A9] bg-[#F1F7FD]", iconBg: "bg-[#DEEDFA] text-[#17649F]" },
  { title: "SHSAT Readiness Quiz", detail: "Check where to focus next", href: toolPath("shsat-readiness-quiz"), event: EVENTS.toolOpen, Icon: Target, card: "border-t-[#31856E] bg-[#EFF9F5]", iconBg: "bg-[#D5EEE3] text-[#14694F]" },
  { title: "Digital SAT Score Planner", detail: "Set goals and map your progress", href: toolPath("digital-sat-score-planner"), event: EVENTS.toolOpen, Icon: TrendingUp, card: "border-t-[#D5A42D] bg-[#FFFAED]", iconBg: "bg-[#FCE9B6] text-[#805B0A]" },
  { title: "Free Sunday Zoom Classes", detail: "Join live SHSAT and Digital SAT lessons", href: "/free-sunday-classes", event: EVENTS.sundayClassCtaClick, Icon: Video, card: "border-t-[#6977B7] bg-[#F4F5FE]", iconBg: "bg-[#E3E6FA] text-[#485A9A]" },
]

export function ToolsResources() {
  return (
    <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-4 border-b border-[#C9DDEB] bg-[#EAF3FA] py-4 md:py-6">
      <div className="container">
        <div className="overflow-hidden rounded-xl border border-[#B8D1E4] bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#CADDEB] bg-[#DCEEF9] p-4 sm:flex-row sm:items-center sm:justify-between md:px-5 md:py-4">
            <div className="max-w-3xl space-y-1">
              <p className="eyebrow blue">Free student resources</p>
              <h2 id="resources-heading" className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl">
                Practice and prepare with confidence
              </h2>
              <p className="text-sm leading-relaxed text-subtle sm:text-base">Explore helpful practice tools and free learning opportunities before choosing a class.</p>
            </div>
            <TrackedLink href="/resources" event={EVENTS.toolOpen} eventProps={{ location: "home_resources_preview", cta: "explore_all" }}
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg border border-[#C5D8E8] bg-white px-4 py-2 text-sm font-extrabold text-navy transition-colors hover:border-brand hover:bg-[#EFF7FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
              Explore all free resources <ArrowRight size={17} aria-hidden="true" className="text-brand transition-transform group-hover:translate-x-1" />
            </TrackedLink>
          </div>
          <ul className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4">
            {ITEMS.map(({ title, detail, href, event, Icon, card, iconBg }) => (
              <li key={href} className="min-w-0">
                <TrackedLink
                  href={href}
                  event={event}
                  eventProps={{ location: "home_resources_preview" }}
                  className={`group flex h-full min-h-28 flex-col rounded-lg border border-[#D3E0EA] border-t-[3px] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${card}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
                      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <ArrowRight size={19} aria-hidden="true" className="text-brand transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="text-sm font-extrabold leading-snug text-navy sm:text-base">{title}</span>
                  <span className="mt-1 text-sm leading-snug text-subtle">{detail}</span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

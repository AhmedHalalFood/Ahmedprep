import { ArrowRight, Leaf, Snowflake, Sun } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"
import { programsHref } from "@/lib/program-finder"

const SEASONS = [
  {
    id: "winter" as const,
    title: "Winter 2027",
    detail: "12 weeks · 72 hours",
    note: "Founding-family offer available",
    icon: Snowflake,
    tone: "border-[#B7D5E7] bg-[#E8F2FA] text-[#174D7C]",
  },
  {
    id: "spring" as const,
    title: "Spring 2027",
    detail: "12 weeks · 72 hours",
    note: "Early-payment discount available",
    icon: Leaf,
    tone: "border-[#A9D5C5] bg-[#E6F4ED] text-[#086347]",
  },
  {
    id: "summer" as const,
    title: "Summer 2027",
    detail: "48–96 hours",
    note: "Weekend and intensive options",
    icon: Sun,
    tone: "border-[#F0D991] bg-[#FFF4D6] text-[#865500]",
  },
] as const

export function ProgramsPreview() {
  return (
    <section id="programs-pricing" aria-labelledby="programs-pricing-title" className="scroll-mt-4 border-b border-line bg-site-canvas py-10 md:py-12">
      <div className="container rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7 md:p-8">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="eyebrow blue">2027 SHSAT & Digital SAT programs</p>
            <h2 id="programs-pricing-title" className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl">
              Find the right class for your student
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-subtle">
              In-person preparation in Astoria, Queens. Maximum {MAX_CLASS_SIZE} students per class.
            </p>
          </div>
          <TrackedLink
            href="/programs-2027"
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_programs_preview", cta: "compare_all" }}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-navy px-5 text-sm font-extrabold text-white transition-colors hover:bg-[#214C77] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            Compare programs & pricing <ArrowRight size={17} aria-hidden="true" />
          </TrackedLink>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {SEASONS.map(({ id, title, detail, note, icon: Icon, tone }) => (
            <TrackedLink
              key={id}
              href={programsHref({ season: id })}
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_programs_preview", cta: `season_${id}` }}
              className={`group flex min-h-32 flex-col justify-between gap-2 rounded-xl border p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${tone}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
                <h3 className="text-base font-extrabold">{title}</h3>
              </div>
              <div>
                <p className="text-sm font-semibold">{detail}</p>
                <p className="text-xs leading-relaxed opacity-85">{note}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold underline underline-offset-4">
                View class options <ArrowRight size={14} aria-hidden="true" />
              </span>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  )
}

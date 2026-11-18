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
    note: "Enrollment open · Founding-family offer",
    formats: "Weekday and weekend classes",
    icon: Snowflake,
    tone: "border-[#B7D5E7] bg-[#E8F2FA] text-[#174D7C]",
  },
  {
    id: "spring" as const,
    title: "Spring 2027",
    detail: "12 weeks · 72 hours",
    note: "Early-payment discount available",
    formats: "Weekday and weekend classes",
    icon: Leaf,
    tone: "border-[#A9D5C5] bg-[#E6F4ED] text-[#086347]",
  },
  {
    id: "summer" as const,
    title: "Summer 2027",
    detail: "8 weeks of instruction",
    note: "Weekend and weekday intensive options",
    formats: "Weekend and weekday intensive",
    icon: Sun,
    tone: "border-[#F0D991] bg-[#FFF4D6] text-[#865500]",
  },
] as const

export function ProgramsPreview() {
  return (
    <section id="programs-pricing" aria-labelledby="programs-pricing-title" className="scroll-mt-4 border-b border-line bg-site-canvas py-5 md:py-6">
      <div className="container rounded-2xl border border-line border-t-4 border-t-gold bg-white p-5 shadow-sm sm:p-6 md:p-7">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="eyebrow blue">Explore the 2027 class calendar</p>
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
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#D8A326] bg-[#E9B83E] px-5 text-sm font-extrabold shadow-sm transition-colors hover:bg-[#F3CB61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy" style={{ color: "#102F51" }}
          >
            <span style={{ color: "#102F51" }}>Compare programs & pricing</span> <ArrowRight size={17} aria-hidden="true" style={{ color: "#102F51" }} />
          </TrackedLink>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {SEASONS.map(({ id, title, detail, note, formats, icon: Icon, tone }) => (
            <TrackedLink
              key={id}
              href={programsHref({ season: id })}
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_programs_preview", cta: `season_${id}` }}
              className={`group grid h-full min-h-[200px] grid-rows-[auto_1fr_auto] gap-2 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${tone}`}
            >
              <div className="flex min-h-7 items-center gap-2">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
                <h3 className="text-base font-extrabold">{title}</h3>
              </div>
              {id === "summer" ? (
                <div className="self-start space-y-1.5 pt-3 text-xs leading-relaxed">
                  <p className="text-sm font-extrabold">{detail}</p>
                  <p><strong>Weekend (Sat–Sun):</strong> 16 classes · 48 hours</p>
                  <p><strong>Weekday intensive (Mon–Thu):</strong> 32 classes · 96 hours</p>
                </div>
              ) : (
                <div className="self-start space-y-1.5 pt-3">
                  <p className="text-sm font-extrabold">{detail}</p>
                  <p className="text-xs font-medium leading-relaxed">{formats}</p>
                  <p className="text-xs leading-relaxed opacity-85">{note}</p>
                </div>
              )
              <span className="inline-flex items-center gap-1 self-end pt-2 text-xs font-extrabold underline underline-offset-4">
                View class options <ArrowRight size={14} aria-hidden="true" />
              </span>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  )
}

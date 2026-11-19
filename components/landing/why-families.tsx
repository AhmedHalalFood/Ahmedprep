import Link from "next/link"
import { ArrowRight, ChartNoAxesColumn, ClipboardCheck, GraduationCap, Users } from "lucide-react"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"

const REASONS = [
  { icon: Users, number: "01", title: `Maximum ${MAX_CLASS_SIZE} students`, body: "Small classes and individual attention.", accent: "border-t-[#E7B83E] bg-[#FFFBF0]", iconBg: "bg-[#FCE9B7] text-[#785315]" },
  { icon: GraduationCap, number: "02", title: "Founder-led teaching", body: "Learn directly from AhmedPrep's founder.", accent: "border-t-[#2778B4] bg-[#F1F8FE]", iconBg: "bg-[#DDEFFC] text-[#155B96]" },
  { icon: ClipboardCheck, number: "03", title: "Diagnostic-based learning", body: "Instruction focused on each student's needs.", accent: "border-t-[#31856E] bg-[#F0F9F5]", iconBg: "bg-[#D6EEE5] text-[#176C55]" },
  { icon: ChartNoAxesColumn, number: "04", title: "Progress you can follow", body: "Structured practice and parent updates.", accent: "border-t-[#5377A8] bg-[#F3F6FC]", iconBg: "bg-[#DFE9F6] text-[#2D598C]" },
] as const

export function WhyFamilies() {
  return (
    <section id="why-families" aria-labelledby="why-families-title" className="border-b border-[#E8D8B6] bg-[#FFF8EA] py-4 md:py-6">
      <div className="container">
        <div className="overflow-hidden rounded-xl border border-[#D2B777] bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#E3EAF0] bg-[#FFF2D6] p-4 sm:flex-row sm:items-center sm:justify-between md:px-5 md:py-4">
            <div className="max-w-3xl space-y-1">
              <p className="eyebrow blue">For parents</p>
              <h2 id="why-families-title" className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl">
                Why families choose AhmedPrep
              </h2>
              <p className="text-sm leading-relaxed text-subtle sm:text-base">Focused teaching, clear goals, and personal attention for every student.</p>
            </div>
            <Link href="/about" className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg border border-[#C5D8E8] bg-white px-4 py-2 text-sm font-extrabold text-navy transition-colors hover:border-brand hover:bg-[#EFF7FE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
              Meet AhmedPrep <ArrowRight size={17} aria-hidden="true" className="text-brand transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ul className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map(({ icon: Icon, number, title, body, accent, iconBg }) => (
              <li key={title} className={`flex min-w-0 flex-col rounded-lg border border-[#DFE7EE] border-t-[3px] p-3 ${accent}`}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span aria-hidden="true" className="text-xs font-extrabold tracking-widest text-[#8396A9]">{number}</span>
                </div>
                <h3 className="text-sm font-extrabold leading-snug text-navy sm:text-base">{title}</h3>
                <p className="mt-1 text-sm leading-snug text-subtle">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

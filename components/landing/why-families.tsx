import Link from "next/link"
import { ArrowRight, ChartNoAxesColumn, ClipboardCheck, GraduationCap, Users } from "lucide-react"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"

const REASONS = [
  { icon: Users, title: `Maximum ${MAX_CLASS_SIZE} students`, body: "Small classes and individual attention." },
  { icon: GraduationCap, title: "Personally founder-taught", body: "SHSAT and Digital SAT classes taught by Tariq Ahmed." },
  { icon: ClipboardCheck, title: "Diagnostic-based learning", body: "Instruction focused on each student's needs." },
  { icon: ChartNoAxesColumn, title: "Progress you can follow", body: "Structured practice and parent updates." },
] as const

export function WhyFamilies() {
  return (
    <section id="why-families" aria-labelledby="why-families-title" className="bg-[#F2F4F7] py-2 md:py-3">
      <div className="container">
        <div className="overflow-hidden rounded-xl border border-[#D8D5CC] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF4DA] px-4 py-3 md:px-5">
            <div className="min-w-0 border-l-4 border-[#D5A329] pl-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#8B6412]">For parents</p>
              <h2 id="why-families-title" className="text-lg font-extrabold leading-tight text-navy sm:text-xl">Why families choose our classes</h2>
            </div>
            <Link href="/about" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#153E67] bg-white px-4 py-2 text-sm font-bold text-navy hover:bg-[#F2F7FD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
              Meet our founder <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid grid-cols-1 divide-y divide-[#E1E7ED] px-3 py-2 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {REASONS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex min-h-16 min-w-0 items-center gap-3 px-2 py-2 lg:border-r lg:border-[#E1E7ED] lg:last:border-r-0">
                <Icon size={25} aria-hidden="true" className="shrink-0 text-[#1873B5]" strokeWidth={1.8} />
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold leading-snug text-navy">{title}</h3>
                  <p className="text-xs leading-snug text-subtle">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

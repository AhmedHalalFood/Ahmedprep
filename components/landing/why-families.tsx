import Link from "next/link"
import { ArrowRight, ChartNoAxesColumn, ClipboardCheck, GraduationCap, Users } from "lucide-react"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"

const REASONS = [
  { icon: Users, title: `Maximum ${MAX_CLASS_SIZE} students`, body: "Small classes and individual attention." },
  { icon: GraduationCap, title: "Founder-led teaching", body: "Learn directly from AhmedPrep's founder." },
  { icon: ClipboardCheck, title: "Diagnostic-based learning", body: "Instruction focused on each student's needs." },
  { icon: ChartNoAxesColumn, title: "Progress you can follow", body: "Structured practice and parent updates." },
] as const

export function WhyFamilies() {
  return (
    <section id="why-families" aria-labelledby="why-families-title" className="border-b border-line bg-site-canvas py-10 md:py-12">
      <div className="container rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <p className="eyebrow blue">For parents</p>
            <h2 id="why-families-title" className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl">
              Why families choose AhmedPrep
            </h2>
            <p className="text-sm leading-relaxed text-subtle">Focused teaching, clear goals, and personal attention for every student.</p>
          </div>
          <Link href="/about" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start text-sm font-bold text-brand underline underline-offset-4 hover:text-navy sm:self-end">
            Meet AhmedPrep <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#E0E8EF] bg-[#F6F9FC] p-4 sm:p-5">
              <Icon size={27} strokeWidth={1.7} aria-hidden="true" className="text-brand" />
              <h3 className="text-base font-extrabold leading-snug text-navy">{title}</h3>
              <p className="text-sm leading-relaxed text-subtle">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import { ChartNoAxesColumn, ClipboardCheck, GraduationCap, Users } from "lucide-react"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"

const REASONS = [
  {
    icon: Users,
    title: `Maximum ${MAX_CLASS_SIZE} students per class`,
    body: "Individual attention in a focused, supportive setting.",
  },
  {
    icon: GraduationCap,
    title: "Personalized instruction",
    body: "Learn directly from founder and lead instructor Tariq Ahmed.",
  },
  {
    icon: ClipboardCheck,
    title: "Diagnostic-based teaching",
    body: "Instruction tailored to each student's strengths and areas for improvement.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Progress you can follow",
    body: "Progress tracking, structured homework, and regular parent communication.",
  },
] as const

export function WhyFamilies() {
  return (
    <section id="why-families" aria-labelledby="why-families-title" className="border-b border-line bg-brand-soft/60 py-6">
      <div className="container flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-0">
        <div className="flex shrink-0 flex-col gap-1 lg:w-64 lg:justify-center lg:border-r lg:border-line lg:pr-6">
          <p className="eyebrow blue">For parents</p>
          <h2
            id="why-families-title"
            className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy"
          >
            Why Choose AhmedPrep?
          </h2>
        </div>
        <ul className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3 lg:border-r lg:border-line lg:px-5 lg:last:border-r-0">
              <Icon size={30} strokeWidth={1.7} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <div className="flex flex-col gap-1">
                <h3 className="text-pretty text-base font-extrabold leading-snug text-navy">{title}</h3>
                <p className="text-pretty text-sm leading-relaxed text-subtle">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

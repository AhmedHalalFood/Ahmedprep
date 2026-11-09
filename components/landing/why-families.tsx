import Link from "next/link"
import { ArrowUpRight, ClipboardCheck, LineChart, UserRound, Users } from "lucide-react"
import { MAX_CLASS_SIZE } from "@/lib/cohorts-2027"

const REASONS = [
  {
    icon: Users,
    title: `Maximum ${MAX_CLASS_SIZE} students per class`,
    body: "Small groups mean the instructor sees each student's work, not just their final answers.",
  },
  {
    icon: UserRound,
    title: "Personalized instruction",
    body: "Students learn directly from founder and lead instructor Tariq Ahmed.",
  },
  {
    icon: ClipboardCheck,
    title: "Diagnostic-based teaching",
    body: "Every student starts with a diagnostic, so lessons and practice target the skills that need work.",
  },
  {
    icon: LineChart,
    title: "Progress tracking & parent communication",
    body: "Structured homework after each lesson and regular updates so parents know where things stand.",
  },
] as const

export function WhyFamilies() {
  return (
    <section id="why-families" aria-labelledby="why-families-title" className="border-y border-line bg-warm py-12 md:py-16">
      <div className="container flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="eyebrow blue">For parents</p>
            <h2 id="why-families-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl">
              Why Choose AhmedPrep?
            </h2>
          </div>
          <Link href="/about" className="text-link">
            Learn more about AhmedPrep <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-3 bg-white p-5 md:p-6">
              <Icon size={24} aria-hidden="true" className="text-brand" />
              <h3 className="text-lg font-extrabold leading-snug text-navy">{title}</h3>
              <p className="text-pretty text-sm leading-relaxed text-subtle">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

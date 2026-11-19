import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, ClipboardCheck, Target } from "lucide-react"
import { FREE_CLASS } from "@/lib/free-class"
import type { Resource } from "@/lib/resources"

export function ResourceNextSteps({ category }: { category: Resource["category"] }) {
  const isSat = category === "Digital SAT"
  const links = [
    isSat
      ? { href: "/digital-sat-prep", label: "Digital SAT Prep", body: "Small-group classes and tutoring in Astoria.", Icon: BookOpen }
      : { href: "/shsat-prep", label: "SHSAT Prep", body: "Math and ELA preparation in Astoria.", Icon: BookOpen },
    { href: FREE_CLASS.path, label: "Free Sunday Classes", body: "Live online classes. View upcoming dates.", Icon: CalendarDays },
    { href: "/free-diagnostic", label: "Free Diagnostic", body: "Identify the skills to practice first.", Icon: ClipboardCheck },
    isSat
      ? { href: "/tools/digital-sat-score-planner", label: "SAT Score Planner", body: "Set a target and plan your practice.", Icon: Target }
      : { href: "/tools/shsat-readiness-quiz", label: "SHSAT Readiness Quiz", body: "Ten questions with a readiness summary.", Icon: Target },
  ]
  return (
    <section aria-labelledby="next-steps-title" className="border-t border-line bg-site-canvas py-5 md:py-7">
      <div className="container">
        <div className="overflow-hidden rounded-xl border border-[#C9D8E5] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-4 py-3 md:px-5">
            <h2 id="next-steps-title" className="text-lg font-extrabold leading-tight text-white md:text-xl">
              Next steps for {category} students
            </h2>
            <Link href="/tools" className="inline-flex min-h-9 items-center gap-1 rounded-md bg-gold px-3 text-xs font-extrabold text-navy transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
              All Free Tools <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3 lg:p-4">
            {links.map(({ href, label, body, Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex h-full min-h-24 flex-col justify-center gap-2 rounded-lg border border-[#D7E2EB] bg-[#F5F9FC] p-3 transition hover:border-brand hover:bg-[#EDF6FD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <span className="flex items-center gap-2 text-sm font-extrabold leading-snug text-navy">
                    <Icon size={18} className="shrink-0 text-brand" aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    <ArrowRight size={15} className="shrink-0 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                  <span className="pl-[26px] text-xs leading-snug text-subtle">{body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FREE_CLASS } from "@/lib/free-class"
import type { Resource } from "@/lib/resources"

export function ResourceNextSteps({ category }: { category: Resource["category"] }) {
  const isSat = category === "Digital SAT"
  const links = [
    isSat
      ? { href: "/digital-sat", label: "Digital SAT Prep at AhmedPrep", body: "Reading & Writing and Math preparation in Astoria, Queens and online." }
      : { href: "/shsat", label: "SHSAT Prep at AhmedPrep", body: "Math and ELA preparation for the computer-adaptive SHSAT." },
    { href: FREE_CLASS.path, label: "Free Sunday Classes", body: "Free live online SHSAT and Digital SAT classes on Sundays. See upcoming dates and times." },
    { href: "/free-diagnostic", label: "Free Diagnostic", body: "Find out exactly which skills to practice first." },
    isSat
      ? { href: "/tools/digital-sat-score-planner", label: "Digital SAT Score Goal Planner", body: "Turn a practice score and a target into a study plan." }
      : { href: "/tools/shsat-readiness-quiz", label: "SHSAT Readiness Quiz", body: "Ten quick questions with a general readiness summary." },
  ]
  return (
    <section aria-labelledby="next-steps-title" className="border-t border-line bg-warm py-12">
      <div className="container">
        <h2 id="next-steps-title" className="text-2xl font-extrabold text-navy">
          Next steps for {category} students
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="group flex h-full flex-col gap-2 border border-line bg-white p-5 hover:border-brand">
                <span className="flex items-start justify-between gap-2 font-extrabold text-navy group-hover:text-brand">
                  {link.label} <ArrowUpRight size={16} aria-hidden="true" className="mt-1 shrink-0" />
                </span>
                <span className="text-sm leading-relaxed text-subtle">{link.body}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/tools" className="text-link mt-6">
          All free tools <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

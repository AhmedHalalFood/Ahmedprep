import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const REASONS = [
  ["Diagnostic-based instruction", "Every student starts with a diagnostic, so lessons target the skills that need work instead of a generic syllabus."],
  ["High-attention teaching", "Small groups and one-on-one sessions mean the instructor sees each student's work, not just their final answers."],
  ["Direct instructor access", "Families work directly with founder and lead instructor Tariq Ahmed, not a rotating call center."],
  ["Structured homework", "Assignments follow each lesson and practice the exact skills that were taught."],
  ["Progress tracking", "Practice sections and full-length tests are reviewed so the plan can be adjusted as the student improves."],
  ["Parent communication", "Parents hear what was covered, what to practice next, and how the student is doing."],
  ["Free weekly learning", "Free live Sunday classes alternate between SHSAT and Digital SAT topics, open to any student who RSVPs."],
] as const

export function WhyFamilies() {
  return (
    <section id="why-families" className="method-section" aria-labelledby="why-families-title">
      <div className="container">
        <div className="method-intro">
          <p className="eyebrow gold">For parents</p>
          <h2 id="why-families-title">Why Families Choose AhmedPrep</h2>
          <p>
            Preparation in Astoria, Queens built around how each student learns, with clear communication for the family at every step.
          </p>
          <Link href="/about" className="text-link">
            Meet Tariq Ahmed <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ul className="method-grid">
          {REASONS.map(([title, body]) => (
            <li key={title} className="method-card">
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

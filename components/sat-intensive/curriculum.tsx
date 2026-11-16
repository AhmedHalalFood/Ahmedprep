import { BookOpenText, Calculator, Check } from "lucide-react"
import { Section } from "@/components/landing/primitives"

const TRACKS = [
  {
    title: "Digital SAT Math",
    icon: Calculator,
    card: "border-brand/25 bg-brand-soft",
    badge: "bg-brand text-white",
    tick: "text-brand",
    topics: [
      "Algebra and functions",
      "Advanced math",
      "Problem-solving and data analysis",
      "Geometry and trigonometry",
      "Desmos calculator strategies",
      "Timed Math practice",
    ],
  },
  {
    title: "Digital SAT Reading & Writing",
    icon: BookOpenText,
    card: "border-lavender/25 bg-lavender-soft",
    badge: "bg-lavender text-white",
    tick: "text-lavender",
    topics: [
      "Grammar and punctuation",
      "Reading comprehension",
      "Vocabulary in context",
      "Inference and evidence",
      "Transitions and rhetorical synthesis",
      "Timed Reading and Writing practice",
    ],
  },
] as const

export function SatIntensiveCurriculum() {
  return (
    <Section
      id="curriculum"
      tone="warm"
      eyebrow="Curriculum"
      title="Both sections of the Digital SAT, covered"
      intro="Students receive targeted instruction and practice based on their individual weaknesses. Instructors review each student’s practice results and adjust what they work on next."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {TRACKS.map(({ title, icon: Icon, card, badge, tick, topics }) => (
          <article key={title} className={`flex flex-col gap-6 rounded-xl border p-6 md:p-8 ${card}`}>
            <div className="flex items-center gap-4">
              <span className={`flex size-12 items-center justify-center rounded-lg ${badge}`}>
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="text-xl font-extrabold text-navy md:text-2xl">{title}</h3>
            </div>
            <ul className="grid gap-3">
              {topics.map((topic) => (
                <li key={topic} className="flex items-start gap-3 font-semibold text-ink">
                  <Check size={18} strokeWidth={3} className={`mt-0.5 shrink-0 ${tick}`} aria-hidden="true" />
                  {topic}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}

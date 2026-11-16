import Image from "next/image"
import { BookOpenText, Calculator, Check } from "lucide-react"

const TRACKS = [
  {
    title: "Math",
    icon: Calculator,
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
    title: "Reading & Writing",
    icon: BookOpenText,
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
    <section id="curriculum" aria-labelledby="curriculum-title" className="scroll-mt-4 bg-paper py-10 md:py-12">
      <div className="container flex flex-col gap-6">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="eyebrow">Curriculum</p>
          <h2 id="curriculum-title" className="text-balance text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
            Both sections of the Digital SAT, covered
          </h2>
          <p className="text-pretty leading-relaxed text-subtle">
            Instructors review each student&apos;s practice results with realistic SAT questions and focus the next class on the question
            types they miss most.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.75fr]">
          {TRACKS.map(({ title, icon: Icon, topics }) => (
            <article key={title} className="flex flex-col gap-4 rounded-xl border border-line bg-cream p-5">
              <h3 className="flex items-center gap-3 text-lg font-extrabold text-navy">
                <span className="flex size-10 items-center justify-center rounded-lg bg-navy text-gold">
                  <Icon size={20} aria-hidden="true" />
                </span>
                {title}
              </h3>
              <ul className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2 text-sm font-semibold leading-snug text-ink">
                    <Check size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                    {topic}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <div className="relative hidden overflow-hidden rounded-xl lg:block">
            <Image
              src="/images/sat-intensive/practice-review-illustration.jpg"
              alt="Illustration of a reviewed math practice worksheet with circled answers beside a pencil and calculator"
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

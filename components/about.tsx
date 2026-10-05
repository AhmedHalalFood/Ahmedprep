import { Users, Target, Award, Heart, GraduationCap } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Focused preparation",
    description: "Clear instruction, deliberate practice, and measurable next steps for the exam or course ahead.",
  },
  {
    icon: Award,
    title: "Experienced teaching",
    description: "A classroom-informed approach shaped by NYC public-school teaching and more than a decade of tutoring.",
  },
  {
    icon: Users,
    title: "Parent partnership",
    description: "Thoughtful communication helps families understand priorities, progress, and how to support study at home.",
  },
  {
    icon: Heart,
    title: "Confident learners",
    description: "Students build the habits, reasoning, and self-advocacy that matter beyond a single test date.",
  },
]

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-card py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">The AhmedPrep difference</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              Serious preparation. Personal attention.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              AhmedPrep was founded by Tariq Ahmed to give NYC students a more focused, personal path through competitive exams and demanding coursework. Every plan is built around the student&apos;s starting point, target, and schedule.
            </p>
            <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
              <GraduationCap className="h-6 w-6 text-accent" aria-hidden="true" />
              <p className="text-sm font-medium leading-relaxed text-foreground">
                Teaching that connects rigorous academics with the way students actually learn.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="relative flex min-h-[270px] flex-col justify-end overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground sm:row-span-2">
              <div className="absolute inset-6 rounded-2xl border border-primary-foreground/20" aria-hidden="true" />
              <div className="relative mx-auto mb-auto flex h-36 w-36 items-center justify-center rounded-full border border-accent/60 bg-accent/15 text-center font-serif text-4xl text-accent">
                TA
              </div>
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Founder & lead instructor</p>
                <h3 className="mt-2 font-serif text-3xl">Tariq Ahmed</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-primary-foreground">
                  B.S., New York University · M.S. Mathematics, Hunter College
                </p>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
                  NYC DOE Educator · 12+ Years of Teaching & Test-Prep Experience
                </p>
              </div>
            </div>
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-border/70 bg-background p-6">
                <value.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <h3 className="mt-5 font-serif text-xl font-medium text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
      

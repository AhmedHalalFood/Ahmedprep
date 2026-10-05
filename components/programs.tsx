import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, GraduationCap, BookOpen, Calculator, PenTool, FlaskConical, Landmark, Trophy } from "lucide-react"

const programs = [
  { icon: GraduationCap, title: "SHSAT", description: "Structured ELA and math preparation for NYC Specialized High School admissions.", features: ["ELA & Math", "Revising & Editing", "Timed practice"] },
  { icon: BookOpen, title: "SAT", description: "Targeted instruction for the digital SAT, with a plan shaped by each student's baseline.", features: ["Reading & Writing", "Math reasoning", "Score strategy"] },
  { icon: Calculator, title: "ACT", description: "Content review and pacing strategies across the ACT sections that matter most.", features: ["English & Reading", "Mathematics", "Science reasoning"] },
  { icon: FlaskConical, title: "AP Courses", description: "Course support that reinforces classroom learning and prepares students for AP exams.", features: ["Math & sciences", "Humanities", "Exam review"] },
  { icon: Landmark, title: "PSAT/NMSQT", description: "Early preparation that builds familiarity with the test and stronger academic habits.", features: ["Test strategy", "Skill building", "Study planning"] },
  { icon: Trophy, title: "Regents", description: "Focused review for New York State Regents courses, concepts, and exam formats.", features: ["Topic review", "Practice sets", "Exam readiness"] },
  { icon: PenTool, title: "Hunter Entrance", description: "Focused preparation for the Hunter College High School entrance process and exam.", features: ["Advanced math", "ELA & writing", "Test strategy"] },
]

export function Programs() {
  return (
    <section id="programs" className="scroll-mt-20 bg-secondary/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">Programs</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">Preparation built around the next important step.</h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">From middle-school admissions to advanced coursework, get direct instruction for the work in front of you.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <Card key={program.title} className={`group border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${index === 0 ? "ring-1 ring-accent/40" : ""}`}>
              <CardContent className="p-7">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10"><program.icon className="h-6 w-6 text-accent" aria-hidden="true" /></div>
                  {index === 0 && <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">Featured</span>}
                </div>
                <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">{program.title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-muted-foreground">{program.description}</p>
                <ul className="mt-5 space-y-2.5">
                  {program.features.map((feature) => <li key={feature} className="flex items-center gap-3 text-sm text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />{feature}</li>)}
                </ul>
                <Button asChild variant="ghost" className="mt-7 h-auto p-0 font-medium text-foreground hover:bg-transparent hover:text-accent"><a href="#contact">Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></a></Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center"><Button asChild className="rounded-full bg-primary px-7 py-6 text-primary-foreground hover:bg-primary/90"><a href="#contact">Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></Button></div>
      </div>
    </section>
  )
}
      

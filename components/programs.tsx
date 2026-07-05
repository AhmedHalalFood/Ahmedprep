import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, GraduationCap, BookOpen, Calculator, FlaskConical, ScrollText } from "lucide-react"

const programs = [
  {
    icon: GraduationCap,
    title: "SHSAT",
    description:
      "Comprehensive prep for NYC's Specialized High Schools Admissions Test with proven, section-by-section strategies.",
    features: ["ELA & Math Mastery", "Revising / Editing", "Full-Length Mock Exams"],
    highlight: true,
  },
  {
    icon: BookOpen,
    title: "SAT",
    description:
      "Strategic Digital SAT prep with personalized study plans built for maximum score improvement.",
    features: ["Reading & Writing", "Adaptive Math", "Timing Strategy"],
    highlight: false,
  },
  {
    icon: Calculator,
    title: "ACT",
    description:
      "Complete ACT preparation focused on pacing and content mastery across every subject.",
    features: ["Science Reasoning", "English & Reading", "Mathematics"],
    highlight: false,
  },
  {
    icon: FlaskConical,
    title: "AP Courses",
    description:
      "Advanced Placement support to help students excel on exams and earn valuable college credit.",
    features: ["AP Sciences", "AP Calculus", "AP Humanities"],
    highlight: false,
  },
  {
    icon: ScrollText,
    title: "Regents",
    description:
      "Targeted prep for all NYS Regents exams, from passing scores to honors-level 90+ results.",
    features: ["Algebra & Geometry", "Living Environment", "Global & US History"],
    highlight: false,
  },
]

export function Programs() {
  return (
    <section id="programs" className="py-24 lg:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">Our Programs</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Tailored programs for every academic goal
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            From specialized high school admissions to college applications, we provide
            expert guidance at every step of the journey.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden rounded-2xl border-border/60 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                program.highlight ? "ring-2 ring-accent/40" : ""
              }`}
            >
              {program.highlight && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <CardContent className="p-8">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${
                    program.highlight ? "bg-accent/15" : "bg-primary/10"
                  }`}
                >
                  <program.icon
                    className={`w-7 h-7 ${program.highlight ? "text-accent" : "text-primary"}`}
                  />
                </div>

                <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
                  {program.title}
                </h3>

                <p className="mt-3 text-muted-foreground leading-relaxed">{program.description}</p>

                <ul className="mt-6 space-y-3">
                  {program.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="ghost"
                  className="mt-8 p-0 h-auto font-medium text-primary hover:text-accent hover:bg-transparent group/btn"
                >
                  <a href="#contact">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="rounded-2xl border-dashed border-2 border-border bg-transparent flex items-center justify-center hover:border-accent/50 transition-colors">
            <CardContent className="p-8 text-center">
              <h3 className="font-serif text-2xl font-medium text-foreground">Not sure where to start?</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Book a free consultation and we&apos;ll build a plan around your goals.
              </p>
              <Button asChild className="mt-6 rounded-full px-6">
                <a href="#contact">Get a Plan</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

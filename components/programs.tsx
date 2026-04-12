import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, FlaskConical, PenTool, ArrowRight, Check } from "lucide-react"

const programs = [
  {
    icon: BookOpen,
    title: "SAT Preparation",
    description: "Comprehensive SAT prep covering all sections with proven strategies for top scores.",
    features: ["Full-length practice tests", "Personalized study plan", "Score improvement guarantee"],
    featured: true
  },
  {
    icon: Calculator,
    title: "ACT Preparation",
    description: "Master the ACT with targeted instruction and timed practice sessions.",
    features: ["Section-by-section breakdown", "Time management strategies", "Science reasoning focus"],
    featured: false
  },
  {
    icon: FlaskConical,
    title: "AP Courses",
    description: "Excel in Advanced Placement courses with expert guidance and exam prep.",
    features: ["Subject-specific tutoring", "FRQ practice", "Exam strategy sessions"],
    featured: false
  },
  {
    icon: PenTool,
    title: "College Essay Writing",
    description: "Craft compelling college application essays that stand out to admissions officers.",
    features: ["Brainstorming sessions", "Multiple draft reviews", "Personal statement guidance"],
    featured: false
  }
]

export function Programs() {
  return (
    <section id="programs" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Programs</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground text-balance">
            Comprehensive Test Prep Solutions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose from our range of expert-led programs designed to help you achieve your academic goals.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <Card 
              key={index} 
              className={`bg-card border-border hover:border-primary/50 transition-all duration-300 ${
                program.featured ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <program.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{program.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{program.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {program.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant={program.featured ? "default" : "outline"} className="w-full gap-2">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, GraduationCap, BookOpen, Calculator, PenTool, FlaskConical } from "lucide-react"

const programs = [
  {
    icon: GraduationCap,
    title: "SHSAT Preparation",
    description: "Comprehensive preparation for NYC&apos;s Specialized High Schools Admissions Test with proven strategies.",
    features: ["ELA & Math Mastery", "Revising/Editing Excellence", "Full-Length Practice Tests"],
    highlight: true
  },
  {
    icon: BookOpen,
    title: "SAT Preparation",
    description: "Strategic SAT prep covering all sections with personalized study plans for maximum score improvement.",
    features: ["Evidence-Based Reading", "Math Problem Solving", "Writing & Language"],
    highlight: false
  },
  {
    icon: Calculator,
    title: "ACT Preparation",
    description: "Complete ACT preparation focusing on timing strategies and content mastery across all subjects.",
    features: ["Science Reasoning", "English & Reading", "Mathematics"],
    highlight: false
  },
  {
    icon: FlaskConical,
    title: "AP Courses",
    description: "Advanced Placement course support to help students excel and earn college credit.",
    features: ["AP Sciences", "AP Mathematics", "AP Humanities"],
    highlight: false
  },
  {
    icon: PenTool,
    title: "College Essays",
    description: "Expert guidance in crafting compelling personal statements that stand out to admissions committees.",
    features: ["Personal Statement", "Supplemental Essays", "Application Review"],
    highlight: false
  },
]

export function Programs() {
  return (
    <section id="programs" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            Our Programs
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Tailored programs for every academic goal
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            From middle school admissions to college applications, we provide 
            expert guidance at every step of your educational journey.
          </p>
        </div>
        
        {/* Programs grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 ${
                program.highlight ? "md:col-span-2 lg:col-span-1 ring-2 ring-accent/20" : ""
              }`}
            >
              {program.highlight && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                  Most Popular
                </div>
              )}
              <CardContent className="p-8">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${
                  program.highlight ? "bg-accent/10" : "bg-secondary"
                }`}>
                  <program.icon className={`w-7 h-7 ${program.highlight ? "text-accent" : "text-foreground"}`} />
                </div>
                
                <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
                  {program.title}
                </h3>
                
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {program.description}
                </p>
                
                <ul className="mt-6 space-y-3">
                  {program.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="ghost" 
                  className="mt-8 p-0 h-auto font-medium text-foreground hover:text-accent hover:bg-transparent group/btn"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

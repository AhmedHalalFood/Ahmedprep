import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, GraduationCap, BookOpen, Calculator, FlaskConical, PenTool } from "lucide-react"

const programs = [
  {
    id: "shsat",
    icon: GraduationCap,
    title: "SHSAT Preparation",
    description: "Comprehensive preparation for NYC's Specialized High Schools Admissions Test with proven strategies for Stuyvesant, Bronx Science, Brooklyn Tech, and more.",
    features: ["ELA & Math Mastery", "Revising/Editing Excellence", "Full-Length Practice Tests", "Hunter Test Prep"],
    highlight: true
  },
  {
    id: "sat-act",
    icon: BookOpen,
    title: "SAT/ACT Preparation",
    description: "Strategic SAT and ACT prep covering all sections with personalized study plans for maximum score improvement.",
    features: ["Evidence-Based Reading", "Math Problem Solving", "Writing & Language", "PSAT/NMSQT Prep"],
    highlight: false
  },
  {
    id: "ap",
    icon: FlaskConical,
    title: "AP & Subject Tutoring",
    description: "Advanced Placement course support and subject tutoring to help students excel and earn college credit.",
    features: ["AP Sciences", "AP Mathematics", "Regents Exams", "Subject Tutoring"],
    highlight: false
  },
]

export function Programs() {
  return (
    <section id="shsat" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            Our Programs
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Dream scores on every test
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            From SHSAT to SAT, ACT to AP - we help students achieve their dream scores 
            and gain admission to top schools.
          </p>
        </div>
        
        {/* Programs grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card 
              key={index}
              id={program.id}
              className={`group relative overflow-hidden border-border/50 bg-card hover:shadow-xl transition-all duration-300 ${
                program.highlight ? "ring-2 ring-accent/20" : ""
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
                  asChild
                >
                  <a href="#contact">
                    Enroll Now
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All classes are conducted <span className="font-medium text-foreground">live and online</span> - 
            join from anywhere without wasting time.
          </p>
        </div>
      </div>
    </section>
  )
}

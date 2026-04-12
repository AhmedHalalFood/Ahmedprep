import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,90,43,0.04),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,90,43,0.04),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Elegant badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Live Online Classes - Join From Anywhere
            </span>
          </div>
          
          {/* Main headline with serif font */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1] text-balance">
            Welcome to
            <br />
            <span className="italic text-accent">Ahmed Prep!</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            World-class test prep that is accessible, effective, and enjoyable for all students. 
            We help students develop skills to think critically, learn independently, and solve problems effectively.
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20"
              asChild
            >
              <a href="tel:347-479-5020">
                <Phone className="mr-2 w-4 h-4" />
                Call Now: 347-479-5020
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium border-border hover:bg-secondary"
              asChild
            >
              <a href="#shsat">
                Explore Programs
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
          
          {/* Urgency message */}
          <p className="mt-6 text-sm text-accent font-medium">
            Classes are filling up quickly - Don&apos;t wait!
          </p>
        </div>
        
        {/* Stats section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {[
            { value: "SHSAT", label: "Specialized HS Prep" },
            { value: "SAT/ACT", label: "College Entrance" },
            { value: "AP", label: "Advanced Placement" },
            { value: "Regents", label: "NY State Exams" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-2xl md:text-3xl font-medium text-foreground">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Elegant divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}

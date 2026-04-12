"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, MapPin, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Elegant background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,90,43,0.08),transparent_50%)]" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Live Online Classes - Astoria, NY
            </span>
          </div>
          
          {/* Main headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1]">
            Welcome to
            <br />
            <span className="italic text-accent">Ahmed Prep!</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            World-class test prep that is accessible, effective, and enjoyable for all students. 
            We help students develop skills to think critically, learn independently, and solve problems effectively.
          </p>
          
          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">Premier Tutoring Since 2021</span>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-accent/20"
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
        
        {/* Programs offered */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {[
            { title: "SHSAT", subtitle: "Specialized HS Prep", highlight: true },
            { title: "SAT/ACT", subtitle: "College Entrance", highlight: false },
            { title: "AP Courses", subtitle: "Advanced Placement", highlight: false },
            { title: "Tutoring", subtitle: "All Subjects", highlight: false },
          ].map((program, index) => (
            <div 
              key={index} 
              className={`text-center p-6 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                program.highlight 
                  ? "bg-accent/5 border-accent/20" 
                  : "bg-card border-border/50 hover:border-border"
              }`}
            >
              <div className={`font-serif text-2xl md:text-3xl font-medium ${
                program.highlight ? "text-accent" : "text-foreground"
              }`}>
                {program.title}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {program.subtitle}
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

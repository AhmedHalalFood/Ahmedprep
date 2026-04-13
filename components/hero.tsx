import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,90,43,0.04),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,90,43,0.04),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              NYC&apos;s Premier Test Prep Academy
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1] text-balance">
            Exceptional preparation
            <br />
            <span className="italic text-accent">for exceptional futures</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Personalized tutoring and test preparation designed to unlock your child&apos;s
            full potential. SHSAT, SAT, ACT, and beyond.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20"
            >
              <a href="#contact">
                Schedule a Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium"
            >
              <a href="#programs">
                Explore Our Programs
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {[
            { value: "2,500+", label: "Students Mentored" },
            { value: "96%", label: "Admission Rate" },
            { value: "150+", label: "Points Avg. Improvement" },
            { value: "12+", label: "Years of Excellence" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-medium text-foreground">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-x-hidden flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,90,43,0.04),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,90,43,0.04),transparent_50%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              NYC&apos;s Premier Test Prep Academy
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl text-center font-serif text-5xl leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Exceptional preparation
            <span className="block italic text-accent">
              for exceptional futures
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Personalized tutoring and test preparation designed to unlock your child&apos;s
            full potential. SHSAT, SAT, ACT, and beyond.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20"
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
              className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-medium"
            >
              <a href="#programs">Explore Our Programs</a>
            </Button>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
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

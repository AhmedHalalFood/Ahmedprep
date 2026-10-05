import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden flex items-center justify-center bg-primary pt-20 text-primary-foreground">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              NYC&apos;s Premier Test Prep Academy
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl text-center font-serif text-5xl leading-tight tracking-tight text-primary-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Exceptional preparation
            <span className="block italic text-accent">
              for exceptional futures
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed">
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
              className="w-full sm:w-auto rounded-full border-primary-foreground/40 bg-transparent px-8 py-6 text-base font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href="#programs">Explore Our Programs</a>
            </Button>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
          {[
            { value: "2,500+", label: "Students Mentored" },
            { value: "96%", label: "Admission Rate" },
            { value: "150+", label: "Points Average SAT Improvement" },
            { value: "12+", label: "Years of Excellence" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-medium text-primary-foreground">
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

import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

const stats = [
  { value: "2,500+", label: "Students Mentored" },
  { value: "96%", label: "Specialized HS Admits" },
  { value: "150+", label: "Avg. SAT Point Gain" },
  { value: "12+", label: "Years of Excellence" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-x-hidden flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(48,54,120,0.07),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0)_85%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <span className="flex items-center gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Rated 5.0 by 500+ NYC families
            </span>
          </div>

          <h1 className="mx-auto max-w-5xl text-center font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            NYC&apos;s Premier
            <span className="block italic text-accent">SHSAT, SAT &amp; ACT Prep</span>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Personalized instruction and proven strategies that get students into
            specialized high schools and top colleges. SHSAT, SAT, ACT, AP, and Regents.
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20"
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
              className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-medium bg-transparent"
            >
              <a href="#programs">Explore Our Programs</a>
            </Button>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif text-3xl md:text-5xl font-medium text-primary">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground text-balance">
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

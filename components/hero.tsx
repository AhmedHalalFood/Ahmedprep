import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Trophy, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
          <span className="text-primary text-sm font-medium">Expert Test Preparation</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
          Master Your Exams with{" "}
          <span className="text-primary">Confidence</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          Personalized tutoring and comprehensive test prep courses designed to help you 
          achieve your academic goals. Join thousands of successful students.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="gap-2 text-base px-8">
            Start Learning Today
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2 text-base px-8">
            <BookOpen className="h-4 w-4" />
            View Programs
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold text-foreground">2,500+</span>
            </div>
            <span className="text-muted-foreground text-sm">Students Helped</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold text-foreground">95%</span>
            </div>
            <span className="text-muted-foreground text-sm">Success Rate</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold text-foreground">150+</span>
            </div>
            <span className="text-muted-foreground text-sm">Point Average Improvement</span>
          </div>
        </div>
      </div>
    </section>
  )
}

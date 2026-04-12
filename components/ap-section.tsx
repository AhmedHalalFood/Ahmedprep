"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FlaskConical, ArrowRight, Star, GraduationCap, DollarSign, TrendingUp } from "lucide-react"

const apCourses = [
  { name: "AP Calculus AB", icon: "∫" },
  { name: "AP Calculus BC", icon: "∂" },
  { name: "AP Statistics", icon: "σ" },
  { name: "AP Biology", icon: "🧬" },
  { name: "AP Chemistry", icon: "⚗" },
  { name: "AP Physics 1", icon: "⚡" },
]

const benefits = [
  {
    icon: Star,
    title: "Earn 4s and 5s",
    description: "Our questions and explanations prepare you for top scores on AP exams."
  },
  {
    icon: GraduationCap,
    title: "College Credit",
    description: "Great AP scores can mean college credit - leading to less time and money spent in college."
  },
  {
    icon: TrendingUp,
    title: "Boost Your GPA",
    description: "Since AP courses may be weighted, you can boost your GPA with top grades."
  },
  {
    icon: DollarSign,
    title: "Save Thousands",
    description: "Scoring well on AP exams may allow you to earn college credit, saving you thousands."
  },
]

export function APSection() {
  return (
    <section id="ap" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            Advanced Placement
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-tight">
            AP Courses & Subjects
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Score 5s on AP courses and improve your GPA. AP classes are more intense than high 
            school classes, and scoring well on AP exams may allow you to earn college credit, 
            advanced placement, or both.
          </p>
        </div>

        {/* Score Scale */}
        <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border/50">
          <p className="text-center text-foreground">
            AP exams are scored from <span className="font-serif text-2xl font-medium text-accent mx-2">1</span> to 
            <span className="font-serif text-2xl font-medium text-accent mx-2">5</span> with 5 being the highest score. 
            Many colleges give credit or advanced placement with a score of <span className="font-medium">3 or better</span>.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="mt-16">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-8">
            AP Courses We Offer
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apCourses.map((course, index) => (
              <Card key={index} className="border-border/50 bg-card hover:border-accent/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl">
                    {course.icon}
                  </div>
                  <span className="font-medium text-foreground">{course.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-8 text-center">
            Why Take AP Classes?
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-card border border-border/50">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-accent" />
                </div>
                <h4 className="mt-4 font-serif text-lg font-medium text-foreground">
                  {benefit.title}
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Section */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-primary/5 border border-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
              Juggling AP Classes and Responsibilities?
            </h3>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Getting the grades you want in your AP Courses and earning high scores on the AP exams 
              are important - especially if you want to differentiate yourself from other college 
              applicants and earn college credit. It&apos;s tough juggling AP classes and all of your 
              other responsibilities. That&apos;s why we&apos;re here to help you master your classes and 
              exams - on your schedule, at your pace, and an affordable price.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 text-base font-medium"
            asChild
          >
            <a href="#contact">
              Get AP Tutoring
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

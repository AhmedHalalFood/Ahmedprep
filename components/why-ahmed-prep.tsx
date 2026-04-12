"use client"

import { BookOpen, Target, Lightbulb, Brain } from "lucide-react"

const methodFeatures = [
  {
    icon: BookOpen,
    title: "Learn by Doing",
    description: "Practice and repetition enable students to master the concepts tested and retain the information. Our subject matter experts write content at or above exam-level difficulty so students can practice challenging questions repeatedly, boosting their readiness on exam day."
  },
  {
    icon: Target,
    title: "Focused Learning",
    description: "Customizable practice tests and immediate performance metrics allow students to control their study plans. By focusing on the most relevant topics and targeting their weaker subjects, students can study more efficiently without the risk of burning out."
  },
  {
    icon: Lightbulb,
    title: "Simplified Learning",
    description: "Our in-depth, still concise explanations and illustrations make complex concepts easy to understand while increasing retention and comprehension. Expert tutors explain both correct and incorrect answer choices for thorough understanding."
  },
  {
    icon: Brain,
    title: "Maximizes Retention",
    description: "Active learning results in increased retention compared to passive learning. Students can choose from thousands of questions to create unlimited customized tests and review detailed answer explanations."
  },
]

export function WhyAhmedPrep() {
  return (
    <section id="why-us" className="py-24 lg:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            Why Ahmed Prep?
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight text-balance">
            The Ahmed Prep Way
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            At Ahmed Prep, we pride ourselves on being the standard of excellence in teaching online 
            for high-stakes exam preparation. We begin with the end in mind - the test taker&apos;s 
            success and mastery of the concepts tested. Our active-learning method maximizes engagement, 
            eliminates cramming, and prepares students not just to master test concepts but also succeed 
            in their careers and lives.
          </p>
        </div>

        {/* Practice Tests Highlight */}
        <div className="mt-16 p-8 md:p-12 rounded-3xl bg-secondary/50 border border-border/50 text-center">
          <div className="font-serif text-6xl md:text-7xl font-medium text-accent">
            20+
          </div>
          <p className="mt-4 text-xl md:text-2xl text-foreground font-medium">
            Practice Exams
          </p>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Students gain confidence after taking diagnostic tests in a real-time test-mode environment 
            and reviewing them in class. Eventually, taking tests becomes routine.
          </p>
        </div>

        {/* Method Features */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {methodFeatures.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-background border border-border/50 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 text-center">
          <blockquote className="font-serif text-2xl md:text-3xl italic text-foreground/80 max-w-3xl mx-auto">
            &ldquo;A picture is worth a thousand words&rdquo;
          </blockquote>
          <p className="mt-4 text-muted-foreground">
            According to research, visual learning and simplified explanations dramatically improve retention.
          </p>
        </div>
      </div>
    </section>
  )
}

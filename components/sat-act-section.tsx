"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, PenTool, Calculator, Clock, ArrowRight, CheckCircle2 } from "lucide-react"

const satSections = [
  {
    icon: BookOpen,
    title: "SAT: Reading",
    description: "Assess vocabulary, measure reading comprehension, and evaluate understanding of literary expression, style, and strategy.",
    topics: ["Identify meaning & allegory", "Structure & tone analysis", "Point of view & context", "Metaphors vs similes", "Themes & motifs", "Symbolism & imagery"]
  },
  {
    icon: PenTool,
    title: "SAT: Writing & Language",
    description: "44 multiple choice questions covering main idea, thesis statement, audience identification, and paragraph structure.",
    topics: ["Grammar & punctuation", "Subject-verb agreement", "Sentence structure", "Word choice & clarity", "Transition & rhetoric", "Style & voice"]
  },
  {
    icon: Calculator,
    title: "SAT: Mathematics",
    description: "58 questions including multiple-choice and problem-solving numerical and story problems.",
    topics: ["Fractions & radicals", "Linear equations", "Absolute value", "Graphing & geometry", "Probability & statistics", "Data analysis"]
  },
]

export function SATACTSection() {
  return (
    <section id="sat-act" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            College Entrance Exams
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-tight">
            SAT & ACT Preparation
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            The SAT is a college-readiness assessment tool recognized and accepted by U.S. colleges 
            and universities. Divided into multiple subject areas, the exam includes a mix of question 
            types with no penalty for wrong answers.
          </p>
        </div>

        {/* Exam Info */}
        <div className="mt-12 flex flex-wrap gap-6">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border">
            <Clock className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">3 Hours Total</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">No Penalty for Wrong Answers</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border">
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">7 Test Dates Per Year</span>
          </div>
        </div>

        {/* SAT Sections */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          {satSections.map((section, index) => (
            <Card key={index} className="border-border/50 bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <section.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-medium text-foreground">
                  {section.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Topics Covered
                  </h4>
                  <ul className="space-y-2">
                    {section.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-foreground">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ACT Info */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-card border border-border/50">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl font-medium text-foreground">
                ACT Preparation
              </h3>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Our ACT prep course covers all four sections of the exam: English, Mathematics, 
                Reading, and Science. We also offer optional writing section preparation for 
                colleges that require it.
              </p>
              <ul className="mt-6 space-y-3">
                {["English Grammar & Usage", "Math through Pre-Calculus", "Reading Comprehension", "Science Reasoning", "Optional Writing Section"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "4", label: "Test Sections" },
                { value: "215", label: "Questions" },
                { value: "2:55", label: "Hours Total" },
                { value: "36", label: "Max Score" },
              ].map((stat, index) => (
                <div key={index} className="p-6 rounded-2xl bg-secondary/50 text-center">
                  <div className="font-serif text-3xl font-medium text-accent">{stat.value}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PSAT/NMSQT */}
        <div className="mt-12 p-6 rounded-2xl bg-accent/5 border border-accent/20">
          <p className="text-center text-foreground">
            <span className="font-medium">Also offering PSAT/NMSQT preparation</span>
            <span className="text-muted-foreground"> - Prepare for the National Merit Scholarship qualifying test</span>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium"
            asChild
          >
            <a href="#contact">
              Start SAT/ACT Prep
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

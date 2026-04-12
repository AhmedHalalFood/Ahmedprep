"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, BookOpen, Calculator, Clock, CheckCircle2, ArrowRight } from "lucide-react"

const elaTopics = [
  "Revising/Editing Part A & B",
  "Reading Comprehension",
  "Global & Detail Questions",
  "Function & Inference Questions",
  "Infographic Analysis",
  "Poetry Analysis"
]

const mathTopics = [
  "Properties of Arithmetic",
  "Exponents & Square Roots",
  "Linear Equations & Inequalities",
  "Ratios & Proportions",
  "Geometry & Right Triangles",
  "Probability & Statistics"
]

const schools = [
  { name: "Stuyvesant High School", color: "bg-accent" },
  { name: "Bronx High School of Science", color: "bg-primary" },
  { name: "Brooklyn Technical High School", color: "bg-accent" },
  { name: "Staten Island Technical", color: "bg-primary" },
  { name: "Queens High School for Sciences", color: "bg-accent" },
  { name: "High School for Math, Science & Engineering", color: "bg-primary" },
  { name: "High School of American Studies", color: "bg-accent" },
  { name: "Brooklyn Latin School", color: "bg-primary" },
]

export function SHSATSection() {
  return (
    <section id="shsat" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <GraduationCap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Most Popular Program</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-tight">
            SHSAT Preparation
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Welcome to the Ahmed Prep SHSAT Course, where your path to success begins! 
            For students who achieved average grades in the 70s and low 80s during their 
            seventh-grade year and aspire to gain admission to prestigious elite high schools 
            in New York City, securing a competitive SHSAT score is essential.
          </p>
        </div>

        {/* Target Schools */}
        <div className="mt-16">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-6">
            Target Schools
          </h3>
          <div className="flex flex-wrap gap-3">
            {schools.map((school, index) => (
              <span 
                key={index}
                className="px-4 py-2 rounded-full bg-secondary border border-border text-sm font-medium text-foreground"
              >
                {school.name}
              </span>
            ))}
          </div>
        </div>

        {/* Exam Structure */}
        <div className="mt-16 p-8 md:p-12 rounded-3xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-accent" />
            <h3 className="font-serif text-2xl font-medium text-foreground">
              Exam Structure
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-background">
              <div className="font-serif text-4xl font-medium text-accent">180</div>
              <p className="mt-2 text-muted-foreground">Minutes Total</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background">
              <div className="font-serif text-4xl font-medium text-accent">2</div>
              <p className="mt-2 text-muted-foreground">Sections (ELA + Math)</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-background">
              <div className="font-serif text-4xl font-medium text-accent">114</div>
              <p className="mt-2 text-muted-foreground">Total Questions</p>
            </div>
          </div>
        </div>

        {/* Two Sections Grid */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          {/* ELA Section */}
          <Card className="border-border/50 bg-card overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground">
                    English Language Arts
                  </h3>
                  <p className="text-sm text-muted-foreground">57 Questions</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Revising/Editing</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Part A covers selecting corrections for errors, identifying sentences with errors, 
                    and improving writing. Part B covers language misuse, transitional words, 
                    organization, and writing standards.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Reading Comprehension</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Five question types: Global (central idea/theme), Detail, Function (purpose), 
                    Inference, and Infographic questions covering informational and literary genres.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-medium text-foreground mb-4">Topics Covered</h4>
                <div className="grid grid-cols-2 gap-3">
                  {elaTopics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-muted-foreground">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Math Section */}
          <Card className="border-border/50 bg-card overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground">
                    Mathematics
                  </h3>
                  <p className="text-sm text-muted-foreground">57 Questions (5 Grid-ins + 52 MCQs)</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Word Problems</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Math section features word and computational problems involving arithmetic, 
                    algebra, geometry, and data analysis concepts.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Problem Solving</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Advanced topics including systems of equations, probability, permutations, 
                    Venn diagrams, and strategic problem-solving approaches.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-medium text-foreground mb-4">Topics Covered</h4>
                <div className="grid grid-cols-2 gap-3">
                  {mathTopics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 text-base font-medium"
            asChild
          >
            <a href="#contact">
              Enroll in SHSAT Prep
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

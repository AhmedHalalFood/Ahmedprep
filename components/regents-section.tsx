"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Calculator, FlaskConical, Globe, CheckCircle2, Award } from "lucide-react"

const regentsExams = [
  { name: "Algebra I (Common Core)", icon: Calculator, category: "Math" },
  { name: "Geometry (Common Core)", icon: Calculator, category: "Math" },
  { name: "Algebra II (Common Core)", icon: Calculator, category: "Math" },
  { name: "Living Environment", icon: FlaskConical, category: "Science" },
  { name: "Chemistry", icon: FlaskConical, category: "Science" },
  { name: "Physics", icon: FlaskConical, category: "Science" },
  { name: "Earth Science", icon: Globe, category: "Science" },
  { name: "English Language Arts", icon: BookOpen, category: "English" },
  { name: "Global History & Geography", icon: Globe, category: "Social Studies" },
  { name: "US History & Government", icon: BookOpen, category: "Social Studies" },
]

const benefits = [
  "Graduate with a Regents Diploma or Advanced Regents Diploma",
  "Master course content and boost your class grade",
  "Build a strong foundation for AP courses and college",
  "Develop test-taking strategies specific to Regents format",
]

export function RegentsSection() {
  return (
    <section id="regents" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            New York State
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-tight">
            NYS Regents Exam Prep
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Prepare for New York State Regents Examinations with expert guidance. 
            Our comprehensive prep helps you master the content and exam format 
            to achieve passing scores or aim for mastery-level performance.
          </p>
        </div>

        {/* Score Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-serif font-medium text-primary">65+</div>
              <p className="mt-2 text-sm text-muted-foreground">Passing Score</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-serif font-medium text-accent">85+</div>
              <p className="mt-2 text-sm text-muted-foreground">Mastery Level</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-serif font-medium text-primary">5</div>
              <p className="mt-2 text-sm text-muted-foreground">Exams for Regents Diploma</p>
            </CardContent>
          </Card>
        </div>

        {/* Exams Grid */}
        <div className="mt-16">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-8">
            Regents Exams We Cover
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {regentsExams.map((exam, index) => (
              <Card key={index} className="border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <exam.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{exam.category}</span>
                      <p className="text-sm font-medium text-foreground mt-0.5">{exam.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
              Why Regents Prep Matters
            </h3>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Regents exams are required for graduation in New York State. Strong 
              performance on these exams not only ensures you graduate but also 
              demonstrates subject mastery to colleges and prepares you for advanced coursework.
            </p>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Card className="border-border/50 bg-card">
            <CardContent className="p-8">
              <h4 className="font-serif text-xl font-medium text-foreground">
                Diploma Requirements
              </h4>
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="font-medium text-foreground">Regents Diploma</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Score 65+ on 5 required Regents exams
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="font-medium text-foreground">Advanced Regents Diploma</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Score 65+ on 9 Regents exams, including additional math and science
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <p className="font-medium text-foreground">Honors Designation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Average score of 90+ across all Regents exams
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20"
            asChild
          >
            <a href="#contact">
              Get Regents Prep Help
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

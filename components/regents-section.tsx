import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calculator, 
  FlaskConical, 
  Leaf, 
  Globe, 
  BookOpen,
  ArrowRight,
  Award,
  CheckCircle2
} from "lucide-react"

const regentsExams = [
  {
    icon: Calculator,
    title: "Mathematics",
    exams: ["Algebra I", "Geometry", "Algebra II"],
    description: "Master all three math Regents with comprehensive problem-solving strategies."
  },
  {
    icon: FlaskConical,
    title: "Physical Sciences",
    exams: ["Chemistry", "Physics", "Earth Science"],
    description: "In-depth preparation covering lab skills, formulas, and scientific reasoning."
  },
  {
    icon: Leaf,
    title: "Living Environment",
    exams: ["Biology"],
    description: "Complete coverage of life science concepts, lab practicals, and exam strategies."
  },
  {
    icon: Globe,
    title: "Social Studies",
    exams: ["Global History", "US History & Government"],
    description: "Document analysis, essay writing, and comprehensive content review."
  },
  {
    icon: BookOpen,
    title: "English Language Arts",
    exams: ["ELA Regents"],
    description: "Reading comprehension, argument writing, and text analysis skills."
  },
]

const diplomaTypes = [
  {
    title: "Regents Diploma",
    requirement: "65+ on 5 required exams",
    color: "bg-secondary"
  },
  {
    title: "Advanced Regents",
    requirement: "65+ on 9 exams including languages",
    color: "bg-accent/10"
  },
  {
    title: "Honors Designation",
    requirement: "90+ average across all Regents",
    color: "bg-primary/10"
  },
]

export function RegentsSection() {
  return (
    <section id="regents" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            NYS Regents Preparation
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Excel on your New York State Regents Examinations
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Comprehensive preparation for all NYS Regents exams. Our proven methods help 
            students achieve the scores they need for graduation and beyond.
          </p>
        </div>

        {/* Diploma types */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {diplomaTypes.map((diploma, index) => (
            <div 
              key={index}
              className={`${diploma.color} rounded-2xl p-6 text-center`}
            >
              <Award className="w-8 h-8 mx-auto text-accent" />
              <h3 className="mt-4 font-serif text-xl font-medium text-foreground">
                {diploma.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {diploma.requirement}
              </p>
            </div>
          ))}
        </div>

        {/* Exams grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regentsExams.map((exam, index) => (
            <Card 
              key={index}
              className="group border-border/50 bg-card hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary">
                  <exam.icon className="w-7 h-7 text-foreground" />
                </div>
                
                <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
                  {exam.title}
                </h3>
                
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {exam.description}
                </p>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {exam.exams.map((examName, examIndex) => (
                    <span 
                      key={examIndex}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-sm text-foreground"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      {examName}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Score targets */}
        <div className="mt-16 bg-secondary/50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-3xl font-medium text-foreground">
                Achieve Your Target Scores
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Whether you&apos;re aiming for a passing score of 65 or striving for honors 
                with 90+, our personalized approach helps you reach your specific goals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
                  Start Preparation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="rounded-full px-8">
                  View Schedule
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-2xl p-6 text-center">
                <p className="text-4xl font-serif font-medium text-accent">65+</p>
                <p className="mt-2 text-sm text-muted-foreground">Passing Score</p>
              </div>
              <div className="bg-background rounded-2xl p-6 text-center">
                <p className="text-4xl font-serif font-medium text-accent">85+</p>
                <p className="mt-2 text-sm text-muted-foreground">Mastery Level</p>
              </div>
              <div className="bg-background rounded-2xl p-6 text-center">
                <p className="text-4xl font-serif font-medium text-accent">90+</p>
                <p className="mt-2 text-sm text-muted-foreground">Honors Designation</p>
              </div>
              <div className="bg-background rounded-2xl p-6 text-center">
                <p className="text-4xl font-serif font-medium text-accent">95%</p>
                <p className="mt-2 text-sm text-muted-foreground">Our Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

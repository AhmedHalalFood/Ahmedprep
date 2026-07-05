import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"

const instructors = [
  {
    initials: "TA",
    name: "Tariq Ahmed",
    role: "Founder & Lead Instructor",
    credential: "New York University, M.A. Education",
    bio: "Over 12 years coaching students into Stuyvesant, Bronx Science, and Ivy League schools with a 96% specialized-HS admit rate.",
    icon: GraduationCap,
  },
]

export function Instructors() {
  return (
    <section id="instructors" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">Our Instructors</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Learn from proven, credentialed experts
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            Our instructors come from top universities and know exactly what NYC&apos;s toughest
            exams demand. Every student learns from a specialist in their subject.
          </p>
        </div>

        <div className="mt-16 max-w-md mx-auto">
          {instructors.map((person, index) => (
            <Card
              key={index}
              className="rounded-2xl border-border/60 bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-serif text-xl font-medium">
                    {person.initials}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground">{person.name}</h3>
                    <p className="text-sm text-accent font-medium">{person.role}</p>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                  <person.icon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">{person.credential}</span>
                </div>

                <p className="mt-4 text-muted-foreground leading-relaxed">{person.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

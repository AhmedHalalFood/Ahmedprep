import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "AhmedPrep transformed my daughter's approach to learning. She gained admission to Stuyvesant and developed confidence that will serve her for life.",
    name: "Sarah M.",
    role: "Parent",
    result: "Stuyvesant HS",
    initials: "SM",
  },
  {
    quote:
      "The personalized attention made all the difference. My SAT score improved by 180 points, and I got into my dream college.",
    name: "Michael T.",
    role: "Student",
    result: "SAT: 1580",
    initials: "MT",
  },
  {
    quote:
      "As a parent, I appreciate how AhmedPrep keeps us involved. The progress reports and regular updates gave us real peace of mind.",
    name: "Jennifer K.",
    role: "Parent",
    result: "Bronx Science",
    initials: "JK",
  },
  {
    quote:
      "The SHSAT course was incredibly thorough. The instructors genuinely care about each student's success and it shows in the results.",
    name: "David L.",
    role: "Student",
    result: "Brooklyn Tech",
    initials: "DL",
  },
]

export function Testimonials() {
  return (
    <section id="results" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">Success Stories</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Hear from our families
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            Real stories from parents and students who achieved their academic goals with AhmedPrep.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="rounded-2xl border-border/60 bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-accent/30" />

                <blockquote className="mt-6 font-serif text-xl text-foreground leading-relaxed">
                  {testimonial.quote}
                </blockquote>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="px-4 py-2 rounded-full bg-accent/15 border border-accent/20">
                    <span className="text-sm font-medium text-accent-foreground">
                      {testimonial.result}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

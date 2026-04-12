import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "AhmedPrep transformed my daughter&apos;s approach to learning. She gained admission to Stuyvesant High School and developed confidence that will serve her for life.",
    name: "Sarah M.",
    role: "Parent",
    result: "Stuyvesant High School",
    initials: "SM"
  },
  {
    quote: "The personalized attention I received made all the difference. My SAT score improved by 180 points, and I got into my dream college.",
    name: "Michael T.",
    role: "Student",
    result: "SAT: 1580",
    initials: "MT"
  },
  {
    quote: "As a parent, I appreciate how AhmedPrep keeps us informed and involved. The progress reports and regular updates gave us peace of mind.",
    name: "Jennifer K.",
    role: "Parent",
    result: "Bronx Science",
    initials: "JK"
  },
  {
    quote: "The SHSAT prep course was incredibly thorough. The instructors genuinely care about each student&apos;s success and it shows in the results.",
    name: "David L.",
    role: "Student",
    result: "Brooklyn Tech",
    initials: "DL"
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">
            Success Stories
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground text-balance">
            Hear from our families
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Real stories from parents and students who achieved their academic goals with AhmedPrep.
          </p>
        </div>
        
        {/* Testimonials grid */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-border/50 bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-accent/20" />
                
                <blockquote className="mt-6 font-serif text-xl text-foreground leading-relaxed italic">
                  {testimonial.quote}
                </blockquote>
                
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-accent">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2 rounded-full bg-secondary border border-border">
                    <span className="text-sm font-medium text-foreground">
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

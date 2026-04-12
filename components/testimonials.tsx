import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Stanford University",
    content: "AhmedPrep helped me raise my SAT score by 200 points! The personalized attention and expert strategies made all the difference.",
    score: "1520 SAT"
  },
  {
    name: "James K.",
    role: "MIT",
    content: "The ACT prep course was incredible. My instructor knew exactly what I needed to work on and helped me achieve a perfect score in Math.",
    score: "35 ACT"
  },
  {
    name: "Emily R.",
    role: "Harvard University",
    content: "The college essay coaching was transformative. My personal statement truly reflected who I am, and I got into my dream school!",
    score: "Accepted Early Decision"
  },
  {
    name: "Michael T.",
    role: "Columbia University",
    content: "I was struggling with the verbal sections until I joined AhmedPrep. The vocabulary strategies and reading techniques were game-changers.",
    score: "1560 SAT"
  }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Testimonials</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground text-balance">
            Success Stories from Our Students
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of students who have achieved their academic goals with AhmedPrep.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-secondary/30 border-border">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground leading-relaxed">{testimonial.content}</p>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-primary font-medium mt-1">{testimonial.score}</p>
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

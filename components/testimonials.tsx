import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const stories = [
  { label: "Parent perspective", title: "A place for a verified family story", body: "This space is reserved for a real parent testimonial. Add the family's approved words here once they are available.", result: "Testimonial placeholder" },
  { label: "Student perspective", title: "A place for a verified student story", body: "This space is reserved for a real student testimonial. Add the student&apos;s approved words here once they are available.", result: "Testimonial placeholder" },
  { label: "Academic progress", title: "A place for a verified outcome", body: "This space is reserved for a documented outcome with permission to publish. No student names, scores, schools, or admissions are assumed here.", result: "Outcome placeholder" },
]

export function Testimonials() {
  return (
    <section id="results" className="scroll-mt-20 bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-accent">Success stories</p>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">Progress worth celebrating. Stories worth verifying.</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">We believe credibility starts with accuracy. Published student stories will appear here only with permission and verified details.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.title} className="border-border/60 bg-card"><CardContent className="p-7"><Quote className="h-8 w-8 text-accent/60" aria-hidden="true" /><p className="mt-7 text-xs font-medium uppercase tracking-[0.18em] text-accent">{story.label}</p><h3 className="mt-3 font-serif text-2xl font-medium text-foreground">{story.title}</h3><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{story.body}</p><div className="mt-7 border-t border-border pt-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{story.result}</div></CardContent></Card>
          ))}
        </div>
      </div>
    </section>
  )
}
      

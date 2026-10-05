import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const stories = [
  { label: "Parent perspective", title: "Verified student story coming soon", body: "A polished place for a permissioned parent perspective. Verified details will be added when the family approves publication.", result: "Awaiting verified story" },
  { label: "Student perspective", title: "Verified student story coming soon", body: "A polished place for a permissioned student perspective. Verified details will be added when the student approves publication.", result: "Awaiting verified story" },
  { label: "Academic progress", title: "Verified student story coming soon", body: "A polished place for a documented academic outcome. No names, schools, scores, or admissions are published without permission and verification.", result: "Awaiting verified outcome" },
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
      

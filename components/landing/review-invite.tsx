import { ArrowRight, Star } from "lucide-react"
import { ReviewLink } from "@/components/review-link"

export function ReviewInvite() {
  return (
    <section id="google-review" aria-labelledby="google-review-title" className="bg-navy py-5 text-primary-foreground">
      <div className="container flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-8">
        <h2
          id="google-review-title"
          className="flex shrink-0 items-center gap-3 text-balance text-2xl font-extrabold leading-tight md:text-[1.75rem]"
        >
          <Star size={32} aria-hidden="true" fill="currentColor" strokeWidth={0} className="shrink-0 text-gold" />
          Share Your Experience with AhmedPrep
        </h2>
        <p className="flex-1 text-pretty text-sm leading-relaxed text-primary-foreground/85 lg:border-l lg:border-primary-foreground/25 lg:pl-8">
          Have you worked with AhmedPrep? Share your experience on Google to help other families learn about our programs.
        </p>
        <ReviewLink
          location="home_review_invite"
          className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-md bg-gold px-6 font-extrabold text-navy transition-colors hover:bg-gold-hover"
        >
          Write a Google Review <ArrowRight size={18} aria-hidden="true" />
        </ReviewLink>
      </div>
    </section>
  )
}

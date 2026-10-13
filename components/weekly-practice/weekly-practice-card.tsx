import { ArrowUpRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { WEEKLY_PRACTICE_PATH, getCurrentPractice } from "@/lib/weekly-practice"

/** Compact homepage teaser. Pages using it should revalidate so it rolls over when a new week publishes. */
export function WeeklyPracticeCard({ location }: { location: string }) {
  const practice = getCurrentPractice()
  if (!practice) return null
  return (
    <section aria-labelledby="weekly-practice-card-title" className="bg-white py-8">
      <div className="container">
        <div className="flex flex-col gap-5 border border-line border-t-4 border-t-gold p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="weekly-practice-card-title" className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold-deep">
                This Week&apos;s Free Practice
              </h2>
              <span className="inline-flex items-center border border-brand/40 bg-brand-soft px-2 py-1 text-xs font-extrabold uppercase tracking-widest text-brand">
                {practice.testType}
              </span>
              <span className="text-sm font-bold text-subtle">{practice.topic}</span>
            </div>
            <p className="text-pretty font-semibold leading-relaxed text-navy">{practice.question}</p>
          </div>
          <TrackedLink
            href={WEEKLY_PRACTICE_PATH}
            event={EVENTS.weeklyPracticeAnswerClick}
            eventProps={{ location, test_type: practice.testType, week: practice.publishedDate }}
            className="button button-outline button-lg shrink-0 justify-center"
          >
            See Answer &amp; Explanation <ArrowUpRight size={17} aria-hidden="true" />
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}

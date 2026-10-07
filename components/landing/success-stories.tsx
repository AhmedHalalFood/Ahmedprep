import Image from "next/image"
import { Section } from "@/components/landing/primitives"
import { getPublishedStories, type SuccessStory } from "@/lib/success-stories"

function StoryCard({ story }: { story: SuccessStory }) {
  return (
    <article className="flex flex-col gap-5 border border-line border-t-4 border-t-gold bg-white p-6">
      <header className="flex items-center gap-4">
        {story.photo && (
          <Image src={story.photo} alt={`${story.studentName}, AhmedPrep student`} width={56} height={56} className="h-14 w-14 object-cover" />
        )}
        <div>
          <h3 className="text-lg font-extrabold text-navy">{story.studentName}</h3>
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{story.program}</p>
        </div>
      </header>
      {(story.startingScore || story.finalScore) && (
        <dl className="grid grid-cols-2 border-y border-line py-4">
          <div>
            <dt className="text-xs font-semibold text-subtle">Starting score</dt>
            <dd className="mt-1 text-xl font-extrabold text-navy">{story.startingScore ?? "—"}</dd>
          </div>
          <div className="border-l border-line pl-4">
            <dt className="text-xs font-semibold text-subtle">Final score</dt>
            <dd className="mt-1 text-xl font-extrabold text-navy">{story.finalScore ?? "—"}</dd>
          </div>
        </dl>
      )}
      {story.acceptance && <p className="font-bold text-ink">{story.acceptance}</p>}
      {story.studentQuote && <blockquote className="leading-relaxed text-ink">&ldquo;{story.studentQuote}&rdquo;</blockquote>}
      {story.parentQuote && (
        <blockquote className="border-l-2 border-line pl-4 text-sm leading-relaxed text-subtle">
          &ldquo;{story.parentQuote}&rdquo;
          {story.parentName && <footer className="mt-2 font-semibold text-ink">— {story.parentName}, parent</footer>}
        </blockquote>
      )}
      {story.videoUrl && (
        <div className="aspect-video">
          <iframe src={story.videoUrl} title={`${story.studentName} video testimonial`} loading="lazy" allowFullScreen className="h-full w-full border-0" />
        </div>
      )}
    </article>
  )
}

/** Renders only verified, published stories. Shows nothing when none are published. */
export function SuccessStories({ program, title = "Student success stories" }: { program?: SuccessStory["program"]; title?: string }) {
  const stories = getPublishedStories(program)
  if (stories.length === 0) return null
  return (
    <Section id="success-stories" eyebrow="Student results" title={title} intro="Shared with written permission from each family.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </Section>
  )
}

import { Section } from "@/components/landing/primitives"
import { LiteYouTube } from "@/components/videos/lite-youtube"
import { getVideosFor, youtubeId, type VideoPage } from "@/lib/teaching-videos"

/** Hidden until lib/teaching-videos.ts has at least one video for this page. */
export function TeachingVideos({ page, title = "Short lessons from AhmedPrep" }: { page: VideoPage; title?: string }) {
  const videos = getVideosFor(page)
  if (videos.length === 0) return null
  return (
    <Section id="videos" eyebrow="Teaching videos" title={title}>
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <li key={video.id} className="flex flex-col gap-3">
            <LiteYouTube id={youtubeId(video.url)!} title={video.title} videoKey={video.id} />
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand">{video.topic}</p>
            <h3 className="text-lg font-extrabold leading-snug text-navy">{video.title}</h3>
            <p className="text-sm leading-relaxed text-subtle">{video.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

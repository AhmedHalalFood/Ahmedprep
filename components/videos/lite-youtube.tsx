"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { EVENTS, trackEvent } from "@/lib/analytics"

/** Shows a lazy-loaded thumbnail; the YouTube player (and its ~1 MB of script) loads only after a click. */
export function LiteYouTube({ id, title, videoKey }: { id: string; title: string; videoKey: string }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full border-0"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setPlaying(true)
        trackEvent(EVENTS.teachingVideoPlay, { video: videoKey })
      }}
      className="group relative block aspect-video w-full overflow-hidden bg-navy"
      aria-label={`Play video: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static YouTube thumbnail; no optimizer round-trip needed */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        width={480}
        height={360}
        className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center bg-gold text-navy shadow-lg transition-transform group-hover:scale-105">
          <Play size={24} aria-hidden="true" fill="currentColor" />
        </span>
      </span>
    </button>
  )
}

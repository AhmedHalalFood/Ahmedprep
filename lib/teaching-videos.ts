export type VideoPage = "shsat" | "digital_sat" | "resources"

export type TeachingVideo = {
  id: string
  /** YouTube watch, share, or embed URL. */
  url: string
  title: string
  topic: string
  description: string
  pages: VideoPage[]
}

/**
 * Add AhmedPrep teaching videos here. Each video appears only on the pages listed in `pages`,
 * and a page's video section stays hidden until it has at least one video. Example:
 *
 * {
 *   id: "shsat-ratios",
 *   url: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
 *   title: "SHSAT Ratios in 5 Minutes",
 *   topic: "SHSAT Math",
 *   description: "How to set up part-to-part and part-to-whole ratio problems.",
 *   pages: ["shsat", "resources"],
 * }
 */
export const TEACHING_VIDEOS: TeachingVideo[] = []

const YOUTUBE_ID = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/

export function youtubeId(url: string) {
  return url.match(YOUTUBE_ID)?.[1] ?? null
}

export function getVideosFor(page: VideoPage) {
  return TEACHING_VIDEOS.filter((v) => v.pages.includes(page) && youtubeId(v.url))
}

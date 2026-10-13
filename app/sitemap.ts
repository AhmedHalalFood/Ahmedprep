import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/business"
import { RESOURCES } from "@/lib/resources"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"
import { FREE_TOOLS, toolPath } from "@/lib/tools"
import { UPDATES, latestUpdateModified } from "@/lib/updates"
import { WEEKLY_PRACTICE_PATH, getCurrentPractice } from "@/lib/weekly-practice"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/shsat", priority: 0.9 },
    { path: INTENSIVE_PATH, priority: 0.9 },
    { path: "/digital-sat", priority: 0.9 },
    { path: "/free-sunday-classes", priority: 0.8 },
    { path: "/free-diagnostic", priority: 0.8 },
    { path: "/programs", priority: 0.8 },
    { path: "/results", priority: 0.7 },
    { path: "/resources", priority: 0.7 },
    { path: "/tools", priority: 0.7 },
    ...FREE_TOOLS.map((t) => ({ path: toolPath(t.slug), priority: 0.6 })),
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/referral", priority: 0.4 },
  ]
  // lastModified comes only from content dates, so it changes when content changes, not on every build.
  return [
    ...pages.map(({ path, priority }) => ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly" as const, priority })),
    {
      url: `${SITE_URL}${WEEKLY_PRACTICE_PATH}`,
      ...(getCurrentPractice() && { lastModified: getCurrentPractice()!.publishedDate }),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    { url: `${SITE_URL}/updates`, lastModified: latestUpdateModified(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...UPDATES.map((u) => ({
      url: `${SITE_URL}/updates/${u.slug}`,
      lastModified: u.dateModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...RESOURCES.map((r) => ({
      url: `${SITE_URL}/resources/${r.slug}`,
      ...((r.dateModified ?? r.datePublished) && { lastModified: r.dateModified ?? r.datePublished }),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}

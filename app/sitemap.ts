import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/business"
import { RESOURCES } from "@/lib/resources"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/shsat", priority: 0.9 },
    { path: "/digital-sat", priority: 0.9 },
    { path: "/free-shsat-class", priority: 0.8 },
    { path: "/free-diagnostic", priority: 0.8 },
    { path: "/resources", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/referral", priority: 0.4 },
  ]
  return [
    ...pages.map(({ path, priority }) => ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly" as const, priority })),
    ...RESOURCES.map((r) => ({ url: `${SITE_URL}/resources/${r.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ]
}

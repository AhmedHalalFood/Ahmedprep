import type { Metadata } from "next"
import { SITE_URL } from "@/lib/business"

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function webPageSchema({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string
  name: string
  description: string
  type?: "WebPage" | "CollectionPage" | "WebApplication"
}) {
  const url = absoluteUrl(path)
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(type === "WebApplication" && { applicationCategory: "EducationalApplication", operatingSystem: "Any", isAccessibleForFree: true }),
  }
}

export const baseOpenGraph = {
  title: "SHSAT & Digital SAT Prep in Astoria, Queens | AhmedPrep",
  description: "Personalized test preparation in Astoria, Queens. Book a free diagnostic.",
  type: "website",
  siteName: "AhmedPrep",
  locale: "en_US",
  images: [{ url: "/ahmedprep-hero.png", width: 1376, height: 768, alt: "Students studying with an instructor at AhmedPrep" }],
} satisfies NonNullable<Metadata["openGraph"]>

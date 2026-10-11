import { SITE_URL } from "@/lib/business"
import { RESOURCES } from "@/lib/resources"
import { UPDATES } from "@/lib/updates"

export const dynamic = "force-static"

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c] as string)

const toTimestamp = (isoDate: string) => `${isoDate}T12:00:00Z`

export function GET() {
  const entries = [
    ...UPDATES.map((u) => ({
      url: `${SITE_URL}/updates/${u.slug}`,
      title: u.title,
      summary: u.description,
      category: u.topic,
      published: u.datePublished,
      updated: u.dateModified,
    })),
    ...RESOURCES.filter((r) => r.datePublished).map((r) => ({
      url: `${SITE_URL}/resources/${r.slug}`,
      title: r.title,
      summary: r.description,
      category: `${r.category} guide`,
      published: r.datePublished!,
      updated: r.dateModified ?? r.datePublished!,
    })),
  ]
    .sort((a, b) => b.updated.localeCompare(a.updated) || b.published.localeCompare(a.published))
    .slice(0, 30)

  const feedUpdated = entries.reduce((max, e) => (e.updated > max ? e.updated : max), entries[0]?.updated ?? "2026-01-01")

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>AhmedPrep: SHSAT &amp; Digital SAT Updates</title>
  <subtitle>Verified testing dates, deadlines, and preparation guides for NYC families.</subtitle>
  <id>${SITE_URL}/updates</id>
  <link rel="self" type="application/atom+xml" href="${SITE_URL}/updates/feed.xml"/>
  <link rel="alternate" type="text/html" href="${SITE_URL}/updates"/>
  <updated>${toTimestamp(feedUpdated)}</updated>
  <author><name>AhmedPrep</name><uri>${SITE_URL}</uri></author>
  <icon>${SITE_URL}/favicon-96x96.png</icon>
${entries
  .map(
    (e) => `  <entry>
    <title>${escapeXml(e.title)}</title>
    <id>${e.url}</id>
    <link rel="alternate" type="text/html" href="${e.url}"/>
    <published>${toTimestamp(e.published)}</published>
    <updated>${toTimestamp(e.updated)}</updated>
    <category term="${escapeXml(e.category)}"/>
    <summary>${escapeXml(e.summary)}</summary>
  </entry>`,
  )
  .join("\n")}
</feed>
`

  return new Response(xml, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  })
}

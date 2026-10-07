import Link from "next/link"
import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { SITE_URL } from "@/lib/business"

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}

type Crumb = { label: string; href: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-white">
        <ol className="container flex flex-wrap items-center gap-1.5 py-3 text-xs font-semibold text-subtle">
          {all.map((item, i) => {
            const last = i === all.length - 1
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-navy">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-brand">
                      {item.label}
                    </Link>
                    <ChevronRight size={13} aria-hidden="true" />
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: `${SITE_URL}${item.href === "/" ? "" : item.href}`,
          })),
        }}
      />
    </>
  )
}

type Tone = "white" | "warm" | "navy"
const toneClass: Record<Tone, string> = {
  white: "bg-white",
  warm: "bg-warm",
  navy: "bg-navy text-white",
}

export function Section({
  id,
  tone = "white",
  eyebrow,
  title,
  intro,
  children,
  labelledBy,
}: {
  id?: string
  tone?: Tone
  eyebrow?: string
  title?: ReactNode
  intro?: ReactNode
  children: ReactNode
  labelledBy?: string
}) {
  const headingId = labelledBy ?? (id ? `${id}-title` : undefined)
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={`scroll-mt-4 py-16 md:py-20 ${toneClass[tone]}`}>
      <div className="container">
        {(eyebrow || title || intro) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && <p className={`eyebrow ${tone === "navy" ? "gold" : "blue"}`}>{eyebrow}</p>}
            {title && (
              <h2
                id={headingId}
                className={`mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight md:text-4xl ${tone === "navy" ? "text-white" : "text-navy"}`}
              >
                {title}
              </h2>
            )}
            {intro && <p className={`mt-4 text-pretty leading-relaxed ${tone === "navy" ? "text-white/75" : "text-subtle"}`}>{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

import { Plus } from "lucide-react"
import { JsonLd, Section } from "@/components/landing/primitives"

export type FaqItem = { q: string; a: string }

export function Faq({ id = "faq", title, items }: { id?: string; title: string; items: FaqItem[] }) {
  return (
    <Section id={id} tone="warm" eyebrow="Questions from parents" title={title}>
      <div className="max-w-3xl border-t border-line">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-bold text-navy marker:hidden [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus size={18} aria-hidden="true" className="shrink-0 text-brand transition-transform group-open:rotate-45" />
            </summary>
            <p className="pb-6 pr-10 leading-relaxed text-subtle">{item.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </Section>
  )
}

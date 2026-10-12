import type { ReactNode } from "react"

export function ToolHero({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="bg-warm py-12 md:py-16">
      <div className="container flex max-w-3xl flex-col gap-4">
        <p className="eyebrow blue">{eyebrow}</p>
        <h1 id={id} className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
          {title}
        </h1>
        <div className="text-pretty text-lg leading-relaxed text-subtle">{children}</div>
      </div>
    </section>
  )
}

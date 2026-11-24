import { Section } from "@/components/landing/primitives"

type Block = { minutes: number; title: string; body: string }

export function ClassStructure({ title, intro, blocks, eyebrow = "Inside every three-hour class", extraNote }: { title: string; intro: string; blocks: [Block, Block, Block]; eyebrow?: string; extraNote?: string }) {
  const tones = ["bg-navy text-primary-foreground", "bg-brand text-primary-foreground", "bg-gold text-navy"]
  return (
    <Section id="class-structure" eyebrow={eyebrow} title={title} intro={intro}>
      <div aria-hidden="true" className="flex h-12 w-full overflow-hidden border border-line">
        {blocks.map((b, i) => (
          <div
            key={b.title}
            className={`flex items-center justify-center text-sm font-extrabold ${tones[i]}`}
            style={{ flexGrow: b.minutes, flexBasis: 0 }}
          >
            {b.minutes} min
          </div>
        ))}
      </div>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {blocks.map((b) => (
          <li key={b.title} className="flex flex-col gap-2 border border-line bg-background p-5">
            <span className="text-sm font-extrabold text-brand">{b.minutes} minutes</span>
            <h3 className="text-lg font-extrabold text-navy">{b.title}</h3>
            <p className="leading-relaxed text-subtle">{b.body}</p>
          </li>
        ))}
      </ol>
      {extraNote && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-subtle">{extraNote}</p>}
    </Section>
  )
}

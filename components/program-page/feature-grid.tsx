import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export type Feature = { title: string; body: string }

export function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="flex flex-col gap-2 bg-background p-6">
          <h3 className="text-lg font-extrabold text-navy">{item.title}</h3>
          <p className="leading-relaxed text-subtle">{item.body}</p>
        </li>
      ))}
    </ul>
  )
}

export type ResourceLink = { href: string; label: string; body: string }

export function ResourceLinks({ items }: { items: ResourceLink[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="group flex h-full flex-col gap-2 border border-line bg-background p-5 transition-colors hover:border-brand"
          >
            <span className="flex items-center justify-between gap-2 font-extrabold text-navy group-hover:text-brand">
              {item.label}
              <ArrowUpRight size={16} aria-hidden="true" className="shrink-0" />
            </span>
            <span className="text-sm leading-relaxed text-subtle">{item.body}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

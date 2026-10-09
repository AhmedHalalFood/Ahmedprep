import Link from "next/link"
import { Fragment, type ReactNode } from "react"

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g
const linkClass = "font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"

/** Renders plain text with inline [anchor text](href) links. */
export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match
    const index = match.index ?? 0
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index))
    const external = /^https?:\/\//.test(href)
    nodes.push(
      external ? (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link key={index} href={href} className={linkClass}>
          {label}
        </Link>
      ),
    )
    lastIndex = index + whole.length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return <Fragment>{nodes}</Fragment>
}

/** Strips link markup for plain-text contexts such as structured data. */
export function plainText(text: string) {
  return text.replace(LINK_PATTERN, "$1")
}

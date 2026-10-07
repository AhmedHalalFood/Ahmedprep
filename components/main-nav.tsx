"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "SHSAT Prep", href: "/shsat" },
  { label: "Digital SAT Prep", href: "/digital-sat" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function MainNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main navigation">
      {NAV_LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
        return (
          <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={active ? "is-active" : undefined}>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

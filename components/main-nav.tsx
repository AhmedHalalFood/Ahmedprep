"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "SHSAT Prep", href: "/shsat" },
  { label: "2026 SHSAT Intensive", href: INTENSIVE_PATH },
  { label: "Digital SAT Prep", href: "/digital-sat" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function isNavActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

export function MainNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main navigation">
      {NAV_LINKS.map((link) => {
        const active = isNavActive(pathname, link.href)
        return (
          <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={active ? "is-active" : undefined}>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { STUDENT_PORTAL_URL } from "@/lib/student-portal"

// The 2026 Intensive stays reachable through the time-gated announcement bar and its own page,
// so it is no longer listed in the primary navigation.
export function navLinks(_showIntensive?: boolean) {
  return NAV_LINKS
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs & Pricing", href: "/programs-2027" },
  { label: "Free Diagnostic", href: "/free-diagnostic" },
  { label: "Free Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  ...(STUDENT_PORTAL_URL ? [{ label: "Student Login", href: STUDENT_PORTAL_URL }] : []),
]

export function isNavActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

export function MainNav({ showIntensive }: { showIntensive: boolean }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main navigation">
      {navLinks(showIntensive).map((link) => {
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

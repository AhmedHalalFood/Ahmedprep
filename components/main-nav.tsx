"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { INTENSIVE_PATH } from "@/lib/shsat-intensive"
import { STUDENT_PORTAL_URL } from "@/lib/student-portal"

export function navLinks(showIntensive: boolean) {
  return showIntensive ? NAV_LINKS : NAV_LINKS.filter((link) => link.href !== INTENSIVE_PATH)
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "SHSAT Prep", href: "/shsat" },
  { label: "2026 SHSAT Intensive", href: INTENSIVE_PATH },
  { label: "Digital SAT Prep", href: "/digital-sat" },
  { label: "Free Sunday Classes", href: "/free-sunday-classes" },
  { label: "Resources", href: "/resources" },
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

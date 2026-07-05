"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, GraduationCap } from "lucide-react"

const navLinks = [
  { label: "Programs", href: "#programs" },
  { label: "Results", href: "#results" },
  { label: "Instructors", href: "#instructors" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2.5" aria-label="AhmedPrep home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
              Ahmed<span className="text-accent">Prep</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Button asChild className="rounded-full px-6">
              <a href="#contact">Book Consultation</a>
            </Button>
          </div>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="mt-2 rounded-full">
              <a href="#contact" onClick={() => setMobileOpen(false)}>
                Book Consultation
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

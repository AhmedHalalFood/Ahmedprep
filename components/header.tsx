"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#why-us", label: "Why Ahmed Prep" },
  { href: "#shsat", label: "SHSAT" },
  { href: "#sat-act", label: "SAT/ACT" },
  { href: "#ap", label: "AP Courses" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Ahmed<span className="text-accent">Prep</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:347-479-5020" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              347-479-5020
            </a>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
              asChild
            >
              <a href="#contact">Call Now</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/50">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <a href="tel:347-479-5020" className="text-center py-2 text-sm font-medium text-muted-foreground">
                  347-479-5020
                </a>
                <Button className="w-full bg-primary text-primary-foreground rounded-full" asChild>
                  <a href="#contact">Contact Us</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TopContactBar } from "@/components/top-contact-bar"

const links = [{ label: "Home", href: "/" }, { label: "SHSAT", href: "/shsat" }, { label: "Digital SAT", href: "/digital-sat" }, { label: "About", href: "/#about" }, { label: "Success Stories", href: "/#results" }, { label: "Contact", href: "/#contact" }]

export function Header() {
  const [open, setOpen] = useState(false)
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b1d35]/95 text-white backdrop-blur">
    <TopContactBar />
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link href="/" className="font-serif text-2xl tracking-tight">Ahmed<span className="text-[#c9a45c]">Prep</span><span className="ml-2 hidden text-[10px] font-sans font-medium uppercase tracking-[0.22em] text-white/50 sm:inline">NYC test prep</span></Link>
      <nav className="hidden items-center gap-7 lg:flex">{links.map(link => <Link key={link.href} href={link.href} className="text-sm text-white/70 transition hover:text-[#e2c77e]">{link.label}</Link>)}</nav>
      <div className="flex items-center gap-3"><Button asChild className="hidden rounded-full bg-[#c9a45c] px-5 text-[#0b1d35] hover:bg-[#e2c77e] sm:inline-flex"><Link href="/#contact">Book a Free Consultation</Link></Button><button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button></div>
    </div>
    {open && <nav className="border-t border-white/10 bg-[#0b1d35] px-5 py-4 lg:hidden">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3 text-sm text-white/80 last:border-0">{link.label}</Link>)}<Button asChild className="mt-4 w-full rounded-full bg-[#c9a45c] text-[#0b1d35]"><Link href="/#contact">Book a Free Consultation</Link></Button></nav>}
  </header>
}

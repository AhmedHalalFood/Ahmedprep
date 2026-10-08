"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu } from "lucide-react"
import { NAV_LINKS, isNavActive } from "@/components/main-nav"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { trackEvent, EVENTS } from "@/lib/analytics"

export function MobileNav() {
  const pathname = usePathname()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type="button" className="mobile-menu-trigger" aria-label="Open menu">
          <Menu size={24} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[86vw] max-w-sm gap-0 border-l-4 border-l-gold bg-navy p-0 text-white">
        <div className="flex items-center gap-4 border-b border-white/15 px-6 pb-5 pt-6">
          <Image
            src="/ahmedprep-logo.png"
            alt="Ahmed Prep logo"
            width={1254}
            height={1254}
            sizes="56px"
            className="size-14 shrink-0 object-contain"
          />
          <div className="flex flex-col gap-1">
            <SheetTitle className="sr-only">AhmedPrep menu</SheetTitle>
            <SheetDescription className="text-xs font-bold uppercase tracking-widest text-gold">Astoria · Queens</SheetDescription>
          </div>
        </div>
        <nav aria-label="Mobile navigation" className="flex flex-col px-6 py-2">
          {NAV_LINKS.map((link) => {
            const active = isNavActive(pathname, link.href)
            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between border-b border-white/10 text-base font-bold uppercase tracking-wider ${active ? "text-gold" : "text-white"}`}
                >
                  {link.label}
                  {active && <span className="size-1.5 bg-gold" aria-hidden="true" />}
                </Link>
              </SheetClose>
            )
          })}
        </nav>
        <div className="px-6 pb-8 pt-4">
          <SheetClose asChild>
            <Link
              href="/free-diagnostic"
              onClick={() => trackEvent(EVENTS.diagnosticCtaClick, { location: "mobile_menu" })}
              className="button button-gold button-lg w-full justify-center uppercase"
            >
              Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

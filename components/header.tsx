import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ShsatIntensiveBar } from "@/components/shsat-intensive-bar"
import { TopContactBar } from "@/components/top-contact-bar"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"

export function Header() {
  return (
    <header className="site-header">
      <ShsatIntensiveBar />
      <TopContactBar />
      <div className="topbar container">
        <Link href="/" className="brand" aria-label="AhmedPrep home">
          <Image
            src="/ahmedprep-logo.png"
            alt="Ahmed Prep logo"
            width={1254}
            height={1254}
            priority
            sizes="(max-width: 800px) 46px, 68px"
            className="brand-logo"
          />
          <span className="brand-text">
            <span className="brand-wordmark">
              Ahmed<span className="brand-wordmark-accent">Prep</span>
            </span>
            <small>ASTORIA • QUEENS</small>
          </span>
        </Link>
        <div className="utility-nav">
          <TrackedLink
            href="/free-diagnostic"
            event={EVENTS.diagnosticCtaClick}
            eventProps={{ location: "header" }}
            className="button button-gold"
          >
            Book Free Diagnostic <ArrowUpRight size={16} aria-hidden="true" />
          </TrackedLink>
        </div>
        <MobileNav />
      </div>
      <div className="site-nav-bar">
        <div className="container nav-inner">
          <MainNav />
          <span className="nav-note">20-65 47th Street, Astoria</span>
        </div>
      </div>
    </header>
  )
}

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { MainNav } from "@/components/main-nav"
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
          <span>AhmedPrep</span>
          <small>ASTORIA · QUEENS</small>
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
        <TrackedLink
          href="/free-diagnostic"
          event={EVENTS.diagnosticCtaClick}
          eventProps={{ location: "header_mobile" }}
          className="mobile-consult"
        >
          Free Diagnostic <ArrowUpRight size={15} aria-hidden="true" />
        </TrackedLink>
      </div>
      <div className="navy-nav">
        <div className="container nav-inner">
          <MainNav />
          <span className="nav-note">20-65 47th Street, Astoria</span>
        </div>
      </div>
    </header>
  )
}

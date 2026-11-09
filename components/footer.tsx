import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone, Star } from "lucide-react"
import { ReviewLink } from "@/components/review-link"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, MAPS_URL, NOT_AFFILIATED_NOTE } from "@/lib/business"

const PROGRAM_LINKS = [
  { href: "/programs-2027", label: "Programs & Pricing" },
  { href: "/shsat", label: "SHSAT Prep" },
  { href: "/digital-sat", label: "Digital SAT Prep" },
  { href: "/free-sunday-classes", label: "Free Sunday Classes" },
  { href: "/free-diagnostic", label: "Free Diagnostic" },
  { href: "/programs-2027#more-options", label: "Private Tutoring" },
  { href: "/enroll-2027", label: "2027 Enrollment" },
  { href: "/results", label: "Student Results" },
  { href: "/tools", label: "Free Tools" },
]

const EXPLORE_LINKS = [
  { href: "/updates", label: "SHSAT & SAT Updates" },
  { href: "/resources", label: "Free Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/referral", label: "Referral" },
]

const linkClass = "inline-flex min-h-8 items-center hover:text-navy hover:underline"

export function Footer() {
  return (
    <footer className="site-footer border-t border-border bg-background text-sm text-subtle">
      <div className="container flex flex-col gap-6 py-7 lg:flex-row lg:items-center lg:gap-8">
        <Link href="/" className="brand shrink-0" aria-label="AhmedPrep home">
          <Image
            src="/ahmedprep-logo.png"
            alt="Ahmed Prep logo"
            width={1254}
            height={1254}
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

        <address className="flex shrink-0 flex-col gap-3 not-italic sm:flex-row sm:gap-8 lg:border-l lg:border-border lg:pl-8">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-foreground hover:text-navy hover:underline">
            <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-navy" />
            <span className="leading-relaxed">
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </span>
          </a>
          <span className="flex flex-col gap-1">
            <TrackedLink
              href={BUSINESS.phoneHref}
              event={EVENTS.phoneClick}
              eventProps={{ location: "footer" }}
              className="flex min-h-7 items-center gap-2 text-foreground hover:text-navy hover:underline"
            >
              <Phone size={16} aria-hidden="true" className="shrink-0 text-navy" />
              {BUSINESS.phoneDisplay}
            </TrackedLink>
            <a href={`mailto:${BUSINESS.email}`} className="flex min-h-7 items-center gap-2 text-foreground hover:text-navy hover:underline">
              <Mail size={16} aria-hidden="true" className="shrink-0 text-navy" />
              {BUSINESS.email}
            </a>
          </span>
        </address>

        <nav aria-label="Footer" className="flex min-w-0 flex-1 flex-col gap-3 lg:border-l lg:border-border lg:pl-8">
          <div>
            <p className="font-bold text-navy">Programs</p>
            <ul className="footer-inline-list mt-1 flex flex-wrap gap-x-3 text-xs">
              {PROGRAM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold text-navy">Explore</p>
            <ul className="footer-inline-list mt-1 flex flex-wrap gap-x-3 text-xs">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <ReviewLink location="footer" className={`${linkClass} gap-1`}>
                  <Star size={12} aria-hidden="true" fill="currentColor" strokeWidth={0} className="text-gold" />
                  Write a Google Review
                </ReviewLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="container flex flex-col gap-1 border-t border-border py-3 text-xs md:flex-row md:justify-between md:gap-6">
        <span className="shrink-0">© {new Date().getFullYear()} AhmedPrep. All rights reserved.</span>
        <span className="text-pretty md:text-right">{NOT_AFFILIATED_NOTE}</span>
      </div>
    </footer>
  )
}

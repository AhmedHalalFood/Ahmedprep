import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Mail, MapPin, Phone, Star } from "lucide-react"
import { ReviewInvite } from "@/components/landing/review-invite"
import { ReviewLink } from "@/components/review-link"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, MAPS_URL, NOT_AFFILIATED_NOTE } from "@/lib/business"

const PROGRAM_LINKS = [
  { href: "/programs-2027", label: "Programs & Pricing" },
  { href: "/shsat-prep", label: "SHSAT Prep" },
  { href: "/digital-sat-prep", label: "Digital SAT Prep" },
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

const linkClass =
  "group inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand hover:text-footer-navy hover:underline underline-offset-4 lg:min-h-8"
const contactClass = "inline-flex min-h-11 items-start gap-2.5 text-ink hover:text-brand hover:underline underline-offset-4 lg:min-h-8"
const arrow = (
  <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-footer-navy/40 transition-transform group-hover:translate-x-0.5" />
)

function ColumnHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="text-sm font-extrabold uppercase tracking-wider text-footer-navy">
      {children}
    </h2>
  )
}

export function Footer() {
  return (
    <>
      <ReviewInvite location="footer_review_banner" />
      <footer className="site-footer bg-footer text-sm">
        <div className="container grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.1fr_1.5fr_1fr] lg:gap-0 lg:py-12">
          <div className="flex flex-col gap-4 lg:pr-10">
            <Link href="/" className="brand self-start" aria-label="AhmedPrep home">
              <Image
                src="/ahmedprep-logo.png"
                alt="AhmedPrep logo"
                width={1254}
                height={1254}
                sizes="68px"
                className="brand-logo"
              />
              <span className="brand-text">
                <span className="brand-wordmark">
                  Ahmed<span className="brand-wordmark-accent">Prep</span>
                </span>
                <small>ASTORIA • QUEENS</small>
              </span>
            </Link>
            <address className="flex flex-col not-italic">
              <span className="font-extrabold text-footer-navy">{BUSINESS.name}</span>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={`${contactClass} py-1.5`}>
                <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                <span className="leading-relaxed">
                  {ADDRESS_LINE_1}
                  <br />
                  {ADDRESS_LINE_2}
                  <span className="sr-only"> (opens Google Maps)</span>
                </span>
              </a>
              <TrackedLink
                href={BUSINESS.phoneHref}
                event={EVENTS.phoneClick}
                eventProps={{ location: "footer" }}
                className={`${contactClass} items-center`}
              >
                <Phone size={16} aria-hidden="true" className="shrink-0 text-brand" />
                {BUSINESS.phoneDisplay}
              </TrackedLink>
              <a href={`mailto:${BUSINESS.email}`} className={`${contactClass} items-center`}>
                <Mail size={16} aria-hidden="true" className="shrink-0 text-brand" />
                {BUSINESS.email}
              </a>
            </address>
          </div>

          <nav aria-labelledby="footer-programs" className="flex flex-col gap-3 lg:border-l lg:border-footer-divider lg:px-10">
            <ColumnHeading id="footer-programs">Programs</ColumnHeading>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {PROGRAM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {arrow}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-explore" className="flex flex-col gap-3 lg:border-l lg:border-footer-divider lg:pl-10">
            <ColumnHeading id="footer-explore">Explore</ColumnHeading>
            <ul className="flex flex-col">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {arrow}
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <ReviewLink location="footer" className={linkClass}>
                  <Star size={14} aria-hidden="true" fill="currentColor" strokeWidth={0} className="shrink-0 text-gold-deep" />
                  Write a Google Review
                </ReviewLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-footer-divider">
          <div className="container flex flex-col gap-1 py-4 text-xs text-subtle md:flex-row md:justify-between md:gap-6">
            <span className="shrink-0">© {new Date().getFullYear()} AhmedPrep. All rights reserved.</span>
            <span className="text-pretty md:text-right">{NOT_AFFILIATED_NOTE}</span>
          </div>
        </div>
      </footer>
    </>
  )
}

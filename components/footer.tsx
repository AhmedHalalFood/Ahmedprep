import Image from "next/image"
import Link from "next/link"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { ADDRESS_LINE_1, ADDRESS_LINE_2, BUSINESS, MAPS_URL, NOT_AFFILIATED_NOTE } from "@/lib/business"

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <Link href="/" className="brand footer-brand" aria-label="AhmedPrep home">
            <Image
              src="/ahmedprep-logo.png"
              alt="Ahmed Prep logo"
              width={1254}
              height={1254}
              sizes="80px"
              className="brand-logo footer-brand-logo"
            />
            <small>ASTORIA · QUEENS</small>
          </Link>
          <p>SHSAT and Digital SAT preparation for students across New York City.</p>
          <address className="footer-nap not-italic">
            <strong>{BUSINESS.name}</strong>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </a>
            <TrackedLink href={BUSINESS.phoneHref} event={EVENTS.phoneClick} eventProps={{ location: "footer" }}>
              {BUSINESS.phoneDisplay}
            </TrackedLink>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </address>
        </div>
        <div className="footer-links">
          <div>
            <span>Programs</span>
            <Link href="/shsat">SHSAT Prep</Link>
            <Link href="/digital-sat">Digital SAT Prep</Link>
            <Link href="/free-shsat-class">Free SHSAT Class</Link>
            <Link href="/free-diagnostic">Free Diagnostic</Link>
          </div>
          <div>
            <span>Explore</span>
            <Link href="/resources">Resources</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/referral">Referral</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} AhmedPrep. All rights reserved.
        </span>
        <span className="footer-note">{NOT_AFFILIATED_NOTE}</span>
      </div>
    </footer>
  )
}

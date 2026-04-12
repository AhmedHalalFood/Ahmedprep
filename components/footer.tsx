import Link from "next/link"

const footerLinks = {
  programs: [
    { label: "SHSAT Prep", href: "#" },
    { label: "SAT Prep", href: "#" },
    { label: "ACT Prep", href: "#" },
    { label: "AP Courses", href: "#" },
    { label: "College Essays", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Team", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Free Resources", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Student Portal", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-tight">
                Ahmed<span className="text-accent">Prep</span>
              </span>
            </Link>
            <p className="mt-4 text-background/70 leading-relaxed max-w-sm">
              Empowering students to achieve academic excellence through 
              personalized instruction and proven methodologies.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5L14.17.5C10.24.5,9.1,3.3,9.1,5.47V7.46H5.5v3.4H9.1V21.5h5.4V10.86h3.47l.5-3.4Z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2.16c3.2,0,3.58.01,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s-.01,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.17,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33.01,7.05.07,2.7.27.27,2.7.07,7.05.01,8.33,0,8.74,0,12s.01,3.67.07,4.95c.2,4.36,2.63,6.78,6.98,6.98,1.28.06,1.69.07,4.95.07s3.67-.01,4.95-.07c4.35-.2,6.78-2.62,6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73,2.7,21.3.27,16.95.07,15.67.01,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.45,20.45H16.89V14.88c0-1.33,0-3-1.85-3s-2.13,1.44-2.13,2.93v5.67H9.35V9h3.41v1.56h.05a3.74,3.74,0,0,1,3.37-1.85c3.6,0,4.27,2.37,4.27,5.46v6.31ZM5.34,7.43A2.07,2.07,0,1,1,7.41,5.36,2.07,2.07,0,0,1,5.34,7.43Zm1.78,13H3.56V9H7.12ZM22.22,0H1.77A1.75,1.75,0,0,0,0,1.73V22.27A1.75,1.75,0,0,0,1.77,24H22.22A1.76,1.76,0,0,0,24,22.27V1.73A1.76,1.76,0,0,0,22.22,0Z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Link columns */}
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-background/50 mb-4">
              Programs
            </h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-background/50 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-background/50 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-background/50 mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} AhmedPrep. All rights reserved.
          </p>
          <p className="text-sm text-background/50">
            Designed with care in New York City
          </p>
        </div>
      </div>
    </footer>
  )
}

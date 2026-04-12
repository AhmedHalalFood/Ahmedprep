import Link from "next/link"

const footerLinks = {
  programs: [
    { label: "SHSAT Prep", href: "#shsat" },
    { label: "SAT Prep", href: "#sat-act" },
    { label: "ACT Prep", href: "#sat-act" },
    { label: "AP Courses", href: "#ap" },
    { label: "NYS Regents", href: "#regents" },
    { label: "Hunter Test", href: "#shsat" },
  ],
  company: [
    { label: "Why Ahmed Prep", href: "#why-us" },
    { label: "About Tariq Ahmed", href: "#about" },
    { label: "Our Approach", href: "#why-us" },
    { label: "Contact Us", href: "#contact" },
  ],
  contact: [
    { label: "347-479-5020", href: "tel:347-479-5020" },
    { label: "Tariq@ahmedprep.com", href: "mailto:Tariq@ahmedprep.com" },
    { label: "19-15 21st Ave, 2B", href: "#contact" },
    { label: "Astoria, NY 11105", href: "#contact" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                Ahmed<span className="text-accent">Prep</span>
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-sm">
              World-class test prep that is accessible, effective, and enjoyable 
              for all students. Helping students achieve their dream scores on 
              SHSAT, SAT, ACT, AP, Regents, and more.
            </p>
            <div className="mt-6">
              <a 
                href="tel:347-479-5020" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Call Now: 347-479-5020
              </a>
            </div>
          </div>
          
          {/* Link columns */}
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-muted-foreground mb-4">
              Programs
            </h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-muted-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm tracking-wider uppercase text-muted-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Trademark disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
            Specialized High School Admission Test (SHSAT) is a registered trademark of the New York City 
            Department of Education; SAT, Advanced Placement, and AP are registered trademarks of the College Board; 
            PSAT/NMSQT is a registered trademark of the College Board and the National Merit Scholarship Corporation; 
            ACT is a registered trademark of ACT, Inc.; and NYS Regents Examinations are administered by the 
            New York State Education Department, which is not affiliated with, and does not endorse, this product or site.
          </p>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ahmed Prep. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Astoria, New York
          </p>
        </div>
      </div>
    </footer>
  )
}

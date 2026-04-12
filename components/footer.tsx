import Link from "next/link"

const footerLinks = {
  programs: [
    { label: "SHSAT Prep", href: "#shsat" },
    { label: "SAT Prep", href: "#sat-act" },
    { label: "ACT Prep", href: "#sat-act" },
    { label: "AP Courses", href: "#ap" },
    { label: "Regents Exams", href: "#ap" },
    { label: "Hunter Test", href: "#shsat" },
  ],
  company: [
    { label: "Who We Are", href: "#about" },
    { label: "Our Approach", href: "#about" },
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
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-tight">
                Ahmed<span className="text-accent">Prep</span>
              </span>
            </Link>
            <p className="mt-4 text-background/70 leading-relaxed max-w-sm">
              World-class test prep that is accessible, effective, and enjoyable 
              for all students. Helping students achieve their dream scores on 
              SHSAT, SAT, ACT, AP, and more.
            </p>
            <div className="mt-6">
              <a 
                href="tel:347-479-5020" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 transition-colors"
              >
                Call Now: 347-479-5020
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
              Contact
            </h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Trademark disclaimer */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <p className="text-xs text-background/40 leading-relaxed max-w-4xl">
            Specialized High School Admission Test (SHSAT) is a registered trademark of the New York City 
            Department of Education; SAT, Advanced Placement, and AP are registered trademarks of the College Board; 
            PSAT/NMSQT is a registered trademark of the College Board and the National Merit Scholarship Corporation, 
            and ACT is a registered trademark of ACT, Inc. which are not affiliated with, and do not endorse, 
            this product or site.
          </p>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} Ahmed Prep. All rights reserved.
          </p>
          <p className="text-sm text-background/50">
            Astoria, New York
          </p>
        </div>
      </div>
    </footer>
  )
}

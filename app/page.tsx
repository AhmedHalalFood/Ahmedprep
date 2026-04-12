import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WhyAhmedPrep } from "@/components/why-ahmed-prep"
import { SHSATSection } from "@/components/shsat-section"
import { SATACTSection } from "@/components/sat-act-section"
import { APSection } from "@/components/ap-section"
import { About } from "@/components/about"
import { CTA } from "@/components/cta"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WhyAhmedPrep />
      <SHSATSection />
      <SATACTSection />
      <APSection />
      <About />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}

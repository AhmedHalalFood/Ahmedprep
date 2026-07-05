import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Programs } from "@/components/programs"
import { Testimonials } from "@/components/testimonials"
import { Instructors } from "@/components/instructors"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Programs />
      <Instructors />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}

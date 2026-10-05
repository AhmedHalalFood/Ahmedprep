import Link from "next/link"
import { ArrowUpRight, Check, ChevronRight, Minus } from "lucide-react"
import { Contact } from "@/components/contact"

const programs = [
  { title: "SHSAT Prep", kicker: "SPECIALIZED HIGH SCHOOL ADMISSIONS", body: "Preparation for NYC Specialized High School admissions with structured support across ELA, mathematics, pacing, and test-day strategy.", points: ["Diagnostic assessment", "Targeted practice and error analysis", "Full-length testing and pacing"] },
  { title: "Digital SAT Prep", kicker: "ADAPTIVE TEST PREPARATION", body: "Personalized preparation for the adaptive Digital SAT, built around score analysis, high-impact instruction, and confident execution.", points: ["Reading & Writing and Math", "Desmos and adaptive strategy", "Practice testing and score analysis"] },
]
const method = [
  ["01", "Diagnose", "Understand the starting point through a focused diagnostic and careful review of strengths and gaps."],
  ["02", "Plan", "Build a clear, realistic preparation roadmap around the student's goals, schedule, and school demands."],
  ["03", "Teach", "Deliver direct instruction, guided practice, and feedback that makes difficult material manageable."],
  ["04", "Measure", "Track progress with purposeful practice, testing, and the next right adjustment."],
]

function GoldArrow({ label }: { label: string }) {
  return <span className="gold-action"><span className="gold-circle"><ArrowUpRight size={17} strokeWidth={2.2} /></span><span>{label}</span></span>
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="topbar container">
          <Link href="#top" className="brand"><span>AhmedPrep</span><small>NYC TEST PREP</small></Link>
          <nav className="utility-nav" aria-label="Utility navigation"><Link href="#about">About</Link><Link href="#results">Results</Link><Link href="#contact">Contact</Link><Link href="#contact" className="button button-gold">Book a Free Consultation <ArrowUpRight size={16} /></Link></nav>
          <Link href="#contact" className="mobile-consult">Consultation <ArrowUpRight size={15} /></Link>
        </div>
        <div className="navy-nav"><div className="container nav-inner"><nav aria-label="Main navigation"><Link href="#programs">SHSAT Prep</Link><Link href="/digital-sat">Digital SAT Prep</Link><Link href="#method">Our Approach</Link><Link href="#resources">Resources</Link><Link href="#contact">Free Diagnostic</Link></nav><span className="nav-note">NYC students. Focused preparation.</span></div></div>
      </header>

      <section id="top" className="hero-section"><div className="hero-image" aria-hidden="true" /><div className="hero-panel"><p className="eyebrow blue">Specialized NYC test preparation</p><h1>Master the SHSAT.<br /><em>Conquer the Digital SAT.</em></h1><p className="hero-copy">Focused, personalized preparation for New York students who are ready to aim higher.</p><div className="hero-actions"><Link href="#programs" className="hero-link"><GoldArrow label="Explore AhmedPrep" /></Link><Link href="#contact" className="text-link">Book a free consultation <ArrowUpRight size={15} /></Link></div></div><div className="hero-caption">Focused instruction. Measurable progress.</div></section>

      <section id="results" className="stats-strip"><div className="container stats-grid"><div className="stat"><strong>2,500+</strong><span>Students Mentored</span></div><div className="stat"><strong>96%</strong><span>Admission Rate</span></div><div className="stat"><strong>150+</strong><span>Average SAT Point Improvement</span></div><div className="stat"><strong>12+ Years</strong><span>Teaching & Test Prep Experience</span></div></div></section>

      <section id="programs" className="section programs-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Focused programs</p><h2>Two tests.<br /><span>Focused preparation.</span></h2></div><p>We keep the work rigorous, personal, and clear—so students know what to practice and why it matters.</p></div><div className="program-grid">{programs.map((program) => <article className="program-card" key={program.title}><p className="eyebrow blue">{program.kicker}</p><h3>{program.title}</h3><p className="program-body">{program.body}</p><ul>{program.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul><Link href={program.title.startsWith("SHSAT") ? "/shsat" : "/digital-sat"}><GoldArrow label={`Explore ${program.title}`} /></Link></article>)}</div></div></section>

      <section id="method" className="method-section"><div className="container"><div className="method-intro"><p className="eyebrow gold">The AhmedPrep method</p><h2>A systematic process.<br /><span>A stronger student.</span></h2><p>Great preparation is not a collection of worksheets. It is a sequence of smart decisions, precise instruction, and honest measurement.</p></div><div className="method-grid">{method.map(([number, title, body]) => <article key={title} className="method-card"><span className="method-number">{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></div></section>

      <section id="about" className="founder-section"><div className="container founder-grid"><div className="founder-mark"><span>AP</span><small>EST.<br />NYC</small></div><div className="founder-copy"><p className="eyebrow blue">Meet the founder</p><h2>Tariq Ahmed</h2><p className="founder-role">Founder & Lead Instructor</p><div className="credentials"><p><strong>B.S.</strong> New York University</p><p><strong>M.S.</strong> Mathematics, Hunter College</p><p><strong>Experience</strong> NYC DOE Educator</p><p><strong>Practice</strong> 12+ Years of Teaching & Test-Prep Experience</p></div><p className="founder-text">AhmedPrep was founded to give New York students the kind of thoughtful, expert preparation that turns uncertainty into a plan—and a plan into progress.</p><Link href="#contact" className="text-link">Learn about our approach <ArrowUpRight size={15} /></Link></div></div></section>

      <section id="resources" className="resources-section"><div className="container"><div className="section-heading resources-heading"><div><p className="eyebrow blue">AhmedPrep resources</p><h2>Useful guidance<br /><span>for the road ahead.</span></h2></div><p>Practical information for NYC families. New guides and testing resources will be added here as they become available.</p></div><div className="resource-grid"><div className="resource-item"><span>Coming soon</span><h3>SHSAT preparation guides</h3><p>Clear guidance for building a thoughtful Specialized High School preparation plan.</p><Minus size={20} /></div><div className="resource-item"><span>Coming soon</span><h3>Digital SAT strategy</h3><p>Useful frameworks for practice, pacing, and making the most of adaptive testing.</p><Minus size={20} /></div><div className="resource-item"><span>Coming soon</span><h3>Practice & testing resources</h3><p>Tools and context to help students practice with purpose and confidence.</p><Minus size={20} /></div></div></div></section>

      <section className="consultation-banner"><div className="container consultation-inner"><div><p className="eyebrow gold">A clear next step</p><h2>Ready to build your student's plan?</h2><p>Start with a conversation about current performance, goals, and the right preparation strategy.</p></div><Link href="#contact" className="button button-gold">Book a Free Consultation <ArrowUpRight size={17} /></Link></div></section>
      <Contact />
      <footer className="footer"><div className="container footer-top"><div><Link href="#top" className="brand footer-brand"><span>AhmedPrep</span><small>NYC TEST PREP</small></Link><p>Serious preparation for New York students ready to aim higher.</p></div><div className="footer-links"><div><span>Programs</span><Link href="/shsat">SHSAT Prep</Link><Link href="/digital-sat">Digital SAT Prep</Link></div><div><span>Explore</span><Link href="#about">About</Link><Link href="#resources">Resources</Link><Link href="#contact">Contact</Link></div><div><span>Service area</span><p>New York City</p><p>Astoria, New York</p></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AhmedPrep. All rights reserved.</span><span>Privacy policy</span></div></footer>
    </main>
  )
}

export const metadata = { title: "AhmedPrep | NYC Test Prep for SHSAT & Digital SAT", description: "Specialized SHSAT and Digital SAT preparation for New York students, led by Tariq Ahmed." }
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0b2b50" }

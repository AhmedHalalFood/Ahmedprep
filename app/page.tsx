import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { Contact } from "@/components/contact"

const programs = [
  { title: "SHSAT Prep", kicker: "SPECIALIZED HIGH SCHOOL ADMISSIONS", body: "Preparation for NYC Specialized High School admissions with structured support across ELA, mathematics, pacing, and test-day strategy.", points: ["Diagnostic assessment", "Targeted practice and error analysis", "Full-length testing and pacing"] },
  { title: "Digital SAT Prep", kicker: "ADAPTIVE TEST PREPARATION", body: "Personalized preparation for the adaptive Digital SAT, built around score analysis, high-impact instruction, and timing and test-day strategy.", points: ["Reading & Writing and Math", "Desmos and adaptive strategy", "Practice testing and score analysis"] },
]
const method = [
  ["01", "Diagnose", "Understand the starting point through a focused diagnostic and careful review of strengths and gaps."],
  ["02", "Plan", "Build a clear, realistic preparation roadmap around the student's goals, schedule, and school demands."],
  ["03", "Teach", "Deliver direct instruction, guided practice, and feedback that makes difficult material manageable."],
  ["04", "Measure", "Track progress with purposeful practice, testing, and the next right adjustment."],
]

const resources = [
  { kicker: "SHSAT", title: "SHSAT program overview", body: "How preparation is structured across ELA, mathematics, pacing, and full-length practice.", href: "/shsat" },
  { kicker: "Digital SAT", title: "Digital SAT program overview", body: "What to expect from the adaptive format and how preparation is organized.", href: "/digital-sat" },
  { kicker: "Free diagnostic", title: "Request a free diagnostic", body: "Start with a clear picture of current strengths, gaps, and a realistic plan.", href: "#contact" },
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
        <div className="navy-nav"><div className="container nav-inner"><nav aria-label="Main navigation"><Link href="/shsat">SHSAT Prep</Link><Link href="/digital-sat">Digital SAT Prep</Link><Link href="#method">Our Approach</Link><Link href="#resources">Resources</Link><Link href="#contact">Free Diagnostic</Link></nav><span className="nav-note">NYC students. Focused preparation.</span></div></div>
      </header>

      <section id="top" className="hero-section"><div className="hero-image" aria-hidden="true" /><div className="hero-panel"><p className="eyebrow blue">Specialized NYC test preparation</p><h1>Master the SHSAT.<br /><em>Conquer the Digital SAT.</em></h1><p className="hero-copy">Focused, personalized preparation for New York students who are ready to aim higher.</p><div className="hero-actions"><Link href="#programs" className="hero-link"><GoldArrow label="Explore AhmedPrep" /></Link><Link href="#contact" className="text-link">Book a free consultation <ArrowUpRight size={15} /></Link></div></div></section>

      <section id="results" className="stats-strip"><div className="container stats-grid"><div className="stat"><strong>2,500+</strong><span>Students Mentored</span></div><div className="stat"><strong>96%</strong><span>Admission Rate</span></div><div className="stat"><strong>150+</strong><span>Average SAT Point Improvement</span></div><div className="stat"><strong>12+ Years</strong><span>Teaching & Test Prep Experience</span></div></div></section>

      <section id="programs" className="section programs-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Focused programs</p><h2>Two tests.<br /><span>Focused preparation.</span></h2></div><p>We keep the work rigorous, personal, and clear—so students know what to practice and why it matters.</p></div><div className="program-grid">{programs.map((program) => <article className="program-card" key={program.title}><p className="eyebrow blue">{program.kicker}</p><h3>{program.title}</h3><p className="program-body">{program.body}</p><ul>{program.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul><Link href={program.title.startsWith("SHSAT") ? "/shsat" : "/digital-sat"}><GoldArrow label={`Explore ${program.title}`} /></Link></article>)}</div></div></section>

      <section id="method" className="method-section"><div className="container"><div className="method-intro"><p className="eyebrow gold">The AhmedPrep method</p><h2>Preparation built<br /><span>around the student.</span></h2><p>Effective preparation starts with knowing where a student stands, then building instruction, practice, and assessment around measurable progress.</p></div><div className="method-grid">{method.map(([number, title, body]) => <article key={title} className="method-card"><span className="method-number">{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></div></section>

      <section id="about" className="founder-section"><div className="container founder-grid"><div className="founder-intro"><p className="eyebrow blue">Meet the founder</p><h2>Tariq Ahmed</h2><p className="founder-role">Founder & Lead Instructor</p><p className="founder-text">AhmedPrep provides New York students with focused, individualized instruction built around their starting point, goals, and progress.</p><Link href="#method" className="text-link">Learn about our approach <ArrowUpRight size={15} /></Link></div><dl className="credentials" aria-label="Credentials"><div><dt>Education</dt><dd>B.S., New York University</dd></div><div><dt>Graduate degree</dt><dd>M.S. Mathematics, Hunter College</dd></div><div><dt>Classroom</dt><dd>NYC DOE Educator</dd></div><div><dt>Experience</dt><dd>12+ Years of Teaching & Test-Prep Experience</dd></div></dl></div></section>

      <section className="consultation-banner"><div className="container consultation-inner"><div><p className="eyebrow gold">A clear next step</p><h2>Ready to build your student's plan?</h2><p>Start with a conversation about current performance, goals, and the right preparation strategy.</p></div><Link href="#contact" className="button button-gold">Book a Free Consultation <ArrowUpRight size={17} /></Link></div></section>

      <section id="resources" className="resources-section" aria-labelledby="resources-heading"><div className="container"><div className="resources-heading"><p className="eyebrow">Resources</p><h2 id="resources-heading">Know the test.<br /><span>Know the next step.</span></h2></div><div className="resource-grid">{resources.map((item) => <Link key={item.title} href={item.href} className="resource-item"><span>{item.kicker}</span><h3>{item.title}</h3><p>{item.body}</p><ArrowUpRight size={18} aria-hidden="true" /></Link>)}</div></div></section>

      <Contact />
      <footer className="footer"><div className="container footer-top"><div><Link href="#top" className="brand footer-brand"><span>AhmedPrep</span><small>NYC TEST PREP</small></Link><p>Serious preparation for New York students ready to aim higher.</p></div><div className="footer-links"><div><span>Programs</span><Link href="/shsat">SHSAT Prep</Link><Link href="/digital-sat">Digital SAT Prep</Link></div><div><span>Explore</span><Link href="#about">About</Link><Link href="#resources">Resources</Link><Link href="#contact">Contact</Link></div><div><span>Service area</span><p>New York City</p><p>Astoria, New York</p></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AhmedPrep. All rights reserved.</span><span>Privacy policy</span></div></footer>
    </main>
  )
}

export const metadata = { title: "AhmedPrep | NYC Test Prep for SHSAT & Digital SAT", description: "Specialized SHSAT and Digital SAT preparation for New York students, led by Tariq Ahmed." }
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0b2b50" }

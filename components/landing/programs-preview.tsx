import { ArrowRight, Leaf, Snowflake, Sun, Sunset } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"
import { MAX_CLASS_SIZE, TERMS_2027, cohortInquiryHref, cohortSchedule, priceFor, dollars } from "@/lib/cohorts-2027"
import { activeTerms } from "@/lib/program-retirement"
import { activeTermIds, isAnnualShsatOfferActive, isTermActive } from "@/lib/program-retirement"
import { programsHref } from "@/lib/program-finder"

const SEASONS = [
  {
    id: "winter" as const,
    title: "Winter 2027",
    detail: "12 weeks · 72 hours",
    note: "Digital SAT weekend: IN PERSON · Sat & Sun, 2–5 PM ET. SHSAT classes remain in person.",
    formats: "Digital SAT weekday: LIVE ONLINE · Tue & Thu, 6:30–9:30 PM ET",
    icon: Snowflake,
    tone: "border-[#B7D5E7] bg-[#E8F2FA] text-[#174D7C]",
  },
  {
    id: "spring" as const,
    title: "Spring 2027",
    detail: "12 weeks · 72 hours",
    note: "Weekday Digital SAT live online; weekend SHSAT & SAT in person",
    formats: "Digital SAT online Tue/Thu, 6:30–9:30 PM ET",
    icon: Leaf,
    tone: "border-[#A9D5C5] bg-[#E6F4ED] text-[#086347]",
  },
  {
    id: "summer" as const,
    title: "Summer 2027",
    detail: "8-week program",
    note: "SHSAT weekdays; Digital SAT weekends only",
    formats: "SHSAT 96 hours · Digital SAT 72 hours",
    icon: Sun,
    tone: "border-[#F0D991] bg-[#FFF4D6] text-[#865500]",
  },
  {
    id: "fall" as const,
    title: "Fall 2027",
    detail: "8-week intensives",
    note: "SHSAT final exam preparation; Digital SAT weekend intensive",
    formats: "SHSAT 96 hours · Digital SAT 72 hours",
    icon: Sunset,
    tone: "border-[#D3C6E6] bg-[#F4F0FA] text-[#593E83]",
  },
] as const

export function ProgramsPreview() {
  const active = activeTermIds()
  const currentTerms = activeTerms(TERMS_2027)
  const winterClasses = currentTerms.find((term) => term.id === "winter")?.cohorts ?? []
  if (!active.length) return null
  return (
    <section id="programs-pricing" aria-labelledby="programs-pricing-title" className="scroll-mt-4 border-b border-line bg-site-canvas py-5 md:py-6">
      <div className="container rounded-2xl border border-line border-t-4 border-t-gold bg-white p-5 shadow-sm sm:p-6 md:p-7">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="eyebrow blue">Winter enrollment first · 2027 calendar below</p>
            <h2 id="programs-pricing-title" className="text-balance text-2xl font-extrabold leading-tight text-navy md:text-3xl">
              Choose your Winter class, then explore the year
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-subtle">
              All SHSAT preparation cohorts meet in person at our Astoria, Queens classroom. Digital SAT weekday classes are live online in Winter and Spring; Digital SAT weekend and intensive classes meet in person. Maximum {MAX_CLASS_SIZE} students per class.
            </p>
          </div>
          <TrackedLink
            href="/programs-2027"
            event={EVENTS.programCtaClick}
            eventProps={{ location: "home_programs_preview", cta: "compare_all" }}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#D8A326] bg-[#E9B83E] px-5 text-sm font-extrabold shadow-sm transition-colors hover:bg-[#F3CB61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy" style={{ color: "#102F51" }}
          >
            <span style={{ color: "#102F51" }}>Compare programs & pricing</span> <ArrowRight size={17} aria-hidden="true" style={{ color: "#102F51" }} />
          </TrackedLink>
        </div>
        {winterClasses.length > 0 && (
          <div className="mt-5 border-t border-line pt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Winter 2027 · Four separate classes</p>
                <h3 className="mt-1 text-lg font-extrabold text-navy">Choose from all four Winter class options</h3>
              </div>
              <p className="text-xs font-semibold text-subtle">12 weeks · 24 meetings · 72 hours · Maximum 12 students each</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {winterClasses.map((c) => (
                <li key={c.id}>
                  <TrackedLink
                    href={cohortInquiryHref(c)}
                    event={EVENTS.programCtaClick}
                    eventProps={{ location: "home_winter_four_classes", cta: c.id }}
                    className={`flex h-full flex-col gap-2 rounded-xl border px-4 py-4 transition-colors hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${c.program === "SHSAT" ? "border-blue-200 bg-blue-50/60" : "border-emerald-200 bg-emerald-50/60"}`}
                  >
                    <span className="text-sm font-extrabold text-navy">{c.program} · {c.label}</span>
                    <span className="text-xs leading-relaxed text-ink">{cohortSchedule(c)}</span>
                    <span className="mt-auto text-xs font-bold text-navy">{dollars(priceFor(c).regular)} regular · Founding-family {dollars(priceFor(c).founding ?? priceFor(c).regular)} if eligible</span>
                    <span className="inline-flex items-center gap-1 pt-1 text-xs font-extrabold text-brand">View this class <ArrowRight size={14} aria-hidden="true" /></span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 border-t border-line pt-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-brand">Explore all 2027 seasons and their schedules</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {SEASONS.filter((season) => active.includes(season.id)).map(({ id, title, detail, note, formats, icon: Icon, tone }) => (
            <TrackedLink
              key={id}
              href={programsHref({ season: id })}
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_programs_preview", cta: `season_${id}` }}
              className={`group grid h-auto min-h-0 grid-rows-[auto_auto_auto] gap-2 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy md:h-full md:min-h-[200px] md:grid-rows-[auto_1fr_auto] ${tone}`}
            >
              <div className="flex min-h-7 items-center gap-2">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
                <h3 className="text-base font-extrabold">{title}</h3>
              </div>
              <p className="text-xs font-bold opacity-90">{currentTerms.find((term) => term.id === id)?.cohorts.length ?? 0} approved class options</p>
              {id === "winter" && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#85D6AE] bg-[#DCFCE7] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#11603A]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#159957]" aria-hidden="true" />
                  Enrollment Open Now
                </span>
              )}
              {id === "summer" ? (
                <div className="self-start space-y-1.5 pt-3 text-xs leading-relaxed">
                  <p className="text-sm font-extrabold">{detail}</p>
                  <p className="text-sm font-bold">SHSAT &amp; Digital SAT Prep</p>
                  <p><strong>SHSAT weekdays:</strong> July 1–Aug 26 · Mon–Thu, 10 AM–1 PM · 96 hours</p>
                  <p><strong>Digital SAT weekends:</strong> July 3–Aug 28 · Sat/Sun, 10 AM–3 PM · 72 instructional hours (30-minute break)</p>
                </div>
              ) : id === "fall" ? (
                <div className="self-start space-y-1.5 pt-3 text-xs leading-relaxed">
                  <p className="text-sm font-extrabold">{detail}</p>
                  <p><strong>SHSAT Final Intensive:</strong> Sep 13–Nov 4 · Mon–Thu, 5:30–8:30 PM · 96 hours</p>
                  <p><strong>Digital SAT Weekend:</strong> Sep 11–Oct 31 · Sat/Sun, 10 AM–3 PM · 72 instructional hours (30-minute break)</p>
                </div>
              ) : (
                <div className="self-start space-y-1.5 pt-3">
                  <p className="text-sm font-extrabold">{detail}</p>
                  <p className="text-sm font-bold">SHSAT &amp; Digital SAT Prep</p>
                  <p className="text-xs font-medium leading-relaxed">{formats}</p>
                  <p className="text-xs leading-relaxed opacity-85">{note}</p>
                </div>
              )}
              <span className="inline-flex items-center gap-1 self-end pt-2 text-xs font-extrabold underline underline-offset-4">
                View class options <ArrowRight size={14} aria-hidden="true" />
              </span>
            </TrackedLink>
          ))}
          </div>
        </div>

        {isAnnualShsatOfferActive() && <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gold/50 bg-cream px-4 py-3 text-sm text-navy">
          <span><strong>Complete SHSAT 2027 · All in person in Astoria:</strong> 336 instructional hours across four stages · $6,720 regular · annual packages from $5,040 for qualifying founding families</span>
          <a href="/shsat-prep#annual-shsat-package" className="font-bold underline underline-offset-4 hover:text-brand">Explore annual SHSAT package</a>
        </div>}

        {isTermActive("winter") && <div className="mt-5 border-t border-line pt-5" aria-labelledby="winter-syllabus-heading">
          <p className="text-xs font-extrabold uppercase tracking-widest text-brand">Explore our academic curriculum</p>
          <h3 id="winter-syllabus-heading" className="mt-1 text-xl font-extrabold text-navy">
            See what your child will learn
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-subtle">
            Learn how our Winter SHSAT Foundation and integrated Digital SAT Mastery programs develop skills,
            use diagnostic assessments, and prepare students for increasingly challenging exam questions.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <TrackedLink
              href="/shsat-prep#shsat-pathway"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_programs_preview", cta: "winter_shsat_curriculum" }}
              className="flex min-h-20 items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              <span className="flex flex-col gap-1">
                <span className="text-sm font-extrabold text-navy">Winter SHSAT Foundation</span>
                <span className="text-xs font-semibold text-[#375C79]">Explore curriculum &amp; learning goals</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-navy" />
            </TrackedLink>
            <TrackedLink
              href="/digital-sat-prep#sat-mastery"
              event={EVENTS.programCtaClick}
              eventProps={{ location: "home_programs_preview", cta: "winter_sat_curriculum" }}
              className="flex min-h-20 items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 transition-colors hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              <span className="flex flex-col gap-1">
                <span className="text-sm font-extrabold text-navy">Winter Digital SAT Mastery</span>
                <span className="text-xs font-semibold text-[#275C4B]">Explore curriculum &amp; 1600 Challenge</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-navy" />
            </TrackedLink>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-extrabold text-navy">
            <a
              href="/syllabi/2027/Winter%20SHSAT%20syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 underline underline-offset-4 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              aria-label="Download Winter 2027 SHSAT syllabus PDF, opens in new tab"
            >
              Download Winter SHSAT syllabus (PDF) <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a href="/digital-sat-prep#sat-mastery" className="inline-flex min-h-10 items-center text-sm font-extrabold text-navy underline underline-offset-4 hover:text-brand">View the Winter Digital SAT curriculum <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </div>}
      </div>
    </section>
  )
}

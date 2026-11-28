"use client"

import { useState } from "react"
import { ArrowRight, CalendarDays, Clock, Leaf, type LucideIcon, Snowflake, Sun, Sunset } from "lucide-react"
import type { ProgramId, TermId } from "@/lib/cohorts-2027"
import { programsHref } from "@/lib/program-finder"
import "./hero-season-picker.css"

const SEASON_ICONS: Record<TermId, LucideIcon> = { winter: Snowflake, spring: Leaf, summer: Sun, fall: Sunset }

const EXAMS: { id: ProgramId | null; label: string }[] = [
  { id: null, label: "All programs" },
  { id: "SHSAT", label: "SHSAT" },
  { id: "Digital SAT", label: "Digital SAT" },
]

type HeroSeason = { id: TermId; name: string; dates: string; hours: string }

/** Season cards link to the 2027 finder; choosing an exam pre-filters every card's link. Works as plain links without JS. */
export function HeroSeasonPicker({ seasons }: { seasons: HeroSeason[] }) {
  const [exam, setExam] = useState<ProgramId | null>(null)

  return (
    <div className="hero-picker">
      <div role="group" aria-label="Show 2027 programs for" className="hero-exam-toggle">
        {EXAMS.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={exam === option.id}
            onClick={() => setExam(option.id)}
            className="hero-exam-option"
          >
            {option.label}
          </button>
        ))}
      </div>
      <nav aria-label="2027 seasons">
        <ul className="hero-seasons">
          {seasons.map((season) => {
            const Icon = SEASON_ICONS[season.id]
            return (
              <li key={season.id}>
                <a href={programsHref({ season: season.id, program: exam ?? undefined })} className="hero-season-card" data-season={season.id}>
                  <span className="hero-season-head">
                    <span className="hero-season-icon" aria-hidden="true">
                      <Icon size={26} strokeWidth={2.2} />
                    </span>
                    <span className="hero-season-name">{season.name}</span>
                  </span>
                  <span className="hero-season-row hero-season-dates">
                    <CalendarDays size={16} aria-hidden="true" />
                    {season.dates}
                  </span>
                  <span className="hero-season-row hero-season-hours">
                    <Clock size={16} aria-hidden="true" />
                    {season.hours}
                  </span>
                  <span className="hero-season-cta">
                    {exam ? `View ${exam} classes` : "View Programs"}
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

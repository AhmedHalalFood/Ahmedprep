import type { SourceId } from "./official-sources"

export type OfficialDateGroup = {
  title: string
  sourceId: SourceId
  updateSlug: string
  rows: { label: string; date: string; endDate?: string; display?: string }[]
}

/** Human-verified on the date stored with each source in lib/official-sources.ts. */
export const OFFICIAL_DATES: OfficialDateGroup[] = [
  {
    title: "2026 SHSAT",
    sourceId: "nycps-high-school",
    updateSlug: "2026-shsat-test-dates-november",
    rows: [
      { label: "Registration closes", date: "2026-10-30" },
      { label: "Weekend SHSAT", date: "2026-11-14", endDate: "2026-11-21", display: "Nov. 14, 15 & 21, 2026" },
      { label: "School-Day SHSAT", date: "2026-11-18" },
    ],
  },
  {
    title: "November 7, 2026 SAT",
    sourceId: "college-board-sat-dates",
    updateSlug: "sat-november-december-2026-registration-deadlines",
    rows: [
      { label: "Registration deadline", date: "2026-10-23" },
      { label: "Late registration / changes", date: "2026-10-27" },
    ],
  },
  {
    title: "December 5, 2026 SAT",
    sourceId: "college-board-sat-dates",
    updateSlug: "sat-november-december-2026-registration-deadlines",
    rows: [
      { label: "Registration deadline", date: "2026-11-20" },
      { label: "Late registration / changes", date: "2026-11-24" },
    ],
  },
]

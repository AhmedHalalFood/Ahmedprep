import { ALL_COHORTS, TERM_IDS, type Cohort, type ProgramId, type TermId } from "@/lib/cohorts-2027"

/**
 * URL state for the /programs-2027 class finder: season → program → format → one exact cohort.
 * Plain query-string links keep every step shareable, crawlable, and usable without JavaScript.
 */

export type FormatSlug = "weekday" | "weekend" | "intensive"
type ProgramSlug = "shsat" | "digital-sat"

const PROGRAM_SLUG: Record<ProgramId, ProgramSlug> = { SHSAT: "shsat", "Digital SAT": "digital-sat" }
const SLUG_PROGRAM: Record<ProgramSlug, ProgramId> = { shsat: "SHSAT", "digital-sat": "Digital SAT" }
const FORMAT_OF: Record<Cohort["label"], FormatSlug> = { Weekday: "weekday", Weekend: "weekend", "Weekday Intensive": "intensive" }

export const FORMAT_LABEL: Record<FormatSlug, string> = { weekday: "Weekday", weekend: "Weekend", intensive: "Summer Intensive" }

export const formatOf = (cohort: Cohort) => FORMAT_OF[cohort.label]

export const FINDER_ID = "class-finder"
const PATH = "/programs-2027"

export function programsHref(sel: { season?: TermId; program?: ProgramId; format?: FormatSlug }) {
  const params = new URLSearchParams()
  if (sel.season) params.set("season", sel.season)
  if (sel.program) params.set("program", PROGRAM_SLUG[sel.program])
  if (sel.format) params.set("format", sel.format)
  const qs = params.toString()
  return qs ? `${PATH}?${qs}#${FINDER_ID}` : PATH
}

export const cohortHref = (cohort: Cohort) => programsHref({ season: cohort.term, program: cohort.program, format: formatOf(cohort) })

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export type FinderState = {
  season?: TermId
  program?: ProgramId
  format?: FormatSlug
  /** Formats offered for the chosen season and program, in catalog order. */
  formats: { slug: FormatSlug; cohort: Cohort }[]
  cohort?: Cohort
}

/** Parses ?season=&program=&format=; anything that doesn't match the approved catalog is dropped, never guessed. */
export function parseFinder(params: Record<string, string | string[] | undefined>): FinderState {
  const seasonRaw = one(params.season)
  const programRaw = one(params.program)
  const formatRaw = one(params.format)
  const season = seasonRaw && (TERM_IDS as readonly string[]).includes(seasonRaw) ? (seasonRaw as TermId) : undefined
  const program = programRaw && programRaw in SLUG_PROGRAM ? SLUG_PROGRAM[programRaw as ProgramSlug] : undefined
  const formats =
    season && program
      ? ALL_COHORTS.filter((c) => c.term === season && c.program === program).map((cohort) => ({ slug: formatOf(cohort), cohort }))
      : []
  const match = formats.find((f) => f.slug === formatRaw)
  return { season, program, format: match?.slug, formats, cohort: match?.cohort }
}

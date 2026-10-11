import { SOURCES, SOURCE_CHECKS, type SourceCheck } from "./official-sources"

const FETCH_TIMEOUT_MS = 20_000
const MIN_TEXT_LENGTH = 2_000
const USER_AGENT = "AhmedPrepSourceCheck/1.0 (+https://ahmedprep.com/updates; daily official date verification)"

const MONTHS = "jan(?:uary|\\.)?|feb(?:ruary|\\.)?|mar(?:ch|\\.)?|apr(?:il|\\.)?|may|june?|july?|aug(?:ust|\\.)?|sept?(?:ember|\\.)?|oct(?:ober|\\.)?|nov(?:ember|\\.)?|dec(?:ember|\\.)?"
const DATE_PATTERN = new RegExp(`\\b(?:${MONTHS}) \\d{1,2}(?:/\\d{1,2})?(?:, 20\\d{2})?\\b`, "g")

export type CheckStatus = "verified" | "changed" | "unavailable"

export type SourceCheckResult = {
  sourceId: string
  name: string
  url: string
  status: CheckStatus
  missingFacts: string[]
  newDates: string[]
  detail?: string
}

/** Converts HTML to lowercase plain text with one line per block element and table cells separated by " | ". */
export function htmlToText(html: string) {
  return html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/t[dh]>\s*<t[dh][^>]*>/gi, " | ")
    .replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6]|\/section|\/article|\/table)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&rsquo;|&#8217;/gi, "'")
    .replace(/&ndash;|&mdash;|&#8211;|&#8212;/gi, "-")
    .replace(/&[a-z]+;/gi, " ")
    .toLowerCase()
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").replace(/\s*\|\s*/g, " | ").trim())
    .filter(Boolean)
    .join("\n")
}

export function extractTrackedDates(text: string, keywords: RegExp) {
  const dates = new Set<string>()
  for (const line of text.split("\n")) {
    if (!keywords.test(line)) continue
    for (const match of line.matchAll(DATE_PATTERN)) dates.add(match[0])
  }
  return [...dates].sort()
}

export function evaluateSource(check: SourceCheck, text: string): Omit<SourceCheckResult, "name" | "url" | "sourceId"> {
  const missingFacts = check.expectations.filter((e) => !e.pattern.test(text)).map((e) => e.fact)

  // If nothing we verified can be found, the page layout most likely changed. Treat it as unreadable rather than as new facts.
  if (missingFacts.length === check.expectations.length) {
    return { status: "unavailable", missingFacts, newDates: [], detail: "None of the verified facts could be located. The page may have been restructured." }
  }

  const known = new Set(check.knownDates)
  const newDates = known.size ? extractTrackedDates(text, check.trackedKeywords).filter((d) => !known.has(d)) : []
  return { status: missingFacts.length || newDates.length ? "changed" : "verified", missingFacts, newDates }
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
    redirect: "follow",
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const text = htmlToText(await response.text())
  if (text.length < MIN_TEXT_LENGTH) throw new Error(`Response too short to parse (${text.length} characters)`)
  return text
}

export async function checkAllSources(): Promise<SourceCheckResult[]> {
  return Promise.all(
    SOURCE_CHECKS.map(async (check) => {
      const { name, url } = SOURCES[check.sourceId]
      const base = { sourceId: check.sourceId, name, url }
      try {
        return { ...base, ...evaluateSource(check, await fetchText(url)) }
      } catch (error) {
        return {
          ...base,
          status: "unavailable" as const,
          missingFacts: [],
          newDates: [],
          detail: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }),
  )
}

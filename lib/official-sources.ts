/**
 * Approved primary sources for factual testing information.
 *
 * `expectations` are the facts AhmedPrep has verified and published. The daily checker confirms each one still appears
 * on the official page; a missing expectation means the source may have changed and a human must review it.
 * `knownDates` are the dates the checker saw next to tracked keywords at verification time. A new date appearing next
 * to those keywords is reported as possible new information. Both lists must be updated together with lib/updates.ts
 * whenever a reviewed change is published.
 */

export type SourceId = "nycps-high-school" | "nycps-specialized" | "college-board-sat-dates" | "ahmedprep"

export type OfficialSource = {
  id: SourceId
  name: string
  publisher: string
  url: string
  /** Date a person last confirmed the published facts against this page (YYYY-MM-DD). */
  lastVerified: string
  official: boolean
}

export type SourceCheck = {
  sourceId: Exclude<SourceId, "ahmedprep">
  expectations: { fact: string; pattern: RegExp }[]
  /** Lines containing one of these terms are scanned for dates. */
  trackedKeywords: RegExp
  knownDates: string[]
}

export const SOURCES: Record<SourceId, OfficialSource> = {
  "nycps-high-school": {
    id: "nycps-high-school",
    name: "NYC Public Schools: High School Admissions",
    publisher: "NYC Public Schools",
    url: "https://www.schools.nyc.gov/enrollment/enroll-grade-by-grade/high-school",
    lastVerified: "2026-10-11",
    official: true,
  },
  "nycps-specialized": {
    id: "nycps-specialized",
    name: "NYC Public Schools: Specialized High Schools",
    publisher: "NYC Public Schools",
    url: "https://www.schools.nyc.gov/enrollment/enroll-grade-by-grade/specialized-high-schools",
    lastVerified: "2026-10-11",
    official: true,
  },
  "college-board-sat-dates": {
    id: "college-board-sat-dates",
    name: "College Board: SAT Dates and Deadlines",
    publisher: "College Board",
    url: "https://satsuite.collegeboard.org/sat/dates-deadlines",
    lastVerified: "2026-10-11",
    official: true,
  },
  ahmedprep: {
    id: "ahmedprep",
    name: "AhmedPrep",
    publisher: "AhmedPrep",
    url: "https://ahmedprep.com",
    lastVerified: "2026-10-11",
    official: false,
  },
}

export const SOURCE_CHECKS: SourceCheck[] = [
  {
    sourceId: "nycps-high-school",
    expectations: [
      { fact: "Applications and SHSAT registration open October 6, 2026", pattern: /october 6, 2026 high school application[^\n]{0,80}shsat[^\n]{0,20}registration opens/ },
      { fact: "SHSAT registration closes October 30, 2026", pattern: /october 30, 2026 shsat registration closes/ },
      { fact: "School-Day SHSAT on November 18", pattern: /november 18 shsat school day/ },
      { fact: "Weekend SHSAT on November 14/15 and November 21", pattern: /weekend test dates:? november 14\/15 and november 21/ },
      { fact: "High school and LaGuardia applications close December 4, 2026", pattern: /december 4, 2026 high school and laguardia applications close/ },
    ],
    trackedKeywords: /shsat|registration|applications? (open|close)/,
    knownDates: ["december 4, 2026", "november 14/15", "november 18", "november 21", "october 30, 2026", "october 6, 2026"],
  },
  {
    sourceId: "nycps-specialized",
    expectations: [
      { fact: "Official SHSAT guide for students entering high school in fall 2027", pattern: /guide to the shsat for students entering high school in fall 2027/ },
      { fact: "Registered students are scheduled for a November SHSAT date", pattern: /scheduled for a shsat testing date in november/ },
    ],
    trackedKeywords: /shsat|registration/,
    knownDates: ["march 5", "november 18", "october 30", "october 6"],
  },
  {
    sourceId: "college-board-sat-dates",
    expectations: [
      { fact: "Nov. 7, 2026 SAT: register by Oct. 23; late registration/changes by Oct. 27", pattern: /nov\.? 7, 2026 \| oct\.? 23, 2026\s+(register \| )?oct\.? 27, 2026/ },
      { fact: "Dec. 5, 2026 SAT: register by Nov. 20; late registration/changes by Nov. 24", pattern: /dec\.? 5, 2026 \| nov\.? 20, 2026\s+(register \| )?nov\.? 24, 2026/ },
      { fact: "March 6, 2027 SAT: register by Feb. 19; late registration/changes by Feb. 23", pattern: /march 6, 2027 \| feb\.? 19, 2027\s+(register \| )?feb\.? 23, 2027/ },
      { fact: "May 1, 2027 SAT: register by Apr. 16; late registration/changes by April 20", pattern: /may 1, 2027 \| apr(il|\.)? 16, 2027\s+(register \| )?apr(il|\.)? 20, 2027/ },
      { fact: "June 5, 2027 SAT: register by May 21; late registration/changes by May 25", pattern: /june 5, 2027 \| may 21, 2027\s+(register \| )?may 25, 2027/ },
    ],
    trackedKeywords: /\b20(2[6-9])\b/,
    knownDates: ["apr. 16, 2027", "april 20, 2027", "april 30, 2027", "august 28, 2027", "dec. 5, 2026", "december 4, 2027", "feb. 19, 2027", "feb. 23, 2027", "june 3, 2028", "june 5, 2027", "march 1", "march 4, 2028", "march 6, 2027", "may 1, 2027", "may 21, 2027", "may 25, 2027", "may 6, 2028", "nov. 20, 2026", "nov. 24, 2026", "nov. 7, 2026", "november 6, 2027", "oct. 23, 2026", "oct. 27, 2026", "oct. 3, 2026", "october 1", "october 9, 2027", "sept. 18, 2026", "sept. 22, 2026", "september 18, 2027"],
  },
]

export function getSource(id: SourceId) {
  return SOURCES[id]
}

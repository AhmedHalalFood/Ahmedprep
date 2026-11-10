"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { TERM_IDS, type ProgramId, type TermId } from "@/lib/cohorts-2027"
import { programsHref } from "@/lib/program-finder"

const HASH_PROGRAM: Record<string, ProgramId> = { shsat: "SHSAT", "digital-sat": "Digital SAT" }

/**
 * Older links (e.g. /programs-2027#spring) put the selection in the hash, which the server never sees.
 * Translate it into the query-string selection the finder renders from, keeping any existing choices.
 */
export function FinderHashRestore({ season, program }: { season?: TermId; program?: ProgramId }) {
  const router = useRouter()
  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase()
    const hashSeason = (TERM_IDS as readonly string[]).includes(hash) ? (hash as TermId) : undefined
    const hashProgram = HASH_PROGRAM[hash]
    if (!hashSeason && !hashProgram) return
    router.replace(programsHref({ season: hashSeason ?? season, program: hashProgram ?? program }))
  }, [router, season, program])
  return null
}

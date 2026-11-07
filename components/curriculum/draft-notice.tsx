import { CURRICULUM_STATUS } from "@/lib/curriculum-2027"

export function DraftNotice() {
  return (
    <div role="note" className="border border-gold-deep border-l-4 bg-cream p-4 text-sm leading-relaxed text-ink">
      <p className="font-bold uppercase tracking-wide text-gold-deep">{CURRICULUM_STATUS}</p>
      <p className="mt-1">
        This curriculum has not been reviewed by AhmedPrep and is not published. Topics, pacing, and assessments may change.
        Makeup sessions marked <strong>Proposed</strong> are not yet approved.
      </p>
    </div>
  )
}

import type { ClassType } from "@/lib/free-class"

const styles: Record<ClassType, string> = {
  shsat: "border-gold bg-gold/20 text-navy",
  digital_sat: "border-brand/40 bg-brand-soft text-brand",
  workshop: "border-line bg-warm text-navy",
}

const labels: Record<ClassType, string> = {
  shsat: "SHSAT",
  digital_sat: "Digital SAT",
  workshop: "Workshop",
}

export function ClassTypeBadge({ type }: { type: ClassType }) {
  return (
    <span className={`inline-flex items-center border px-2 py-1 text-xs font-extrabold uppercase tracking-widest ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

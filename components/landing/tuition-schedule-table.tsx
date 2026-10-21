import { formatClassDate, formatUsd, type TuitionRow } from "@/lib/shsat-intensive"

const TONES = {
  dark: {
    head: "border-white/25 text-white/70",
    row: "border-white/15 text-white",
    current: "bg-gold text-navy",
    tuition: "text-gold",
  },
  light: {
    head: "border-navy/25 text-subtle",
    row: "border-line text-navy",
    current: "bg-gold text-navy",
    tuition: "text-navy",
  },
}

/** Four narrow columns so the table fits a 320px phone without horizontal scrolling. */
export function TuitionScheduleTable({
  rows,
  tone = "light",
  caption,
}: {
  rows: TuitionRow[]
  tone?: keyof typeof TONES
  caption: string
}) {
  const t = TONES[tone]
  return (
    <table className="w-full table-fixed border-collapse text-left text-sm sm:text-base">
      <caption className="sr-only">{caption}</caption>
      <colgroup>
        <col className="w-[38%]" />
        <col className="w-[20%]" />
        <col className="w-[18%]" />
        <col className="w-[24%]" />
      </colgroup>
      <thead>
        <tr className={`border-b-2 text-[11px] font-bold uppercase tracking-wider sm:text-xs ${t.head}`}>
          <th scope="col" className="py-2 pr-2 font-bold">
            First class
          </th>
          <th scope="col" className="px-1 py-2 text-right font-bold">
            Classes
          </th>
          <th scope="col" className="px-1 py-2 text-right font-bold">
            Hours
          </th>
          <th scope="col" className="py-2 pl-1 text-right font-bold">
            Tuition
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const isCurrent = index === 0
          return (
            <tr key={row.date} className={`border-b ${isCurrent ? t.current : t.row}`}>
              <th scope="row" className={`py-2.5 font-semibold ${isCurrent ? "pl-2 pr-2" : "pr-2"}`}>
                {formatClassDate(row.date)}
                {isCurrent && <span className="block text-[10px] font-extrabold uppercase tracking-widest">Next available</span>}
              </th>
              <td className="px-1 py-2.5 text-right tabular-nums">{row.classes}</td>
              <td className="px-1 py-2.5 text-right tabular-nums">{row.hours}</td>
              <td
                className={`py-2.5 text-right font-extrabold tabular-nums ${isCurrent ? "pl-1 pr-2" : `pl-1 ${t.tuition}`}`}
              >
                {formatUsd(row.tuition)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

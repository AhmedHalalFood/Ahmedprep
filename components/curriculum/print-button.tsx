"use client"

export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="button button-outline min-h-11" data-print-hide>
      {label}
    </button>
  )
}

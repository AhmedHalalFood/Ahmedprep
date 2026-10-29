import type { Metadata } from "next"
import { SeatAvailabilityBoard } from "@/components/seats/seat-availability-board"

export const metadata: Metadata = {
  title: "Seat Availability (Design Preview)",
  description: "Phase 1 design preview of January 2027 seat availability. Demonstration values only.",
  robots: { index: false, follow: false },
}

export default function SeatsPreviewPage() {
  return (
    <section className="bg-warm px-4 py-8 text-navy sm:px-5 sm:py-14">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="eyebrow blue">Design preview</p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            January 2027 seat availability
          </h1>
          <p className="text-pretty leading-relaxed text-subtle">
            Four Astoria groups, each limited to 12 students.
          </p>
        </header>
        <SeatAvailabilityBoard />
      </div>
    </section>
  )
}

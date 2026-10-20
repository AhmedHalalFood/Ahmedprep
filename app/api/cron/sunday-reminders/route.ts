import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { isProductionDeployment, UnsafeDatabaseError } from "@/lib/db-environment"
import { REMINDER_SLOTS, type ReminderSlot } from "@/lib/reminder-schedule"
import { runReminderSlot } from "@/lib/sunday-reminders"

export const dynamic = "force-dynamic"
export const maxDuration = 30

function authorized(request: Request) {
  const secret = process.env.REMINDER_CRON_SECRET ?? ""
  if (secret.length < 32) return false
  const given = Buffer.from(request.headers.get("authorization") ?? "")
  const expected = Buffer.from(`Bearer ${secret}`)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

/**
 * Called by cron-job.org on Sundays at 10:00 and 15:30 America/New_York (plus catch-up runs 20 minutes later).
 * POST sends; GET reports what would be sent without sending. Outside a production deployment, `at` can simulate a time.
 */
async function handle(request: Request, dryRun: boolean) {
  if (!authorized(request)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const params = new URL(request.url).searchParams
  const slot = params.get("slot") as ReminderSlot
  if (!REMINDER_SLOTS.includes(slot)) return NextResponse.json({ ok: false, error: "slot must be morning or afternoon" }, { status: 400 })

  const at = params.get("at")
  const now = at && !isProductionDeployment() ? new Date(at) : new Date()
  if (Number.isNaN(now.getTime())) return NextResponse.json({ ok: false, error: "Invalid at" }, { status: 400 })

  try {
    const report = await runReminderSlot(slot, { now, dryRun })
    console.log("[sunday-reminders] run", JSON.stringify(report))
    return NextResponse.json({ ok: true, ...report }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    if (error instanceof UnsafeDatabaseError) return NextResponse.json({ ok: false, error: error.message }, { status: 409 })
    console.error("[sunday-reminders] run failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ ok: false, error: "Reminder run failed" }, { status: 500 })
  }
}

export const POST = (request: Request) => handle(request, false)
export const GET = (request: Request) => handle(request, true)

import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import { SAT_INTENSIVE_PROGRAM_KEY } from "@/lib/sat-final-intensive"
import { drainOutboxAfterResponse } from "@/lib/sat-final-intensive-outbox-runner"
import { handleStripeWebhook, stripeSetup } from "@/lib/sat-final-intensive-stripe"

export const dynamic = "force-dynamic"
export const maxDuration = 60

/** Stripe webhook (test mode only). The browser's success redirect never confirms a seat; only this verified event does. */
export async function POST(request: Request) {
  if (!internalPreviewAllowed() || process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const setup = stripeSetup()
  if (!setup.ok) return NextResponse.json({ error: "Not configured" }, { status: 503 })

  const rawBody = await request.text()
  try {
    const result = await handleStripeWebhook(pool, SAT_INTENSIVE_PROGRAM_KEY, rawBody, request.headers.get("stripe-signature"), setup)
    if (result.confirmed) drainOutboxAfterResponse()
    if (result.outcome.startsWith("needs_review")) console.error(`[sat-intensive] payment needs manual review: ${result.outcome}`)
    return NextResponse.json({ received: result.status === 200, outcome: result.outcome }, { status: result.status })
  } catch (error) {
    // A database error returns 500 so Stripe retries the event later.
    console.error("[sat-intensive] webhook failed:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Temporary failure" }, { status: 500 })
  }
}

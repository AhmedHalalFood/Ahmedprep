import Stripe from "stripe"
import type { Pool } from "pg"
import { SAT_INTENSIVE_NAME, SAT_INTENSIVE_PATH, formatClassDate } from "@/lib/sat-final-intensive"
import {
  confirmStripePayment,
  hasStripeEvent,
  recordStripeEvent,
  releaseCheckoutHold,
  type EnrollmentRecord,
} from "@/lib/sat-final-intensive-enrollment"

/**
 * Stripe Checkout for the SAT Final Intensive, TEST MODE ONLY. No Stripe account is connected yet; until
 * STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set, every function here reports "not configured" and the Preview
 * keeps using the simulated payment. Live keys are refused outright: going live needs explicit approval and a code
 * change here, not just new environment variables.
 */

export type StripeSetup =
  | { ok: true; stripe: Stripe; webhookSecret: string }
  | { ok: false; reason: "not_configured" | "live_key_refused" }

export function isLiveKey(key: string) {
  return /^(sk|rk)_live_/.test(key)
}

export function stripeSetup(env: Record<string, string | undefined> = process.env): StripeSetup {
  const key = env.STRIPE_SECRET_KEY?.trim()
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!key || !webhookSecret) return { ok: false, reason: "not_configured" }
  if (isLiveKey(key) || !/^(sk|rk)_test_/.test(key)) return { ok: false, reason: "live_key_refused" }
  return { ok: true, stripe: new Stripe(key, { maxNetworkRetries: 2 }), webhookSecret }
}

export async function createCheckoutSession(
  stripe: Stripe,
  record: EnrollmentRecord,
  origin: string,
  sessionExpiresAt: Date,
) {
  return stripe.checkout.sessions.create(
    {
      mode: "payment",
      ui_mode: "hosted",
      customer_email: record.parentEmail,
      client_reference_id: record.publicId,
      expires_at: Math.floor(sessionExpiresAt.getTime() / 1000),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            // Always the stored, server-computed tuition. Nothing from the browser reaches this amount.
            unit_amount: record.tuitionCents,
            product_data: {
              name: `${SAT_INTENSIVE_NAME}: ${record.studentName}`,
              description: `${record.remainingClasses} classes starting ${formatClassDate(record.firstClassDate)}, in person`,
            },
          },
        },
      ],
      metadata: { enrollment_id: record.publicId, program_key: record.programKey },
      payment_intent_data: { metadata: { enrollment_id: record.publicId, program_key: record.programKey } },
      success_url: `${origin}${SAT_INTENSIVE_PATH}?checkout=success&enrollment=${record.publicId}`,
      cancel_url: `${origin}${SAT_INTENSIVE_PATH}?checkout=canceled`,
    },
    // One session per enrollment per hold window: a double-click or retry returns the same session.
    { idempotencyKey: `sat-intensive/checkout/${record.publicId}/${record.holdExpiresAt.getTime()}` },
  )
}

export type WebhookResult = { status: number; outcome: string; confirmed?: EnrollmentRecord }

/**
 * Verifies the signature over the exact raw body, then applies the event once. Live-mode events are rejected even if
 * correctly signed. Returning non-2xx makes Stripe retry, so only database errors do that.
 */
export async function handleStripeWebhook(
  pool: Pool,
  programKey: string,
  rawBody: string,
  signature: string | null,
  setup: { stripe: Stripe; webhookSecret: string },
  now = new Date(),
): Promise<WebhookResult> {
  let event: Stripe.Event
  try {
    event = setup.stripe.webhooks.constructEvent(rawBody, signature ?? "", setup.webhookSecret)
  } catch {
    return { status: 400, outcome: "bad_signature" }
  }
  if (event.livemode) return { status: 400, outcome: "live_event_refused" }
  if (await hasStripeEvent(pool, event.id)) return { status: 200, outcome: "duplicate" }

  let outcome = "ignored"
  let publicId: string | null = null
  let confirmed: EnrollmentRecord | undefined

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded" ||
    event.type === "checkout.session.expired"
  ) {
    const session = event.data.object
    publicId = session.metadata?.enrollment_id ?? session.client_reference_id ?? null
    const sameProgram = session.metadata?.program_key === programKey
    if (!publicId || !sameProgram) {
      outcome = "not_this_program"
    } else if (event.type === "checkout.session.expired") {
      outcome = (await releaseCheckoutHold(pool, programKey, publicId, session.id, now)) ? "hold_released" : "nothing_to_release"
    } else if (session.payment_status !== "paid") {
      outcome = "awaiting_payment"
    } else {
      const result = await confirmStripePayment(
        pool,
        programKey,
        {
          publicId,
          sessionId: session.id,
          paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
          amountTotalCents: session.amount_total ?? -1,
          currency: session.currency ?? "",
        },
        now,
      )
      outcome = result.outcome === "needs_review" || result.outcome === "ignored" ? `${result.outcome}:${result.reason}` : result.outcome
      if (result.outcome === "confirmed") confirmed = result.record
    }
  }

  await recordStripeEvent(pool, event.id, event.type, publicId, outcome)
  return { status: 200, outcome, confirmed }
}

import type { Pool } from "pg"
import type { CreateEmailOptions } from "resend"
import { FAMILY_SENDER, INTERNAL_SENDER, createEmailClient } from "@/lib/email-sender"
import { SAT_INTENSIVE_CAPACITY } from "@/lib/sat-final-intensive"
import { ADMIN_NOTIFICATION_TO, adminNotificationEmail, familyConfirmationEmail } from "@/lib/sat-final-intensive-emails"
import { getEnrollment, getSeatSummary } from "@/lib/sat-final-intensive-enrollment"

/**
 * Durable delivery for enrollment emails. Jobs are rows in sat_intensive_email_outbox, written in the same transaction
 * that confirms the seat. A worker claims due jobs with SKIP LOCKED, sends them one at a time at a paced rate, and
 * reschedules transient failures with exponential backoff and jitter. Every attempt is recorded.
 */

export { EMAIL_KINDS, type EmailKind } from "@/lib/sat-final-intensive-enrollment"
import type { EmailKind } from "@/lib/sat-final-intensive-enrollment"

// Resend's default team limit is 2 requests per second, shared by every form on the site. Pacing one worker at
// 600 ms leaves headroom; anything above the limit comes back as 429 and is retried with backoff.
export const MIN_SEND_INTERVAL_MS = 600
const CLAIM_LEASE_MS = 2 * 60_000
const BACKOFF_BASE_MS = 2_000
const BACKOFF_CAP_MS = 60 * 60_000
export const ADMIN_RESEND_COOLDOWN_MS = 2 * 60_000

const TRANSIENT_ERRORS = new Set(["rate_limit_exceeded", "application_error", "internal_server_error", "concurrent_idempotent_requests"])

export type SendOutcome =
  | { kind: "sent"; messageId: string | null }
  | { kind: "retry"; errorName: string; statusCode: number | null; retryAfterMs?: number }
  | { kind: "failed"; errorName: string; statusCode: number | null }

type SendFn = (payload: CreateEmailOptions, idempotencyKey: string) => Promise<SendOutcome>

/** Classifies a Resend response. Quota, auth and validation errors are permanent; rate limits, 5xx and network errors retry. */
export function classifyResendResult(
  result: { data?: { id?: string } | null; error?: { name?: string; statusCode?: number | null } | null },
): SendOutcome {
  if (result.data?.id) return { kind: "sent", messageId: result.data.id }
  const name = result.error?.name ?? "unknown_error"
  const statusCode = result.error?.statusCode ?? null
  // The same key was already accepted: the earlier attempt delivered it.
  if (name === "invalid_idempotent_request") return { kind: "sent", messageId: null }
  if (TRANSIENT_ERRORS.has(name) || (statusCode !== null && statusCode >= 500)) return { kind: "retry", errorName: name, statusCode }
  return { kind: "failed", errorName: name, statusCode }
}

export function resendSender(apiKey: string): SendFn {
  const client = createEmailClient(apiKey)
  return async (payload, idempotencyKey) => {
    try {
      return classifyResendResult(await client.emails.send(payload, { idempotencyKey }))
    } catch (error) {
      return { kind: "retry", errorName: error instanceof Error ? error.name : "network_error", statusCode: null }
    }
  }
}

/** Full-jitter-style backoff: base * 2^(attempt-1), capped, then scaled by a random factor in [0.5, 1.5). */
export function backoffMs(attempt: number, random = Math.random) {
  const exp = Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** Math.max(0, attempt - 1))
  return Math.round(exp * (0.5 + random()))
}

type Job = { id: string; enrollment_public_id: string; kind: EmailKind; generation: number; attempts: number; max_attempts: number }

async function claimNextJob(pool: Pool, now: Date, scope: string[] | null): Promise<Job | null> {
  const { rows } = await pool.query<Job>(
    `UPDATE sat_intensive_email_outbox o
     SET status = 'sending', attempts = o.attempts + 1, locked_until = $2, updated_at = $1
     WHERE o.id = (
       SELECT id FROM sat_intensive_email_outbox
       WHERE ((status = 'pending' AND next_attempt_at <= $1) OR (status = 'sending' AND locked_until <= $1))
         AND ($3::text[] IS NULL OR enrollment_public_id::text = ANY($3::text[]))
       ORDER BY next_attempt_at, id
       FOR UPDATE SKIP LOCKED LIMIT 1
     )
     RETURNING o.id, o.enrollment_public_id, o.kind, o.generation, o.attempts, o.max_attempts`,
    [now, new Date(now.getTime() + CLAIM_LEASE_MS), scope],
  )
  return rows[0] ?? null
}

async function buildPayload(pool: Pool, job: Job): Promise<CreateEmailOptions | null> {
  const record = await getEnrollment(pool, job.enrollment_public_id)
  if (!record || record.status !== "confirmed") return null
  if (job.kind === "family_confirmation") {
    return { from: FAMILY_SENDER, to: [record.parentEmail], replyTo: ADMIN_NOTIFICATION_TO, ...familyConfirmationEmail(record) }
  }
  const seats = await getSeatSummary(pool, record.programKey)
  return {
    from: INTERNAL_SENDER,
    to: [ADMIN_NOTIFICATION_TO],
    replyTo: record.parentEmail,
    ...adminNotificationEmail(record, seats.confirmed, SAT_INTENSIVE_CAPACITY, adminLink?.(record.publicId) ?? null),
  }
}

// Injected by the server entry point so this module stays free of server-only imports and can run under node --test.
let adminLink: ((publicId: string) => string | null) | null = null
export function setOutboxAdminLinkFactory(factory: (publicId: string) => string | null) {
  adminLink = factory
}

async function recordOutcome(pool: Pool, job: Job, outcome: SendOutcome, now: Date, random: () => number) {
  const exhausted = outcome.kind === "retry" && job.attempts >= job.max_attempts
  const final = outcome.kind === "retry" && !exhausted ? "retry" : outcome.kind === "sent" ? "sent" : "failed"
  const errorName = outcome.kind === "sent" ? null : outcome.errorName
  const statusCode = outcome.kind === "sent" ? null : outcome.statusCode
  const messageId = outcome.kind === "sent" ? outcome.messageId : null
  const delay =
    final === "retry" && outcome.kind === "retry"
      ? Math.max(backoffMs(job.attempts, random), outcome.retryAfterMs ?? 0)
      : 0

  await pool.query(
    `INSERT INTO sat_intensive_email_attempts (outbox_id, generation, attempt, outcome, error_name, status_code, resend_message_id, attempted_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [job.id, job.generation, job.attempts, final, errorName, statusCode, messageId, now],
  )
  await pool.query(
    `UPDATE sat_intensive_email_outbox SET
       status = $2, locked_until = NULL, updated_at = $3, last_error = $4,
       next_attempt_at = CASE WHEN $2 = 'pending' THEN $5::timestamptz ELSE next_attempt_at END,
       resend_message_id = COALESCE($6, resend_message_id),
       sent_at = CASE WHEN $2 = 'sent' THEN $3::timestamptz ELSE sent_at END
     WHERE id = $1`,
    [
      job.id,
      final === "retry" ? "pending" : final,
      now,
      errorName ? `${errorName}${statusCode ? ` (${statusCode})` : ""}${exhausted ? " - retries exhausted" : ""}` : null,
      new Date(now.getTime() + delay),
      messageId,
    ],
  )
  return final
}

export type ProcessSummary = { sent: number; retried: number; failed: number; skipped: number }

/**
 * Drains due jobs until none are due or the deadline passes. Short first retries (about 2s, 4s, 8s) usually complete in
 * the same invocation; longer ones are left in the table for the next run.
 */
export async function processEmailOutbox(
  pool: Pool,
  options: {
    send?: SendFn
    deadlineMs?: number
    now?: () => Date
    sleep?: (ms: number) => Promise<void>
    random?: () => number
    /** Restricts the run to these enrollments (tests use this so a fake sender never claims real jobs). */
    onlyPublicIds?: string[]
  } = {},
): Promise<ProcessSummary> {
  const summary: ProcessSummary = { sent: 0, retried: 0, failed: 0, skipped: 0 }
  const apiKey = process.env.RESEND_API_KEY
  const send = options.send ?? (apiKey && process.env.RESEND_EMAIL_DOMAIN ? resendSender(apiKey) : null)
  if (!send) return summary
  const now = options.now ?? (() => new Date())
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)))
  const random = options.random ?? Math.random
  const deadline = Date.now() + (options.deadlineMs ?? 20_000)
  const scope = options.onlyPublicIds ?? null
  let lastSendAt = 0

  while (Date.now() < deadline) {
    const job = await claimNextJob(pool, now(), scope)
    if (!job) {
      const next = await nextDueInMs(pool, now(), scope)
      if (next === null || Date.now() + next >= deadline) break
      await sleep(next)
      continue
    }
    const payload = await buildPayload(pool, job)
    if (!payload) {
      await recordOutcome(pool, job, { kind: "failed", errorName: "enrollment_not_confirmed", statusCode: null }, now(), random)
      summary.skipped++
      continue
    }
    const wait = lastSendAt + MIN_SEND_INTERVAL_MS - Date.now()
    if (wait > 0) await sleep(wait)
    lastSendAt = Date.now()
    const outcome = await send(payload, `sat-intensive/${job.kind}/${job.enrollment_public_id}/g${job.generation}`)
    const final = await recordOutcome(pool, job, outcome, now(), random)
    if (final === "sent") summary.sent++
    else if (final === "retry") summary.retried++
    else summary.failed++
    if (outcome.kind !== "sent") console.error(`[sat-intensive] ${job.kind} attempt ${job.attempts} ${final}: ${outcome.errorName}`)
  }
  return summary
}

async function nextDueInMs(pool: Pool, now: Date, scope: string[] | null) {
  const { rows } = await pool.query<{ next: Date | null }>(
    `SELECT min(next_attempt_at) AS next FROM sat_intensive_email_outbox
     WHERE status = 'pending' AND ($1::text[] IS NULL OR enrollment_public_id::text = ANY($1::text[]))`,
    [scope],
  )
  return rows[0]?.next ? Math.max(0, rows[0].next.getTime() - now.getTime()) : null
}

export type OutboxJobView = {
  kind: EmailKind
  status: string
  generation: number
  attempts: number
  lastError: string | null
  sentAt: Date | null
  nextAttemptAt: Date
}

export async function getEmailJobs(pool: Pool, publicId: string): Promise<OutboxJobView[]> {
  const { rows } = await pool.query(
    `SELECT kind, status, generation, attempts, last_error, sent_at, next_attempt_at
     FROM sat_intensive_email_outbox WHERE enrollment_public_id = $1 ORDER BY kind`,
    [publicId],
  )
  return rows.map((r) => ({
    kind: r.kind,
    status: r.status,
    generation: r.generation,
    attempts: r.attempts,
    lastError: r.last_error,
    sentAt: r.sent_at,
    nextAttemptAt: r.next_attempt_at,
  }))
}

export type AdminResendResult = { ok: true } | { ok: false; reason: "not_found" | "not_confirmed" | "in_progress" | "cooldown" }

/**
 * Administrator resend of one confirmation email. Starts a new generation (new idempotency key) and re-queues the job.
 * It never touches payment or enrollment rows, so it cannot create a second charge, receipt transaction or seat.
 */
export async function requeueEmailForAdmin(pool: Pool, publicId: string, kind: EmailKind, now = new Date()): Promise<AdminResendResult> {
  const record = await getEnrollment(pool, publicId)
  if (!record) return { ok: false, reason: "not_found" }
  if (record.status !== "confirmed") return { ok: false, reason: "not_confirmed" }
  const { rows } = await pool.query<{ id: string }>(
    `UPDATE sat_intensive_email_outbox SET
       status = 'pending', generation = generation + 1, attempts = 0, next_attempt_at = $3, locked_until = NULL,
       last_error = NULL, last_admin_resend_at = $3, updated_at = $3
     WHERE enrollment_public_id = $1 AND kind = $2 AND status IN ('sent', 'failed')
       AND (last_admin_resend_at IS NULL OR last_admin_resend_at <= $4)
     RETURNING id`,
    [publicId, kind, now, new Date(now.getTime() - ADMIN_RESEND_COOLDOWN_MS)],
  )
  if (rows.length) return { ok: true }
  const current = await pool.query<{ status: string }>(
    `SELECT status FROM sat_intensive_email_outbox WHERE enrollment_public_id = $1 AND kind = $2`,
    [publicId, kind],
  )
  if (!current.rows.length) return { ok: false, reason: "not_found" }
  return { ok: false, reason: current.rows[0].status === "pending" || current.rows[0].status === "sending" ? "in_progress" : "cooldown" }
}

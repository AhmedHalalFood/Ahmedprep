import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { verifySatIntensiveEmailsToken } from "@/lib/admin-links"
import { pool } from "@/lib/db"
import { internalPreviewAllowed } from "@/lib/internal-routes"
import { formatClassDate } from "@/lib/sat-final-intensive"
import { getEnrollment } from "@/lib/sat-final-intensive-enrollment"
import { getEmailJobs, type OutboxJobView } from "@/lib/sat-final-intensive-email-outbox"
import { IntensiveResendForm } from "./resend-form"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "SAT Final Intensive Emails | AhmedPrep",
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ""

const LABELS = { family_confirmation: "Family confirmation", admin_notification: "Staff notification" } as const
const STATUS_TEXT: Record<string, string> = {
  pending: "Queued",
  sending: "Sending",
  sent: "Delivered to Resend",
  failed: "Failed after retries",
}

function describe(job: OutboxJobView) {
  if (job.status === "sent" && job.sentAt) return `${STATUS_TEXT.sent} ${job.sentAt.toLocaleString("en-US", { timeZone: "America/New_York" })}`
  if (job.status === "pending" && job.attempts > 0) return `Retrying (attempt ${job.attempts + 1} pending)`
  return STATUS_TEXT[job.status] ?? job.status
}

export default async function SatIntensiveEmailsPage({ searchParams }: Props) {
  if (!internalPreviewAllowed()) notFound()
  const params = await searchParams
  const id = first(params.id)
  const exp = first(params.exp)
  const sig = first(params.sig)
  const publicId = verifySatIntensiveEmailsToken(id, exp, sig)

  let loaded: { record: Awaited<ReturnType<typeof getEnrollment>>; jobs: OutboxJobView[] } | null = null
  let dbError = false
  if (publicId) {
    try {
      const [record, jobs] = await Promise.all([getEnrollment(pool, publicId), getEmailJobs(pool, publicId)])
      loaded = { record, jobs }
    } catch (error) {
      dbError = true
      console.error("[sat-intensive] admin page load failed:", error instanceof Error ? error.message : error)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-lg flex-col gap-6 border border-border bg-background p-6 text-ink shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-balance text-navy">SAT Final Intensive email delivery</h1>
        {!publicId ? (
          <p className="leading-relaxed text-subtle">This link is invalid or has expired.</p>
        ) : dbError ? (
          <p className="leading-relaxed text-subtle">The enrollment database is unavailable right now. Please try again in a few minutes.</p>
        ) : !loaded?.record ? (
          <p className="leading-relaxed text-subtle">No enrollment was found for this link.</p>
        ) : (
          <>
            <dl className="flex flex-col gap-1 text-sm leading-relaxed">
              <div className="flex justify-between gap-4">
                <dt className="text-subtle">Student</dt>
                <dd className="font-medium">{loaded.record.studentName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-subtle">First class</dt>
                <dd className="font-medium">{formatClassDate(loaded.record.firstClassDate)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-subtle">Enrollment status</dt>
                <dd className="font-medium">{loaded.record.status}</dd>
              </div>
            </dl>
            <p className="text-sm leading-relaxed text-subtle">
              Resending only sends the email again. It never charges the family, creates a new payment, or changes the seat.
            </p>
            <ul className="flex flex-col gap-5">
              {loaded.jobs.map((job) => (
                <li key={job.kind} className="flex flex-col gap-3 border-t border-border pt-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-navy">{LABELS[job.kind]}</p>
                    <p className="text-sm leading-relaxed">{describe(job)}</p>
                    {job.lastError && <p className="text-sm leading-relaxed text-subtle">Last error: {job.lastError}</p>}
                  </div>
                  <IntensiveResendForm
                    id={id}
                    exp={exp}
                    sig={sig}
                    kind={job.kind}
                    label={`Resend ${LABELS[job.kind].toLowerCase()}`}
                    disabled={job.status === "pending" || job.status === "sending" || loaded.record?.status !== "confirmed"}
                  />
                </li>
              ))}
              {loaded.jobs.length === 0 && <li className="text-sm text-subtle">No emails are queued for this enrollment.</li>}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}

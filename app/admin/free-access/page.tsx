import type { Metadata } from "next"
import { verifyFreeAccessAdminToken } from "@/lib/admin-links"
import { FREE_ACCESS_MIGRATION, isFreeAccessEnforced, searchFreeAccess } from "@/lib/free-access"
import { ASSESSMENT_STATUSES, ATTENDANCE_STATUSES, FREE_ACCESS_LIMITS, STATUS_LABELS } from "@/lib/free-access-policy"
import { addException, markReviewed, removeException, updateAssessment, updateAttendance } from "./actions"

export const metadata: Metadata = {
  title: "Free Access Records | AhmedPrep",
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ""

const inputClass = "rounded-md border border-border bg-background px-3 py-2 text-sm"
const buttonClass = "rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"

function Hidden({ token, q }: { token: { exp: string; sig: string }; q: string }) {
  return (
    <>
      <input type="hidden" name="exp" value={token.exp} />
      <input type="hidden" name="sig" value={token.sig} />
      <input type="hidden" name="q" value={q} />
    </>
  )
}

function ReviewFlag({ reason }: { reason: string | null }) {
  return <p className="text-sm font-semibold text-error">Needs review{reason ? `: ${reason}` : ""}</p>
}

export default async function FreeAccessAdminPage({ searchParams }: Props) {
  const params = await searchParams
  const token = { exp: first(params.exp), sig: first(params.sig) }
  const q = first(params.q).slice(0, 100)
  const message = first(params.msg).slice(0, 300)

  if (!verifyFreeAccessAdminToken(token.exp, token.sig)) {
    return (
      <Shell>
        <p className="leading-relaxed text-subtle">
          This link is invalid or has expired. Open the link in a more recent AhmedPrep notification email.
        </p>
      </Shell>
    )
  }

  let enforced = false
  let results: Awaited<ReturnType<typeof searchFreeAccess>> | null = null
  try {
    enforced = await isFreeAccessEnforced()
    if (enforced) results = await searchFreeAccess(q)
  } catch (error) {
    console.error("[free-access-admin] Could not load records:", error instanceof Error ? error.message : error)
  }

  if (!enforced || !results) {
    return (
      <Shell>
        <p className="leading-relaxed text-subtle">
          Free-access limits are not active yet: migration <code>{FREE_ACCESS_MIGRATION}</code> has not been applied, or the
          database is unavailable. Registrations are accepted normally until then.
        </p>
      </Shell>
    )
  }

  return (
    <Shell>
      <p className="text-sm leading-relaxed text-subtle">
        Each student gets {FREE_ACCESS_LIMITS.sunday_class} free Sunday classes and {FREE_ACCESS_LIMITS.diagnostic} free
        diagnostics. Cancelled and no-show records do not count. Every change is written to the audit log.
      </p>
      {message && (
        <p role="status" className="border-l-4 border-gold bg-cream px-4 py-3 text-sm">
          {message}
        </p>
      )}

      <form method="get" className="flex flex-wrap gap-2" role="search">
        <input type="hidden" name="exp" value={token.exp} />
        <input type="hidden" name="sig" value={token.sig} />
        <label htmlFor="q" className="sr-only">
          Search by parent email, phone, or name
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Parent email, phone, or name" className={`${inputClass} min-w-0 flex-1`} />
        <button className={buttonClass}>Search</button>
      </form>
      {!q && <p className="text-sm text-subtle">Showing records that need review.</p>}

      <Section title={`Sunday classes (${results.sunday.length})`}>
        {results.sunday.map((row) => (
          <li key={row.id} className="flex flex-col gap-2 border-b border-border py-3">
            <p className="text-sm">
              <span className="font-semibold">{row.studentName}</span> · grade {row.studentGrade} · {row.classDate} · #{row.id}
            </p>
            <p className="break-all text-sm text-subtle">
              {row.parentName} · {row.parentEmail} · {row.parentPhone}
            </p>
            {row.reviewStatus === "needs_review" && <ReviewFlag reason={row.reviewReason} />}
            <div className="flex flex-wrap gap-2">
              <form action={updateAttendance} className="flex gap-2">
                <Hidden token={token} q={q} />
                <input type="hidden" name="id" value={row.id} />
                <label htmlFor={`att-${row.id}`} className="sr-only">
                  Attendance
                </label>
                <select id={`att-${row.id}`} name="status" defaultValue={row.attendanceStatus} className={inputClass}>
                  {ATTENDANCE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button className={buttonClass}>Save</button>
              </form>
              {row.reviewStatus === "needs_review" && (
                <form action={markReviewed}>
                  <Hidden token={token} q={q} />
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="kind" value="sunday_class" />
                  <button className={`${inputClass} font-semibold`}>Mark reviewed</button>
                </form>
              )}
            </div>
          </li>
        ))}
      </Section>

      <Section title={`Diagnostics (${results.diagnostic.length})`}>
        {results.diagnostic.map((row) => (
          <li key={row.id} className="flex flex-col gap-2 border-b border-border py-3">
            <p className="text-sm">
              <span className="font-semibold">{row.studentName || "Student not named"}</span> · requested {row.createdAt}
              {row.preferredDate ? ` · prefers ${row.preferredDate}` : ""} · #{row.id}
            </p>
            <p className="break-all text-sm text-subtle">
              {row.parentName} · {row.parentEmail} · {row.parentPhone}
            </p>
            {row.reviewStatus === "needs_review" && <ReviewFlag reason={row.reviewReason} />}
            <div className="flex flex-wrap gap-2">
              <form action={updateAssessment} className="flex gap-2">
                <Hidden token={token} q={q} />
                <input type="hidden" name="id" value={row.id} />
                <label htmlFor={`diag-${row.id}`} className="sr-only">
                  Assessment status
                </label>
                <select id={`diag-${row.id}`} name="status" defaultValue={row.assessmentStatus} className={inputClass}>
                  {ASSESSMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button className={buttonClass}>Save</button>
              </form>
              {row.reviewStatus === "needs_review" && (
                <form action={markReviewed}>
                  <Hidden token={token} q={q} />
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="kind" value="diagnostic" />
                  <button className={`${inputClass} font-semibold`}>Mark reviewed</button>
                </form>
              )}
            </div>
          </li>
        ))}
      </Section>

      <Section title={`Active exceptions (${results.exceptions.length})`}>
        {results.exceptions.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3">
            <p className="text-sm">
              <span className="font-semibold">{row.studentName}</span> · {row.parentEmail} · +{row.extraAllowance}{" "}
              {row.kind === "sunday_class" ? "Sunday class" : "diagnostic"} · {row.reason} · {row.createdAt}
            </p>
            <form action={removeException}>
              <Hidden token={token} q={q} />
              <input type="hidden" name="id" value={row.id} />
              <button className={`${inputClass} font-semibold`}>Revoke</button>
            </form>
          </li>
        ))}
      </Section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl font-semibold">Grant an exception</h2>
        <form action={addException} className="grid gap-3 sm:grid-cols-2">
          <Hidden token={token} q={q} />
          <Field label="Type">
            <select name="kind" className={inputClass} defaultValue="sunday_class">
              <option value="sunday_class">Sunday class</option>
              <option value="diagnostic">Diagnostic</option>
            </select>
          </Field>
          <Field label="Extra free uses">
            <input name="extraAllowance" type="number" min={1} max={10} defaultValue={1} required className={inputClass} />
          </Field>
          <Field label="Student name">
            <input name="studentName" required maxLength={100} className={inputClass} />
          </Field>
          <Field label="Parent email">
            <input name="parentEmail" type="email" required maxLength={200} className={inputClass} />
          </Field>
          <Field label="Parent phone (optional)">
            <input name="parentPhone" type="tel" maxLength={30} className={inputClass} />
          </Field>
          <Field label="Reason">
            <input name="reason" required maxLength={500} className={inputClass} />
          </Field>
          <button className={`${buttonClass} sm:col-span-2`}>Grant exception</button>
        </form>
      </section>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <h1 className="font-serif text-2xl font-semibold text-balance">Free class &amp; diagnostic records</h1>
        {children}
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      <ul className="flex flex-col">{children}</ul>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  )
}

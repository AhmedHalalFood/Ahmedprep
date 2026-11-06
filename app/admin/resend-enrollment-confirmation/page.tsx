import type { Metadata } from "next"
import { verifyLeadResendToken } from "@/lib/admin-links"
import { selectionLabel } from "@/lib/enrollment-2027-inquiry"
import { getLead } from "@/lib/lead-storage"
import { describeDbError } from "@/lib/sunday-registrations"
import { LeadResendForm } from "./resend-form"
import { storedInquiry } from "./stored-inquiry"

export const metadata: Metadata = {
  title: "Resend Enrollment Confirmation | AhmedPrep",
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ""

export default async function ResendEnrollmentConfirmationPage({ searchParams }: Props) {
  const params = await searchParams
  const id = first(params.id)
  const exp = first(params.exp)
  const sig = first(params.sig)

  const leadId = verifyLeadResendToken(id, exp, sig)
  let inquiry: ReturnType<typeof storedInquiry> = null
  let dbError = false
  if (leadId) {
    try {
      inquiry = storedInquiry(await getLead(leadId))
    } catch (error) {
      dbError = true
      console.error("[enrollment-resend] Could not load inquiry:", describeDbError(error))
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-6 border border-border bg-background p-6 text-ink shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-balance text-navy">Resend enrollment inquiry confirmation</h1>
        {dbError ? (
          <p className="leading-relaxed text-subtle">The inquiry database is unavailable right now. Please try this link again in a few minutes.</p>
        ) : !inquiry ? (
          <p className="leading-relaxed text-subtle">This link is invalid, has expired, or the inquiry no longer exists.</p>
        ) : (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-subtle">Student</dt>
              <dd>{inquiry.fields.studentName}</dd>
              <dt className="text-subtle">Parent</dt>
              <dd className="break-all">{inquiry.fields.email}</dd>
              <dt className="text-subtle">Cohort</dt>
              <dd>{selectionLabel(inquiry.selection)}</dd>
              <dt className="text-subtle">Last status</dt>
              <dd>
                {inquiry.confirmationStatus}
                {inquiry.confirmationError ? ` (${inquiry.confirmationError})` : ""}
              </dd>
            </dl>
            <LeadResendForm id={id} exp={exp} sig={sig} />
          </>
        )}
      </div>
    </main>
  )
}

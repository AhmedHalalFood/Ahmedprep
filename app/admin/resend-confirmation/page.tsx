import type { Metadata } from "next"
import { verifyResendToken } from "@/lib/admin-links"
import { CLASS_TYPES, getSessionByDate, type RsvpProgram } from "@/lib/free-class"
import { describeDbError, getRegistration } from "@/lib/sunday-registrations"
import { ResendForm } from "./resend-form"

export const metadata: Metadata = {
  title: "Resend Class Confirmation | AhmedPrep",
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ""

export default async function ResendConfirmationPage({ searchParams }: Props) {
  const params = await searchParams
  const id = first(params.id)
  const exp = first(params.exp)
  const sig = first(params.sig)

  const registrationId = verifyResendToken(id, exp, sig)
  let registration: Awaited<ReturnType<typeof getRegistration>> | null = null
  let dbError = false
  if (registrationId) {
    try {
      registration = await getRegistration(registrationId)
    } catch (error) {
      dbError = true
      console.error("[confirmation-resend] Could not load registration:", describeDbError(error))
    }
  }
  const session = registration ? getSessionByDate(registration.classDate, registration.program) : undefined

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-balance">Resend class confirmation</h1>
        {dbError ? (
          <p className="leading-relaxed text-muted-foreground">
            The registration database is unavailable right now. Please try this link again in a few minutes.
          </p>
        ) : !registration || !session ? (
          <p className="leading-relaxed text-muted-foreground">
            This link is invalid, has expired, or the registration no longer exists.
          </p>
        ) : (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Student</dt>
              <dd>{registration.studentName}</dd>
              <dt className="text-muted-foreground">Parent</dt>
              <dd className="break-all">{registration.parentEmail}</dd>
              <dt className="text-muted-foreground">Program</dt>
              <dd>{CLASS_TYPES[registration.program as RsvpProgram]?.label ?? registration.program}</dd>
              <dt className="text-muted-foreground">Class</dt>
              <dd>{session.label}, {session.timeLabel.replace(" ET", " Eastern")}</dd>
              <dt className="text-muted-foreground">Last status</dt>
              <dd className="capitalize">{registration.confirmationStatus ?? "unknown"}</dd>
            </dl>
            <ResendForm id={id} exp={exp} sig={sig} />
          </>
        )}
      </div>
    </main>
  )
}

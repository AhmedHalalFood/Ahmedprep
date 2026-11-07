"use client"

import { useActionState } from "react"
import { resendEnrollmentConfirmation, type LeadResendState } from "./actions"

const initial: LeadResendState = { status: "idle", message: "" }

export function LeadResendForm({ id, exp, sig }: { id: string; exp: string; sig: string }) {
  const [state, action, pending] = useActionState(resendEnrollmentConfirmation, initial)
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="exp" value={exp} />
      <input type="hidden" name="sig" value={sig} />
      <button
        type="submit"
        disabled={pending || state.status === "sent"}
        className="inline-flex min-h-11 items-center justify-center bg-navy px-5 font-semibold text-primary-foreground transition-colors hover:bg-academic disabled:opacity-60"
      >
        {pending ? "Sending…" : state.status === "sent" ? "Sent" : "Resend confirmation email"}
      </button>
      {state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className="text-sm leading-relaxed text-ink">
          {state.message}
        </p>
      )}
    </form>
  )
}

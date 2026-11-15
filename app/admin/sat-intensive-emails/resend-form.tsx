"use client"

import { useActionState } from "react"
import { resendIntensiveEmail, type IntensiveResendState } from "./actions"

const initial: IntensiveResendState = { status: "idle", message: "" }

export function IntensiveResendForm(props: { id: string; exp: string; sig: string; kind: string; label: string; disabled: boolean }) {
  const [state, action, pending] = useActionState(resendIntensiveEmail, initial)
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={props.id} />
      <input type="hidden" name="exp" value={props.exp} />
      <input type="hidden" name="sig" value={props.sig} />
      <input type="hidden" name="kind" value={props.kind} />
      <button
        type="submit"
        disabled={props.disabled || pending || state.status === "queued"}
        className="inline-flex min-h-11 items-center justify-center bg-navy px-5 font-semibold text-primary-foreground transition-colors hover:bg-academic disabled:opacity-60"
      >
        {pending ? "Queuing…" : state.status === "queued" ? "Queued" : props.label}
      </button>
      {state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className="text-sm leading-relaxed text-ink">
          {state.message}
        </p>
      )}
    </form>
  )
}

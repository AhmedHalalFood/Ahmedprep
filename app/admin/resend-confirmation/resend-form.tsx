"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { resendConfirmation, type ResendState } from "./actions"

const INITIAL: ResendState = { status: "idle", message: "" }

export function ResendForm({ id, exp, sig }: { id: string; exp: string; sig: string }) {
  const [state, action, pending] = useActionState(resendConfirmation, INITIAL)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="exp" value={exp} />
      <input type="hidden" name="sig" value={sig} />
      <Button type="submit" size="lg" disabled={pending || state.status === "sent"}>
        {pending ? "Sending…" : state.status === "sent" ? "Confirmation sent" : "Resend confirmation email"}
      </Button>
      <p
        role="status"
        aria-live="polite"
        className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
      >
        {state.message}
      </p>
    </form>
  )
}

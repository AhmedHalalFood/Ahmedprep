"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { RSVP_MESSAGES } from "@/lib/rsvp-response"

type State = { kind: "idle" | "sending" } | { kind: "done" | "error"; message: string }

/** Asks the server to resend the confirmation for the registration this browser just submitted. */
export function ResendConfirmationButton({ token, label = "Resend confirmation and Zoom details" }: { token: string; label?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" })

  async function resend() {
    setState({ kind: "sending" })
    try {
      const response = await fetch("/api/free-sunday-class/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const body = (await response.json().catch(() => null)) as { message?: string } | null
      const message = body?.message || (response.ok ? RSVP_MESSAGES.resendAccepted : RSVP_MESSAGES.resendFailed)
      setState({ kind: response.ok ? "done" : "error", message })
    } catch {
      setState({ kind: "error", message: RSVP_MESSAGES.resendFailed })
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {state.kind !== "done" && (
        <button
          type="button"
          onClick={resend}
          disabled={state.kind === "sending"}
          className="inline-flex items-center gap-2 border border-navy px-3 py-2 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white disabled:cursor-wait disabled:opacity-60"
        >
          <Mail size={16} aria-hidden="true" />
          {state.kind === "sending" ? "Sending\u2026" : label}
        </button>
      )}
      <p role="status" aria-live="polite" className={state.kind === "error" ? "text-sm text-error" : "text-sm text-navy"}>
        {state.kind === "done" || state.kind === "error" ? state.message : ""}
      </p>
    </div>
  )
}

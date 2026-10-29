"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"

type Status = "idle" | "submitting" | "success" | "error"
type Errors<T> = Partial<Record<keyof T, string>>

/** Empty when unavailable (non-secure context); the server then dedupes on the submitted content alone. */
export function newSubmissionId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : ""
}

export function useLeadForm<T extends Record<string, string>>({
  endpoint,
  initial,
  validate,
  onStart,
  onSuccess,
}: {
  endpoint: string
  initial: T
  validate: (data: T) => Errors<T>
  onStart?: () => void
  onSuccess?: (data: T) => void
}) {
  const [data, setData] = useState<T>(initial)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [status, setStatus] = useState<Status>("idle")
  const [serverResult, setServerResult] = useState<Record<string, unknown> | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const startedAtRef = useRef(0)
  const touchedRef = useRef(false)
  const submissionIdRef = useRef("")

  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  const update = (key: keyof T, value: string) => {
    if (!touchedRef.current) {
      touchedRef.current = true
      onStart?.()
    }
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "submitting") return

    const nextErrors = validate(data)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors).find((k) => nextErrors[k as keyof T])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus("submitting")
    // Kept across failed attempts so a retry is recognised as the same submission; cleared after success.
    submissionIdRef.current ||= newSubmissionId()
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          submissionId: submissionIdRef.current,
          website: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - startedAtRef.current,
        }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.success !== true) throw new Error("Delivery not confirmed")
      submissionIdRef.current = ""
      setServerResult(result)
      setStatus("success")
      onSuccess?.(data)
      setData(initial)
      startedAtRef.current = Date.now()
    } catch {
      setStatus("error")
    }
  }

  return { data, errors, status, serverResult, setStatus, update, submit, formRef, honeypotRef }
}

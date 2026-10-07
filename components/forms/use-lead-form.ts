"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"

type Status = "idle" | "submitting" | "success" | "error"
type Errors<T> = Partial<Record<keyof T, string>>

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
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const startedAtRef = useRef(0)
  const touchedRef = useRef(false)

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
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - startedAtRef.current,
        }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.success !== true) throw new Error("Delivery not confirmed")
      setStatus("success")
      onSuccess?.(data)
      setData(initial)
      startedAtRef.current = Date.now()
    } catch {
      setStatus("error")
    }
  }

  return { data, errors, status, setStatus, update, submit, formRef, honeypotRef }
}

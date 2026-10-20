"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "../actions"

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null)
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      {state && !state.ok && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="bg-navy text-primary-foreground hover:bg-academic">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}

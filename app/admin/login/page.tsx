import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { isAdminConfigured, isAdminSession } from "@/lib/admin-auth"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Admin sign in | AhmedPrep",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/admin/classes")

  return (
    <main className="flex min-h-svh items-center justify-center bg-brand-soft px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6 border border-line border-t-4 border-t-gold bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="eyebrow blue">AhmedPrep admin</p>
          <h1 className="text-balance text-2xl font-extrabold text-navy">Sign in</h1>
          <p className="text-sm leading-relaxed text-ink">Manage Sunday class Zoom links and reminder emails.</p>
        </div>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <p role="alert" className="text-sm leading-relaxed text-ink">
            The admin dashboard is not configured. Set ADMIN_PASSWORD (12+ characters) and ADMIN_SESSION_SECRET (32+ characters) in Vercel.
          </p>
        )}
      </div>
    </main>
  )
}

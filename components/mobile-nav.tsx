"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Menu } from "lucide-react"

// The drawer (Radix Dialog, focus trap, scroll lock) is only needed once the menu is opened,
// so it is fetched on the visitor's first interaction instead of during initial page load.
const loadSheet = () => import("@/components/mobile-nav-sheet")
const MobileNavSheet = dynamic(loadSheet, { ssr: false })

const PRELOAD_EVENTS = ["pointerdown", "touchstart", "keydown", "scroll"] as const

export function MobileNav() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const preload = () => {
      void loadSheet()
      PRELOAD_EVENTS.forEach((type) => window.removeEventListener(type, preload))
    }
    PRELOAD_EVENTS.forEach((type) => window.addEventListener(type, preload, { passive: true, once: true }))
    return () => PRELOAD_EVENTS.forEach((type) => window.removeEventListener(type, preload))
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu-trigger"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={mounted ? "mobile-nav-sheet" : undefined}
        onFocus={() => void loadSheet()}
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
      >
        <Menu size={24} aria-hidden="true" />
      </button>
      {mounted && (
        <MobileNavSheet
          open={open}
          onOpenChange={setOpen}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            triggerRef.current?.focus()
          }}
        />
      )}
    </>
  )
}

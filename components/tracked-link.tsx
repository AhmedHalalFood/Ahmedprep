"use client"

import Link from "next/link"
import type { ComponentProps, MouseEvent } from "react"
import { trackEvent, type EventName, type EventProps } from "@/lib/analytics"

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string
  event: EventName
  eventProps?: EventProps
}

const RAW_HREF = /^(tel:|sms:|mailto:|https?:)/

export function TrackedLink({ href, event, eventProps, onClick, children, ...rest }: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(event, { ...eventProps, href })
    onClick?.(e)
  }

  if (RAW_HREF.test(href)) {
    return (
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}

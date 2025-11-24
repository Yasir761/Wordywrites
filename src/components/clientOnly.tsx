"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useMounted } from "@/lib/use-mouted"

type ClientOnlyProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export default function ClientOnly({
  children,
  fallback = null,
  className,
}: ClientOnlyProps) {
  const mounted = useMounted()

  if (!mounted) return <>{fallback}</>

  return (
    <div
      data-slot="client-only"
      className={cn(
        "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
        className
      )}
    >
      {children}
    </div>
  )
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Skeleton = ({
  className,
  rounded = "md",
  ...props
}: React.ComponentProps<"div"> & {
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full"
}) => {
  const radius = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  }[rounded]

  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden bg-muted/50",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        radius,
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

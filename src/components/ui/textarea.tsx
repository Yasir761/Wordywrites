"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base size + spacing
        "flex min-h-24 w-full rounded-xl px-4 py-3 resize-none",
        // Frosted glass surface
        "bg-white/5 backdrop-blur-md border border-white/10",
        // Typography
        "text-off-white placeholder:text-grey-500 text-[15px] leading-relaxed",
        // Focus interaction
        "transition-all duration-300",
        "focus-visible:bg-white/10 focus-visible:border-white/20",
        "focus-visible:ring-[2px] focus-visible:ring-white/30",
        // Error + disabled handling
        "aria-invalid:border-red-500/60 aria-invalid:ring-red-500/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// PREMIUM Toggle Variants
const toggleVariants = cva(
  `
  inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap select-none
  outline-none transition-all duration-200 ease-in-out
  disabled:pointer-events-none disabled:opacity-50
  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
  hover:bg-white/10 hover:text-white
  focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0
  data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-600 data-[state=on]:to-cyan-500
  data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:scale-[1.04]
  `,
  {
    variants: {
      variant: {
        default: "bg-white/5 text-gray-400 backdrop-blur-md border border-white/10",
        outline:
          "border border-white/15 bg-transparent hover:border-white/25",
      },
      size: {
        default: "h-9 px-3 text-sm",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Component
function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }

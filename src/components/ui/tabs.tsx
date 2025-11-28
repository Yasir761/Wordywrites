"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center gap-1",
        "rounded-xl border border-white/10 bg-white/5 backdrop-blur-md",
        "p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative px-4 py-2 text-sm font-medium whitespace-nowrap",
        "text-gray-400 transition-all duration-200",
        "rounded-lg",
        "hover:text-gray-200 hover:bg-white/5",
        "data-[state=active]:text-off-white data-[state=active]:shadow-md",
        "data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-xl",
        "focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-white/20",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 rounded-xl border border-white/10",
        "bg-white/5 backdrop-blur-xl p-5",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]",
        "transition-all duration-300",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

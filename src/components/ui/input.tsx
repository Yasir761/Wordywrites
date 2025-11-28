"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
        w-full h-10
        px-3 py-2
        rounded-xl
        border border-border
        bg-transparent
        text-sm font-medium tracking-tight
        placeholder:text-muted-foreground
        text-foreground
        
        transition-all duration-200 ease-out
        outline-none

        hover:border-ai-accent/30
        hover:bg-white/5

        focus-visible:border-ai-accent
        focus-visible:ring-2 focus-visible:ring-ai-accent/30
        focus-visible:bg-ai-accent-dim
        
        disabled:opacity-40 disabled:cursor-not-allowed
        aria-invalid:border-red-500 aria-invalid:ring-red-500/20
        file:bg-transparent file:border-0 file:text-sm file:font-medium
      `,
        className
      )}
      {...props}
    />
  );
}

export { Input };

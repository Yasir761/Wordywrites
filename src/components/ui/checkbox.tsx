"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
        peer
        size-4 shrink-0
        rounded-[6px]
        border border-border
        bg-background
        transition-all duration-150
        hover:border-ai-accent/40
        focus-visible:ring-2 focus-visible:ring-ai-accent/40 focus-visible:ring-offset-1
        data-[state=checked]:border-ai-accent data-[state=checked]:bg-ai-accent/15
        dark:data-[state=checked]:bg-ai-accent/20
        disabled:opacity-40 disabled:cursor-not-allowed
      `,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="
          flex items-center justify-center
          text-ai-accent
          transition-transform duration-200 scale-100
        "
      >
        <CheckIcon className="size-3 stroke-[2]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };

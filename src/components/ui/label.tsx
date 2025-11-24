"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        `
        text-[13px] font-medium tracking-wide
        text-foreground/90
        select-none
        flex items-center gap-1.5
        transition-colors duration-200 ease-out

        peer-focus-visible:text-ai-accent
        hover:text-foreground

        peer-disabled:opacity-40 peer-disabled:cursor-not-allowed
        group-data-[disabled=true]:opacity-40 group-data-[disabled=true]:pointer-events-none
      `,
        className
      )}
      {...props}
    />
  );
}

export { Label };

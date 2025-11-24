"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  `
  inline-flex items-center justify-center gap-1
  px-2.5 py-0.5 rounded-md
  text-[11px] font-heading font-medium tracking-wide uppercase
  border transition-all duration-200
  w-fit shrink-0 whitespace-nowrap
  `,
  {
    variants: {
      variant: {
        default: `
          bg-ai-accent/10 text-ai-accent border-ai-accent/40
        `,
        secondary: `
          bg-muted text-muted-foreground border-border
        `,
        outline: `
          bg-transparent text-foreground border-border
          hover:bg-muted/40
        `,
        subtle: `
          bg-secondary text-muted-foreground border-border
        `,
        destructive: `
          bg-red-500/10 text-red-400 border-red-500/30
        `,
        success: `
          bg-green-500/10 text-green-400 border-green-500/30
        `,
      },
      size: {
        sm: "px-2 py-[2px] text-[10px]",
        md: "px-2.5 py-0.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

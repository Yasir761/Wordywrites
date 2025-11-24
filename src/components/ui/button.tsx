"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
  inline-flex items-center justify-center gap-2 shrink-0
  whitespace-nowrap rounded-lg
  text-sm font-heading font-medium tracking-tight
  transition-all duration-200
  disabled:pointer-events-none disabled:opacity-40
  outline-none focus-visible:ring-2 focus-visible:ring-ai-accent focus-visible:ring-offset-2
  [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-ai-accent text-white
          hover:bg-ai-accent/90
        `,
        secondary: `
          bg-secondary text-foreground
          hover:bg-secondary/70
        `,
        outline: `
          border border-border bg-transparent
          hover:border-ai-accent hover:text-ai-accent
        `,
        ghost: `
          bg-transparent text-muted-foreground
          hover:bg-muted/30 hover:text-foreground
        `,
        subtle: `
          bg-muted text-muted-foreground
          hover:bg-muted/60
        `,
        destructive: `
          bg-red-500/15 border border-red-500/25 text-red-400
          hover:bg-red-500/25
        `,
        link: `
          text-ai-accent underline-offset-4 hover:underline
          font-normal
        `,
      },
      size: {
        default: `
          h-9 px-4
        `,
        sm: `
          h-8 px-3 text-xs
        `,
        lg: `
          h-11 px-6 text-base
        `,
        icon: `
          h-9 w-9 p-0 flex items-center justify-center
        `,
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };

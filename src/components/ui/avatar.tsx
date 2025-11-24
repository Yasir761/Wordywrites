"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        `
        relative flex h-9 w-9 shrink-0 overflow-hidden rounded-lg
        border border-border bg-secondary
        transition-all
        hover:ring-2 hover:ring-ai-accent hover:ring-offset-2 hover:ring-offset-background
      `,
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        `
        h-full w-full object-cover object-center
        transition-opacity duration-200
      `,
        className
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        `
        flex h-full w-full items-center justify-center
        rounded-lg bg-muted text-muted-foreground
        font-heading font-medium text-xs tracking-wide uppercase
      `,
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };

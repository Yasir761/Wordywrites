"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max items-center justify-center",
        "px-2",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "flex list-none items-center justify-center gap-2",
        "text-sm font-medium tracking-wide",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  `
  inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
  text-sm font-medium tracking-wide transition-all duration-200
  bg-transparent text-foreground/90
  hover:text-ai-accent hover:bg-muted/30
  focus-visible:ring-2 focus-visible:ring-ai-accent focus-visible:ring-offset-2
  data-[state=open]:text-ai-accent
  data-[state=open]:bg-ai-accent/10
  disabled:opacity-50 disabled:pointer-events-none
  `
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="ml-1 size-4 transition-transform duration-300 group-data-[state=open]/navigation-menu:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        `
        z-50 md:absolute left-0 top-full
        rounded-xl p-3 mt-3
        bg-white/70 dark:bg-charcoal/80 backdrop-blur-xl
        border border-white/20 shadow-xl
        animate-in fade-in-0 zoom-in-95 slide-in-from-top-2
        data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0 data-[motion^=to-]:zoom-out-90
        `,
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          `
          relative w-full md:w-[var(--radix-navigation-menu-viewport-width)]
          h-[var(--radix-navigation-menu-viewport-height)]
          rounded-xl border border-white/20
          bg-white/80 dark:bg-charcoal/90 backdrop-blur-xl
          shadow-xl transition-all duration-300
          data-[state=open]:animate-in data-[state=open]:zoom-in-90
          data-[state=closed]:animate-out data-[state=closed]:zoom-out-95
        `,
          className
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        `
        block rounded-md p-3 text-sm tracking-wide
        transition-all duration-200
        text-foreground/90 hover:text-ai-accent
        hover:bg-ai-accent/10
        focus-visible:ring-2 focus-visible:ring-ai-accent
        `,
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[2] flex h-3 items-end justify-center transition-all",
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
        className
      )}
      {...props}
    >
      <div className="h-2 w-2 rotate-45 bg-ai-accent/60 shadow-md rounded-sm" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};

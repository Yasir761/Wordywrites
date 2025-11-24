"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

function Drawer(props: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger(props: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose(props: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        `
        fixed inset-0 z-50
        bg-black/60
        backdrop-blur-[2px]
        transition-all duration-200
        data-[state=open]:fade-in data-[state=closed]:fade-out
      `,
        className
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          `
          fixed z-50 flex flex-col
          bg-card border border-border
          rounded-xl
          shadow-xl
          transition-all duration-200 ease-out
          animate-in slide-in-from-bottom
          data-[vaul-drawer-direction=right]:animate-in data-[vaul-drawer-direction=right]:slide-in-from-right
          data-[vaul-drawer-direction=left]:animate-in data-[vaul-drawer-direction=left]:slide-in-from-left

          // positioning
          data-[vaul-drawer-direction=bottom]:bottom-0 inset-x-0 max-h-[85vh]
          data-[vaul-drawer-direction=bottom]:rounded-t-xl

          data-[vaul-drawer-direction=right]:right-0 inset-y-0 w-[420px] max-w-[85vw]
          data-[vaul-drawer-direction=left]:left-0 inset-y-0 w-[420px] max-w-[85vw]
        `,
          className
        )}
        {...props}
      >
        {/* Handle Drag Strip for bottom drawer */}
        <div className="hidden group-data-[vaul-drawer-direction=bottom]:block mx-auto mt-3 h-1.5 w-[90px] rounded-full bg-muted" />

        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("px-5 pt-5 pb-2 flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-3 px-5 py-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading text-lg font-semibold text-foreground tracking-tight", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground font-editor leading-relaxed", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

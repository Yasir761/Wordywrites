"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Root
function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

// Trigger
function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

// Portal
function DropdownMenuPortal(props: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

// Content
function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        data-slot="dropdown-menu-content"
        className={cn(
          `
          z-50 min-w-[10rem]
          rounded-xl border border-white/20
          bg-white/80 dark:bg-black/70
          backdrop-blur-xl shadow-xl
          p-1.5
          animate-in fade-in zoom-in-95
          data-[state=closed]:fade-out data-[state=closed]:zoom-out-95
          text-sm font-medium tracking-wide
        `,
          className
        )}
        {...props}
      />
    </DropdownMenuPortal>
  );
}

// Group
function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

// Item
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        `
        flex items-center gap-2
        rounded-md px-3 py-2 select-none outline-none cursor-pointer
        transition-colors
        text-gray-800 dark:text-gray-200
        hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20
        focus:bg-gradient-to-r focus:from-purple-600/30 focus:to-cyan-600/30
        focus:text-foreground
        data-[disabled]:opacity-50 data-[disabled]:pointer-events-none
        data-[variant=destructive]:text-red-600
        data-[variant=destructive]:focus:bg-red-600/10
        [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
        `,
        inset && "pl-10",
        className
      )}
      {...props}
    />
  );
}

// Checkbox Item
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        `
        relative flex items-center gap-2
        rounded-md py-2 pr-3 pl-10 cursor-pointer
        hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20
        focus:bg-gradient-to-r focus:from-purple-600/30 focus:to-cyan-600/30
        outline-none
        `,
        className
      )}
      {...props}
    >
      <span className="absolute left-3 flex items-center justify-center size-4">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

// Radio Group
function DropdownMenuRadioGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

// Radio Item
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        `
        relative flex items-center gap-2
        rounded-md py-2 pr-3 pl-10 cursor-pointer
        hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20
        focus:bg-gradient-to-r focus:from-purple-600/30 focus:to-cyan-600/30
        outline-none
        `,
        className
      )}
      {...props}
    >
      <span className="absolute left-3 flex items-center justify-center size-3.5">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-3 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

// Label
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-3 py-1.5 text-xs tracking-wide text-gray-500 uppercase",
        inset && "pl-10",
        className
      )}
      {...props}
    />
  );
}

// Separator
function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={cn("h-px my-2 bg-border", className)} {...props} />;
}

// Shortcut
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("ml-auto text-[10px] tracking-widest text-gray-500", className)} {...props} />
  );
}

// Sub Menu
function DropdownMenuSub(props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        `
        flex items-center gap-2 px-3 py-2 text-sm rounded-md
        hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20
        focus:bg-gradient-to-r focus:from-purple-600/30 focus:to-cyan-600/30
        cursor-pointer
      `,
        inset && "pl-10",
        className
      )}
      {...props}
    >
      {props.children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        `
        min-w-[10rem] rounded-xl border border-white/20
        bg-white/80 dark:bg-black/70
        backdrop-blur-xl shadow-xl p-1.5
        animate-in fade-in zoom-in-95 slide-in-from-left-2
      `,
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};

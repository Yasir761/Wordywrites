"use client"

import { type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "group transition-all duration-300 rounded-md px-2",
                    isActive && "bg-accent text-accent-foreground shadow-sm"
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 px-2 py-2"
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          "size-4 transition-all duration-300",
                          isActive
                            ? "text-accent-foreground scale-110"
                            : "text-muted-foreground"
                        )}
                      />
                    )}

                    <span
                      className={cn(
                        "text-sm font-medium transition-all duration-300",
                        isActive
                          ? "text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

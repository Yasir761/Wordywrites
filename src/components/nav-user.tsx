




"use client"

import { SignOutButton } from "@clerk/nextjs"
import {
  IconDotsVertical,
  IconLogout2,
  IconMessage,
  IconId,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                group relative rounded-lg px-2 py-2
                transition-all duration-300
                hover:bg-ai-accent-dim/40 hover:text-ai-accent
                data-[state=open]:bg-ai-accent/20
                data-[state=open]:text-ai-accent
                data-[state=open]:shadow-[0_0_12px_-4px_var(--ai-accent)]
              "
            >
              <Avatar className="h-8 w-8 rounded-md ring-2 ring-border group-hover:ring-ai-accent transition">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-md">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>

              <IconDotsVertical
                className="
                  ml-auto size-4 text-muted-foreground nav-icon transition
                  group-data-[state=open]:text-ai-accent
                  group-data-[state=open]:drop-shadow-[0_0_6px_var(--ai-accent)]
                  group-data-[state=open]:scale-110
                "
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="
              min-w-[230px] rounded-xl
              border border-border/60
              bg-card/75 backdrop-blur-xl
              shadow-[0_0_25px_-12px_var(--ai-accent)]
              animate-in fade-in-80 zoom-in-90
            "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-9 w-9 rounded-md ring-2 ring-border">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-border/60" />

            {/* Blog Profile */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                data-active={pathname === "/dashboard/blog-profile"}
                className="
                  flex items-center gap-3 w-full px-2 py-2 rounded-lg
                  transition-colors duration-200 text-[14px] font-medium tracking-tight text-muted-foreground

                  hover:bg-ai-accent-dim/40 hover:text-ai-accent

                  data-[active=true]:bg-ai-accent/15
                  data-[active=true]:border data-[active=true]:border-ai-accent/40
                  data-[active=true]:text-ai-accent
                  data-[active=true]:shadow-[0_0_12px_-4px_var(--ai-accent)]
                "
              >
                <a href="/dashboard/blog-profile" className="flex items-center gap-3 w-full">
                  <IconId className="size-4" />
                  <span className="truncate">My Blog Profiles</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Contact */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="
                  flex items-center gap-3 w-full px-2 py-2 rounded-lg
                  transition-colors duration-200 text-[14px] font-medium tracking-tight text-muted-foreground
                  hover:bg-ai-accent-dim/40 hover:text-ai-accent
                "
              >
                <a href="/contact" className="flex items-center gap-3 w-full">
                  <IconMessage className="size-4" />
                  <span className="truncate">Contact Support</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-border/60" />

            {/* Logout */}
            <SignOutButton>
              <DropdownMenuItem
                className="
                  font-medium text-red-500
                  hover:bg-red-500/10 hover:text-red-600
                  transition
                "
              >
                <IconLogout2 className="size-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

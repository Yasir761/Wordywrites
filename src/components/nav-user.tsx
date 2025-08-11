"use client"

import { useClerk } from "@clerk/nextjs"
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
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

import { SignOutButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { signOut } = useClerk()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-white/40 data-[state=open]:text-foreground transition-all duration-300 hover:bg-white/30 backdrop-blur-md rounded-lg"
            >
              <Avatar className="h-8 w-8 rounded-md ring-2 ring-purple-500/30 group-hover:ring-purple-500 transition-all duration-300">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-md">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {user.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-gray-400 group-hover:text-purple-500 transition" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-[220px] rounded-xl border border-white/10 shadow-xl backdrop-blur-md bg-white/70 animate-in fade-in zoom-in-95"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-9 w-9 rounded-md ring ring-purple-500/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none text-gray-800">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 leading-tight truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-gray-200" />

            {/* <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-purple-50/80 transition">
                <IconUserCircle className="size-4 mr-2 text-purple-500" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-purple-50/80 transition">
                <IconCreditCard className="size-4 mr-2 text-green-500" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-purple-50/80 transition">
                <IconNotification className="size-4 mr-2 text-cyan-500" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}

            <DropdownMenuSeparator className="bg-gray-200" />

            <SignOutButton>
              <DropdownMenuItem className="text-red-600 hover:bg-red-50 transition font-medium">
                <IconLogout className="size-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

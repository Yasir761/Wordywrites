"use client"

import {
  IconLayoutDashboard,
  IconEdit,
  IconNotebook,
  IconUpload,
  IconSearch,
} from "@tabler/icons-react"

import { useUser } from "@clerk/nextjs"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"

const sidebarConfig = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Generate Blog",
      url: "/dashboard/create",
      icon: IconEdit,
    },
    {
      title: "Your Blogs",
      url: "/dashboard/blogs",
      icon: IconNotebook,
    },
    {
      title: "Publish to wordpress",
      url: "/dashboard/wordpress",
      icon: IconUpload,
    },
    {
      title: "Crawl & Enhance",
      url: "/dashboard/crawl",
      icon: IconSearch,
    },
  ],
  // navFooter: [
  //   {
  //     title: "Help",
  //     url: "#",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Settings",
  //     url: "/dashboard/settings",
  //     icon: IconSettings,
  //   },
  // ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  const sidebarUser = {
    name: user?.fullName || "User",
    email: user?.emailAddresses[0]?.emailAddress || "",
    avatar: user?.imageUrl || "/avatars/default.jpg",
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-white/60 backdrop-blur-md border-r border-white/20 shadow-sm"
      {...props}
    >
      {/* Brand Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="!p-1.5 hover:bg-white/30 rounded-md transition"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                  Wordywrites
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <NavMain items={sidebarConfig.navMain} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/20 pt-3 mt-4">
        <SidebarMenu>
          {/* {sidebarConfig.navFooter.map((item, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition"
                >
                  <item.icon className="size-4 text-purple-500 group-hover:text-purple-600 transition" />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))} */}
        </SidebarMenu>

        <div className="mt-4">
          <NavUser user={sidebarUser} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

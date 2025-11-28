


"use client";

import {
  IconGauge,
  IconSparkles,
  IconFiles,
  IconWorldUpload,
  IconSearch,
} from "@tabler/icons-react";


import { useUser } from "@clerk/nextjs";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";

const sidebarConfig = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconGauge },
    { title: "Generate Blog", url: "/dashboard/create", icon: IconSparkles },
    { title: "Your Blogs", url: "/dashboard/blogs", icon: IconFiles  },
    { title: "Publish to WordPress", url: "/dashboard/wordpress", icon: IconWorldUpload },
    { title: "Crawl & Enhance", url: "/dashboard/crawl", icon: IconSearch },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const sidebarUser = {
    name: user?.fullName || "Writer",
    email: user?.emailAddresses[0]?.emailAddress || "",
    avatar: user?.imageUrl || "/avatars/default.jpg",
  };

  return (
    <Sidebar
     collapsible="offcanvas"
  {...props}
  className="
    bg-sidebar/70 backdrop-blur-xl
    border-r border-border/50
    shadow-[0_0_25px_-15px_rgba(0,0,0,0.45)]
    text-foreground
    transition-all
  "
    >
      {/* Header Branding */}
      <SidebarHeader className="px-4 pb-2 pt-6">
        <Link
          href="/dashboard"
          className="
            flex items-center gap-2 group
            text-xl font-heading tracking-tight
            transition-all
          "
        >
          <span className="
            bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent
            group-hover:opacity-80 transition
          ">
            WORDYWRITES
          </span>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 mt-4">
        <div  className="
     space-y-1
    [&_a]:flex [&_a]:items-center [&_a]:gap-3
    [&_a]:rounded-lg
    [&_a]:text-[14px] [&_a]:font-medium
    [&_a]:px-3 [&_a]:py-2
    [&_a]:transition-all [&_a]:duration-200

    /* Hover */
    [&_a:hover]:bg-ai-accent-dim/40
    [&_a:hover]:text-ai-accent

    /* Active row */
    [&_[data-active=true]]:bg-ai-accent/15
    [&_[data-active=true]]:border [&_[data-active=true]]:border-ai-accent/40
    [&_[data-active=true]]:text-ai-accent
    [&_[data-active=true]]:shadow-[0_0_14px_-4px_var(--ai-accent)]

    /* Active icon only (glow + scale + accent) */
    [&_[data-active=true]_.nav-icon]:text-ai-accent
    [&_[data-active=true]_.nav-icon]:drop-shadow-[0_0_6px_var(--ai-accent)]
    [&_[data-active=true]_.nav-icon]:scale-110

    /* All icons base style */
    [&_svg]:text-muted-foreground
    [&_svg]:transition-all [&_svg]:duration-200
    [&_svg]:shrink-0
    ">
          <NavMain items={sidebarConfig.navMain} />
        </div>
      </SidebarContent>

      {/* Footer Profile */}
      <SidebarFooter className="border-t border-border mt-4 px-2 py-4">
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}

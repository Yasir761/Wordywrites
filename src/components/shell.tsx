// "use client"

// import { ReactNode } from "react"
// import { AppSidebar } from "@/components/app-sidebar"
// import { SiteHeader } from "@/components/site-header"
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
// import { cn } from "@/lib/utils"

// export function DashboardShell({ children }: { children: ReactNode }) {
//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "17rem",
//           "--sidebar-width-icon": "3.7rem",
//           "--header-height": "3.5rem",
//         } as React.CSSProperties
//       }
//       className="flex w-full min-h-screen"
//     >
//       {/* Sidebar */}
//       <AppSidebar collapsible="offcanvas" />

//       {/* Content + Top Header */}
//       <SidebarInset className="flex flex-col w-full">
//         <SiteHeader />

//         <main
//           className={cn(
//             "flex-1 relative p-6 min-h-screen",
//             "bg-white/80 backdrop-blur-lg",
//             "transition-all duration-300 ease-out"
//           )}
//         >
//           {children}
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }





"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "17rem",
          "--sidebar-width-icon": "3.7rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
      className="flex w-full min-h-screen bg-background"
    >
      {/* Sidebar */}
      <AppSidebar collapsible="offcanvas" />

      {/* Content + Top Header */}
      <SidebarInset className="flex flex-col w-full bg-background">
        <SiteHeader />

        <main
          className={cn(
            "flex-1 relative p-6 min-h-screen",
            "bg-background text-foreground",
            "dark:bg-background dark:text-foreground",
            "transition-all duration-300 ease-out"
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
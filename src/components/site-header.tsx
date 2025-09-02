"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { motion } from "framer-motion"

export function SiteHeader() {
  const { user } = useUser()
  const firstName = user?.firstName || "Creator"

  return (
    <header className="flex h-[--header-height] items-center bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left Section: Sidebar trigger */}
        <div className="flex items-center gap-3">
          <SidebarTrigger />
        </div>

        {/* Right Section: User tools */}
        <div className="flex items-center gap-3">
          {/* Greeting */}
          <motion.span
            className="hidden sm:block text-sm font-medium text-gray-600"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Hi, {firstName}
          </motion.span>

          {/* Notification Bell */}
          {/* <motion.button */}
            {/* whileTap={{ scale: 0.9 }} */}
            {/* whileHover={{ rotate: 5 }} */}
            {/* className="relative rounded-full p-2 hover:bg-gray-100 transition-colors" */}
          {/* > */}
            {/* <Bell className="h-5 w-5 text-gray-600" /> */}
            {/* Notification dot */}
            {/* <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" /> */}
          {/* </motion.button> */}

          {/* Contact (example action button) */}
          {/* <Button variant="ghost" size="sm">
            Contact
          </Button> */}

          {/* User Avatar (Clerk provides this automatically if used elsewhere) */}
          {/* Plan / Credits Badge can be added next to avatar */}
        </div>
      </div>
    </header>
  )
}

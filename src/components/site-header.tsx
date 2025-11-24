"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-accent transition"
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  )
}

export function SiteHeader() {
  const { user } = useUser()
  const firstName = user?.firstName || "Creator"

  return (
    <header
      className="
        sticky top-0 z-40
        flex items-center h-[--header-height]
        bg-white/60 backdrop-blur-xl
        border-b border-white/20
        shadow-[0_0_20px_-10px_rgba(0,0,0,0.15)]
        transition-all duration-300
      "
    >
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <SidebarTrigger className="hover:bg-gray-200/40 rounded-lg transition-all" />
          </motion.div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Greeting */}
          <motion.span
            className="hidden sm:block text-sm font-medium text-gray-600"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Hi, {firstName} <ThemeToggle />
          </motion.span>

          {/* Notifications (optional) */}
          {/* <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 5 }}
            className="relative rounded-full p-2 hover:bg-gray-200/40 transition"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </motion.button> */}

          {/* Example Extra Action */}
          {/* <Button size="sm" variant="ghost" className="rounded-lg">
            Contact
          </Button> */}
        </div>

      </div>
    </header>
  )
}

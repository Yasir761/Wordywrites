"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        flex items-center justify-center
        h-9 w-9 rounded-lg
        transition-all duration-300
        bg-secondary/40 border border-border/30 backdrop-blur-md
        hover:border-ai-accent/40 hover:text-ai-accent
        hover:shadow-[0_0_10px_-2px_var(--ai-accent)]
      "
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </motion.button>
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
        px-4 lg:px-6
        border-b border-border/60
        backdrop-blur-2xl
        bg-gradient-to-r from-background/80 via-background/60 to-background/80
        shadow-[0_0_30px_-12px_var(--ai-accent)]
      "
    >
      {/* Left */}
      <motion.div whileTap={{ scale: 0.92 }}>
        <SidebarTrigger className="
          rounded-lg p-2
          bg-secondary/30 border border-border/40
          hover:bg-ai-accent-dim/40 hover:border-ai-accent/40 hover:text-ai-accent
          transition-all duration-300
          shadow-[0_0_0_1px_var(--border)]
          hover:shadow-[0_0_10px_-4px_var(--ai-accent)]
        " />
      </motion.div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="
            hidden sm:block text-sm font-medium
            bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent
            tracking-tight
          "
        >
          Hi, {firstName}
        </motion.div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}

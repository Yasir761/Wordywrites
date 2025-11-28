

"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function BlogLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="
          relative w-[90%] max-w-md rounded-2xl px-9 py-10 text-center
          bg-card/80 backdrop-blur-xl border border-border/60
          shadow-[0_0_40px_-12px_var(--ai-accent)]
        "
      >
        {/* Accent glow outline */}
        <div className="absolute -inset-[1px] rounded-2xl bg-ai-accent/10 blur-xl pointer-events-none"></div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-4 w-10 h-10 flex items-center justify-center
            rounded-xl bg-ai-accent/15 border border-ai-accent/20 text-ai-accent"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Generating your blog…
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-1 text-[13px] text-muted-foreground"
        >
          AI agents are researching, outlining, writing & optimizing.
        </motion.p>

        {/* Loader ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="
            mt-8 mx-auto w-12 h-12 border-4 rounded-full
            border-border border-t-ai-accent
          "
        />

        {/* Soft pulse status text */}
        <motion.div
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-6 text-[11px] text-muted-foreground tracking-wide"
        >
          Crafting high-quality content…
        </motion.div>
      </motion.div>
    </div>
  )
}

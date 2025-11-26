"use client";
import { ReactNode } from "react";
import { DashboardShell } from "@/components/shell";
import { Space_Grotesk, IBM_Plex_Serif, Literata } from "next/font/google";
import { motion } from "framer-motion";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-literata",
  display: "swap",
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`
        relative min-h-screen w-full 
        bg-background text-foreground
        font-[family-name:var(--font-space-grotesk)]
        antialiased
        ${spaceGrotesk.variable} 
        ${ibmPlexSerif.variable} 
        ${literata.variable}
        bg-[radial-gradient(circle_at_50%_0%,_rgba(99,102,241,0.07),_transparent_60%)]
        after:absolute after:inset-0 after:bg-[url('/noise.svg')] after:opacity-[0.04] after:pointer-events-none
      `}
    >
      {/* Page subtle fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <DashboardShell>{children}</DashboardShell>
      </motion.div>
    </div>
  );
}

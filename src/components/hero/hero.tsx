"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  TrendingUp,
  PenLine,
  ClipboardCopy,
  Link as LucideLink,
  Repeat,
  Scan,
  Eye,
  Sparkles,
  SearchCheck,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Feature = {
  icon: React.ElementType
  label: string
  x: number
  y: number
  delay: number
}

const desktopFeatures: Feature[] = [
  { icon: TrendingUp, label: "Boost Rankings", x: 40, y: 40, delay: 0 },
  { icon: PenLine, label: "AI-Written Blogs", x: 360, y: 60, delay: 0.1 },
  { icon: ClipboardCopy, label: "Copy to Clipboard", x: 80, y: 340, delay: 0.2 },
  { icon: Eye, label: "Content Previews ", x: 390, y: 360, delay: 0.3 },
  { icon: SearchCheck, label: "Analyzer", x: 30, y: 200, delay: 0.4 },
  { icon: Scan, label: "Crawl & Enhance", x: 310, y: 10, delay: 0.5 },
  { icon: Repeat, label: "Auto Posting", x: 190, y: 420, delay: 0.6 },
]

const mobileFeatures: Feature[] = desktopFeatures.map((f, i) => ({
  ...f,
  x: 50,
  y: 40 + i * 60,
}))

const connections: [number, number][] = [
  [0, 1],
  [1, 4],
  [4, 5],
  [5, 2],
  [2, 3],
  [3, 6],
]

const buzzwords = [
  "Rank-Optimized",
  "AI-Powered",
  "Traffic-Boosting",
  "Effortless",
]

function AnimatedHeadline() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % buzzwords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.h1
      className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center md:text-left leading-tight mb-4"
      style={{ fontFamily: "var(--font-heading)" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      Create{" "}
      <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
        {buzzwords[index]}
      </span>{" "}
      Blogs That Actually Perform
    </motion.h1>
  )
}

function FeatureIcon({ icon: Icon, label, x, y, delay }: Feature) {
  return (
    <motion.div
      className="absolute bg-white/90 border border-gray-200 backdrop-blur-md shadow-xl rounded-xl px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-800 z-10"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 0 20px rgba(59,130,246,0.5)",
      }}
    >
      <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </motion.div>
  )
}

function generateCurvePath(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) / 2
  const dy = (y2 - y1) / 2
  const cx1 = x1 + dx + Math.random() * 40 - 20
  const cy1 = y1 + dy + Math.random() * 40 - 20
  return `M ${x1} ${y1} Q ${cx1} ${cy1}, ${x2} ${y2}`
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [paths, setPaths] = useState<string[]>([])

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      if (!mobile) {
        const generatedPaths = connections.map(([fromIdx, toIdx]) => {
          const from = desktopFeatures[fromIdx]
          const to = desktopFeatures[toIdx]
          return generateCurvePath(from.x + 80, from.y + 20, to.x + 80, to.y + 20)
        })
        setPaths(generatedPaths)
      }
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const features = isMobile ? mobileFeatures : desktopFeatures

  return (
    <main
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-30 scroll-mt-28"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 text-center md:text-left">
          <AnimatedHeadline />

          <motion.p
            className="text-gray-600 text-base sm:text-lg md:text-xl font-body max-w-xl mx-auto md:mx-0 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Go beyond generic AI writers. Wordywrites creates full blog drafts, refreshes old posts from just a URL, and publishes directly to WordPress — all in one click.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.4,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  className=" px-6 py-3 text-lg relative overflow-hidden border-2 border-transparent bg-white/80 backdrop-blur-sm  font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 hover:scale-105 hover:border-blue-400 shadow-md"
                >
                 Start Free
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Floating Features */}
        <motion.div
          className="relative h-[400px] sm:h-[520px] w-full md:w-[640px] mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {!isMobile && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="#d4d4d4"
                  strokeWidth="1.5"
                  fill="none"
                />
              ))}
            </svg>
          )}

          {features.map((feature, idx) => (
            <FeatureIcon key={idx} {...feature} />
          ))}
        </motion.div>
      </div>

      <motion.div
        className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2 cursor-pointer hover:text-blue-600 transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-col items-center mt-3 text-xs sm:text-sm text-gray-500 animate-bounce">
          <span className="mb-1">Scroll to see how it works</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-lg"
          >
            ↓
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}




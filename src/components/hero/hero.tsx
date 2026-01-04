// "use client"

// import { Button } from "@/components/ui/button"
// import { motion } from "framer-motion"
// import {
//   TrendingUp,
//   PenLine,
//   ClipboardCopy,
//   Link as LucideLink,
//   Repeat,
//   Scan,
//   Eye,
//   Sparkles,
//   SearchCheck,
// } from "lucide-react"
// import Link from "next/link"
// import { useEffect, useState } from "react"

// type Feature = {
//   icon: React.ElementType
//   label: string
//   x: number
//   y: number
//   delay: number
// }

// const desktopFeatures: Feature[] = [
//   { icon: TrendingUp, label: "Boost Rankings", x: 40, y: 40, delay: 0 },
//   { icon: PenLine, label: "AI-Written Blogs", x: 360, y: 60, delay: 0.1 },
//   { icon: ClipboardCopy, label: "Copy to Clipboard", x: 80, y: 340, delay: 0.2 },
//   { icon: Eye, label: "Content Previews ", x: 390, y: 360, delay: 0.3 },
//   { icon: SearchCheck, label: "Analyzer", x: 30, y: 200, delay: 0.4 },
//   { icon: Scan, label: "Crawl & Enhance", x: 310, y: 10, delay: 0.5 },
//   { icon: Repeat, label: "Auto Posting", x: 190, y: 420, delay: 0.6 },
// ]

// const mobileFeatures: Feature[] = desktopFeatures.map((f, i) => ({
//   ...f,
//   x: 50,
//   y: 40 + i * 60,
// }))

// const connections: [number, number][] = [
//   [0, 1],
//   [1, 4],
//   [4, 5],
//   [5, 2],
//   [2, 3],
//   [3, 6],
// ]

// const buzzwords = [
//  "Analyzes Google before writing",
//   "Refreshes existing blogs from a URL",
//   "Writes content structured to rank",
//   "Publishes directly to WordPress",
// ]






// function AnimatedHeadline() {
//   const [index, setIndex] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % buzzwords.length)
//     }, 2600)
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//       className="mb-4"
//     >
//       {/* Primary headline */}
//       <h1
//         className="
//           font-heading
//           text-3xl sm:text-4xl md:text-5xl lg:text-6xl
//           font-semibold
//           tracking-tight
//           text-foreground
//           leading-tight
//         "
//       >
//         Blogs That Rank on Google
//       </h1>

//       {/* Animated proof line */}
//       <motion.div
//         key={index}
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -8 }}
//         transition={{ duration: 0.35, ease: "easeOut" }}
//         className="
//           mt-2
//           text-lg sm:text-xl
//           font-medium
//           text-ai-accent
//         "
//       >
//         {buzzwords[index]}
//       </motion.div>
//     </motion.div>
//   )
// }


// function FeatureIcon({ icon: Icon, label, x, y, delay }: Feature) {
//   return (
//     <motion.div
//       className="absolute bg-white/90 border border-gray-200 backdrop-blur-md shadow-xl rounded-xl px-3 py-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-800 z-10"
//       style={{ left: x, top: y }}
//       initial={{ opacity: 0, scale: 0.8, y: 10 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       transition={{ duration: 0.6, delay }}
//       whileHover={{
//         scale: 1.08,
//         boxShadow: "0 0 20px rgba(59,130,246,0.5)",
//       }}
//     >
//       <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
//       <span className="truncate">{label}</span>
//     </motion.div>
//   )
// }

// function generateCurvePath(x1: number, y1: number, x2: number, y2: number) {
//   const dx = (x2 - x1) / 2
//   const dy = (y2 - y1) / 2
//   const cx1 = x1 + dx + Math.random() * 40 - 20
//   const cy1 = y1 + dy + Math.random() * 40 - 20
//   return `M ${x1} ${y1} Q ${cx1} ${cy1}, ${x2} ${y2}`
// }

// export default function Home() {
//   const [isMobile, setIsMobile] = useState(false)
//   const [paths, setPaths] = useState<string[]>([])

//   useEffect(() => {
//     const update = () => {
//       const mobile = window.innerWidth < 768
//       setIsMobile(mobile)

//       if (!mobile) {
//         const generatedPaths = connections.map(([fromIdx, toIdx]) => {
//           const from = desktopFeatures[fromIdx]
//           const to = desktopFeatures[toIdx]
//           return generateCurvePath(from.x + 80, from.y + 20, to.x + 80, to.y + 20)
//         })
//         setPaths(generatedPaths)
//       }
//     }

//     update()
//     window.addEventListener("resize", update)
//     return () => window.removeEventListener("resize", update)
//   }, [])

//   const features = isMobile ? mobileFeatures : desktopFeatures

//   return (
//     <main
//       id="hero"
//       className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-30 scroll-mt-28"
//     >
//       <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
//         {/* Left Content */}
//         <div className="space-y-6 text-center md:text-left">
//           <AnimatedHeadline />

//           <motion.p
//             className="text-gray-600 text-base sm:text-lg md:text-xl font-body max-w-xl mx-auto md:mx-0 leading-relaxed"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             Go beyond generic AI writers. Wordywrites creates full blog drafts, refreshes old posts from just a URL, and publishes directly to WordPress — all in one click.
//           </motion.p>

//           <motion.div
//             className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
//             initial="hidden"
//             animate="visible"
//             variants={{
//               hidden: {},
//               visible: {
//                 transition: {
//                   staggerChildren: 0.15,
//                   delayChildren: 0.4,
//                 },
//               },
//             }}
//           >
//             <motion.div
//               variants={{
//                 hidden: { opacity: 0, y: 20 },
//                 visible: { opacity: 1, y: 0 },
//               }}
//             >
//               <Link href="/sign-up">
//                 <Button
//   className="
//     px-6 py-3 text-lg
//     font-medium
//     rounded-lg
//     bg-ai-accent
//     text-primary-foreground
//     shadow-[0_6px_18px_-6px_var(--ai-accent)]
//     transition-all duration-300
//     hover:shadow-[0_10px_30px_-6px_var(--ai-accent)]
//     hover:-translate-y-[1px]
//     focus-visible:ring-2
//     focus-visible:ring-ai-accent
//     focus-visible:ring-offset-2
//   "
// >
//   Start Free
// </Button>
//               </Link>
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Right Floating Features */}
//         <motion.div
//           className="relative h-[400px] sm:h-[520px] w-full md:w-[640px] mx-auto"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, delay: 0.3 }}
//         >
//           {!isMobile && (
//             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
//               {paths.map((d, i) => (
//                 <path
//                   key={i}
//                   d={d}
//                   stroke="#d4d4d4"
//                   strokeWidth="1.5"
//                   fill="none"
//                 />
//               ))}
//             </svg>
//           )}

//           {features.map((feature, idx) => (
//             <FeatureIcon key={idx} {...feature} />
//           ))}
//         </motion.div>
//       </div>

//       <motion.div
//         className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2 cursor-pointer hover:text-blue-600 transition"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.6 }}
//       >
//         <div className="flex flex-col items-center mt-3 text-xs sm:text-sm text-gray-500 animate-bounce">
//           <span className="mb-1">Scroll to see how it works</span>
//           <motion.div
//             animate={{ y: [0, 6, 0] }}
//             transition={{ repeat: Infinity, duration: 1.2 }}
//             className="text-lg"
//           >
//             ↓
//           </motion.div>
//         </div>
//       </motion.div>
//     </main>
//   )
// }








"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  TrendingUp,
  PenLine,
  ClipboardCopy,
  Eye,
  Repeat,
  Scan,
  SearchCheck,
} from "lucide-react"
import Link from "next/link"

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
  { icon: Eye, label: "Content Previews", x: 390, y: 360, delay: 0.3 },
  { icon: SearchCheck, label: "Analyzer", x: 30, y: 200, delay: 0.4 },
  { icon: Scan, label: "Crawl & Enhance", x: 310, y: 10, delay: 0.5 },
  { icon: Repeat, label: "Auto Posting", x: 190, y: 420, delay: 0.6 },
]

const mobileFeatures: Feature[] = desktopFeatures.map((f, i) => ({
  ...f,
  x: 32,
  y: 40 + i * 56,
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
  "Analyzes Google before writing",
  "Refreshes existing blogs from a URL",
  "Writes content structured to rank",
  "Publishes directly to WordPress",
]

function AnimatedHeadline() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % buzzwords.length),
      2600
    )
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-4 space-y-2"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
        AI blogs that actually rank
      </div>

      <h1
        className="
          font-heading
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          font-semibold
          tracking-tight
          text-gray-900
          leading-tight
        "
      >
        Blogs that rank on Google,
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          without writing from scratch.
        </span>
      </h1>

      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="
          mt-2
          text-base sm:text-lg
          font-medium
          text-indigo-600
        "
      >
        {buzzwords[index]}
      </motion.div>
    </motion.div>
  )
}

function FeatureIcon({ icon: Icon, label, x, y, delay }: Feature) {
  return (
    <motion.div
      className="absolute flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs sm:text-sm font-medium text-gray-800 shadow-lg ring-1 ring-gray-200/70 backdrop-blur-md"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 12px 30px rgba(79,70,229,0.25)",
        y: -2,
      }}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
        <Icon className="h-4 w-4 text-indigo-600" />
      </div>
      <span className="truncate">{label}</span>
    </motion.div>
  )
}

function generateCurvePath(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) / 2
  const dy = (y2 - y1) / 2
  const cx1 = x1 + dx
  const cy1 = y1 + dy
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
          return generateCurvePath(
            from.x + 90,
            from.y + 24,
            to.x + 90,
            to.y + 24
          )
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
      className="
        min-h-[90vh]
        flex flex-col items-center justify-center
        px-4 sm:px-6 lg:px-8
        pt-28 pb-16 sm:pb-24
        bg-gradient-to-b from-white via-indigo-50/10 to-white
      "
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 md:grid md:grid-cols-2 md:items-center md:gap-12">
        {/* Left Content */}
        <div className="space-y-6 text-center md:text-left">
          <AnimatedHeadline />

          <motion.p
            className="mx-auto max-w-xl text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 md:mx-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Go beyond generic AI writers. Wordywrites creates full blog drafts,
            refreshes old posts from just a URL, and publishes directly to
            WordPress — all in one workflow.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.35,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link href="/sign-up">
                <Button
                  className="
                    px-7 py-3
                    text-sm sm:text-base
                    font-semibold
                    rounded-full
                    bg-gradient-to-r from-indigo-600 to-purple-600
                    text-white
                    shadow-[0_15px_40px_-12px_rgba(79,70,229,0.7)]
                    transition-all duration-300
                    hover:shadow-[0_20px_55px_-18px_rgba(79,70,229,0.8)]
                    hover:-translate-y-[1px]
                    focus-visible:ring-2
                    focus-visible:ring-indigo-500
                    focus-visible:ring-offset-2
                  "
                >
                  Start free
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-xs sm:text-sm text-gray-500">
                No credit card needed • First 5 blogs free
              </p>
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

      {/* Scroll hint */}
      <motion.div
        className="mt-10 flex flex-col items-center text-xs sm:text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        <span className="mb-1">Scroll to see how it works</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-lg"
        >
          ↓
        </motion.div>
      </motion.div>
    </main>
  )
}

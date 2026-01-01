// 'use client'

// import { motion } from 'framer-motion'
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card'
// import {
//   TrendingUp,
//   Sparkles,
//   FileText,
//   PenLine,
//   Upload,
// } from 'lucide-react'

// const howItWorksSteps = [
//   {
//     title: 'Keyword Agent',
//     summary: 'Understands your audience in seconds — used in 1,200+ live blogs.',
//     description:
//       'The Keyword Agent analyzes your target keyword to uncover search intent, ranking difficulty, and related phrases. It’s the strategic brain behind every blog we create.',
//     gradient: 'from-[#e0f2fe] via-[#e0e7ff] to-[#ede9fe]',
//     delay: 0.1,
//     icon: TrendingUp, // could replace with Search icon if preferred
//   },
//   {
//     title: 'SEO Agent',
//     summary: 'Optimizes for over 50 ranking factors — automatically.',
//     description:
//       'The SEO Agent ensures your blog is structured, tagged, and keyword-optimized for maximum visibility. From meta descriptions to headline scoring, it’s like having an SEO consultant built in.',
//     gradient: 'from-[#fef3c7] via-[#fcd34d] to-[#fca5a5]',
//     delay: 0.15,
//     icon: Sparkles,
//   },
//   {
//     title: 'Outline Agent',
//     summary: 'Creates clean, high-converting blog blueprints.',
//     description:
//       'The Outline Agent turns your keyword and tone into a strategic structure with H2s, H3s, CTAs, and internal linking cues — before a single word is written.',
//     gradient: 'from-[#ede9fe] via-[#d8b4fe] to-[#f0abfc]',
//     delay: 0.2,
//     icon: FileText,
//   },
//   {
//     title: 'Blog Writing Agent',
//     summary: 'Writes & refines — ready to publish in minutes.',
//     description:
//       'Combining human-like creativity with data-driven optimization, the Blog Writing Agent produces complete, SEO-ready articles. The built-in Editor Agent then polishes grammar, tone, and flow.',
//     gradient: 'from-[#d1fae5] via-[#a7f3d0] to-[#99f6e4]',
//     delay: 0.25,
//     icon: PenLine,
//   },
//   {
//     title: 'Publish Anywhere',
//     summary: 'Export to WordPress, Copy to Medium or anywhere you want.',
//     description:
//       'Once approved, your content is ready for one-click export as HTML, PDF, or Wordpress — so you can go live faster and keep your publishing workflow smooth.',
//     gradient: 'from-[#e0f2fe] via-[#c7d2fe] to-[#fce7f3]',
//     delay: 0.3,
//     icon: Upload,
//   },
// ]


// export function HowItWorks() {
//   return (
//     <section className="py-24 scroll-mt-24" id="how-it-works">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
//             How It Works
//           </h2>
//           <p className="mt-2 text-lg text-gray-600">
//             From one keyword to a full blog — powered by AI agents working together.
//           </p>
//         </div>
//         {howItWorksSteps.map((item, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             whileHover={{ scale: 1.02 }}
//             transition={{ delay: item.delay, duration: 0.7, ease: 'easeOut' }}
//             viewport={{ once: true }}
//             className="flex flex-col md:flex-row items-start gap-6 md:gap-10"
//           >
//             <Card
//               className={`w-full md:w-2/5 bg-gradient-to-br ${item.gradient} border-none shadow-xl hover:shadow-2xl transition duration-300 rounded-3xl`}
//             >
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-heading text-gray-800">
//                   <item.icon className="w-5 h-5 text-primary" />
//                   {item.title}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-sm sm:text-base text-gray-700 font-medium">
//                   {item.summary}
//                 </CardDescription>
//               </CardContent>
//             </Card>

//             <div className="w-full md:w-3/5 text-gray-700 font-body text-base sm:text-lg leading-relaxed pt-2 md:pt-0">
//               {item.description}
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   )
// }




// 'use client'

// import { motion } from 'framer-motion'
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card'
// import {
//   TrendingUp,
//   Sparkles,
//   FileText,
//   PenLine,
//   Upload,
// } from 'lucide-react'

// const howItWorksSteps = [
//   {
//     title: 'Keyword Agent',
//     summary: 'Understands your audience in seconds — used in 1,200+ live blogs.',
//     description:
//       'The Keyword Agent analyzes your target keyword to uncover search intent, ranking difficulty, and related phrases. It’s the strategic brain behind every blog we create.',
//     gradient: 'from-[#e0f2fe] via-[#e0e7ff] to-[#ede9fe]',
//     delay: 0.1,
//     icon: TrendingUp, // could replace with Search icon if preferred
//   },
//   {
//     title: 'SEO Agent',
//     summary: 'Optimizes for over 50 ranking factors — automatically.',
//     description:
//       'The SEO Agent ensures your blog is structured, tagged, and keyword-optimized for maximum visibility. From meta descriptions to headline scoring, it’s like having an SEO consultant built in.',
//     gradient: 'from-[#fef3c7] via-[#fcd34d] to-[#fca5a5]',
//     delay: 0.15,
//     icon: Sparkles,
//   },
//   {
//     title: 'Outline Agent',
//     summary: 'Creates clean, high-converting blog blueprints.',
//     description:
//       'The Outline Agent turns your keyword and tone into a strategic structure with H2s, H3s, CTAs, and internal linking cues — before a single word is written.',
//     gradient: 'from-[#ede9fe] via-[#d8b4fe] to-[#f0abfc]',
//     delay: 0.2,
//     icon: FileText,
//   },
//   {
//     title: 'Blog Writing Agent',
//     summary: 'Writes & refines — ready to publish in minutes.',
//     description:
//       'Combining human-like creativity with data-driven optimization, the Blog Writing Agent produces complete, SEO-ready articles. The built-in Editor Agent then polishes grammar, tone, and flow.',
//     gradient: 'from-[#d1fae5] via-[#a7f3d0] to-[#99f6e4]',
//     delay: 0.25,
//     icon: PenLine,
//   },
//   {
//     title: 'Publish Anywhere',
//     summary: 'Export to WordPress, Copy to Medium or anywhere you want.',
//     description:
//       'Once approved, your content is ready for one-click export as HTML, PDF, or Wordpress — so you can go live faster and keep your publishing workflow smooth.',
//     gradient: 'from-[#e0f2fe] via-[#c7d2fe] to-[#fce7f3]',
//     delay: 0.3,
//     icon: Upload,
//   },
// ]


// export function HowItWorks() {
//   return (
//     <section className="py-24 scroll-mt-24" id="how-it-works">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
//             How It Works
//           </h2>
//           <p className="mt-2 text-lg text-gray-600">
//             From one keyword to a full blog — powered by AI agents working together.
//           </p>
//         </div>
//         {howItWorksSteps.map((item, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             whileHover={{ scale: 1.02 }}
//             transition={{ delay: item.delay, duration: 0.7, ease: 'easeOut' }}
//             viewport={{ once: true }}
//             className="flex flex-col md:flex-row items-start gap-6 md:gap-10"
//           >
//             <Card
//               className={`w-full md:w-2/5 bg-gradient-to-br ${item.gradient} border-none shadow-xl hover:shadow-2xl transition duration-300 rounded-3xl`}
//             >
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-heading text-gray-800">
//                   <item.icon className="w-5 h-5 text-primary" />
//                   {item.title}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-sm sm:text-base text-gray-700 font-medium">
//                   {item.summary}
//                 </CardDescription>
//               </CardContent>
//             </Card>

//             <div className="w-full md:w-3/5 text-gray-700 font-body text-base sm:text-lg leading-relaxed pt-2 md:pt-0">
//               {item.description}
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   )
// }





'use client'

import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  TrendingUp,
  Sparkles,
  FileText,
  PenLine,
  Upload,
  Play,
} from 'lucide-react'
import { useRef, useState } from 'react'

const howItWorksSteps = [
  {
    title: 'Keyword Agent',
    summary: 'Understands your audience in seconds.',
    description:
      'Analyzes search intent, competition, and semantic relevance before writing begins.',
    gradient: 'from-[#e0f2fe] via-[#e0e7ff] to-[#ede9fe]',
    icon: TrendingUp,
  },
  {
    title: 'SEO Agent',
    summary: 'Optimized for rankings automatically.',
    description:
      'Titles, meta, structure, internal SEO — all handled by the agent.',
    gradient: 'from-[#fef3c7] via-[#fcd34d] to-[#fca5a5]',
    icon: Sparkles,
  },
  {
    title: 'Outline Agent',
    summary: 'High-converting structure.',
    description:
      'Creates a logical, reader-first outline before content generation.',
    gradient: 'from-[#ede9fe] via-[#d8b4fe] to-[#f0abfc]',
    icon: FileText,
  },
  {
    title: 'Blog Writing Agent',
    summary: 'Writes publish-ready content.',
    description:
      'Human-like writing with SEO baked in — no editing needed.',
    gradient: 'from-[#d1fae5] via-[#a7f3d0] to-[#99f6e4]',
    icon: PenLine,
  },
  {
    title: 'Publish Anywhere',
    summary: 'Export in one click.',
    description:
      'WordPress, Medium, HTML — ship instantly.',
    gradient: 'from-[#e0f2fe] via-[#c7d2fe] to-[#fce7f3]',
    icon: Upload,
  },
]

export function HowItWorks() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const handlePlay = () => {
    videoRef.current?.play()
    setPlaying(true)
  }

  return (
    <section id="how-it-works" className="py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* LEFT — EXPLANATION */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              From one keyword to a complete SEO blog — fully automated.
            </p>
          </div>

          <div className="space-y-6">
            {howItWorksSteps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`bg-gradient-to-br ${item.gradient} border-none rounded-2xl shadow-lg`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <item.icon className="w-5 h-5 text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700">
                      {item.summary}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — DEMO VIDEO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-black"
        >
          {/* Gradient overlay */}
          {!playing && (
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 z-10" />
          )}

          <video
            ref={videoRef}
            src="/demo.mp4"
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Play button */}
          {!playing && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-105 transition">
                <Play className="w-8 h-8 text-black ml-1" />
              </div>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}

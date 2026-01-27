

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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

const howItWorksSteps = [
  {
    title: 'Enter Your Keyword',
    summary: 'Start with a topic you want to rank for.',
    description:
      'Type a keyword or topic and WordyWrites analyzes search intent, competition, and what your blog needs to compete on Google.',
    gradient: 'from-[#e0f2fe] via-[#e0e7ff] to-[#ede9fe]',
    delay: 0.1,
    icon: TrendingUp,
  },
  {
    title: 'SEO Structure Is Built',
    summary: 'Headings, outline, and strategy are handled automatically.',
    description:
      'We generate a structured outline with optimized headings and flow based on what already ranks — so your article follows a proven structure.',
    gradient: 'from-[#fef3c7] via-[#fcd34d] to-[#fca5a5]',
    delay: 0.15,
    icon: Sparkles,
  },
  {
    title: 'Full Blog Is Written',
    summary: 'Readable, natural content — not robotic AI text.',
    description:
      'Your article is written in your chosen tone and audience style, ensuring clarity, engagement, and SEO-friendly formatting without keyword stuffing.',
    gradient: 'from-[#ede9fe] via-[#d8b4fe] to-[#f0abfc]',
    delay: 0.2,
    icon: FileText,
  },
  {
    title: 'Content Is Refined',
    summary: 'Grammar, tone, and flow are polished automatically.',
    description:
      'The draft is improved and formatted so it reads like a finished article — not something that needs heavy editing.',
    gradient: 'from-[#d1fae5] via-[#a7f3d0] to-[#99f6e4]',
    delay: 0.25,
    icon: PenLine,
  },
  {
    title: 'Publish Anywhere',
    summary: 'Go live in minutes.',
    description:
      'Export to WordPress, copy formatted HTML, or download as PDF. Your blog is ready to publish without reformatting or technical steps.',
    gradient: 'from-[#e0f2fe] via-[#c7d2fe] to-[#fce7f3]',
    delay: 0.3,
    icon: Upload,
  },
]


export function HowItWorks() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section
  className="
    py-24 scroll-mt-24
    bg-gradient-to-b from-white via-indigo-50/10 to-white
  "
  id="how-it-works"
>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            From one keyword to a full blog — powered by AI agents working together.
          </p>
        </div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black/5 border border-gray-200/50 backdrop-blur-sm">
            {/* Video Container */}
            <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 aspect-video flex items-center justify-center overflow-hidden">
              {/* Embedded Video - Replace with your video URL */}
              {showVideo ? (
              <video
  src="/demo.mp4"
  className="w-full h-full object-cover"
  autoPlay
  muted
  loop
  playsInline
/>
              ) : (
                <>
                  {/* Video Thumbnail/Poster */}
                  <div className="absolute inset-0 w-full h-full">
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
                    </div>
                  </div>

                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowVideo(true)}
                    className="relative z-10 group"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-3xl transition-all duration-300 border-2 border-white/20">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900 fill-gray-900 ml-1" />
                    </div>
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12 whitespace-nowrap text-sm sm:text-base font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Watch Demo
                    </span>
                  </motion.button>
                </>
              )}
            </div>

           
          </div>

          {/* Video Description */}
          <div className="mt-6 text-center max-w-2xl mx-auto">
            <p className="text-gray-700 text-base sm:text-lg font-medium mb-2">
              See WordyWrites in action
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              Watch how our AI agents work together to create SEO-optimized blogs from keyword to publish in minutes.
            </p>
          </div>
        </motion.div>

        {/* Existing Steps */}
        {howItWorksSteps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: item.delay, duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start gap-6 md:gap-10"
          >
            <Card
              className={`w-full md:w-2/5 bg-gradient-to-br ${item.gradient} border-none shadow-xl hover:shadow-2xl transition duration-300 rounded-3xl`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-heading text-gray-800">
                  <item.icon className="w-5 h-5 text-primary" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-700 font-medium">
                  {item.summary}
                </CardDescription>
              </CardContent>
            </Card>

            <div className="w-full md:w-3/5 text-gray-700 font-body text-base sm:text-lg leading-relaxed pt-2 md:pt-0">
              {item.description}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}


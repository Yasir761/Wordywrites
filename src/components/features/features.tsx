'use client'

import {
  PenLine,
  FileText,
  ShieldCheck,
  Sparkles,
  Wand2,
  BrainCog,
} from "lucide-react"
import { motion } from "framer-motion"

// ✅ Toggle this when launching
const isLaunched = true

// ✅ Pre-launch badges
const preLaunchBadges = [
  { icon: ShieldCheck, text: "Launching Soon — Early Access Open", color: "text-green-500" },
  { icon: Sparkles, text: "AI-Optimized & SEO-Ready", color: "text-yellow-500" },
  { icon: PenLine, text: "Human-Style Writing", color: "text-indigo-500" },
]

// ✅ Post-launch badges
const postLaunchBadges = [
  { icon: ShieldCheck, text: "1,200+ Blogs Created", color: "text-green-500" },
  { icon: Sparkles, text: "98% User Satisfaction", color: "text-yellow-500" },
  { icon: PenLine, text: "AI + Human Editing", color: "text-indigo-500" },
]

// ✅ Pick badges based on launch status
const trustBadges = isLaunched ? postLaunchBadges : preLaunchBadges

const features = [
  {
    icon: PenLine,
    title: "From Idea to Blog in 90 Seconds",
    description:
      "Type a keyword and watch AI craft a full, SEO-ready article — tested on 1,200+ published posts.",
  },
  {
    icon: FileText,
    title: "Sounds Exactly Like You",
    description:
      "Choose tone, audience, and format — the AI adapts to match your style, not the other way around.",
  },
  {
    icon: ShieldCheck,
    title: "Originality Guaranteed",
    description:
      "Every draft passes plagiarism & repetition checks — so you publish with confidence.",
  },
  {
    icon: Sparkles,
    title: "SEO That Works While You Write",
    description:
      "Built-in optimization for titles, meta descriptions, and hashtags — backed by SERP analysis.",
  },
  {
    icon: Wand2,
    title: "Publish Anywhere in One Click",
    description:
      "Export to WordPress, Google Docs, Medium, or PDF instantly — no copy-pasting required.",
  },
  {
    icon: BrainCog,
    title: "Scales With You & Your Team",
    description:
      "From solo creators to agencies, manage multiple projects with shared folders and workflows.",
  },
]

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24" id="features">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="mb-12 sm:mb-16 text-center">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
            Why Wordywrites?
          </span>
          <h2 className="text-4xl font-bold text-gray-900 font-heading mt-2">
            Everything You Need to Blog Better
          </h2>
          <p className="mt-2 text-lg sm:text-xl text-gray-600">
            {isLaunched 
              ? "Trusted by 3,000+ bloggers, startups, and marketing teams worldwide."
              : "Join early and be among the first to supercharge your blogging with AI."}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-500">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <badge.icon className={`w-4 h-4 ${badge.color}`} /> {badge.text}
              </div>
            ))}
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-inner border border-indigo-100 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300 shrink-0">
                  <Icon className="w-7 h-7 text-indigo-600 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

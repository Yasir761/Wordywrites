// 'use client'

// import {
//   PenLine,
//   FileText,
//   ShieldCheck,
//   Sparkles,
//   Wand2,
//   BrainCog,
// } from "lucide-react"
// import { motion } from "framer-motion"

// //  Toggle this when launching
// const isLaunched = true

// //  Pre-launch badges
// const preLaunchBadges = [
//   { icon: ShieldCheck, text: "Launching Soon — Early Access Open", color: "text-green-500" },
//   { icon: Sparkles, text: "AI-Optimized & SEO-Ready", color: "text-yellow-500" },
//   { icon: PenLine, text: "Human-Style Writing", color: "text-indigo-500" },
// ]

// //  Post-launch badges
// const postLaunchBadges = [
//   { icon: ShieldCheck, text: "1,200+ Blogs Created", color: "text-green-500" },
//   { icon: Sparkles, text: "98% User Satisfaction", color: "text-yellow-500" },
//   { icon: PenLine, text: "AI + Human Editing", color: "text-indigo-500" },
// ]

// //  Pick badges based on launch status
// const trustBadges = isLaunched ? postLaunchBadges : preLaunchBadges

// const features = [
//   {
//     icon: PenLine,
//     title: "From Idea to Blog in 90 Seconds",
//     description:
//       "Type a keyword and watch AI craft a full, SEO-ready article — tested on 1,200+ published posts.",
//   },
//   {
//     icon: FileText,
//     title: "Sounds Exactly Like You",
//     description:
//       "Choose tone, audience, and format — the AI adapts to match your style, not the other way around.",
//   },
//   {
//     icon: ShieldCheck,
//     title: "Originality Guaranteed",
//     description:
//       "Every draft passes plagiarism & repetition checks — so you publish with confidence.",
//   },
//   {
//     icon: Sparkles,
//     title: "SEO That Works While You Write",
//     description:
//       "Built-in optimization for titles, meta descriptions, and hashtags — backed by SERP analysis.",
//   },
//   {
//     icon: Wand2,
//     title: "Publish Anywhere in One Click",
//     description:
//       "Export to WordPress, Google Docs, Medium, or PDF instantly — no copy-pasting required.",
//   },
//   {
//     icon: BrainCog,
//     title: "Scales With You & Your Team",
//     description:
//       "From solo creators to agencies, manage multiple projects with shared folders and workflows.",
//   },
// ]

// export default function Features() {
//   return (
//     <section className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24" id="features">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Heading */}
//         <div className="mb-12 sm:mb-16 text-center">
//           <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
//             Why Wordywrites?
//           </span>
//           <h2 className="text-4xl font-bold text-gray-900 font-heading mt-2">
//             Everything You Need to Blog Better
//           </h2>
//           <p className="mt-2 text-lg sm:text-xl text-gray-600">
//             {isLaunched 
//               ? "Trusted by 3,000+ bloggers, startups, and marketing teams worldwide."
//               : "Join early and be among the first to supercharge your blogging with AI."}
//           </p>

//           {/* Trust badges */}
//           <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-500">
//             {trustBadges.map((badge, i) => (
//               <div key={i} className="flex items-center gap-2">
//                 <badge.icon className={`w-4 h-4 ${badge.color}`} /> {badge.text}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Features grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
//           {features.map(({ icon: Icon, title, description }, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               className="group bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
//             >
//               <div className="flex items-start gap-4">
//                 {/* Icon */}
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-inner border border-indigo-100 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300 shrink-0">
//                   <Icon className="w-7 h-7 text-indigo-600 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300" />
//                 </div>

//                 {/* Text */}
//                 <div>
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                     {title}
//                   </h3>
//                   <p className="mt-2 text-gray-600 text-sm leading-relaxed">
//                     {description}
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }




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
import { useState } from "react"


//  Toggle this when launching
const isLaunched = true


//  Pre-launch badges
const preLaunchBadges = [
  { icon: ShieldCheck, text: "Launching Soon — Early Access Open", color: "text-green-500", bgColor: "bg-green-50" },
  { icon: Sparkles, text: "AI-Optimized & SEO-Ready", color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { icon: PenLine, text: "Human-Style Writing", color: "text-indigo-500", bgColor: "bg-indigo-50" },
]


//  Post-launch badges
const postLaunchBadges = [
  { icon: ShieldCheck, text: "1,200+ Blogs Created", color: "text-green-500", bgColor: "bg-green-50" },
  { icon: Sparkles, text: "98% User Satisfaction", color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { icon: PenLine, text: "AI + Human Editing", color: "text-indigo-500", bgColor: "bg-indigo-50" },
]


//  Pick badges based on launch status
const trustBadges = isLaunched ? postLaunchBadges : preLaunchBadges


const features = [
  {
    icon: PenLine,
    title: "From Idea to Blog in 90 Seconds",
    description:
      "Type a keyword and watch AI craft a full, SEO-ready article — tested on 1,200+ published posts.",
    gradient: "from-blue-500/10 via-indigo-500/10 to-blue-500/10",
    iconBg: "from-blue-500 to-cyan-500"
  },
  {
    icon: FileText,
    title: "Sounds Exactly Like You",
    description:
      "Choose tone, audience, and format — the AI adapts to match your style, not the other way around.",
    gradient: "from-purple-500/10 via-pink-500/10 to-purple-500/10",
    iconBg: "from-purple-500 to-pink-500"
  },
  {
    icon: ShieldCheck,
    title: "Originality Guaranteed",
    description:
      "Every draft passes plagiarism & repetition checks — so you publish with confidence.",
    gradient: "from-green-500/10 via-emerald-500/10 to-green-500/10",
    iconBg: "from-green-500 to-emerald-500"
  },
  {
    icon: Sparkles,
    title: "SEO That Works While You Write",
    description:
      "Built-in optimization for titles, meta descriptions, and hashtags — backed by SERP analysis.",
    gradient: "from-yellow-500/10 via-amber-500/10 to-yellow-500/10",
    iconBg: "from-yellow-500 to-amber-500"
  },
  {
    icon: Wand2,
    title: "Publish Anywhere in One Click",
    description:
      "Export to WordPress, Google Docs, Medium, or PDF instantly — no copy-pasting required.",
    gradient: "from-orange-500/10 via-red-500/10 to-orange-500/10",
    iconBg: "from-orange-500 to-red-500"
  },
  {
    icon: BrainCog,
    title: "Scales With You & Your Team",
    description:
      "From solo creators to agencies, manage multiple projects with shared folders and workflows.",
    gradient: "from-indigo-500/10 via-purple-500/10 to-indigo-500/10",
    iconBg: "from-indigo-500 to-purple-500"
  },
]


export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24 bg-gradient-to-b from-white via-gray-50 to-white" id="features">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16 text-center"
        >
          <motion.span 
            className="inline-block text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full"
          >
            Why Wordywrites?
          </motion.span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-heading mt-4 leading-tight">
            Everything You Need to Blog Better
          </h2>
          
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {isLaunched 
              ? "Trusted by 3,000+ bloggers, startups, and marketing teams worldwide."
              : "Join early and be among the first to supercharge your blogging with AI."}
          </p>

          {/* Trust badges - Enhanced */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {trustBadges.map((badge, i) => (
              <motion.div 
                key={i} 
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full ${badge.bgColor} border border-gray-200/50 backdrop-blur-sm hover:border-gray-300 transition-all duration-300`}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <badge.icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features grid - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {features.map(({ icon: Icon, title, description, gradient, iconBg }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative h-full"
            >
              {/* Animated gradient background */}
              <motion.div
                className={`absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              
              {/* Card Container */}
              <motion.div
                className="relative h-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl lg:rounded-3xl p-6 sm:p-7 lg:p-8 shadow-sm group-hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  y: -8,
                  borderColor: "rgba(129, 103, 249, 0.3)"
                }}
              >
                <div className="flex flex-col h-full gap-4">
                  {/* Icon Container */}
                  <div className="flex-shrink-0">
                    <motion.div
                      className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${iconBg} shadow-lg`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 6
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </motion.div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-grow flex flex-col gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow">
                      {description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <motion.div 
                    className={`h-1 bg-gradient-to-r ${iconBg} rounded-full`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredIndex === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p className="text-gray-600 text-lg">
            Ready to transform your blogging workflow?{" "}
            <motion.span 
              className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              Start your free trial today
            </motion.span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
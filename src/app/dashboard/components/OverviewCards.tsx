"use client"

import { useEffect, useState } from "react"
import {
  IconArticle,
  IconWriting,
  IconStar,
  IconLock,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { motion } from "framer-motion"
import PlanCard from "./PlanCard" // import your plan card

export default function OverviewCards() {
  const [stats, setStats] = useState([
    {
      label: "Blogs Created",
      value: 0,
      icon: IconArticle,
      trend: "+0%",
      description: "New blogs this month",
      direction: "up",
    },
    {
      label: "Words Written",
      value: "0",
      icon: IconWriting,
      trend: "+0%",
      description: "Word count across all blogs",
      direction: "up",
    },
    {
      label: "Avg SEO Score",
      value: "0%",
      icon: IconStar,
      trend: "+0%",
      description: "Improved SEO performance",
      direction: "up",
    },
  ])

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats", { credentials: "include" })
        const data = await res.json()

        // Update stats
        setStats([
          {
            label: "Blogs Created",
            value: data.blogCount,
            icon: IconArticle,
            trend: `${data.trends.blogs >= 0 ? "+" : ""}${data.trends.blogs}%`,
            description:
              data.plan === "Free"
                ? `${Math.max(0, 5 - data.blogsGeneratedThisMonth)} blogs left this month`
                : "You can create unlimited blogs 🚀",
            direction: data.trends.blogs >= 0 ? "up" : "down",
          },
          {
            label: "Words Written",
            value: data.totalWords.toLocaleString(),
            icon: IconWriting,
            trend: `${data.trends.words >= 0 ? "+" : ""}${data.trends.words}%`,
            description: "Word count across all blogs",
            direction: data.trends.words >= 0 ? "up" : "down",
          },
          {
            label: "Avg SEO Score",
            value: `${data.avgSEO}%`,
            icon: IconStar,
            trend: `${data.trends.seo >= 0 ? "+" : ""}${data.trends.seo}%`,
            description: "Improved SEO performance",
            direction: data.trends.seo >= 0 ? "up" : "down",
          },
        ])
      } catch (err) {
        console.error("Failed to load stats:", err)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-4 xl:px-6 mt-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        const trendUp = stat.direction === "up"
        const TrendEmoji = trendUp ? "📈" : "📉"
        const badgeColor = trendUp
          ? "border-green-300 text-green-700 bg-green-50"
          : "border-red-300 text-red-600 bg-red-50"

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-sm transition-all hover:shadow-xl hover:scale-[1.015]">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100/20 via-transparent to-cyan-100/20" />
              <div className="absolute top-4 right-4 z-10">
                <Badge className={`text-xs px-2 py-1 border ${badgeColor}`}>
                  {TrendEmoji} {stat.trend}
                </Badge>
              </div>
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <CardDescription className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-1 px-5 pb-5 pt-0 text-sm text-muted-foreground relative z-10">
                <span className="font-medium text-foreground">{stat.description}</span>
                <span className="text-xs">Tracked in real-time</span>
              </CardFooter>
            </Card>
          </motion.div>
        )
      })}

      {/* Add the UserPlanCard as a separate card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <PlanCard />
      </motion.div>
    </div>
  )
}

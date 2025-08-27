"use client"

import { useEffect, useState } from "react"
import { IconLock } from "@tabler/icons-react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { initializePaddle, Paddle } from "@paddle/paddle-js"

export default function UserPlanCard() {
  const [planData, setPlanData] = useState<{ plan?: string; blogsLeft?: number }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [paddle, setPaddle] = useState<Paddle>()

  // Initialize Paddle once on mount
  useEffect(() => {
    initializePaddle({
      environment: "sandbox", // or "production" for live
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((paddleInstance) => setPaddle(paddleInstance))
  }, [])

  useEffect(() => {
    async function fetchPlan() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/user/plan", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error("API Error:", res.status, errorText)
          throw new Error(`Failed to fetch user plan: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        console.log("Plan data received:", data)
        setPlanData({ plan: data.plan, blogsLeft: data.blogsLeft })
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [])

const handleUpgrade = async () => {
  setUpgradeLoading(true)

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId: "pri_01k3amkh5jpxnsb12by5ae99fw" }),
  })
  const data = await res.json()

  if (data.checkoutUrl) {
    window.location.href = data.checkoutUrl // full-page redirect
    // OR: paddle.Checkout.open({ url: data.checkoutUrl }) if you want overlay mode
  }

  setUpgradeLoading(false)
}
  const isFree = planData.plan === "Free"

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm animate-pulse">
                <IconLock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <CardDescription className="text-sm font-medium text-gray-600">Loading...</CardDescription>
                <CardTitle className="text-2xl font-bold text-gray-900">...</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden rounded-2xl border border-red-200 bg-red-50/30 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
                <IconLock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <CardDescription className="text-sm font-medium text-red-600">Error loading plan</CardDescription>
                <CardTitle className="text-lg font-bold text-red-900">{error}</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-sm transition-all hover:shadow-xl">
        {/* Top-right badge like trend cards */}
        <div className="absolute top-4 right-4 z-10">
          {isFree ? (
            <Badge className="text-xs px-2 py-1 border border-yellow-300 text-yellow-700 bg-yellow-50">
              {planData.blogsLeft ?? 5} left
            </Badge>
          ) : (
            <Badge className="text-xs px-2 py-1 border border-green-300 text-green-700 bg-green-50">Pro</Badge>
          )}
        </div>

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
              <IconLock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <CardDescription className="text-sm font-medium text-gray-600">Your Plan</CardDescription>
              <CardTitle className="text-2xl font-bold text-gray-900">{planData.plan || "Free"}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col items-start gap-2 px-5 pb-5 pt-0 text-sm text-muted-foreground relative z-10">
          {isFree ? (
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
            >
              {upgradeLoading ? "Starting checkout..." : "Upgrade to Pro"}
            </Button>
          ) : (
            <span className="font-medium text-foreground">Enjoy unlimited blogs 🚀</span>
          )}
          <span className="text-xs">Tracked in real-time</span>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
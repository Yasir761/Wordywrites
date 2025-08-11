import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { BlogModel } from "@/app/models/blog"
import { connectDB } from "@/app/api/utils/db"

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  await connectDB()

  // Get query params for range
  const url = new URL(req.url)
  const range = url.searchParams.get("range") || "7d"

  // Calculate date range
  let startDate = new Date(0)
  if (range === "7d") startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  if (range === "30d") startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Fetch blogs for user within range
  const blogs = await BlogModel.find({
    userId,
    createdAt: { $gte: startDate }
  }).select("createdAt blogAgent.wordCount seoAgent.seo_score")

  // Aggregate by day
  const dailyStats: Record<string, { blogs: number; totalSEO: number }> = {}
  blogs.forEach(blog => {
    const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    if (!dailyStats[date]) {
      dailyStats[date] = { blogs: 0, totalSEO: 0 }
    }
    dailyStats[date].blogs += 1
    dailyStats[date].totalSEO += blog.seoAgent?.seo_score || 0
  })

  // Format data for chart
  const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    blogs: stats.blogs,
    avgSEO: stats.blogs > 0 ? Math.round(stats.totalSEO / stats.blogs) : 0,
  }))

  // Sort chronologically
  chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return NextResponse.json(chartData)
}

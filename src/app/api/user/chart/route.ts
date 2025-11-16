import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BlogModel } from "@/app/models/blog";
import { connectDB } from "@/app/api/utils/db";
import crypto from "crypto";
import { redis } from "@/lib/redis";

const TTL = 60 * 10; // 10 minutes cache

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "7d";

  const cacheKey = `stats:${userId}:${range}`;

  // ----------- TRY REDIS CACHE FIRST -----------
  let cached = await redis.get(cacheKey);

  if (cached) {
    try {
      // Normalize cached value
      let json: any;

      if (typeof cached === "string") {
        if (cached.trim() !== "") {
          json = JSON.parse(cached);
        }
      } else if (typeof cached === "object") {
        // Upstash may return objects directly
        json = cached;
      }

      if (json) {
        const raw = typeof cached === "string" ? cached : JSON.stringify(cached);
        const etag = crypto.createHash("sha1").update(raw).digest("hex");

        if (req.headers.get("if-none-match") === etag) {
          return new NextResponse(null, {
            status: 304,
            headers: {
              "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
              ETag: etag,
            },
          });
        }

        return new NextResponse(JSON.stringify(json), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
            ETag: etag,
          },
        });
      }
    } catch (err) {
      console.warn(" Redis contained invalid JSON — regenerating...", err);
    }
  }

  // ----------- FALLBACK TO DATABASE -----------
  await connectDB();

  let startDate = new Date(0);
  if (range === "7d") startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  if (range === "30d") startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const blogs = await BlogModel.find({
    userId,
    createdAt: { $gte: startDate },
  }).select("createdAt blogAgent.wordCount seoAgent.seo_score");

  // ----------- AGGREGATION -----------
  const dailyStats: Record<string, { blogs: number; totalSEO: number }> = {};

  blogs.forEach((blog) => {
    const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!dailyStats[date]) dailyStats[date] = { blogs: 0, totalSEO: 0 };

    dailyStats[date].blogs += 1;
    dailyStats[date].totalSEO += blog.seoAgent?.seo_score || 0;
  });

  const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    blogs: stats.blogs,
    avgSEO: stats.blogs > 0 ? Math.round(stats.totalSEO / stats.blogs) : 0,
  }));

  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const responseJSON = JSON.stringify(chartData);
  const etag = crypto.createHash("sha1").update(responseJSON).digest("hex");

  // ----------- STORE IN REDIS -----------
  await redis.set(cacheKey, responseJSON, { ex: TTL });

  return new NextResponse(responseJSON, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      ETag: etag,
    },
  });
}

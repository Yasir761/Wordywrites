
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BlogModel } from "@/app/models/blog";
import { connectDB } from "@/app/api/utils/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await connectDB();

  //  Define time ranges
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Fetch blogs 
  const allBlogs = await BlogModel.find({ userId });
  const currentBlogs = await BlogModel.find({
    userId,
    createdAt: { $gte: startOfThisMonth },
  });
  const previousBlogs = await BlogModel.find({
    userId,
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });

  // Base stats 
  const blogCount = allBlogs.length;
  const totalWords = allBlogs.reduce((acc, blog) => acc + (blog.blogAgent?.wordCount || 0), 0);
  const avgSEO =
    allBlogs.length > 0
      ? Math.round(
          allBlogs.reduce((acc, blog) => acc + (blog.seoAgent?.seo_score || 0), 0) /
            allBlogs.length
        )
      : 0;

  // --- Current & Previous period stats ---
  const currentWords = currentBlogs.reduce((acc, blog) => acc + (blog.blogAgent?.wordCount || 0), 0);
  const previousWords = previousBlogs.reduce((acc, blog) => acc + (blog.blogAgent?.wordCount || 0), 0);

  const currentSEO =
    currentBlogs.length > 0
      ? currentBlogs.reduce((acc, blog) => acc + (blog.seoAgent?.seo_score || 0), 0) /
        currentBlogs.length
      : 0;

  const previousSEO =
    previousBlogs.length > 0
      ? previousBlogs.reduce((acc, blog) => acc + (blog.seoAgent?.seo_score || 0), 0) /
        previousBlogs.length
      : 0;

  //  Trend calculations 
  const calcTrend = (current: number, previous: number) =>
    previous === 0 ? 100 : Math.round(((current - previous) / previous) * 100);

  const trends = {
    blogs: calcTrend(currentBlogs.length, previousBlogs.length),
    words: calcTrend(currentWords, previousWords),
    seo: calcTrend(currentSEO, previousSEO),
  };

  return NextResponse.json({
    blogCount,
    totalWords,
    avgSEO,
    trends,
  });
}

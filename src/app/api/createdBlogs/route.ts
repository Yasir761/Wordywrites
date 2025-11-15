import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import { cachedQuery } from "@/lib/dbCache";

export const GET = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    // Create unique cache key per user
    const cacheKey = `blogs:user:${userId}`;

    const blogs = await cachedQuery(
      cacheKey,
      async () =>
        await BlogModel.find({ userId })
          .sort({ createdAt: -1 })
          .select("+blogAgent.blog"),
      60 * 5 // 5 minutes TTL — ideal for dashboard data
    );

    return new Response(JSON.stringify(blogs), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return new Response("Server Error", { status: 500 });
  }
};

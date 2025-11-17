import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import { cachedQuery } from "@/lib/dbCache";
import crypto from "crypto";

export const GET = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    //  Cache key per-user
    const cacheKey = `blogs:user:${userId}`;

    //  Redis-cached DB query (5 min TTL)
    const blogs = await cachedQuery(
      cacheKey,
      async () =>
        await BlogModel.find({ userId })
          .sort({ createdAt: -1 })
          .select("+blogAgent.blog")
          .lean(),
      60 * 5 // 5 minutes
    );

    //  Create ETag from hash of JSON
    const bodyString = JSON.stringify(blogs);
    const etag = crypto.createHash("md5").update(bodyString).digest("hex");

    //  Build stable Response
    const res = new Response(bodyString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    //  Add CDN caching: safe for user-specific data (short TTL)
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=120"
    );

    //  Add ETag for browser revalidation
    res.headers.set("ETag", etag);

    return res;
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return new Response("Server Error", { status: 500 });
  }
};

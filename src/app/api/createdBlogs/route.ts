
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import { cachedQuery } from "@/lib/dbCache";
import crypto from "crypto";
import * as Sentry from "@sentry/nextjs";

export const GET = async () => {
  const span = Sentry.startSpan({ name: "api.fetch-blogs" }, (s) => s);

  try {
    const { userId } = await auth();

    if (!userId) {
      Sentry.captureMessage("Unauthorized blog fetch attempt", "warning");
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Cache key per user
    const cacheKey = `blogs:user:${userId}`;

    Sentry.addBreadcrumb({
      category: "db",
      message: "Fetching user blogs",
      level: "info",
      data: { cacheKey },
    });

    const blogs = await cachedQuery(
      cacheKey,
      async () =>
        await BlogModel.find({ userId })
          .sort({ createdAt: -1 })
          .select("+blogAgent.blog")
          .lean(),
      60 * 5 // 5 min TTL
    );

    const bodyString = JSON.stringify(blogs);
    const etag = crypto.createHash("md5").update(bodyString).digest("hex");

    const res = new Response(bodyString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=120"
    );
    res.headers.set("ETag", etag);

    return res;
  } catch (err) {
    Sentry.captureException(err, {
      extra: { route: "GET /api/blogs", note: "Failed to fetch blogs" },
    });

    return new Response("Server Error", { status: 500 });
  } finally {
    span.end();
  }
};

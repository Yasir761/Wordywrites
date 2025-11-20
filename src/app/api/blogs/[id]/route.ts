// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { connectDB } from "@/app/api/utils/db";
// import { BlogModel } from "@/app/models/blog";

// const ITEMS_PER_PAGE = 5;

// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectDB();

//     // Extract page from query string
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "0");
//     const skip = page * ITEMS_PER_PAGE;

//     const blogs = await BlogModel.find({ userId })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(ITEMS_PER_PAGE)
//       .lean();

//     const total = await BlogModel.countDocuments({ userId });
//     const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

//     return NextResponse.json({ blogs, totalPages });
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import * as Sentry from "@sentry/nextjs";

const ITEMS_PER_PAGE = 5;

export async function GET(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "Fetch User Blogs (Pagination)", op: "api.blog.fetch" },
    async () => {
      try {
        const { userId } = await auth();

        Sentry.addBreadcrumb({
          category: "blogs-api",
          message: "GET /api/blogs request received",
          level: "info",
          data: { url: req.url, userId },
        });

        if (!userId) {
          Sentry.captureMessage("Unauthorized blogs request", { level: "warning" });
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "0");

        Sentry.addBreadcrumb({
          category: "blogs-api",
          message: "Pagination details",
          level: "info",
          data: { page, itemsPerPage: ITEMS_PER_PAGE },
        });

        const skip = page * ITEMS_PER_PAGE;

        // Fetch blogs
        const blogs = await BlogModel.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(ITEMS_PER_PAGE)
          .lean();

        // Count total
        const total = await BlogModel.countDocuments({ userId });
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

        Sentry.addBreadcrumb({
          category: "blogs-api",
          message: "Fetched blogs successfully",
          level: "info",
          data: {
            returnedBlogs: blogs.length,
            totalBlogs: total,
            totalPages,
          },
        });

        return NextResponse.json({ blogs, totalPages });
      } catch (error) {
        Sentry.captureException(error);

        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
  );
}

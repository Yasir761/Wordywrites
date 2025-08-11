// import { NextResponse } from "next/server";
// import { connectDB } from "@/app/api/utils/db";
// import { BlogModel } from "@/app/models/blog";

// export async function GET(req: Request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "0", 10);
//     const ITEMS_PER_PAGE = 5;

//     // Fetch paginated blogs
//     const blogs = await BlogModel.find({})
//       .sort({ createdAt: -1 })
//       .skip(page * ITEMS_PER_PAGE)
//       .limit(ITEMS_PER_PAGE)
//       .lean();

//     const totalCount = await BlogModel.countDocuments();

//     // Format response with word count & full createdAt
//     const formattedBlogs = blogs.map((blog: any) => {
//       const seoScore = blog.seoAgent?.seo_score || 0;
//       const wordCount =
//         blog.blogAgent?.wordCount || blog.blogAgent?.content?.split(/\s+/).length || 0;

//       return {
//         id: blog._id.toString(),
//         title: blog.seoAgent?.optimized_title || "Untitled Blog",
//         date: new Date(blog.createdAt).toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         }),
//         createdAt: blog.createdAt, // raw date for flexibility
//         seoScore,
//         wordCount,
//       };
//     });

//     return NextResponse.json({
//       blogs: formattedBlogs,
//       totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
//     });
//   } catch (error) {
//     console.error("Error fetching recent blogs:", error);
//     return NextResponse.json(
//       { error: "Failed to load blogs" },
//       { status: 500 }
//     );
//   }
// }

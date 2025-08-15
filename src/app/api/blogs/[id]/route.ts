import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";

const ITEMS_PER_PAGE = 5;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Extract page from query string
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const skip = page * ITEMS_PER_PAGE;

    const blogs = await BlogModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .lean();

    const total = await BlogModel.countDocuments({ userId });
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return NextResponse.json({ blogs, totalPages });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

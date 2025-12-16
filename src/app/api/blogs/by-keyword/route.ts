// /api/blogs/by-keyword/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BlogModel } from "@/app/models/blog";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
  }

  const blog = await BlogModel.findOne({
    userId,
    "keywordAgent.keyword": keyword,
  })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(blog ?? null);
}

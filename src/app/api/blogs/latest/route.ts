import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BlogModel } from "@/app/models/blog";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blog = await BlogModel.findOne({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(blog);
}
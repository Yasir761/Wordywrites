import { NextResponse } from "next/server";
import {connectDB} from "@/app/api/utils/db";
import { BlogProfileModel } from "@/app/models/blogprofile";
import { auth } from "@clerk/nextjs/server";

// ✅ GET single profile
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await BlogProfileModel.findOne({ _id: params.id, userId });
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT update profile
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const profile = await BlogProfileModel.findOneAndUpdate(
      { _id: params.id, userId },
      body,
      { new: true }
    );

    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE profile
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await BlogProfileModel.findOneAndDelete({ _id: params.id, userId });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogProfileModel } from "@/app/models/blogprofile";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, context: any) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = context.params.id;
    const profile = await BlogProfileModel.findOne({ _id: id, userId });

    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = context.params.id;
    const body = await req.json();
    const profile = await BlogProfileModel.findOneAndUpdate({ _id: id, userId }, body, { new: true });

    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = context.params.id;

    const profile = await BlogProfileModel.findOne({ _id: id, userId });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    //  Block deleting default profile
    if (profile.isDefault) {
      return NextResponse.json(
        { error: "You cannot delete the default profile" },
        { status: 400 }
      );
    }

    await BlogProfileModel.deleteOne({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("BLOG PROFILE DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}


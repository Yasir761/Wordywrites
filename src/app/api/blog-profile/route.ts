import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogProfileModel } from "@/app/models/blogprofile";
import { auth } from "@clerk/nextjs/server";
import { getUserPlan } from "@/app/api/utils/planUtils";

/*  GET all profiles */
export async function GET() {
  try {
    await connectDB();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await BlogProfileModel.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(profiles, { status: 200 });
  } catch (error: any) {
    console.error("BLOG PROFILE GET ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ✅ CREATE profile */
export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email =
      (sessionClaims?.email as string) ||
      ((sessionClaims?.user as any)?.email as string) ||
      "";

    const plan = await getUserPlan(userId, email);

    const profileCount = await BlogProfileModel.countDocuments({ userId });
    if (plan.maxProfiles !== Infinity && profileCount >= plan.maxProfiles) {
      return NextResponse.json(
        { error: `You can only create ${plan.maxProfiles} profiles on ${plan.name}` },
        { status: 403 }
      );
    }

    const body = await req.json();

    const profile = await BlogProfileModel.create({
      ...body,
      userId,
    });

    return NextResponse.json(profile.toObject(), { status: 201 });
  } catch (error: any) {
    console.error("BLOG PROFILE POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

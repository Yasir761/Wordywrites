
import { NextResponse } from "next/server";
import {connectDB} from "@/app/api/utils/db";
import { BlogProfileModel } from "@/app/models/blogprofile";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserPlan } from "@/app/api/utils/planUtils";

export async function GET() {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profiles = await BlogProfileModel.find({ userId });
    return NextResponse.json(profiles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await auth();
    const clerkUser = await currentUser();
    if (!userId || !clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const plan = await getUserPlan(userId, email);

    // ✅ enforce profile limits
    const profileCount = await BlogProfileModel.countDocuments({ userId });
    if (plan.maxProfiles !== Infinity && profileCount >= plan.maxProfiles) {
      return NextResponse.json(
        { error: `You can only create up to ${plan.maxProfiles} blog profile(s) on the ${plan.name} plan.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    const profile = new BlogProfileModel({ ...body, userId });
    await profile.save();

    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

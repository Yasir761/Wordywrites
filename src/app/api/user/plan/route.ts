
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserModel } from "@/app/models/user";
import { connectDB } from "@/app/api/utils/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase() || "";

    //  Find user by Clerk userId first, fallback to email (normalized)
    let user = await UserModel.findOne({
      $or: [{ userId: clerkUser.id }, { email }],
    });

    if (!user) {
      // If truly not found, create new Free user
      user = new UserModel({
        userId: clerkUser.id,
        email,
        plan: "Free",
        credits: 5,
        blogsGeneratedThisMonth: 0,
        lastBlogReset: new Date(),
      });
      await user.save();
      console.log("Created new Free user:", user);
    }

    // Determine remaining blogs
    let blogsLeft: number | null;
    if (user.plan === "Free") {
      blogsLeft = Math.max(0, 5 - (user.blogsGeneratedThisMonth || 0));
    } else {
      // Pro/Starter → use credits from DB
      blogsLeft = user.credits ?? null;
    }

    console.log("User from DB:", user);
    console.log("Resolved planName:", user.plan);

    return NextResponse.json({
      plan: user.plan,
      credits: user.credits,
      blogsLeft,
      blogsGeneratedThisMonth: user.blogsGeneratedThisMonth,
    });
  } catch (err) {
    console.error(" Error in /api/user/plan:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

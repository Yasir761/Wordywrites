import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserModel } from "@/app/models/user";
import { connectDB } from "@/app/api/utils/db";

export async function GET() {
  try {
    console.log("API route called: /api/user/plan");

    // Check authentication
    const { userId } = await auth();
    console.log("User ID from auth:", userId);

    if (!userId) {
      console.log("No user ID found - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    // Get Clerk user info
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 });
    }
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";

    // Find user by ID or email to avoid duplicates
    console.log("Looking for user with ID or email:", userId, email);
    let user = await UserModel.findOne({
      $or: [{ userId }, { email }]
    });

    // If user doesn't exist, create them
    if (!user) {
      console.log("User not found in database, creating new user...");

      try {
        user = new UserModel({
          userId: clerkUser.id,
          email,
          plan: "Free",
          credits: 5,
          blogsGeneratedThisMonth: 0,
          lastBlogReset: new Date(),
        });

        await user.save();
        console.log("New user created:", user);
      } catch (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }
    } else {
      console.log("User already exists:", user);
    }

    // Calculate blogs left if Free plan
    const blogsLeft = user.plan === "Free"
      ? Math.max(0, 5 - user.blogsGeneratedThisMonth)
      : null;

    const response = {
      plan: user.plan,
      blogsLeft,
      blogsGeneratedThisMonth: user.blogsGeneratedThisMonth,
    };

    console.log("Sending response:", response);
    return NextResponse.json(response);

  } catch (err) {
    console.error("Error in /api/user/plan:", err);

    if (err instanceof Error) {
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
      },
      { status: 500 }
    );
  }
}

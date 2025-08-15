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

    // Find user
    console.log("Looking for user with ID:", userId);
    let user = await UserModel.findOne({ userId });
    
    // If user doesn't exist, create them
    if (!user) {
      console.log("User not found in database, creating new user...");
      
      try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
          return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 });
        }

        user = new UserModel({
          userId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
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
    }

    console.log("User found/created:", user ? "Yes" : "No");

    // Calculate blogs left if Free plan
    const blogsLeft = user.plan === "Free" ? Math.max(0, 5 - user.blogsGeneratedThisMonth) : null;
    
    const response = {
      plan: user.plan,
      blogsLeft,
      blogsGeneratedThisMonth: user.blogsGeneratedThisMonth,
    };
    
    console.log("Sending response:", response);
    return NextResponse.json(response);
    
  } catch (err) {
    console.error("Error in /api/user/plan:", err);
    
    // More detailed error logging
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
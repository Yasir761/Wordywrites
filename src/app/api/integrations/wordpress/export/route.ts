import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
// import { checkAndConsumeCredit } from "@/app/api/utils/useCredits";
import { publishBlogToWordPress } from "../publish";
import { WordPressPostSchema } from "../schema";
// import { connectDB } from "@/app/api/utils/db";


//  await connectDB(); 
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Remove spaces from application password before validation
  if (body.applicationPassword) {
    body.applicationPassword = body.applicationPassword.replace(/\s+/g, "");
  }

  // Validate input
  const validated = WordPressPostSchema.safeParse(body);
  if (!validated.success) {
    console.error("❌ Validation issues:", validated.error.format());
    return NextResponse.json(
      {
        error: "Invalid input",
        issues: validated.error.format(),
      },
      { status: 400 }
    );
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    });
    const user = await userRes.json();
    const email = user?.email_addresses?.[0]?.email_address;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 403 });
    }

    // await checkAndConsumeCredit(email, { allowOnly: ["Starter", "Pro"] });

    // Publish as draft
    const result = await publishBlogToWordPress(validated.data);

    // Build edit link (WordPress dashboard)
    const editLink = `${validated.data.siteUrl.replace(/\/$/, "")}/wp-admin/post.php?post=${result.id}&action=edit`;

    return NextResponse.json({
      success: true,
      editLink,
      result,
    });
  } catch (err: unknown) {
    console.error("💥 WordPress Export Error:", err);
    return NextResponse.json(
      {
        error: "Failed to export to WordPress",
        detail: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    );
  }
}

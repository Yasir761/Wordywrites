
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { publishBlogToWordPress } from "../publish";
import { WordPressPostSchema } from "../schema";
import {connectDB} from "@/app/api/utils/db";
import { BlogProfileModel } from "@/app/models/blogprofile";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, title, content } = body;

    if (!profileId) {
      return NextResponse.json({ error: "ProfileId is required" }, { status: 400 });
    }

    //  find profile
    const profile = await BlogProfileModel.findOne({ _id: profileId, userId });
    if (!profile) {
      return NextResponse.json({ error: "Blog profile not found" }, { status: 404 });
    }

    //  build WordPress payload
    const wpData = {
      siteUrl: profile.siteUrl,
      username: profile.username,
      applicationPassword: profile.appPassword.replace(/\s+/g, ""), // clean spaces
      title,
      content,
    };

    // Validate before sending
    const validated = WordPressPostSchema.safeParse(wpData);
    if (!validated.success) {
      console.error(" Validation issues:", validated.error.format());
      return NextResponse.json(
        { error: "Invalid input", issues: validated.error.format() },
        { status: 400 }
      );
    }

    //  publish as draft
    const result = await publishBlogToWordPress(validated.data);

    // Build edit link
    const editLink = `${profile.siteUrl.replace(/\/$/, "")}/wp-admin/post.php?post=${result.id}&action=edit`;

    return NextResponse.json({ success: true, editLink, result });
  } catch (err: unknown) {
    console.error(" WordPress Export Error:", err);
    return NextResponse.json(
      { error: "Failed to export to WordPress", detail: err instanceof Error ? err.message : err },
      { status: 500 }
    );
  }
}

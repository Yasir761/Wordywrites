
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { publishBlogToWordPress } from "../publish";
import { WordPressPostSchema } from "../schema";
import { connectDB } from "@/app/api/utils/db";
import { BlogProfileModel } from "@/app/models/blogprofile";
import { BlogModel } from "@/app/models/blog";
import { consumeCredits } from "@/lib/consumeCredits";

import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  const span = Sentry.startSpan({ name: "api.wordpress.publish" }, (s) => s);

  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      Sentry.captureMessage("Unauthorized WordPress publish attempt", "warning");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const credit = await consumeCredits(userId, "BLOG_PUBLISH_WORDPRESS");

if (!credit.allowed) {
  return NextResponse.json(
    {
      error: "No credits left",
      remainingCredits: credit.remainingCredits,
    },
    { status: 402 }
  );
}

    const body = await req.json();
 const { profileId, blogId, title, content, publishNow } = body;



    Sentry.addBreadcrumb({
      category: "wordpress",
      message: "Incoming publish request",
      data: { profileId, titleLength: title?.length, contentLength: content?.length },
      level: "info",
    });

    if (!profileId) {
      return NextResponse.json({ error: "ProfileId is required" }, { status: 400 });
    }

    // Fetch profile
    const profile = await BlogProfileModel.findOne({ _id: profileId, userId });

    if (!profile) {
      Sentry.captureMessage("WordPress profile not found", "error");
      return NextResponse.json({ error: "Blog profile not found" }, { status: 404 });
    }

    // Prepare final payload
    const wpData = {
      siteUrl: profile.siteUrl,
      username: profile.username,
      applicationPassword: profile.appPassword.replace(/\s+/g, ""),
      title,
      content,
    };

    // Validate WordPress request schema
    const validated = WordPressPostSchema.safeParse(wpData);
    if (!validated.success) {
      Sentry.captureException(validated.error, {
        extra: { wpData },
      });

      return NextResponse.json(
        { error: "Invalid input", issues: validated.error.format() },
        { status: 400 }
      );
    }

    Sentry.addBreadcrumb({
      category: "wordpress",
      message: "Publishing to WordPress...",
      data: { siteUrl: profile.siteUrl, username: profile.username },
      level: "info",
    });

    // Try publishing
    const result = await publishBlogToWordPress(validated.data,publishNow);

    // Build edit link
    const editLink = `${profile.siteUrl.replace(/\/$/, "")}/wp-admin/post.php?post=${
      result.id
    }&action=edit`;
     const publicLink = result.link; 

    if (blogId) {
     

  await BlogModel.findOneAndUpdate(
    { _id: blogId, userId },
    {
      status: publishNow ? "published" : "completed",
      wordpressPostId: result.id,
      wordpressEditLink: editLink,
      wordpressPublicLink: publicLink,
    }
  );
}

    return NextResponse.json({ success: true, editLink, result });
  } catch (err: unknown) {
    Sentry.captureException(err, {
      extra: { route: "/api/integrations/wordpress/export" },
      level: "error",
    });

    return NextResponse.json(
      {
        error: "Failed to export to WordPress",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}

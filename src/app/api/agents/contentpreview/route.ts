

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import { createGeneralTeaserPrompt } from "./prompt";
import { GeneralTeaserSchema } from "./schema";
import * as Sentry from "@sentry/nextjs";





interface BlogLean {
  seoAgent?: {
    optimized_title?: string;
  };
  blogAgent?: {
    blog?: string;
  };
}

export async function POST(req: NextRequest) {
  return Sentry.startSpan(
    { name: "Content Preview API", op: "api.post" },
    async () => {
      try {
        const { blogId } = await req.json();

        if (!blogId) {
          return NextResponse.json(
            { error: "Missing blogId" },
            { status: 400 }
          );
        }

        await connectDB();

        const blog = await BlogModel.findById(blogId).lean() as BlogLean | null;

        if (
          !blog?.seoAgent?.optimized_title ||
          !blog?.blogAgent?.blog
        ) {
          return NextResponse.json(
            { error: "Blog not ready for preview" },
            { status: 400 }
          );
        }

        const title = blog.seoAgent.optimized_title;
        const content = blog.blogAgent.blog;

        const prompt = createGeneralTeaserPrompt(title, content);

        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-20b",
              messages: [
                { role: "system", content: "You are a content strategist." },
                { role: "user", content: prompt },
              ],
              temperature: 0.4,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Groq teaser generation failed");
        }

        const json = await res.json();
        const raw = json.choices?.[0]?.message?.content || "";

        const teasers = raw
          .split("\n")
          .map((s: string) => s.trim())
          .filter(Boolean)
          .slice(0, 3);

        const result = GeneralTeaserSchema.parse({
          teasers,
          hashtags: ["#blog", "#seo"],
          engagementCTA: "Read the full blog →",
        });

        //  Persist preview
        await BlogModel.updateOne(
          { _id: blogId },
          { $set: { contentPreviewAgent: result } }
        );

        return NextResponse.json({ contentpreview: result });
      } catch (err: any) {
        Sentry.captureException(err);
        return NextResponse.json(
          { error: err.message || "Preview failed" },
          { status: 500 }
        );
      }
    }
  );
}

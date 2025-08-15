import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { CrawlEnhanceSchema } from "./schema";
import { createEnhancementPrompt } from "./prompt";
import { isWithinTokenLimit, splitTextByTokenLimit } from "@/app/api/utils/tokenUtils";
import { connectDB } from "@/app/api/utils/db";
import { CrawledBlogModel } from "@/app/models/crawledBlog";
// import { auth } from "@clerk/nextjs/server";
// import { checkProAccess } from "@/app/api/utils/useCredits";

const parser = new Parser();
const MAX_TOKENS = 4000;

export async function POST(req: NextRequest) {
  try {
    const { rssUrl, manualContent, manualTitle } = await req.json();

    await connectDB();

    let title = manualTitle || "";
    let content = manualContent || "";
    let meta = "";

    // --- MODE 1: RSS URL ---
    if (rssUrl && /^https?:\/\/.+/.test(rssUrl)) {
      const feed = await parser.parseURL(rssUrl);
      const firstItem = feed.items?.[0];
      if (!firstItem?.link || !firstItem?.title) {
        return NextResponse.json({ error: "No valid blog post found in RSS" }, { status: 404 });
      }

      const html = await fetch(firstItem.link).then(res => res.text());
      const $ = cheerio.load(html);

      content = $("article p, div.post-content p, p")
        .map((_, el) => $(el).text())
        .get()
        .join("\n")
        .trim();

      if (!content || content.length < 300) {
        return NextResponse.json({ error: "Blog content too short or not found" }, { status: 422 });
      }

      title = firstItem.title;
      meta = $("meta[name='description']").attr("content") || "";
    }

    // --- MODE 2: Manual Input ---
    else if (manualContent && manualContent.trim().length > 100) {
      title = manualTitle || "Untitled Blog";
      meta = "Enhanced blog generated from manual input";
    } else {
      return NextResponse.json(
        { error: "Provide either a valid RSS URL or sufficient manual content (min 100 chars)" },
        { status: 400 }
      );
    }

    // --- AI Agents (Intent, Tone, SEO) ---
    let intent, toneVoice, seo;
    try {
      [intent, toneVoice, seo] = await Promise.all([
        fetch("http://localhost:3000/api/agents/keyword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: title }),
        }).then(res => res.json()),

        fetch("http://localhost:3000/api/agents/tone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: title }),
        }).then(res => res.json()),

        fetch("http://localhost:3000/api/agents/seo-optimizer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword: title,
            outline: [],
            tone: "informative",
            voice: "neutral",
            tags: [],
          }),
        }).then(res => res.json()),
      ]);
    } catch (err) {
      console.error("AI Agents failed:", err);
      return NextResponse.json({ error: "Failed to fetch AI agents" }, { status: 500 });
    }

    // --- Enhancement Prompt ---
    const enhancedPrompt = `
You are an expert blog editor. Improve the following blog post:

Title: ${title}
Meta: ${meta}
Tone: ${toneVoice?.tone || "informative"}
Voice: ${toneVoice?.voice || "neutral"}
Intent: ${intent?.intent || "Informational"}
SEO: ${seo?.optimized_title || ""}, ${seo?.meta_description || ""}

Content:
${content}

Enhance by:
- Keep original meaning
- Improve tone, grammar, flow
- Use Markdown headers
- Boost SEO where possible
- Expand to at least 800 words
- Conclude with a summary

Return only the enhanced blog content in Markdown.
    `.trim();

    if (!isWithinTokenLimit(enhancedPrompt, MAX_TOKENS)) {
      return NextResponse.json(
        { error: "Prompt too long", chunks: splitTextByTokenLimit(enhancedPrompt, MAX_TOKENS) },
        { status: 413 }
      );
    }

    // --- AI Enhancement ---
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a precise and SEO-aware blog improver." },
          { role: "user", content: enhancedPrompt },
        ],
        temperature: 0.4,
      }),
    });

    const aiJson = await aiRes.json();
    const enhancedBlog = aiJson.choices?.[0]?.message?.content?.trim();
    if (!enhancedBlog || enhancedBlog.length < 400) {
      return NextResponse.json({ error: "Enhanced blog is too short or missing" }, { status: 500 });
    }

    // --- Difference Analysis ---
    const diffPrompt = createEnhancementPrompt(content, enhancedBlog);
    if (!isWithinTokenLimit(diffPrompt, MAX_TOKENS)) {
      return NextResponse.json(
        { error: "Comparison prompt too long", suggestion: "Try smaller blog content" },
        { status: 413 }
      );
    }

    const compareJson = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a JSON diff analyzer." },
          { role: "user", content: diffPrompt },
        ],
        temperature: 0.2,
      }),
    }).then(res => res.json());

    let comparison;
    try {
      comparison = JSON.parse(compareJson.choices?.[0]?.message?.content || "{}");
    } catch {
      return NextResponse.json({ error: "Failed to parse comparison JSON" }, { status: 500 });
    }

    // --- Validation ---
    const result = CrawlEnhanceSchema.safeParse({
      original: {
        title,
        content,
        meta_description: meta,
        tone: toneVoice?.tone,
        voice: toneVoice?.voice,
        seo,
        intent: intent?.intent,
      },
      enhanced: {
        title: seo?.optimized_title,
        content: enhancedBlog,
        meta_description: seo?.meta_description,
        tone: toneVoice?.tone,
        voice: toneVoice?.voice,
        seo,
        intent: intent?.intent,
      },
      changes: comparison,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Final validation failed", issues: result.error.flatten() },
        { status: 422 }
      );
    }

    // --- Save & Respond ---
    await CrawledBlogModel.create({
      sourceUrl: rssUrl || "manual-input",
      title,
      original: result.data.original,
      enhanced: result.data.enhanced,
      changes: result.data.changes,
      createdAt: new Date(),
    });

    return NextResponse.json(result.data);
  } catch (err) {
    console.error("💥 Crawl & Enhance Agent Error:", err);
    return NextResponse.json({ error: "Internal server error - Crawl Agent Failed" }, { status: 500 });
  }
}

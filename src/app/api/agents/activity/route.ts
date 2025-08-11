
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BlogModel } from "@/app/models/blog";
import { connectDB } from "@/app/api/utils/db";
import { getUserPlan } from "@/app/api/utils/planUtils";

const ALL_AGENTS = [
  { key: "keyword", name: "Keyword Agent", description: "The Keyword Agent analyzes your target keyword to determine the searcher’s true intent — whether it's informational, transactional, navigational, or commercial. It uses AI to precisely parse and validate the keyword.", type: "automated" },
  { key: "blueprint", name: "Outline Agent", description: "The Blog Blueprint Agent transforms your keyword and tone into a clean, AI-powered blog outline. It ensures you're writing with purpose and structure, saving time and aligning your content with your SEO and content goals.", type: "manual" },
  { key: "seo", name: "SEO Agent", description: "The SEO takes your blog blueprint (keyword, outline, tone, voice, and tags) and produces a fully optimized SEO package, including title, meta description, slugs, and schema-ready content essentials .", type: "automated" },
  { key: "tone", name: "Tone Agent", description: "The Tone agent analyzes your blog’s topic and suggests the most fitting tone and voice — helping your content sound exactly the way your audience expects. Whether it's casual, authoritative, witty, or bold, the Tone Agent ensures your blog speaks with the right personality", type: "manual" },
  { key: "hashtags", name: "Hashtag Agent", description: "The Hashtag Agent analyzes your blog’s keyword and generates high-impact, contextually relevant hashtags — optimized for platforms like Twitter, LinkedIn, and Medium. It’s built to boost discoverability without sounding generic or spammy.", type: "automated" },
  { key: "teaser", name: "Teaser Agent", description: "The Teaser agent distills your full blog into punchy, scroll-stopping teaser lines — perfect for promoting on LinkedIn, Medium, newsletters, or email intros. It captures the essence, hooks, and hashtags in a way that entices readers to click", type: "automated" },
  { key: "analyze", name: "Analyze Agent", description: "The Analyze Agent scans the top-ranking pages on Google for your keyword using SERP data. It identifies common content structures, keyword patterns, and topical gaps across competitors. This agent highlights what users and search engines expect from high-performing content, helping you strategically position your blog for better SEO and engagement.", type: "manual" },
  { key: "crawl", name: "Crawl Agent", description: "The Crawl Agent extracts content from external blogs via RSS feeds or allows manual content input. It enriches this content by analyzing tone, intent, and SEO factors, then enhances it using AI. The result? An improved, SEO-friendly blog post that matches your voice and content goals — complete with Markdown formatting and a content difference report.", type: "automated" },
  { key: "blog", name: "Blog Writing Agent", description: "The Blog Agent generates a high-quality, SEO-optimized blog post using AI. It combines keyword intent, a structured outline, tone guidance, and SEO metadata to produce clean, publish-ready content.", type: "automated" },
];

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const plan = await getUserPlan(userId);

  const latestBlog = await BlogModel.findOne({ userId }).sort({ createdAt: -1 }).lean() as { createdAt?: Date } | null;

  const agents = ALL_AGENTS.map(agent => {
    return {
      name: agent.name,
      description: agent.description,
      type: agent.type,
      active: plan.aiAgents.includes(agent.key),
      lastRun: latestBlog?.createdAt ? new Date(latestBlog.createdAt).toLocaleString() : null
    };
  });

  return NextResponse.json({ agents });
}

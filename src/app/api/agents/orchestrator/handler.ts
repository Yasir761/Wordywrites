import { clerkClient } from "@clerk/clerk-sdk-node";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import { getUserPlan } from "@/app/api/utils/planUtils";
import { UserModel } from "@/app/models/user";
import { performance } from "perf_hooks";

const AGENT_ENDPOINTS = {
  analyze: "/api/agents/analyze",
  crawl: "/api/agents/crawl",
  keyword: "/api/agents/keyword",
  blueprint: "/api/agents/blueprint",
  tone: "/api/agents/tone",
  hashtags: "/api/agents/hashtags",
  seo: "/api/agents/seo-optimizer",
  blog: "/api/agents/blog",
  contentpreview: "/api/agents/contentpreview",
};

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
const baseUrl = getBaseUrl();

export async function orchestratorHandler({
  userId,
  keyword,
  crawlUrl,
}: {
  userId: string;
  keyword: string;
  crawlUrl?: string;
}) {
  console.log(" QStash triggered orchestrator for:", keyword);
  const startAll = performance.now();

  //  Connect to DB
  await connectDB();

  // Get user (fallback to system)
  let email = "system@wordywrites.ai";
  try {
    const user = await clerkClient.users.getUser(userId);
    email = user?.emailAddresses?.[0]?.emailAddress || email;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : String(err);
    console.warn(" Clerk lookup failed:", message);
  }

  //  Ensure user record
  await UserModel.findOneAndUpdate(
    { email },
    { userId, email },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Plan check (fallback to Pro for dev)
  const plan = await getUserPlan(userId).catch(() => ({
    name: "Pro",
    aiAgents: Object.keys(AGENT_ENDPOINTS),
  }));

  //  Agent caller helper
  const callAgent = async (agent: keyof typeof AGENT_ENDPOINTS, body: any) => {
    if (!plan.aiAgents.includes(agent))
      throw { agent, status: 403, error: `Agent "${agent}" not allowed for ${plan.name}` };

    const start = performance.now();
    const res = await fetch(`${baseUrl}${AGENT_ENDPOINTS[agent]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw { status: res.status, agent, error: json };
    console.log(` ${agent} finished in ${(performance.now() - start).toFixed(1)}ms`);
    return json;
  };

  //  Parallel Agent Execution (with dependencies)
  const [analyze, keywordData] = await Promise.all([
    callAgent("analyze", { keyword }),
    callAgent("keyword", { keyword }),
  ]);

  const [tone, tagsData] = await Promise.all([
    callAgent("tone", { keyword }),
    callAgent("hashtags", { keyword }),
  ]);

  // Include outline + analyze in SEO call
  const [blueprint, seo] = await Promise.all([
    callAgent("blueprint", { keyword, tone: tone.tone, intent: keywordData.intent }),
    callAgent("seo", {
      keyword,
      tone: tone.tone,
      voice: tone.voice,
      tags: tagsData.tags,
      analyze,
      outline: keywordData?.outline || [],
    }),
  ]);

  //  Use blueprint’s outline or fallback
  const finalOutline =
    blueprint?.outline || (Array.isArray(keywordData?.outline) ? keywordData.outline : []);

  //  Run Blog first (so we can use blog content for preview)
  const blog = await callAgent("blog", {
    keyword,
    outline: finalOutline,
    tone: tone.tone,
    seo,
  });

  //  Now generate Content Preview using blog content
  const [preview, crawl] = await Promise.all([
    callAgent("contentpreview", {
      title: seo.optimized_title || keyword,
      content: blog.blog || "", //  pass generated blog content
    }),
    crawlUrl ? callAgent("crawl", { url: crawlUrl }) : Promise.resolve(null),
  ]);

  //  Save all results
  await BlogModel.create({
    userId,
    keywordAgent: { keyword, intent: keywordData.intent },
    toneAgent: tone,
    blueprintAgent: blueprint,
    seoAgent: seo,
    blogAgent: blog,
    analyzeAgent: analyze,
    crawlAgent: crawl,
    ContentPreviewAgent: preview,
    status: "draft",
    createdAt: new Date(),
  });

  console.log(" Orchestrator completed in", (performance.now() - startAll).toFixed(2), "ms");
}

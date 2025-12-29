
import { clerkClient } from "@clerk/clerk-sdk-node";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import { getUserPlan } from "@/app/api/utils/planUtils";
import { UserModel } from "@/app/models/user";
import { batchGet, batchSet } from "@/lib/cacheBatch";
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
  // contentpreview: "/api/agents/contentpreview",
};

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.APP_URL || "http://localhost:3000";
}
const baseUrl = getBaseUrl();

export async function orchestratorHandler({
  userId,
  keyword,
  crawlUrl,
}: {
  userId?: string;
  keyword: string;
  crawlUrl?: string;
}) {
  console.log(` QStash triggered orchestrator for: "${keyword}"`);
  const startAll = performance.now();

  //  Connect to DB
  await connectDB();

  //  Handle missing user (for local or Postman testing)
  if (!userId) {
    if (process.env.NODE_ENV === "development") {
      
      console.warn(" No userId provided — using fallback dev_user_1234");
      userId = "dev_user_1234";
    } else {
      console.error(" Missing userId in production");
      throw new Error("Unauthorized: Missing userId");
    }
  }

  // 3️ Clerk user lookup (with fallback email)
  let email = "system@wordywrites.ai";
  try {
    const user = await clerkClient.users.getUser(userId);
    email = user?.emailAddresses?.[0]?.emailAddress || email;
    console.log(` Clerk user found: ${email}`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : String(err);
    console.warn(" Clerk lookup failed:", message);
    console.log(" Using fallback email:", email);
  }

  //  Ensure user record exists
  await UserModel.findOneAndUpdate(
    { email },
    { userId, email },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(" User record ensured in DB");

  //  Get plan (fallback to Pro for testing)
  const plan = await getUserPlan(userId).catch(() => ({
    name: "Pro",
    aiAgents: Object.keys(AGENT_ENDPOINTS),
  }));

  console.log(` Active Plan: ${plan.name}`);
const jobId = Date.now(); // simple, works

  //  Define cache keys
  const keys = {
    analyze: `agent:analyze:${keyword}`,
    keyword: `agent:keyword:${keyword}`,
    tone: `agent:tone:${keyword}`,
    hashtags: `agent:hashtags:${keyword}`,
    blueprint: `agent:blueprint:${keyword}`,
    seo: `agent:seo:${keyword}`,
    blog: `agent:blog:${keyword}:${jobId}`,
    // contentpreview: `agent:contentpreview:${keyword}`,
  };

  //  Prefetch Redis cache
  console.time(" REDIS_MGET");
  const cached = await batchGet(Object.values(keys));
  console.timeEnd(" REDIS_MGET");

  const cacheStatus: Record<string, string> = {};
  const ttl = 60 * 60 * 24; // 24 hours



  class AgentError extends Error {
  agent: string;
  status: number;
  payload: any;

  constructor(agent: string, status: number, payload: any) {
    super(`Agent ${agent} failed with status ${status}`);
    this.agent = agent;
    this.status = status;
    this.payload = payload;
  }
}
  //  Agent call helper
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

    console.log(` ${agent} generated in ${(performance.now() - start).toFixed(1)}ms`);
    return json;
  };



//   const res = await fetch(`${baseUrl}${AGENT_ENDPOINTS[agent]}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   const text = await res.text();

//   if (!res.ok) {
//     throw new Error(
//       `Agent ${agent} failed (${res.status}): ${text.slice(0, 120)}`
//     );
//   }

//   try {
//     return JSON.parse(text);
//   } catch {
//     throw new Error(`Agent ${agent} returned non-JSON response`);
//   }
// };

  //  Cache retrieval or regeneration
  async function getOrGenerate(
    idx: number,
    agent: keyof typeof AGENT_ENDPOINTS,
    body: any
  ) {
    if (cached[idx]) {
      cacheStatus[agent] = " CACHE HIT";
      return  JSON.parse(JSON.stringify(cached[idx]));
    }
    cacheStatus[agent] = " MISS → generating";
    return await callAgent(agent, body);
  }

  //  Parallel agent orchestration
  const [analyze, keywordData] = await Promise.all([
    getOrGenerate(0, "analyze", { keyword }),
    getOrGenerate(1, "keyword", { keyword }),
  ]);

  const [tone, tagsData] = await Promise.all([
    getOrGenerate(2, "tone", { keyword }),
    getOrGenerate(3, "hashtags", { keyword }),
  ]);


const blueprint = await getOrGenerate(4, "blueprint", {
  keyword,
  tone: tone.tone,
  intent: keywordData.intent,
});

//  SEO depends on blueprint.outline
const seo = await getOrGenerate(5, "seo", {
  keyword,
  outline: blueprint.outline,
  tone: tone.tone,
  voice: tone.voice,
  tags: tagsData.tags,
});

  const finalOutline =
    blueprint?.outline || (Array.isArray(keywordData?.outline) ? keywordData.outline : []);

  // const blog = await getOrGenerate(6, "blog", {
  //   keyword,
  //   outline: finalOutline,
  //   tone: tone.tone,
  //   seo,
  // });

  // Do NOT generate blog text here
const blog = {
  keyword,
  blog: "", // filled by stream
};
  // const preview = await getOrGenerate(7, "contentpreview", {
  //   title: seo.optimized_title || keyword,
  //   content: blog.blog || "",
  // });

  const crawl = crawlUrl ? await callAgent("crawl", { url: crawlUrl }) : null;

  //  Cache all new results
  const newEntries: Array<[string, any, number]> = [];
  const results: Record<keyof typeof keys, any> = {
    analyze,
    keyword: keywordData,
    tone,
    hashtags: tagsData,
    blueprint,
    seo,
    blog,
    // contentpreview: preview, 
  };

  Object.keys(keys).forEach((agent, i) => {
    if (!cached[i]) {
      newEntries.push([keys[agent as keyof typeof keys], results[agent as keyof typeof keys], ttl]);
    }
  });

  console.time(" REDIS_PIPELINE_SET");
  await batchSet(newEntries);
  console.timeEnd(" REDIS_PIPELINE_SET");

  //  Save results to DB
  // const blogDoc = await BlogModel.create({
  //   userId,
  //   keywordAgent: { keyword, intent: keywordData.intent },
  //   toneAgent: tone,
  //   blueprintAgent: blueprint,
  //   seoAgent: seo,
  //   blogAgent: blog,
  //   analyzeAgent: analyze,
  //   crawlAgent: crawl,
  //   // ContentPreviewAgent: preview,
  //   status: "draft",
  //   createdAt: new Date(),
  // });
const blogDoc = await BlogModel.create({
  userId,
  keywordAgent: { keyword, intent: keywordData.intent },
  toneAgent: tone,
  blueprintAgent: blueprint,
  seoAgent: seo,
  blogAgent: { blog: "" }, // streamed later
  analyzeAgent: analyze,
  crawlAgent: crawl,
  status: "streaming",

});
  //  Cache summary
  console.log("\n CACHE STATUS SUMMARY:");
  Object.entries(cacheStatus).forEach(([agent, status]) =>
    console.log(`  → ${agent.padEnd(15)} : ${status}`)
  );

  console.log(
    `\n Orchestrator completed in ${(performance.now() - startAll).toFixed(2)}ms`
  );



  // return {
  //   keyword,
  //   seo,
  //   blog: blog.blog || "",
  //   // contentpreview: preview,
  //   tone,
  //   hashtags: tagsData.tags || tagsData,
  //   analyze,
  //   blueprint,
  //   blogId: blogDoc._id.toString(),
  // };



  return {
  blogId: blogDoc._id.toString(),
  keyword,
  seo,
  tone,
  hashtags: tagsData.tags || tagsData,
  analyze,
  blueprint,
  // contentpreview: preview,
};
}
 
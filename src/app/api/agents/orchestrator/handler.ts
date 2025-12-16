// import { clerkClient } from "@clerk/clerk-sdk-node";
// import { connectDB } from "@/app/api/utils/db";
// import { BlogModel } from "@/app/models/blog";
// import { getUserPlan } from "@/app/api/utils/planUtils";
// import { UserModel } from "@/app/models/user";
// import { performance } from "perf_hooks";

// const AGENT_ENDPOINTS = {
//   analyze: "/api/agents/analyze",
//   crawl: "/api/agents/crawl",
//   keyword: "/api/agents/keyword",
//   blueprint: "/api/agents/blueprint",
//   tone: "/api/agents/tone",
//   hashtags: "/api/agents/hashtags",
//   seo: "/api/agents/seo-optimizer",
//   blog: "/api/agents/blog",
//   contentpreview: "/api/agents/contentpreview",
// };

// function getBaseUrl() {
//   if (typeof window !== "undefined") return "";
//   return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
// }
// const baseUrl = getBaseUrl();

// export async function orchestratorHandler({
//   userId,
//   keyword,
//   crawlUrl,
// }: {
//   userId: string;
//   keyword: string;
//   crawlUrl?: string;
// }) {
//   console.log(" QStash triggered orchestrator for:", keyword);
//   const startAll = performance.now();

//   //  Connect to DB
//   await connectDB();

//   // Get user (fallback to system)
//   let email = "system@wordywrites.ai";
//   try {
//     const user = await clerkClient.users.getUser(userId);
//     email = user?.emailAddresses?.[0]?.emailAddress || email;
//   } catch (err) {
//     const message =
//       err instanceof Error ? err.message : typeof err === "string" ? err : String(err);
//     console.warn(" Clerk lookup failed:", message);
//   }

//   //  Ensure user record
//   await UserModel.findOneAndUpdate(
//     { email },
//     { userId, email },
//     { upsert: true, new: true, setDefaultsOnInsert: true }
//   );

//   // Plan check (fallback to Pro for dev)
//   const plan = await getUserPlan(userId).catch(() => ({
//     name: "Pro",
//     aiAgents: Object.keys(AGENT_ENDPOINTS),
//   }));

//   //  Agent caller helper
//   const callAgent = async (agent: keyof typeof AGENT_ENDPOINTS, body: any) => {
//     if (!plan.aiAgents.includes(agent))
//       throw { agent, status: 403, error: `Agent "${agent}" not allowed for ${plan.name}` };

//     const start = performance.now();
//     const res = await fetch(`${baseUrl}${AGENT_ENDPOINTS[agent]}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     const json = await res.json();
//     if (!res.ok) throw { status: res.status, agent, error: json };
//     console.log(` ${agent} finished in ${(performance.now() - start).toFixed(1)}ms`);
//     return json;
//   };

//   //  Parallel Agent Execution (with dependencies)
//   const [analyze, keywordData] = await Promise.all([
//     callAgent("analyze", { keyword }),
//     callAgent("keyword", { keyword }),
//   ]);

//   const [tone, tagsData] = await Promise.all([
//     callAgent("tone", { keyword }),
//     callAgent("hashtags", { keyword }),
//   ]);

//   // Include outline + analyze in SEO call
//   const [blueprint, seo] = await Promise.all([
//     callAgent("blueprint", { keyword, tone: tone.tone, intent: keywordData.intent }),
//     callAgent("seo", {
//       keyword,
//       tone: tone.tone,
//       voice: tone.voice,
//       tags: tagsData.tags,
//       analyze,
//       outline: keywordData?.outline || [],
//     }),
//   ]);

//   //  Use blueprint’s outline or fallback
//   const finalOutline =
//     blueprint?.outline || (Array.isArray(keywordData?.outline) ? keywordData.outline : []);

//   //  Run Blog first (so we can use blog content for preview)
//   const blog = await callAgent("blog", {
//     keyword,
//     outline: finalOutline,
//     tone: tone.tone,
//     seo,
//   });

//   //  Now generate Content Preview using blog content
//   const [preview, crawl] = await Promise.all([
//     callAgent("contentpreview", {
//       title: seo.optimized_title || keyword,
//       content: blog.blog || "", //  pass generated blog content
//     }),
//     crawlUrl ? callAgent("crawl", { url: crawlUrl }) : Promise.resolve(null),
//   ]);

//   //  Save all results
//   await BlogModel.create({
//     userId,
//     keywordAgent: { keyword, intent: keywordData.intent },
//     toneAgent: tone,
//     blueprintAgent: blueprint,
//     seoAgent: seo,
//     blogAgent: blog,
//     analyzeAgent: analyze,
//     crawlAgent: crawl,
//     ContentPreviewAgent: preview,
//     status: "draft",
//     createdAt: new Date(),
//   });

//   console.log(" Orchestrator completed in", (performance.now() - startAll).toFixed(2), "ms");
// }


// import { clerkClient } from "@clerk/clerk-sdk-node";
// import { connectDB } from "@/app/api/utils/db";
// import { BlogModel } from "@/app/models/blog";
// import { getUserPlan } from "@/app/api/utils/planUtils";
// import { UserModel } from "@/app/models/user";
// import { batchGet, batchSet } from "@/lib/cacheBatch";
// import { performance } from "perf_hooks";

// const AGENT_ENDPOINTS = {
//   analyze: "/api/agents/analyze",
//   crawl: "/api/agents/crawl",
//   keyword: "/api/agents/keyword",
//   blueprint: "/api/agents/blueprint",
//   tone: "/api/agents/tone",
//   hashtags: "/api/agents/hashtags",
//   seo: "/api/agents/seo-optimizer",
//   blog: "/api/agents/blog",
//   contentpreview: "/api/agents/contentpreview",
// };

// function getBaseUrl() {
//   if (typeof window !== "undefined") return "";
//   return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
// }
// const baseUrl = getBaseUrl();

// export async function orchestratorHandler({
//   userId,
//   keyword,
//   crawlUrl,
// }: {
//   userId: string;
//   keyword: string;
//   crawlUrl?: string;
// }) {
//   console.log(`🚀 QStash triggered orchestrator for: "${keyword}"`);
//   const startAll = performance.now();

//   // 🔌 Connect to MongoDB
//   await connectDB();

//   // 👤 Clerk user lookup
//   let email = "system@wordywrites.ai";
//   try {
//     const user = await clerkClient.users.getUser(userId);
//     email = user?.emailAddresses?.[0]?.emailAddress || email;
//   } catch (err) {
//     console.warn("⚠️ Clerk lookup failed:", err);
//   }

//   // 🧩 Ensure user exists in DB
//   await UserModel.findOneAndUpdate(
//     { email },
//     { userId, email },
//     { upsert: true, new: true, setDefaultsOnInsert: true }
//   );

//   // 💳 Plan check
//   const plan = await getUserPlan(userId).catch(() => ({
//     name: "Pro",
//     aiAgents: Object.keys(AGENT_ENDPOINTS),
//   }));

//   const keys = {
//     analyze: `agent:analyze:${keyword}`,
//     keyword: `agent:keyword:${keyword}`,
//     tone: `agent:tone:${keyword}`,
//     hashtags: `agent:hashtags:${keyword}`,
//     blueprint: `agent:blueprint:${keyword}`,
//     seo: `agent:seo:${keyword}`,
//     blog: `agent:blog:${keyword}`,
//     contentpreview: `agent:contentpreview:${keyword}`,
//   };

//   // 🧠 Prefetch from Redis
//   console.time("🧠 REDIS_MGET");
//   const cached = await batchGet(Object.values(keys));
//   console.timeEnd("🧠 REDIS_MGET");

//   const cacheStatus: Record<string, string> = {};
//   const ttl = 60 * 60 * 24; // 24 hours

//   // ⚙️ Helper to call agents
//   const callAgent = async (agent: keyof typeof AGENT_ENDPOINTS, body: any) => {
//     if (!plan.aiAgents.includes(agent))
//       throw { agent, status: 403, error: `Agent "${agent}" not allowed for ${plan.name}` };

//     const start = performance.now();
//     const res = await fetch(`${baseUrl}${AGENT_ENDPOINTS[agent]}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });
//     const json = await res.json();
//     if (!res.ok) throw { status: res.status, agent, error: json };

//     console.log(`⚙️ ${agent} generated in ${(performance.now() - start).toFixed(1)}ms`);
//     return json;
//   };

//   // 📦 Helper for cache retrieval or generation
//   async function getOrGenerate(
//     idx: number,
//     agent: keyof typeof AGENT_ENDPOINTS,
//     body: any
//   ) {
//     if (cached[idx]) {
//       cacheStatus[agent] = "🟢 CACHE HIT";
//       return cached[idx];
//     }
//     cacheStatus[agent] = "🟡 MISS → generating";
//     return await callAgent(agent, body);
//   }

//   // 🧩 Orchestrator parallel execution
//   const [analyze, keywordData] = await Promise.all([
//     getOrGenerate(0, "analyze", { keyword }),
//     getOrGenerate(1, "keyword", { keyword }),
//   ]);

//   const [tone, tagsData] = await Promise.all([
//     getOrGenerate(2, "tone", { keyword }),
//     getOrGenerate(3, "hashtags", { keyword }),
//   ]);

//   const [blueprint, seo] = await Promise.all([
//     getOrGenerate(4, "blueprint", { keyword, tone: tone.tone, intent: keywordData.intent }),
//     getOrGenerate(5, "seo", {
//       keyword,
//       tone: tone.tone,
//       voice: tone.voice,
//       tags: tagsData.tags,
//       analyze,
//     }),
//   ]);

//   const finalOutline =
//     blueprint?.outline || (Array.isArray(keywordData?.outline) ? keywordData.outline : []);

//   const blog = await getOrGenerate(6, "blog", {
//     keyword,
//     outline: finalOutline,
//     tone: tone.tone,
//     seo,
//   });

//   const preview = await getOrGenerate(7, "contentpreview", {
//     title: seo.optimized_title || keyword,
//     content: blog.blog || "",
//   });

//   const crawl = crawlUrl ? await callAgent("crawl", { url: crawlUrl }) : null;

//   // 💾 Batch set new results
//   const newEntries: Array<[string, any, number]> = [];
//   const allAgents = Object.keys(keys) as Array<keyof typeof keys>;

//   // map agent names to their generated results (note: keyword agent result is in keywordData, hashtags in tagsData)
//   const results: Record<keyof typeof keys, any> = {
//     analyze,
//     keyword: keywordData,
//     tone,
//     hashtags: tagsData,
//     blueprint,
//     seo,
//     blog,
//     contentpreview: preview,
//   };

//   allAgents.forEach((agent, i) => {
//     if (!cached[i]) {
//       newEntries.push([keys[agent], results[agent], ttl]);
//     }
//   });

//   console.time("💾 REDIS_PIPELINE_SET");
//   await batchSet(newEntries);
//   console.timeEnd("💾 REDIS_PIPELINE_SET");

//   // 🧱 Save all results to DB
//   await BlogModel.create({
//     userId,
//     keywordAgent: { keyword, intent: keywordData.intent },
//     toneAgent: tone,
//     blueprintAgent: blueprint,
//     seoAgent: seo,
//     blogAgent: blog,
//     analyzeAgent: analyze,
//     crawlAgent: crawl,
//     ContentPreviewAgent: preview,
//     status: "draft",
//     createdAt: new Date(),
//   });

//   console.log("\n🧩 CACHE STATUS SUMMARY:");
//   Object.entries(cacheStatus).forEach(([agent, status]) =>
//     console.log(`  → ${agent.padEnd(15)} : ${status}`)
//   );

//   console.log(
//     `\n✅ Orchestrator completed in ${(performance.now() - startAll).toFixed(2)}ms`
//   );
// }










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
  contentpreview: "/api/agents/contentpreview",
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

  //  Define cache keys
  const keys = {
    analyze: `agent:analyze:${keyword}`,
    keyword: `agent:keyword:${keyword}`,
    tone: `agent:tone:${keyword}`,
    hashtags: `agent:hashtags:${keyword}`,
    blueprint: `agent:blueprint:${keyword}`,
    seo: `agent:seo:${keyword}`,
    blog: `agent:blog:${keyword}`,
    contentpreview: `agent:contentpreview:${keyword}`,
  };

  //  Prefetch Redis cache
  console.time(" REDIS_MGET");
  const cached = await batchGet(Object.values(keys));
  console.timeEnd(" REDIS_MGET");

  const cacheStatus: Record<string, string> = {};
  const ttl = 60 * 60 * 24; // 24 hours

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

  //  Cache retrieval or regeneration
  async function getOrGenerate(
    idx: number,
    agent: keyof typeof AGENT_ENDPOINTS,
    body: any
  ) {
    if (cached[idx]) {
      cacheStatus[agent] = " CACHE HIT";
      return cached[idx];
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

  const [blueprint, seo] = await Promise.all([
    getOrGenerate(4, "blueprint", { keyword, tone: tone.tone, intent: keywordData.intent }),
    getOrGenerate(5, "seo", {
      keyword,
      tone: tone.tone,
      voice: tone.voice,
      tags: tagsData.tags,
      analyze,
    }),
  ]);

  const finalOutline =
    blueprint?.outline || (Array.isArray(keywordData?.outline) ? keywordData.outline : []);

  const blog = await getOrGenerate(6, "blog", {
    keyword,
    outline: finalOutline,
    tone: tone.tone,
    seo,
  });

  const preview = await getOrGenerate(7, "contentpreview", {
    title: seo.optimized_title || keyword,
    content: blog.blog || "",
  });

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
    contentpreview: preview,
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

  //  Cache summary
  console.log("\n CACHE STATUS SUMMARY:");
  Object.entries(cacheStatus).forEach(([agent, status]) =>
    console.log(`  → ${agent.padEnd(15)} : ${status}`)
  );

  console.log(
    `\n Orchestrator completed in ${(performance.now() - startAll).toFixed(2)}ms`
  );
}
 







// import { clerkClient } from "@clerk/clerk-sdk-node";
// import { connectDB } from "@/app/api/utils/db";
// import { BlogModel } from "@/app/models/blog";
// import { getUserPlan } from "@/app/api/utils/planUtils";
// import { UserModel } from "@/app/models/user";
// import { batchGet, batchSet } from "@/lib/cacheBatch";
// import { performance } from "perf_hooks";

// // IMPORT AGENT LOGIC DIRECTLY
// import { analyzeAgent } from "@/app/api/agents/analyze/logic";
// import { keywordAgent } from "@/app/api/agents/keyword/logic";
// import { toneAgent } from "@/app/api/agents/tone/logic";
// import { hashtagAgent } from "@/app/api/agents/hashtags/logic";
// import { blueprintAgent } from "@/app/api/agents/blueprint/logic";
// import { seoAgent } from "@/app/api/agents/seo-optimizer/logic";
// import { blogAgent } from "@/app/api/agents/blog/logic";
// import { contentPreviewAgent } from "@/app/api/agents/contentpreview/logic";
// import { crawlAgent } from "@/app/api/agents/crawl/logic";

// export async function orchestratorHandler({
//   userId,
//   keyword,
//   crawlUrl,
// }: {
//   userId?: string;
//   keyword: string;
//   crawlUrl?: string;
// }) {
//   const startAll = performance.now();
//   console.log(`🚀 Orchestrator started for: "${keyword}"`);

//   //  DB
//   await connectDB();

//   if (!userId) {
//     throw new Error("Unauthorized: Missing userId");
//   }

//   //  Clerk user
//   let email = "system@wordywrites.ai";
//   try {
//     const user = await clerkClient.users.getUser(userId);
//     email = user.emailAddresses?.[0]?.emailAddress ?? email;
//   } catch {
//     console.warn("Clerk lookup failed, using fallback email");
//   }

//   //  Ensure user exists
//   await UserModel.findOneAndUpdate(
//     { email },
//     { userId, email },
//     { upsert: true, new: true, setDefaultsOnInsert: true }
//   );

//   //  Plan
//   const plan = await getUserPlan(userId).catch(() => ({
//     name: "Pro",
//     aiAgents: ["*"],
//   }));

//   //  Redis keys
//   const keys = {
//     analyze: `agent:analyze:${keyword}`,
//     keyword: `agent:keyword:${keyword}`,
//     tone: `agent:tone:${keyword}`,
//     hashtags: `agent:hashtags:${keyword}`,
//     blueprint: `agent:blueprint:${keyword}`,
//     seo: `agent:seo:${keyword}`,
//     blog: `agent:blog:${keyword}`,
//     preview: `agent:contentpreview:${keyword}`,
//   };

//   const cached = await batchGet(Object.values(keys));
//   const ttl = 60 * 60 * 24;

//   //  Agents (PURE FUNCTIONS)
//   const analyze = cached[0] ?? await analyzeAgent({ keyword });
//   const keywordData = cached[1] ?? await keywordAgent({ keyword });

//   const tone = cached[2] ?? await toneAgent({ keyword });
//   const hashtags = cached[3] ?? await hashtagAgent({ keyword });

//   const blueprint = cached[4] ?? await blueprintAgent({
//     keyword,
//     tone: tone.tone,
//     intent: keywordData.intent,
//   });

//   const seo = cached[5] ?? await seoAgent({
//     keyword,
//     tone: tone.tone,
//     voice: tone.voice,
//     tags: hashtags.tags,
//     analyze,
//   });

//   const blog = cached[6] ?? await blogAgent({
//     keyword,
//     outline: blueprint.outline,
//     tone: tone.tone,
//     seo,
//   });

//   const preview = cached[7] ?? await contentPreviewAgent({
//     title: seo.optimized_title,
//     content: blog.blog,
//   });

//   const crawl = crawlUrl ? await crawlAgent({ url: crawlUrl }) : null;

//   //  Cache new
//   await batchSet(
//     [
//       [keys.analyze, analyze, ttl],
//       [keys.keyword, keywordData, ttl],
//       [keys.tone, tone, ttl],
//       [keys.hashtags, hashtags, ttl],
//       [keys.blueprint, blueprint, ttl],
//       [keys.seo, seo, ttl],
//       [keys.blog, blog, ttl],
//       [keys.preview, preview, ttl],
//     ],
//     ttl
//   );

//   //  SAVE BLOG (THIS WAS NEVER REACHED BEFORE)
//   const savedBlog = await BlogModel.create({
//     userId,
//     keywordAgent: { keyword, intent: keywordData.intent },
//     toneAgent: tone,
//     blueprintAgent: blueprint,
//     seoAgent: seo,
//     blogAgent: blog,
//     analyzeAgent: analyze,
//     crawlAgent: crawl,
//     ContentPreviewAgent: preview,
//     status: "draft",
//   });

//   console.log(
//     ` Orchestrator finished in ${(performance.now() - startAll).toFixed(2)}ms`
//   );

//   //  RETURN VALUE (IMPORTANT)
//   return savedBlog;
// }











































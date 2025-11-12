// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { clerkClient } from "@clerk/clerk-sdk-node";
// import { connectDB } from "@/app/api/utils/db";
// import { BlogModel } from "@/app/models/blog";

// import { getUserPlan } from "@/app/api/utils/planUtils";
// import { UserModel } from "@/app/models/user";



// function getBaseUrl() {
//   if (typeof window !== "undefined") return ""; // browser
//   return process.env.NEXT_PUBLIC_APP_URL ; // server
// }

// const baseUrl = getBaseUrl();

// const AGENT_ENDPOINTS = {
//   analyze: `${baseUrl}/api/agents/analyze`,
//   crawl: `${baseUrl}/api/agents/crawl`,
//   keyword: `${baseUrl}/api/agents/keyword`,
//   blueprint: `${baseUrl}/api/agents/blueprint`,
//   tone: `${baseUrl}/api/agents/tone`,
//   hashtags: `${baseUrl}/api/agents/hashtags`,
//   seo: `${baseUrl}/api/agents/seo-optimizer`,
//   blog: `${baseUrl}/api/agents/blog`,
//   teaser: `${baseUrl}/api/agents/teaser`,
// };







// export async function POST(req: NextRequest) {
//   const { userId } = await auth();
//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized: Please sign in" }, { status: 401 });
//   }

//   const user = await clerkClient.users.getUser(userId).catch(() => null);
//   const emailVerified = user?.emailAddresses?.[0]?.verification?.status === "verified";
//   if (!emailVerified) {
//     return NextResponse.json({ error: "Email not verified" }, { status: 403 });
//   }

//   const { keyword, crawlUrl } = await req.json();
//   if (!keyword) {
//     return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
//   }

//   try {
//     await connectDB();

//     const plan = await getUserPlan(userId);
//     //  const plan = {
//     //   name: "Pro",
//     //   monthlyCredits: Infinity,
//     //   aiAgents: [
//     //     "analyze",
//     //     "crawl",
//     //     "keyword",
//     //     "blueprint",
//     //     "tone",
//     //     "hashtags",
//     //     "seo",
//     //     "blog",
//     //   ],
//     //   integrations: ["wordpress", "gdocs", "twitter", "medium"],
//     // };

//     // ✅ Check and reset monthly blog count for Free plan
//     if (plan.name === "Free") {
//       const dbUser = await UserModel.findOne({ email: user.emailAddresses[0].emailAddress });
//       if (!dbUser) {
//         return NextResponse.json({ error: "User not found in database" }, { status: 404 });
//       }

//       const now = new Date();
//       const lastReset = new Date(dbUser.lastBlogReset);

//       // Reset if new month
//       if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
//         dbUser.blogsGeneratedThisMonth = 0;
//         dbUser.lastBlogReset = now;
//         await dbUser.save();
//       }

//       // Check limit
//       if (dbUser.blogsGeneratedThisMonth >= 5) {
//         return NextResponse.json(
//           { error: "Free plan limit reached (5 blogs per month). Upgrade to continue." },
//           { status: 403 }
//         );
//       }
//     }

//     const isUnlimited = plan.monthlyCredits === Infinity;

//     if (!isUnlimited && plan.name !== "Free") {
//       const thisMonth = new Date();
//       thisMonth.setDate(1);
//       thisMonth.setHours(0, 0, 0, 0);
//       const blogCount = await BlogModel.countDocuments({
//         userId,
//         createdAt: { $gte: thisMonth },
//       });

//       if (blogCount >= plan.monthlyCredits) {
//         return NextResponse.json(
//           { error: "Monthly blog generation limit reached for your plan." },
//           { status: 403 }
//         );
//       }
//     }

//     const callAgent = async (agent: keyof typeof AGENT_ENDPOINTS, body: any) => {
//       if (!plan.aiAgents.includes(agent)) {
//         throw {
//           agent,
//           status: 403,
//           error: `Agent "${agent}" not available in your current plan.`,
//         };
//       }

//       const start = performance.now();
//       const res = await fetch(`${AGENT_ENDPOINTS[agent]}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const end = performance.now();

//       const json = await res.json();

//       if (!res.ok) {
//         console.error(`❌ Agent "${agent}" failed`, json);
//         throw { status: res.status, agent, error: json };
//       }

//       return json;
//     };

//     // --- EXISTING FLOW ---
//     const keywordData = await callAgent("keyword", { keyword });
//     const intent = keywordData.intent;

//     const analyze = plan.aiAgents.includes("analyze")
//       ? await callAgent("analyze", { keyword })
//       : null;

//     const toneData = plan.aiAgents.includes("tone")
//       ? await callAgent("tone", { keyword })
//       : { tone: null, voice: null };
//     const { tone, voice } = toneData;

//     const blueprintData = await callAgent("blueprint", {
//       keyword,
//       tone,
//       intent,
//     });
//     const outline = blueprintData.outline;

//     const tagData = plan.aiAgents.includes("hashtags")
//       ? await callAgent("hashtags", { keyword })
//       : { tags: [] };
//     const tags = tagData.tags;

//     const seo = plan.aiAgents.includes("seo")
//       ? await callAgent("seo", {
//           keyword,
//           outline,
//           tone,
//           voice,
//           tags,
//         })
//       : {
//           optimized_title: null,
//           meta_description: null,
//           slug: null,
//           final_hashtags: [],
//         };

//     const writerData = await callAgent("blog", {
//       keyword,
//       outline,
//       tone,
//       voice,
//       seo,
//       analyze,
//     });

//     const crawlData =
//       crawlUrl && plan.aiAgents.includes("crawl")
//         ? await callAgent("crawl", { url: crawlUrl })
//         : null;

//     const teaserData = plan.aiAgents.includes("teaser")
//       ? await callAgent("teaser", {
//           title: seo.optimized_title || keyword,
//           content: writerData.blog,
//         })
//       : null;

//     const saved = await BlogModel.create({
//       userId,
//       keywordAgent: { keyword, intent },
//       toneAgent: { tone, voice },
//       blueprintAgent: { outline },
//       seoAgent: seo,
//       blogAgent: {
//         blog: writerData.blog,
//         keyword: writerData.keyword,
//         wordCount: writerData.wordCount,
//       },
//       ...(analyze && {
//         analyzeAgent: {
//           top_keywords: analyze.top_keywords,
//           avg_word_count: analyze.avg_word_count,
//           competitors: analyze.competitors,
//         },
//       }),
//       ...(crawlData && {
//         crawlAgent: {
//           urls: crawlData.urls,
//           extracted_texts: crawlData.extracted_texts,
//         },
//       }),
//       ...(teaserData && {
//         teaserAgent: {
//           teasers: teaserData.teasers,
//           hashtags: teaserData.hashtags,
//           engagementCTA: teaserData.engagementCTA,
//         },
//       }),
//       status: "draft",
//       createdAt: new Date(),
//     });

//     // ✅ Increment Free plan usage count
//     if (plan.name === "Free") {
//       await UserModel.updateOne(
//         { email: user.emailAddresses[0].emailAddress },
//         { $inc: { blogsGeneratedThisMonth: 1 } }
//       );
//     }

//     return NextResponse.json({
//       message: "✅ Blog successfully created",
//       keyword: saved.blogAgent.keyword,
//       blog: saved.blogAgent.blog,
//       wordCount: saved.blogAgent.wordCount,
//       seo: saved.seoAgent,
//       tone: saved.toneAgent.tone,
//       voice: saved.toneAgent.voice,
//       teaser: saved.teaserAgent
//         ? {
//             teasers: saved.teaserAgent.teasers,
//             hashtags: saved.teaserAgent.hashtags,
//             engagementCTA: saved.teaserAgent.engagementCTA,
//           }
//         : null,
//     });
//   } catch (err: any) {
//     console.error("💥 Orchestrator error:", err);

//     if (err?.agent && err?.status) {
//       return NextResponse.json(
//         {
//           error: `Agent ${err.agent} failed`,
//           details: err.error || "Unknown agent error",
//         },
//         { status: err.status }
//       );
//     }

//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }





















// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { clerkClient } from "@clerk/clerk-sdk-node";
// import { connectDB } from "@/app/api/utils/db";
// import { BlogModel } from "@/app/models/blog";
// import { performance } from "perf_hooks";
// import { getUserPlan } from "@/app/api/utils/planUtils";
// import { UserModel } from "@/app/models/user";

// function getBaseUrl() {
//   if (typeof window !== "undefined") return "";
//   return process.env.APP_URL || "http://localhost:3000";
// }
// const baseUrl = getBaseUrl();

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

// export async function POST(req: NextRequest) {
//   const { userId } = await auth();
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const user = await clerkClient.users.getUser(userId).catch(() => null);
//   const email = user?.emailAddresses?.[0]?.emailAddress;
//   const emailVerified = user?.emailAddresses?.[0]?.verification?.status === "verified";
//   if (!emailVerified) return NextResponse.json({ error: "Email not verified" }, { status: 403 });

//   const { keyword, crawlUrl } = await req.json();
//   if (!keyword) return NextResponse.json({ error: "Missing keyword" }, { status: 400 });

//   try {
//     await connectDB();
//     await UserModel.findOneAndUpdate(
//       { email },
//       { userId, email },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     const plan = await getUserPlan(userId);

//     // --- Free plan limiter ---
//     if (plan.name === "Free") {
//       const dbUser = await UserModel.findOne({ email });
//       const now = new Date();
//       const lastReset = new Date(dbUser.lastBlogReset);
//       if (now.getMonth() !== lastReset.getMonth()) {
//         dbUser.blogsGeneratedThisMonth = 0;
//         dbUser.lastBlogReset = now;
//       }
//       if (dbUser.blogsGeneratedThisMonth >= 5) {
//         return NextResponse.json({ error: "Free plan limit reached (5 blogs/month)" }, { status: 403 });
//       }
//       await dbUser.save();
//     }

//     // --- Helper to call each agent ---
//     const callAgent = async (agent: keyof typeof AGENT_ENDPOINTS, body: any) => {
//       if (!plan.aiAgents.includes(agent))
//         throw { agent, status: 403, error: `Agent "${agent}" not allowed for ${plan.name}` };

//       const start = performance.now();
//       const url = `${baseUrl}${AGENT_ENDPOINTS[agent]}`;
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const json = await res.json();
//       if (!res.ok) throw { status: res.status, agent, error: json };
//       console.log(`⚡ ${agent} finished in ${(performance.now() - start).toFixed(1)}ms`);
//       return json;
//     };

//     // ---------------------------
//     // 🚀 PARALLEL EXECUTION FLOW
//     // ---------------------------

//     console.log("🎯 Running orchestrator in parallel mode...");

//     // Step 1️⃣ Run Analyze + Keyword together
//     const [analyzeResult, keywordResult] = await Promise.allSettled([
//       callAgent("analyze", { keyword }),
//       callAgent("keyword", { keyword }),
//     ]);

//     const analyze =
//       analyzeResult.status === "fulfilled" ? analyzeResult.value : null;
//     const keywordData =
//       keywordResult.status === "fulfilled" ? keywordResult.value : null;

//     // Step 2️⃣ Run Tone + Hashtags together
//     const [toneResult, hashtagsResult] = await Promise.allSettled([
//       callAgent("tone", { keyword }),
//       callAgent("hashtags", { keyword }),
//     ]);

//     const tone =
//       toneResult.status === "fulfilled" ? toneResult.value : { tone: "neutral", voice: "default" };
//     const tags =
//       hashtagsResult.status === "fulfilled" ? hashtagsResult.value.tags : [];

//     // Step 3️⃣ Run Blueprint + SEO together (dependent on tone + keyword)
//     const [blueprintResult, seoResult] = await Promise.allSettled([
//       callAgent("blueprint", {
//         keyword,
//         tone: tone.tone,
//         intent: keywordData?.intent || "Informational",
//       }),
//       callAgent("seo", {
//         keyword,
//         tone: tone.tone,
//         voice: tone.voice,
//         tags,
//       }),
//     ]);

//     const blueprint =
//       blueprintResult.status === "fulfilled" ? blueprintResult.value : { outline: [] };
//     const seo =
//       seoResult.status === "fulfilled" ? seoResult.value : {};

//     // Step 4️⃣ Run Blog + ContentPreview + Crawl (in parallel)
//     const [blogResult, previewResult, crawlResult] = await Promise.allSettled([
//       callAgent("blog", {
//         keyword,
//         outline: blueprint.outline,
//         tone: tone.tone,
//         voice: tone.voice,
//         seo,
//         analyze,
//       }),
//       callAgent("contentpreview", {
//         title: seo.optimized_title || keyword,
//         content: "",
//       }),
//       crawlUrl ? callAgent("crawl", { url: crawlUrl }) : Promise.resolve(null),
//     ]);

//     const blog =
//       blogResult.status === "fulfilled" ? blogResult.value : null;
//     const contentpreview =
//       previewResult.status === "fulfilled" ? previewResult.value : null;
//     const crawl =
//       crawlResult.status === "fulfilled" ? crawlResult.value : null;

//     // Step 5️⃣ Save result
//     const saved = await BlogModel.create({
//       userId,
//       keywordAgent: { keyword, intent: keywordData?.intent },
//       toneAgent: tone,
//       blueprintAgent: blueprint,
//       seoAgent: seo,
//       blogAgent: blog,
//       analyzeAgent: analyze,
//       crawlAgent: crawl,
//       ContentPreviewAgent: contentpreview,
//       status: "draft",
//       createdAt: new Date(),
//     });

//     // Update monthly limit if Free
//     if (plan.name === "Free") {
//       await UserModel.updateOne({ email }, { $inc: { blogsGeneratedThisMonth: 1 } });
//     }

//     return NextResponse.json({
//       message: "✅ Blog created successfully (parallel mode)",
//       keyword: saved.keywordAgent.keyword,
//       blog: saved.blogAgent.blog,
//       wordCount: saved.blogAgent.wordCount,
//       seo: saved.seoAgent,
//       tone: saved.toneAgent,
//       hashtags: tags,
//       analyze,
//       contentpreview,
//     });
//   } catch (err: any) {
//     console.error("💥 Orchestrator error:", err);
//     return NextResponse.json(
//       {
//         error: err.agent ? `Agent ${err.agent} failed` : "Internal error",
//         details: err.error || err.message,
//       },
//       { status: err.status || 500 }
//     );
//   }
// }




// import { NextRequest, NextResponse } from "next/server";
// import { client } from "@/lib/qstash";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (!body.keyword || !body.userId) {
//       return NextResponse.json({ error: "Missing keyword or userId" }, { status: 400 });
//     }

//     const result = await client.publishJSON({
//       url: `${process.env.APP_URL}/api/workers/orchestrator`,
//       body,
//       retries: 3,
//     });

//     console.log("📩 Orchestrator job queued:", result.messageId);

//     return NextResponse.json({
//       message: "Blog generation started",
//       jobId: result.messageId,
//       status: "queued",
//     });
//   } catch (err: any) {
//     console.error("💥 Queue error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { keyword, crawlUrl } = await req.json();

  const result = await client.publishJSON({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workers/orchestrator`,
    body: { userId, keyword, crawlUrl },
    retries: 1,
  });

  console.log(" Orchestrator job queued:", result.messageId);
  return NextResponse.json({ queued: true, jobId: result.messageId });
}




// develpoment mode 




// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import { Client } from "@upstash/qstash";

// const client = new Client({ token: process.env.QSTASH_TOKEN! });

// export async function POST(req: NextRequest) {
//   // --- DEV MODE BYPASS ---
//   const devBypass = process.env.NODE_ENV === "development";
//   const { userId } = devBypass ? { userId: "user_dev_test_123" } : await auth();

//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { keyword, crawlUrl } = await req.json();

//   const result = await client.publishJSON({
//     url: `${process.env.APP_URL}/api/workers/orchestrator`,
//     body: { userId, keyword, crawlUrl },
//     retries: 1,
//   });

//   console.log("📩 Orchestrator job queued:", result.messageId);
//   return NextResponse.json({ queued: true, jobId: result.messageId });
// }

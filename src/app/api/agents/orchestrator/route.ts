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




















// orchestrator.ts
import { NextRequest, NextResponse } from "next/server"; 
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
import { performance } from "perf_hooks";
import { getUserPlan } from "@/app/api/utils/planUtils";
import { UserModel } from "@/app/models/user";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.APP_URL || "http://localhost:3000";
}
const baseUrl = getBaseUrl();

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

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId).catch(() => null);
  const email = user?.emailAddresses?.[0]?.emailAddress;

await connectDB();
await UserModel.findOneAndUpdate(
  { email },
  { userId, email },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

  const emailVerified = user?.emailAddresses?.[0]?.verification?.status === "verified";
  if (!emailVerified) {
    return NextResponse.json({ error: "Email not verified" }, { status: 403 });
  }

  const { keyword, crawlUrl } = await req.json();
  if (!keyword) {
    return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
  }

  try {
    await connectDB();
    const plan = await getUserPlan(userId);

    // --- Free Plan Monthly Check ---
    if (plan.name === "Free") {
      const dbUser = await UserModel.findOne({ email: user.emailAddresses[0].emailAddress });
      if (!dbUser) {
        return NextResponse.json({ error: "User not found in database" }, { status: 404 });
      }
      const now = new Date();
      const lastReset = new Date(dbUser.lastBlogReset);
      if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
        dbUser.blogsGeneratedThisMonth = 0;
        dbUser.lastBlogReset = now;
        await dbUser.save();
      }
      if (dbUser.blogsGeneratedThisMonth >= 5) {
        return NextResponse.json(
          { error: "Free plan limit reached (5 blogs per month)." },
          { status: 403 }
        );
      }
    }

    // --- Agent caller ---
    const callAgent = async (agent: keyof typeof AGENT_ENDPOINTS, body: any) => {
      if (!plan.aiAgents.includes(agent)) {
        throw { agent, status: 403, error: `Agent "${agent}" not allowed in ${plan.name} plan.` };
      }
      const start = performance.now();
      const url = `${baseUrl}${AGENT_ENDPOINTS[agent]}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw { status: res.status, agent, error: json };
      console.log(`🧠 ${agent} took ${(performance.now() - start).toFixed(2)}ms`);
      return json;
    };

    // --- FLOW HANDLING ---
    let saved;
    if (plan.name === "Free") {
      console.log("🎯 Running FREE flow...");
      const keywordData = await callAgent("keyword", { keyword });
      const blueprintData = await callAgent("blueprint", { keyword });
      const writerData = await callAgent("blog", { keyword, outline: blueprintData.outline });

      saved = await BlogModel.create({
        userId,
        keywordAgent: { keyword, intent: keywordData.intent },
        blueprintAgent: { outline: blueprintData.outline },
        blogAgent: {
          blog: writerData.blog,
          keyword: writerData.keyword,
          wordCount: writerData.wordCount,
        },
        status: "draft",
        createdAt: new Date(),
      });

      await UserModel.updateOne(
        { email: user.emailAddresses[0].emailAddress },
        { $inc: { blogsGeneratedThisMonth: 1 } }
      );
    } else {
      console.log("🎯 Running PRO flow...");
      const keywordData = await callAgent("keyword", { keyword });
      const analyze = await callAgent("analyze", { keyword });
      const toneData = await callAgent("tone", { keyword });
      const blueprintData = await callAgent("blueprint", {
        keyword,
        tone: toneData.tone,
        intent: keywordData.intent,
      });
      const tagData = await callAgent("hashtags", { keyword });
      const seo = await callAgent("seo", {
        keyword,
        outline: blueprintData.outline,
        tone: toneData.tone,
        voice: toneData.voice,
        tags: tagData.tags,
      });
      const writerData = await callAgent("blog", {
        keyword,
        outline: blueprintData.outline,
        tone: toneData.tone,
        voice: toneData.voice,
        seo,
        analyze,
      });
      const crawlData = crawlUrl ? await callAgent("crawl", { url: crawlUrl }) : null;
      const contentpreviewData = await callAgent("contentpreview", {
        title: seo.optimized_title || keyword,
        content: writerData.blog,
      });

      saved = await BlogModel.create({
        userId,
        keywordAgent: { keyword, intent: keywordData.intent },
        toneAgent: { tone: toneData.tone, voice: toneData.voice },
        blueprintAgent: { outline: blueprintData.outline },
        seoAgent: seo,
        blogAgent: {
          blog: writerData.blog,
          keyword: writerData.keyword,
          wordCount: writerData.wordCount,
        },
        analyzeAgent: analyze,
        crawlAgent: crawlData,
        ContentPreviewAgent: contentpreviewData,
        status: "draft",
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      message: "✅ Blog created",
      keyword: saved.blogAgent.keyword,
      blog: saved.blogAgent.blog,
      wordCount: saved.blogAgent.wordCount,
      seo: saved.seoAgent || null,
      tone: saved.toneAgent?.tone || null,
      voice: saved.toneAgent?.voice || null,
      contentpreview: saved.ContentPreviewAgent || null,
    });
  } catch (err: any) {
    console.error("💥 Orchestrator error:", err);
    return NextResponse.json(
      { error: err.agent ? `Agent ${err.agent} failed` : "Internal error", details: err.error || err.message },
      { status: err.status || 500 }
    );
  }
}

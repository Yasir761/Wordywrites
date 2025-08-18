import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { connectDB } from "@/app/api/utils/db";
import { BlogModel } from "@/app/models/blog";
// import { performance } from "perf_hooks";
import { getUserPlan } from "@/app/api/utils/planUtils";
import { UserModel } from "@/app/models/user";



function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser
  return process.env.NEXT_PUBLIC_APP_URL ; // server
}

const baseUrl = getBaseUrl();

const AGENT_ENDPOINTS = {
  analyze: `${baseUrl}/api/agents/analyze`,
  crawl: `${baseUrl}/api/agents/crawl`,
  keyword: `${baseUrl}/api/agents/keyword`,
  blueprint: `${baseUrl}/api/agents/blueprint`,
  tone: `${baseUrl}/api/agents/tone`,
  hashtags: `${baseUrl}/api/agents/hashtags`,
  seo: `${baseUrl}/api/agents/seo-optimizer`,
  blog: `${baseUrl}/api/agents/blog`,
  teaser: `${baseUrl}/api/agents/teaser`,
};





    // without the crawl and analyze agents


// export async function POST(req: NextRequest) {
//   const { userId } = await auth();
//   console.log("USER ID IN ORCHESTRATOR", userId);
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

//     const plan = {
//       name: "Pro",
//       monthlyCredits: Infinity,
//       aiAgents: [
//         "analyze",
//         "crawl",
//         "keyword",
//         "blueprint",
//         "tone",
//         "hashtags",
//         "seo",
//         "blog",
//       ],
//       integrations: ["wordpress", "gdocs", "twitter", "medium"],
//     };

//     const isUnlimited = plan.monthlyCredits === Infinity;

//     if (!isUnlimited) {
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

//       const res = await fetch(`${BASE_URL}${AGENT_ENDPOINTS[agent]}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const json = await res.json();
//       if (!res.ok) throw { status: res.status, agent, error: json };
//       return json;
//     };

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
//       status: "draft",
//       createdAt: new Date(),
//     });

//     return NextResponse.json({
//       message: "✅ Blog successfully created",
//       keyword: saved.blogAgent.keyword,
//       blog: saved.blogAgent.blog,
//       wordCount: saved.blogAgent.wordCount,
//       seo: saved.seoAgent,
//       tone: saved.toneAgent.tone,
//       voice: saved.toneAgent.voice,
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



// without teaser agent 


// export async function POST(req: NextRequest) {
//   const { userId } = await auth();
//   console.log("USER ID IN ORCHESTRATOR", userId);
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


// const plan = await getUserPlan(userId); 

//     const isUnlimited = plan.monthlyCredits === Infinity;

//     if (!isUnlimited) {
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
//       const res = await fetch(`${BASE_URL}${AGENT_ENDPOINTS[agent]}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const end = performance.now();

//       const json = await res.json();
//       console.log(`🧠 Agent "${agent}" took ${(end - start).toFixed(2)}ms`);

//       if (!res.ok) {
//         console.error(`❌ Agent "${agent}" failed`, json);
//         throw { status: res.status, agent, error: json };
//       }

//       return json;
//     };

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
//       status: "draft",
//       createdAt: new Date(),
//     });

//     console.log("✅ Blog created and saved to DB:", saved._id);

//     return NextResponse.json({
//       message: "✅ Blog successfully created",
//       keyword: saved.blogAgent.keyword,
//       blog: saved.blogAgent.blog,
//       wordCount: saved.blogAgent.wordCount,
//       seo: saved.seoAgent,
//       tone: saved.toneAgent.tone,
//       voice: saved.toneAgent.voice,
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





// without the utility functions for monthly credits and plan checks

// export async function POST(req: NextRequest) {
//   const { userId } = await auth();
//   // console.log("USER ID IN ORCHESTRATOR", userId);
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
//     //     "teaser", 
//     //   ],
//     //   integrations: ["wordpress", "gdocs", "twitter", "medium"],
//     // };

//     const isUnlimited = plan.monthlyCredits === Infinity;

//     if (!isUnlimited) {
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
//       const res = await fetch(`${BASE_URL}${AGENT_ENDPOINTS[agent]}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const end = performance.now();

//       const json = await res.json();
//       // console.log(`🧠 Agent "${agent}" took ${(end - start).toFixed(2)}ms`);

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

//     // --- NEW: GENERAL TEASER ---
//     const teaserData = plan.aiAgents.includes("teaser")
//       ? await callAgent("teaser", {
//           title: seo.optimized_title || keyword,
//           content: writerData.blog,
//         })
//       : null;

//       // console.log("Teaser Data from agent:", teaserData);

//     // --- SAVE TO DB ---
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
//       ...(teaserData && { teaserAgent: {
//         teasers: teaserData.teasers,
//         hashtags: teaserData.hashtags,
//         engagementCTA: teaserData.engagementCTA,
//       }

//        }), // Save teaser
//       status: "draft",
//       createdAt: new Date(),
//     });

//     // console.log("Saved Teaser Agent in DB:", saved.teaserAgent);

//     // console.log("✅ Blog created and saved to DB:", saved._id);

//     return NextResponse.json({
//       message: "✅ Blog successfully created",
//       keyword: saved.blogAgent.keyword,
//       blog: saved.blogAgent.blog,
//       wordCount: saved.blogAgent.wordCount,
//       seo: saved.seoAgent,
//       tone: saved.toneAgent.tone,
//       voice: saved.toneAgent.voice,
//       teaser: saved.teaserAgent ? {
//       teasers: saved.teaserAgent.teasers,
//       hashtags: saved.teaserAgent.hashtags,
//       engagementCTA: saved.teaserAgent.engagementCTA,
//     }
//   : null, // Include teaser in response
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



export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized: Please sign in" }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId).catch(() => null);
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
    //  const plan = {
    //   name: "Pro",
    //   monthlyCredits: Infinity,
    //   aiAgents: [
    //     "analyze",
    //     "crawl",
    //     "keyword",
    //     "blueprint",
    //     "tone",
    //     "hashtags",
    //     "seo",
    //     "blog",
    //   ],
    //   integrations: ["wordpress", "gdocs", "twitter", "medium"],
    // };

    // ✅ Check and reset monthly blog count for Free plan
    if (plan.name === "Free") {
      const dbUser = await UserModel.findOne({ email: user.emailAddresses[0].emailAddress });
      if (!dbUser) {
        return NextResponse.json({ error: "User not found in database" }, { status: 404 });
      }

      const now = new Date();
      const lastReset = new Date(dbUser.lastBlogReset);

      // Reset if new month
      if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
        dbUser.blogsGeneratedThisMonth = 0;
        dbUser.lastBlogReset = now;
        await dbUser.save();
      }

      // Check limit
      if (dbUser.blogsGeneratedThisMonth >= 5) {
        return NextResponse.json(
          { error: "Free plan limit reached (5 blogs per month). Upgrade to continue." },
          { status: 403 }
        );
      }
    }

    const isUnlimited = plan.monthlyCredits === Infinity;

    if (!isUnlimited && plan.name !== "Free") {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      const blogCount = await BlogModel.countDocuments({
        userId,
        createdAt: { $gte: thisMonth },
      });

      if (blogCount >= plan.monthlyCredits) {
        return NextResponse.json(
          { error: "Monthly blog generation limit reached for your plan." },
          { status: 403 }
        );
      }
    }

    const callAgent = async (agent: keyof typeof AGENT_ENDPOINTS, body: any) => {
      if (!plan.aiAgents.includes(agent)) {
        throw {
          agent,
          status: 403,
          error: `Agent "${agent}" not available in your current plan.`,
        };
      }

      const start = performance.now();
      const res = await fetch(`${AGENT_ENDPOINTS[agent]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const end = performance.now();

      const json = await res.json();

      if (!res.ok) {
        console.error(`❌ Agent "${agent}" failed`, json);
        throw { status: res.status, agent, error: json };
      }

      return json;
    };

    // --- EXISTING FLOW ---
    const keywordData = await callAgent("keyword", { keyword });
    const intent = keywordData.intent;

    const analyze = plan.aiAgents.includes("analyze")
      ? await callAgent("analyze", { keyword })
      : null;

    const toneData = plan.aiAgents.includes("tone")
      ? await callAgent("tone", { keyword })
      : { tone: null, voice: null };
    const { tone, voice } = toneData;

    const blueprintData = await callAgent("blueprint", {
      keyword,
      tone,
      intent,
    });
    const outline = blueprintData.outline;

    const tagData = plan.aiAgents.includes("hashtags")
      ? await callAgent("hashtags", { keyword })
      : { tags: [] };
    const tags = tagData.tags;

    const seo = plan.aiAgents.includes("seo")
      ? await callAgent("seo", {
          keyword,
          outline,
          tone,
          voice,
          tags,
        })
      : {
          optimized_title: null,
          meta_description: null,
          slug: null,
          final_hashtags: [],
        };

    const writerData = await callAgent("blog", {
      keyword,
      outline,
      tone,
      voice,
      seo,
      analyze,
    });

    const crawlData =
      crawlUrl && plan.aiAgents.includes("crawl")
        ? await callAgent("crawl", { url: crawlUrl })
        : null;

    const teaserData = plan.aiAgents.includes("teaser")
      ? await callAgent("teaser", {
          title: seo.optimized_title || keyword,
          content: writerData.blog,
        })
      : null;

    const saved = await BlogModel.create({
      userId,
      keywordAgent: { keyword, intent },
      toneAgent: { tone, voice },
      blueprintAgent: { outline },
      seoAgent: seo,
      blogAgent: {
        blog: writerData.blog,
        keyword: writerData.keyword,
        wordCount: writerData.wordCount,
      },
      ...(analyze && {
        analyzeAgent: {
          top_keywords: analyze.top_keywords,
          avg_word_count: analyze.avg_word_count,
          competitors: analyze.competitors,
        },
      }),
      ...(crawlData && {
        crawlAgent: {
          urls: crawlData.urls,
          extracted_texts: crawlData.extracted_texts,
        },
      }),
      ...(teaserData && {
        teaserAgent: {
          teasers: teaserData.teasers,
          hashtags: teaserData.hashtags,
          engagementCTA: teaserData.engagementCTA,
        },
      }),
      status: "draft",
      createdAt: new Date(),
    });

    // ✅ Increment Free plan usage count
    if (plan.name === "Free") {
      await UserModel.updateOne(
        { email: user.emailAddresses[0].emailAddress },
        { $inc: { blogsGeneratedThisMonth: 1 } }
      );
    }

    return NextResponse.json({
      message: "✅ Blog successfully created",
      keyword: saved.blogAgent.keyword,
      blog: saved.blogAgent.blog,
      wordCount: saved.blogAgent.wordCount,
      seo: saved.seoAgent,
      tone: saved.toneAgent.tone,
      voice: saved.toneAgent.voice,
      teaser: saved.teaserAgent
        ? {
            teasers: saved.teaserAgent.teasers,
            hashtags: saved.teaserAgent.hashtags,
            engagementCTA: saved.teaserAgent.engagementCTA,
          }
        : null,
    });
  } catch (err: any) {
    console.error("💥 Orchestrator error:", err);

    if (err?.agent && err?.status) {
      return NextResponse.json(
        {
          error: `Agent ${err.agent} failed`,
          details: err.error || "Unknown agent error",
        },
        { status: err.status }
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




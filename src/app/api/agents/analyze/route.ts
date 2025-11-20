// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { AnalyzeAgentSchema } from "./schema";
// import {
//   isWithinTokenLimit,
//   splitTextByTokenLimit,
// } from "@/app/api/utils/tokenUtils";
// import { connectDB } from "@/app/api/utils/db";
// import { cachedAgent, deleteCacheKey } from "@/lib/cache"; //  added cache helpers
// import * as Sentry from "@sentry/nextjs";
// const MAX_TOKENS = 2000;

// //  Core analyzer generation logic
// async function generateAnalysis(keyword: string, userId?: string) {
  


//   try {
//     //  Fetch SERP data
//     const serpRes = await fetch(
//       `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&api_key=${process.env.SERP_API_KEY}`
//     );
//     const serpJson = await serpRes.json();

//     if (!serpJson.organic_results || serpJson.organic_results.length === 0) {
//       throw new Error("No SERP data found");
//     }

//     const organicResults = serpJson.organic_results.slice(0, 5);
//     const prompt = createPrompt(keyword, organicResults);

//     if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
//       const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS);
//       throw new Error(
//         `Prompt exceeded token limit. Reduce SERP results or truncate content.`
//       );
//     }

//     //  Call Groq LLM for analysis
//     const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-oss-20b",
//         messages: [
//           { role: "system", content: "You are an SEO analyst and strategist." },
//           { role: "user", content: prompt },
//         ],
//         temperature: 0.3,
//       }),
//     });

//     const aiJson = await aiRes.json();

//     if (!aiJson.choices?.[0]?.message?.content) {
//       throw new Error("No AI content returned.");
//     }

//     const rawOutput = aiJson.choices[0].message.content;

//     //  Validate output
//     let parsed;
//     try {
//       parsed = JSON.parse(rawOutput || "{}");
//     } catch (err) {
//       console.error(" JSON parse error:", err, "\nOutput:", rawOutput);
//       throw new Error("Failed to parse AI output");
//     }

//     const validation = AnalyzeAgentSchema.safeParse(parsed);
//     if (!validation.success) {
//       console.error(" Schema validation failed:", validation.error.flatten());
//       throw new Error("Output schema validation failed");
//     }

//     return validation.data;
//   } finally {
//     try {
//       transaction.finish();
//     } catch (e) {
//       // ignore any errors finishing the transaction
//     }
//   }
// }

// //  API Route
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { keyword, regenerate = false } = body;

//     if (!keyword) {
//       return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
//     }

//     await connectDB();

//     const cacheKey = `agent:analyze:${keyword.toLowerCase()}`;

//     //  Optional regenerate
//     if (regenerate) {
//       await deleteCacheKey(cacheKey);
//       console.log(` Cache cleared for analyze agent: ${keyword}`);
//     }

//     //  Use cachedAgent (12-hour TTL)
//     const result = await cachedAgent(
//       cacheKey,
//       () => generateAnalysis(keyword),
//       60 * 60 * 12
//     );

//     return NextResponse.json({ keyword, ...result });
//   } catch (err: unknown) {
//     console.error(" Analyze Agent Fatal Error:", err);
//     const message = err instanceof Error ? err.message : String(err);
//     return NextResponse.json(
//       { error: message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { AnalyzeAgentSchema } from "./schema";
import {
  isWithinTokenLimit,
  splitTextByTokenLimit,
} from "@/app/api/utils/tokenUtils";
import { connectDB } from "@/app/api/utils/db";
import { cachedAgent, deleteCacheKey } from "@/lib/cache";

import * as Sentry from "@sentry/nextjs";

const MAX_TOKENS = 2000;

async function generateAnalysis(keyword: string, userId?: string) {
  return await Sentry.startSpan(
    { name: "Analyze Agent Execution", op: "agent.analyze" },
    async () => {
      Sentry.setTag("agent", "analyze");
      if (userId) Sentry.setUser({ id: userId });

      Sentry.addBreadcrumb({
        category: "analyze",
        message: "Analyze agent started",
        level: "info",
        data: { keyword },
      });

      // Fetch SERP data
      Sentry.addBreadcrumb({
        category: "serpapi",
        message: "Fetching SERP data",
        level: "info",
        data: { keyword },
      });

      const serpRes = await fetch(
        `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&api_key=${process.env.SERP_API_KEY}`
      );

      if (!serpRes.ok) throw new Error(`SERP API failed: ${serpRes.status}`);

      const serpJson = await serpRes.json();

      if (!serpJson.organic_results?.length) {
        throw new Error("No SERP results found");
      }

      const organicResults = serpJson.organic_results.slice(0, 5);
      const prompt = createPrompt(keyword, organicResults);

      if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
        throw new Error("Prompt exceeded token limit");
      }

      // AI Call
      Sentry.addBreadcrumb({
        category: "groq",
        message: "Calling Groq LLM",
        level: "info",
      });

      const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: "You are an SEO analyst." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      if (!aiRes.ok) throw new Error(`Groq failed: ${aiRes.status}`);

      const aiJson = await aiRes.json();

      if (!aiJson.choices?.[0]?.message?.content)
        throw new Error("Groq returned empty content");

      const rawOutput = aiJson.choices[0].message.content;

      // Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(rawOutput);
      } catch (err) {
        Sentry.captureException(err, {
          tags: { stage: "json-parse" },
          extra: { rawOutput },
        });
        throw new Error("Failed to parse JSON");
      }

      const validation = AnalyzeAgentSchema.safeParse(parsed);
      if (!validation.success) {
        Sentry.captureException(validation.error, {
          tags: { stage: "schema-validation" },
        });
        throw new Error("Schema validation failed");
      }

      return validation.data;
    }
  );
}

export async function POST(req: NextRequest) {
  return Sentry.startSpan(
    { name: "Analyze Agent API Request", op: "api.post" },
    async () => {
      try {
        const body = await req.json();
        const { keyword, regenerate = false, userId } = body;

        if (!keyword) {
          return NextResponse.json(
            { error: "Missing keyword" },
            { status: 400 }
          );
        }

        await connectDB();

        const cacheKey = `agent:analyze:${keyword.toLowerCase()}`;

        Sentry.addBreadcrumb({
          category: "cache",
          message: regenerate
            ? "Regenerate requested — clearing cache"
            : "Checking cache",
          level: "info",
          data: { cacheKey },
        });

        if (regenerate) await deleteCacheKey(cacheKey);

        const result = await cachedAgent(
          cacheKey,
          () => generateAnalysis(keyword, userId),
          60 * 60 * 12
        );

        return NextResponse.json({ keyword, ...result });
      } catch (err) {
        Sentry.captureException(err);
        const msg = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    }
  );
}

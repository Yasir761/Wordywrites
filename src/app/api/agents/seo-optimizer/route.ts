// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { SEOOptimizerSchema } from "./schema";
// import { cachedAgent, deleteCacheKey } from "@/lib/cache"; //  added cache helpers

// //  Core LLM generation logic (used by cachedAgent)
// async function generateSEOOptimization(keyword: string, outline: string[], tone: string, voice: string, tags: string[]) {
//   const prompt = createPrompt(keyword, outline, tone, voice, tags);

//   const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini", // lightweight + cheaper
//       messages: [
//         { role: "system", content: "You are an SEO blog optimizer." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.4,
//     }),
//   });

//   const json = await aiRes.json();
//   const output = json.choices?.[0]?.message?.content?.trim() || "";

//   //  Validate structured JSON from model
//   let parsed;
//   try {
//     parsed = JSON.parse(output);
//   } catch {
//     throw new Error("Invalid JSON output from model");
//   }

//   const validated = SEOOptimizerSchema.safeParse(parsed);
//   if (!validated.success) {
//     console.error(" SEO validation failed:", validated.error.flatten());
//     throw new Error("Schema validation failed");
//   }

//   return validated.data;
// }

// //  API Route
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { keyword, outline, tone, voice, tags, regenerate = false } = body;

//     if (!keyword || !outline || !tone || !voice || !tags) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const cacheKey = `agent:seo:${keyword.toLowerCase()}:${tone.toLowerCase()}:${voice.toLowerCase()}`;

//     //  Handle regenerate requests
//     if (regenerate) {
//       await deleteCacheKey(cacheKey);
//       console.log(` Cache cleared for SEO agent: ${keyword}`);
//     }

//     //  Use cachedAgent helper (12-hour TTL)
//     const result = await cachedAgent(
//       cacheKey,
//       () => generateSEOOptimization(keyword, outline, tone, voice, tags),
//       60 * 60 * 12 // 12 hours TTL
//     );

//     return NextResponse.json(result);
//   } catch (err: unknown) {
//     console.error(" SEO Optimizer Agent Error:", err);
//     const message = err instanceof Error ? err.message : String(err);
//     return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
//   }
// }








import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { SEOOptimizerSchema } from "./schema";
import { cachedAgent, deleteCacheKey } from "@/lib/cache";
import * as Sentry from "@sentry/nextjs";

//  Core LLM logic with Sentry instrumentation
async function generateSEOOptimization(
  keyword: string,
  outline: string[],
  tone: string,
  voice: string,
  tags: string[]
) {
  return await Sentry.startSpan(
    { name: "SEO Agent - Generate Optimization", op: "agent.llm" },
    async () => {
      const prompt = createPrompt(keyword, outline, tone, voice, tags);

      Sentry.addBreadcrumb({
        category: "seo-optimizer",
        message: "Sending prompt to LLM",
        level: "info",
        data: { keyword, tone, voice, outlineLength: outline.length },
      });

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an SEO blog optimizer." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      });

      const json = await aiRes.json();
      const raw = json.choices?.[0]?.message?.content?.trim() || "";

      Sentry.addBreadcrumb({
        category: "seo-optimizer",
        message: "LLM responded",
        level: "info",
        data: { rawLength: raw.length },
      });

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        Sentry.captureException(err);
        throw new Error(`Invalid JSON output from model`);
      }

      const validated = SEOOptimizerSchema.safeParse(parsed);
      if (!validated.success) {
        Sentry.captureException(validated.error);
        throw new Error("Schema validation failed");
      }

      return validated.data;
    }
  );
}

//  API Route
export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "SEO Optimizer Agent API", op: "api.post" },
    async () => {
      try {
        const body = await req.json();
        const { keyword, outline, tone, voice, tags, regenerate = false } = body;

        Sentry.setTag("agent", "seo");
        Sentry.addBreadcrumb({
          category: "seo-optimizer",
          message: "Request received",
          level: "info",
          data: { keyword, tone, voice, tagCount: tags?.length },
        });

        // Basic validation
        if (!keyword || !outline || !tone || !voice || !tags) {
          Sentry.captureMessage("Missing SEO optimizer fields", {
            level: "warning",
          });
          return NextResponse.json(
            { error: "Missing fields" },
            { status: 400 }
          );
        }

        const cacheKey = `agent:seo:${keyword.toLowerCase()}:${tone.toLowerCase()}:${voice.toLowerCase()}`;

        if (regenerate) {
          await deleteCacheKey(cacheKey);
          Sentry.addBreadcrumb({
            category: "cache",
            message: "SEO cache cleared",
            level: "info",
            data: { cacheKey },
          });
        }

        Sentry.addBreadcrumb({
          category: "cache",
          message: "Checking cache for SEO agent",
          level: "info",
          data: { cacheKey },
        });

        const result = await cachedAgent(
          cacheKey,
          () => generateSEOOptimization(keyword, outline, tone, voice, tags),
          60 * 60 * 12
        );

        return NextResponse.json(result);
      } catch (err) {
        Sentry.captureException(err);
        const message = err instanceof Error ? err.message : String(err);

        return NextResponse.json(
          { error: message || "Internal server error" },
          { status: 500 }
        );
      }
    }
  );
}

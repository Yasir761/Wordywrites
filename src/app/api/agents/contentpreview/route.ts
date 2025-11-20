// import { NextRequest, NextResponse } from "next/server";
// import { createGeneralTeaserPrompt } from "./prompt";
// import { GeneralTeaserSchema } from "./schema";
// import { cachedAgent, deleteCacheKey } from "@/lib/cache"; //  added cache helpers

// //  Core teaser generation logic
// async function generateGeneralTeasers(title: string, content: string) {
//   const prompt = createGeneralTeaserPrompt(title, content);

//   const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         { role: "system", content: "You are a professional content strategist." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.4,
//     }),
//   });

//   const json = await res.json();
//   let rawOutput = json.choices?.[0]?.message?.content?.trim() || "";

//   // --- STEP 1: Clean markdown, bullets, and quotes ---
//   rawOutput = rawOutput
//     .replace(/```[\s\S]*?```/g, "")
//     .replace(/[*_]+/g, "")
//     .replace(/["“”]+/g, "")
//     .trim();

//   // --- STEP 2: Break into sections ---
//   const sections = rawOutput
//     .split(/\n+/)
//     .map((s: string) => s.trim())
//     .filter(Boolean);

//   // --- STEP 3: Extract valid teasers ---
//   let teasers = sections
//     .filter((s: string) => s.length >= 30)
//     .slice(0, 3);
//   if (teasers.length === 0) teasers = [rawOutput];

//   // --- STEP 4: Extract hashtags ---
//   let hashtags =
//     sections
//       .find((s: string) => s.includes("#"))
//       ?.replace(/^[^\#]*/, "")
//       .split(/\s+/)
//       .filter((tag: string) => /^#[\w]+$/.test(tag)) || [];

//   if (hashtags.length === 0)
//     hashtags = ["#blog", "#content", "#marketing"];

//   hashtags = hashtags.slice(0, 10);

//   // --- STEP 5: Extract CTA ---
//   const engagementCTA =
//     sections.find((s: string) =>
//       s.toLowerCase().includes("read") ||
//       s.toLowerCase().includes("take") ||
//       s.toLowerCase().includes("thought")
//     ) || "Read the full blog here !";

//   // --- STEP 6: Validate final output ---
//   const validated = GeneralTeaserSchema.safeParse({
//     teasers,
//     hashtags,
//     engagementCTA,
//   });
//   if (!validated.success) {
//     console.error(" General Teaser validation failed:", validated.error.flatten());
//     throw new Error("Validation failed");
//   }

//   return validated.data;
// }

// //  API Route
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { title, content, regenerate = false } = body;

//     if (!title || !content) {
//       return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
//     }

//     //  Unique cache key based on title + content hash
//     const cacheKey = `agent:teaser:${title.toLowerCase().slice(0, 60)}`;

//     //  Optional regenerate
//     if (regenerate) {
//       await deleteCacheKey(cacheKey);
//       console.log(`♻️ Cache cleared for teaser agent: ${title}`);
//     }

//     // Use cachedAgent (24-hour TTL)
//     const result = await cachedAgent(
//       cacheKey,
//       () => generateGeneralTeasers(title, content),
//       60 * 60 * 24
//     );

//     return NextResponse.json(result);
//   } catch (err) {
//     console.error(" General Teaser Agent Error:", err);
//     const message = err instanceof Error ? err.message : String(err);
//     return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
//   }
// }








import { NextRequest, NextResponse } from "next/server";
import { createGeneralTeaserPrompt } from "./prompt";
import { GeneralTeaserSchema } from "./schema";
import { cachedAgent, deleteCacheKey } from "@/lib/cache";
import * as Sentry from "@sentry/nextjs";


  //  GENERATION LOGIC

async function generateGeneralTeasers(title: string, content: string) {
  return await Sentry.startSpan(
    { name: "General Teaser Generation", op: "agent.teaser" },
    async () => {
      Sentry.addBreadcrumb({
        category: "teaser.agent",
        message: "Teaser agent started",
        level: "info",
        data: { titlePreview: title.slice(0, 60) },
      });

      const prompt = createGeneralTeaserPrompt(title, content);

      Sentry.addBreadcrumb({
        category: "prompt",
        message: "Generated teaser prompt",
        level: "debug",
        data: { preview: prompt.slice(0, 200) },
      });

     
        //  LLM Call (Groq)
      
      Sentry.addBreadcrumb({
        category: "groq",
        message: "Calling Groq teaser model",
        level: "info",
      });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: "You are a professional content strategist." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      });

      if (!res.ok) {
        Sentry.captureMessage("Groq API error in Teaser Agent", {
          level: "error",
          extra: { status: res.status },
        });
        throw new Error(`Groq API failed with status ${res.status}`);
      }

      const json = await res.json();
      let rawOutput = json.choices?.[0]?.message?.content?.trim() || "";

        //  CLEANING & EXTRACTION
    
      Sentry.addBreadcrumb({
        category: "teaser.cleaning",
        message: "Cleaning LLM output",
        level: "debug",
      });

      rawOutput = rawOutput
        .replace(/```[\s\S]*?```/g, "")
        .replace(/[*_]+/g, "")
        .replace(/["“”]+/g, "")
        .trim();

      const sections = rawOutput
        .split(/\n+/)
        .map((s: string) => s.trim())
        .filter(Boolean);

      let teasers = sections.filter((s: string | any[]) => s.length >= 30).slice(0, 3);
      if (teasers.length === 0) teasers = [rawOutput];

      let hashtags =
        sections
          .find((s: string | string[]) => s.includes("#"))
          ?.replace(/^[^\#]*/, "")
          .split(/\s+/)
          .filter((tag: string) => /^#[\w]+$/.test(tag)) || [];

      if (hashtags.length === 0) hashtags = ["#blog", "#content", "#marketing"];

      hashtags = hashtags.slice(0, 10);

      const engagementCTA =
        sections.find((s: string) =>
          s.toLowerCase().includes("read") ||
          s.toLowerCase().includes("take") ||
          s.toLowerCase().includes("thought")
        ) || "Read the full blog here!";

      
        //  SCHEMA VALIDATION
     
      const validated = GeneralTeaserSchema.safeParse({
        teasers,
        hashtags,
        engagementCTA,
      });

      if (!validated.success) {
        Sentry.captureException(validated.error, {
          tags: { stage: "schema-validation" },
        });
        throw new Error("General Teaser schema validation failed");
      }

      return validated.data;
    }
  );
}


  //  API ROUTE

export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "General Teaser API Request", op: "api.post" },
    async () => {
      try {
        const body = await req.json();
        const { title, content, regenerate = false } = body;

        if (!title || !content) {
          return NextResponse.json(
            { error: "Missing title or content" },
            { status: 400 }
          );
        }

        const cacheKey = `agent:teaser:${title.toLowerCase().slice(0, 60)}`;

        if (regenerate) {
          Sentry.addBreadcrumb({
            category: "cache",
            message: "Regenerate requested — clearing teaser cache",
            level: "info",
            data: { cacheKey },
          });
          await deleteCacheKey(cacheKey);
        }

        const result = await cachedAgent(
          cacheKey,
          () => generateGeneralTeasers(title, content),
          60 * 60 * 24 // 24 hours
        );

        return NextResponse.json(result);
      } catch (err: any) {
        Sentry.captureException(err);
        return NextResponse.json(
          { error: err.message || "Internal server error" },
          { status: 500 }
        );
      }
    }
  );
}

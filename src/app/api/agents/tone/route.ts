// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { ToneSchema } from "./schema";
// import { cachedAgent, deleteCacheKey } from "@/lib/cache"; //  added cache helpers

// //  Core tone generation logic
// async function generateTone(keyword: string) {
//   const prompt = createPrompt(keyword);

//   const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         { role: "system", content: "You are a blog tone and voice strategist." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.4,
//     }),
//   });

//   const data = await aiRes.json();
//   const raw = data.choices?.[0]?.message?.content?.trim();

//   if (!raw) throw new Error("No AI output received.");

//   let parsed;
//   try {
//     parsed = JSON.parse(raw);
//   } catch (err) {
//     console.error(" Tone JSON parse failed:", err, "\nRaw output:", raw);
//     throw new Error("Invalid JSON format from model");
//   }

//   const validated = ToneSchema.safeParse(parsed);
//   if (!validated.success) {
//     console.error(" Tone schema validation failed:", validated.error.format());
//     throw new Error("Schema validation failed");
//   }

//   return validated.data;
// }

// //  API Route
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { keyword, regenerate = false } = body;

//     if (!keyword) {
//       return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
//     }

//     //  Cache key — unique per keyword
//     const cacheKey = `agent:tone:${keyword.toLowerCase()}`;

//     //  Optional regenerate
//     if (regenerate) {
//       await deleteCacheKey(cacheKey);
//       console.log(`♻️ Cache cleared for tone agent: ${keyword}`);
//     }

//     //  Use cachedAgent (6-hour TTL)
//     const result = await cachedAgent(
//       cacheKey,
//       () => generateTone(keyword),
//       60 * 60 * 6 // 6 hours TTL
//     );

//     return NextResponse.json({ keyword, ...result });
//   } catch (err) {
//     console.error(" Tone Agent Error:", err);
//     const message = err instanceof Error ? err.message : String(err);
//     return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { ToneSchema } from "./schema";
import { cachedAgent, deleteCacheKey } from "@/lib/cache";
import * as Sentry from "@sentry/nextjs";

// Core LLM logic
async function generateTone(keyword: string) {
  return await Sentry.startSpan(
    { name: "Tone Agent - Generate Tone", op: "agent.llm" },
    async () => {
      const prompt = createPrompt(keyword);

      Sentry.addBreadcrumb({
        category: "tone-agent",
        message: "Sending prompt to LLM",
        level: "info",
        data: { keyword },
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
            { role: "system", content: "You are a blog tone and voice strategist." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      });

      const data = await aiRes.json();
      const raw = data.choices?.[0]?.message?.content?.trim();

      if (!raw) {
        Sentry.captureMessage("Tone Agent returned empty output");
        throw new Error("No AI output received.");
      }

      Sentry.addBreadcrumb({
        category: "tone-agent",
        message: "LLM responded",
        level: "info",
        data: { rawLength: raw.length },
      });

      // Parse JSON safely
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        Sentry.captureException(err);
        throw new Error("Invalid JSON format from model");
      }

      const validated = ToneSchema.safeParse(parsed);
      if (!validated.success) {
        Sentry.captureException(validated.error);
        throw new Error("Schema validation failed");
      }

      return validated.data;
    }
  );
}

// API Route
export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "Tone Agent API", op: "api.post" },
    async () => {
      try {
        const body = await req.json();
        const { keyword, regenerate = false } = body;

        Sentry.setTag("agent", "tone");
        Sentry.addBreadcrumb({
          category: "tone-agent",
          message: "Request received",
          level: "info",
          data: { keyword },
        });

        if (!keyword) {
          Sentry.captureMessage("Tone agent invoked with missing keyword", {
            level: "warning",
          });
          return NextResponse.json(
            { error: "Missing keyword" },
            { status: 400 }
          );
        }

        const cacheKey = `agent:tone:${keyword.toLowerCase()}`;

        if (regenerate) {
          await deleteCacheKey(cacheKey);
          Sentry.addBreadcrumb({
            category: "cache",
            message: "Tone agent cache cleared",
            level: "info",
            data: { cacheKey },
          });
        }

        const result = await cachedAgent(
          cacheKey,
          () => generateTone(keyword),
          60 * 60 * 6
        );

        return NextResponse.json({ keyword, ...result });
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

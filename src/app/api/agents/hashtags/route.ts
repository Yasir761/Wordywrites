// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { HashtagSchema } from "./schema";
// import { cachedAgent, deleteCacheKey } from "@/lib/cache"; // added cache helpers

// //  LLM generation logic (used inside cachedAgent)
// async function generateHashtags(keyword: string) {
//   const prompt = createPrompt(keyword);

//   const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         { role: "system", content: "You are a professional social media strategist." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.3,
//     }),
//   });

//   const json = await res.json();
//   let rawOutput = json.choices?.[0]?.message?.content?.trim();

//   if (!rawOutput) {
//     throw new Error("No content returned by LLM");
//   }

//   //  Sanitize LLM output (removes ```json etc.)
//   rawOutput = rawOutput.replace(/```json|```/g, "").trim();

//   //  Parse JSON safely
//   let parsed;
//   try {
//     const safeOutput = rawOutput.endsWith("}") ? rawOutput : rawOutput + "}";
//     parsed = JSON.parse(safeOutput);
//   } catch (err) {
//     console.error(" JSON parse error in Hashtag agent:", err, "\nRaw:", rawOutput);
//     throw new Error("Failed to parse JSON from model");
//   }

//   //  Validate schema
//   const result = HashtagSchema.safeParse(parsed);
//   if (!result.success) {
//     console.error(" Hashtag schema validation failed:", result.error.flatten());
//     throw new Error("Invalid hashtag schema");
//   }

//   return result.data; // { tags: [...] }
// }

// //  API Route
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { keyword, regenerate = false } = body;

//     if (!keyword) {
//       return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
//     }

//     const cacheKey = `agent:hashtag:${keyword.toLowerCase()}`;

//     //  Optional regenerate
//     if (regenerate) {
//       await deleteCacheKey(cacheKey);
//       console.log(`♻️ Cache cleared for hashtag agent: ${keyword}`);
//     }

//     //  Use cachedAgent (6-hour TTL)
//     const result = await cachedAgent(
//       cacheKey,
//       () => generateHashtags(keyword),
//       60 * 60 * 6
//     );

//     return NextResponse.json({ keyword, ...result });
//   } catch (err) {
//     console.error(" Hashtag Agent Error:", err);
//     const message = err instanceof Error ? err.message : String(err);
//     return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { HashtagSchema } from "./schema";
import { cachedAgent, deleteCacheKey } from "@/lib/cache";
import * as Sentry from "@sentry/nextjs";

// LLM generation logic (wrapped with Sentry)
async function generateHashtags(keyword: string) {
  return await Sentry.startSpan(
    { name: "Generate Hashtags", op: "agent.hashtag.llm" },
    async () => {
      Sentry.addBreadcrumb({
        category: "hashtag",
        message: "Preparing prompt for hashtag agent",
        level: "info",
        data: { keyword }
      });

      const prompt = createPrompt(keyword);

      let res;
      try {
        res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              {
                role: "system",
                content: "You are a professional social media strategist.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.3,
          }),
        });
      } catch (networkError) {
        Sentry.captureException(networkError, {
          extra: { keyword, stage: "fetch-groq" },
        });
        throw new Error("Network error calling Groq API");
      }

      const json = await res.json();
      let rawOutput = json?.choices?.[0]?.message?.content?.trim();

      if (!rawOutput) {
        Sentry.captureMessage("Hashtag agent returned empty output", {
          level: "warning",
          extra: { keyword },
        });
        throw new Error("No content returned by LLM");
      }

      // Clean JSON blocks like ```json
      rawOutput = rawOutput.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        const safeOutput = rawOutput.endsWith("}") ? rawOutput : rawOutput + "}";
        parsed = JSON.parse(safeOutput);
      } catch (err) {
        Sentry.captureException(err, {
          extra: { rawOutput },
        });
        throw new Error("Failed to parse JSON from LLM");
      }

      const result = HashtagSchema.safeParse(parsed);
      if (!result.success) {
        Sentry.captureException(result.error, {
          extra: {
            output: parsed,
            keyword,
          },
        });
        throw new Error("Invalid hashtag schema returned by LLM");
      }

      return result.data; // { tags: [...] }
    }
  );
}

// API Route
export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "Hashtag Agent API", op: "api.post" },
    async () => {
      try {
        const body = await req.json();
        const { keyword, regenerate = false, userId } = body;

        if (userId) Sentry.setUser({ id: userId });
        Sentry.setTag("agent", "hashtag");

        if (!keyword) {
          return NextResponse.json(
            { error: "Missing keyword" },
            { status: 400 }
          );
        }

        const cacheKey = `agent:hashtag:${keyword.toLowerCase()}`;

        if (regenerate) {
          Sentry.addBreadcrumb({
            category: "cache",
            message: "Cache cleared for hashtag agent",
            level: "info",
            data: { keyword },
          });
          await deleteCacheKey(cacheKey);
        }

        const result = await cachedAgent(
          cacheKey,
          () => generateHashtags(keyword),
          60 * 60 * 6 // 6-hour TTL
        );

        return NextResponse.json({ keyword, ...result });
      } catch (err) {
        Sentry.captureException(err);
        console.error(" Hashtag Agent Error:", err);

        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
          { error: message || "Internal server error" },
          { status: 500 }
        );
      }
    }
  );
}


// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { BlogOutlineSchema } from "./schema";
// import {
//   countTokens,
//   isWithinTokenLimit,
//   splitTextByTokenLimit,
// } from "@/app/api/utils/tokenUtils";
// import { cachedAgent, deleteCacheKey } from "@/lib/cache"; //  added caching helpers

// const MAX_TOKENS = 2048;

// //  LLM generation logic (used by cachedAgent)
// async function generateBlueprint(keyword: string, tone: string): Promise<string[]> {
//   const prompt = createPrompt(keyword, tone);

//   const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         {
//           role: "system",
//           content: "You are a concise blog strategist. Do not generate paragraphs.",
//         },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.4,
//     }),
//   });

//   const data = await response.json();
//   const rawOutput = data.choices?.[0]?.message?.content || "";

//   //  Clean and dedupe bullet points
//   const outline = rawOutput
//     .split(/\n|•|-/)
//     .map((line: string) => line.trim())
//     .filter(
//       (line: string, i: number, arr: string[]) =>
//         line.length > 4 && arr.indexOf(line) === i
//     );

//   //  Validate structure
//   const result = BlogOutlineSchema.safeParse({ outline });
//   if (!result.success) {
//     console.error(" Outline validation failed:", result.error.format());
//     throw new Error("Invalid blog outline format");
//   }

//   return result.data.outline;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { keyword, tone, regenerate = false } = body;

//     const finalKeyword = keyword || "general topic";
//     const finalTone = tone || "neutral";

//     const prompt = createPrompt(finalKeyword, finalTone);

//     //  Token safety check (keep your existing logic)
//     if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
//       const trimmed = splitTextByTokenLimit(prompt, MAX_TOKENS)[0] || "";
//       console.warn(" Prompt too long. Using trimmed version.");
//       return NextResponse.json(
//         {
//           warning: "Prompt exceeded token limit. Please shorten input.",
//           trimmedPrompt: trimmed,
//           tokens: countTokens(trimmed),
//         },
//         { status: 413 }
//       );
//     }

//     //  Cache key = unique per keyword + tone
//     const cacheKey = `agent:blueprint:${finalKeyword.toLowerCase()}:${finalTone.toLowerCase()}`;

//     //  Optional regenerate
//     if (regenerate) {
//       await deleteCacheKey(cacheKey);
//       console.log(` Cache cleared for blueprint: ${finalKeyword}`);
//     }

//     //  Use cachedAgent (6-hour TTL)
//     const outline = await cachedAgent<string[]>(
//       cacheKey,
//       () => generateBlueprint(finalKeyword, finalTone),
//       60 * 60 * 6
//     );

//     return NextResponse.json({ keyword: finalKeyword, outline });
//   } catch (err: unknown) {
//     console.error(" Blueprint Agent Error:", err);
//     const message = err instanceof Error ? err.message : String(err);
//     return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { BlogOutlineSchema } from "./schema";
import {
  isWithinTokenLimit,
  splitTextByTokenLimit,
  countTokens,
} from "@/app/api/utils/tokenUtils";

import { cachedAgent, deleteCacheKey } from "@/lib/cache";
import * as Sentry from "@sentry/nextjs";

const MAX_TOKENS = 2048;


  //  BLUEPRINT GENERATION LOGIC

async function generateBlueprint(
  keyword: string,
  tone: string
): Promise<string[]> {
  return await Sentry.startSpan(
    { name: "Blueprint Agent Execution", op: "agent.blueprint" },
    async () => {
      Sentry.addBreadcrumb({
        category: "blueprint",
        message: "Blueprint agent started",
        level: "info",
        data: { keyword, tone },
      });

      const prompt = createPrompt(keyword, tone);

      Sentry.addBreadcrumb({
        category: "prompt",
        message: "Generated blueprint prompt",
        level: "debug",
        data: { preview: prompt.slice(0, 200) },
      });


        //  Token Limit Check
  
      if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
        Sentry.captureMessage("Blueprint prompt exceeded token limit", {
          level: "warning",
        });

        const trimmed = splitTextByTokenLimit(prompt, MAX_TOKENS)[0];
        throw new Error("Prompt exceeded token limit.");
      }

     
        //  LLM Call
     
      Sentry.addBreadcrumb({
        category: "groq",
        message: "Calling Groq LLM",
        level: "info",
      });

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
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
                content:
                  "You are a concise blog strategist. Output only bullet points. No paragraphs.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.4,
          }),
        }
      );

      if (!response.ok) {
        Sentry.captureMessage("Groq API Error", {
          level: "error",
          extra: { status: response.status },
        });
        throw new Error(`Groq API failure: ${response.status}`);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "";

      
        //  Outline Cleaning
      
      const outline = raw
        .split(/\n|•|-/)
        .map((x: string) => x.trim())
        .filter((line: string, idx: number, arr: string[]) => line.length > 4 && arr.indexOf(line) === idx);

        //  Schema Validation
     
      const validated = BlogOutlineSchema.safeParse({ outline });

      if (!validated.success) {
        Sentry.captureException(validated.error, {
          tags: { stage: "schema-validation" },
        });
        throw new Error("Invalid blog outline format");
      }

      return validated.data.outline;
    }
  );
}

  //  API ROUTE

export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "Blueprint Agent API Request", op: "api.post" },
    async () => {
      try {
        const body = await req.json();
        const { keyword, tone, regenerate = false } = body;

        const finalKeyword = keyword || "general topic";
        const finalTone = tone || "neutral";

        // Token Check
        const prompt = createPrompt(finalKeyword, finalTone);

        if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
          const trimmed = splitTextByTokenLimit(prompt, MAX_TOKENS)[0];

          Sentry.captureMessage("Blueprint prompt too long", {
            level: "warning",
            extra: { tokenCount: countTokens(prompt) },
          });

          return NextResponse.json(
            {
              warning: "Prompt exceeded token limit.",
              trimmedPrompt: trimmed,
              tokens: countTokens(trimmed),
            },
            { status: 413 }
          );
        }

        const cacheKey = `agent:blueprint:${finalKeyword.toLowerCase()}:${finalTone.toLowerCase()}`;

        if (regenerate) {
          Sentry.addBreadcrumb({
            category: "cache",
            message: "Regenerate requested, clearing blueprint cache",
            level: "info",
            data: { cacheKey },
          });
          await deleteCacheKey(cacheKey);
        }

        const outline = await cachedAgent(
          cacheKey,
          () => generateBlueprint(finalKeyword, finalTone),
          60 * 60 * 6 // 6 hours
        );

        return NextResponse.json({ keyword: finalKeyword, outline });
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

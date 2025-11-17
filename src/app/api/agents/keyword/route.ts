

import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { KeywordIntentSchema } from "./schema";
import { z } from "zod";
import { redis } from "@/lib/redis";
import { cachedAgent, deleteCacheKey } from "@/lib/cache"; //  using your shared helper





type KeywordIntent = z.infer<typeof KeywordIntentSchema>;

/**
 * Core logic of the Keyword Agent
 */
async function generateKeywordIntent(keyword: string): Promise<KeywordIntent> {
  const prompt = createPrompt(keyword);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a precise SEO keyword intent analyzer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  const json = await response.json();
  let raw = json.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("No content returned from model");

  raw = raw.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(" JSON parse error:", err, "\nReturned:", raw);
    throw new Error("Invalid JSON from model");
  }

  const result = KeywordIntentSchema.safeParse(parsed);
  if (!result.success) {
    console.error(" Schema validation failed:", result.error.flatten());
    throw new Error("Invalid schema from model");
  }

  return result.data;
}

/**
 *  API Route (POST)
 */
export async function POST(req: NextRequest) {
  
  try {
    const { keyword, regenerate = false } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
    }

    const cacheKey = `agent:keyword:${keyword.toLowerCase()}`;

    // Handle regenerate (force new LLM call)
    if (regenerate) {
      await deleteCacheKey(cacheKey);
      console.log(` Cache cleared for ${keyword}`);
    }

    //  Use cachedAgent helper (12-hour TTL)
    console.time("TOTAL_REQUEST");
console.time("REDIS_GET");
    const data = await cachedAgent<KeywordIntent>(
      cacheKey,
      () => generateKeywordIntent(keyword),
      60 * 60 * 12
    );
console.timeEnd("REDIS_GET");
console.timeEnd("TOTAL_REQUEST");
    //  Add flag so frontend can tell if cached or not
    const cachedFlag = await (async () => {
      const allKeys = await redis.smembers("wordywrites:cached_keys");
      return allKeys.includes(cacheKey);
    })();

    return NextResponse.json({ ...data, cached: cachedFlag });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Agent error" }, { status: 500 });
  }
}

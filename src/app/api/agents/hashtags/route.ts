import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { HashtagSchema } from "./schema";
import { cachedAgent, deleteCacheKey } from "@/lib/cache"; // added cache helpers

//  LLM generation logic (used inside cachedAgent)
async function generateHashtags(keyword: string) {
  const prompt = createPrompt(keyword);

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a professional social media strategist." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  const json = await res.json();
  let rawOutput = json.choices?.[0]?.message?.content?.trim();

  if (!rawOutput) {
    throw new Error("No content returned by LLM");
  }

  //  Sanitize LLM output (removes ```json etc.)
  rawOutput = rawOutput.replace(/```json|```/g, "").trim();

  //  Parse JSON safely
  let parsed;
  try {
    const safeOutput = rawOutput.endsWith("}") ? rawOutput : rawOutput + "}";
    parsed = JSON.parse(safeOutput);
  } catch (err) {
    console.error(" JSON parse error in Hashtag agent:", err, "\nRaw:", rawOutput);
    throw new Error("Failed to parse JSON from model");
  }

  //  Validate schema
  const result = HashtagSchema.safeParse(parsed);
  if (!result.success) {
    console.error(" Hashtag schema validation failed:", result.error.flatten());
    throw new Error("Invalid hashtag schema");
  }

  return result.data; // { tags: [...] }
}

//  API Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword, regenerate = false } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
    }

    const cacheKey = `agent:hashtag:${keyword.toLowerCase()}`;

    //  Optional regenerate
    if (regenerate) {
      await deleteCacheKey(cacheKey);
      console.log(`♻️ Cache cleared for hashtag agent: ${keyword}`);
    }

    //  Use cachedAgent (6-hour TTL)
    const result = await cachedAgent(
      cacheKey,
      () => generateHashtags(keyword),
      60 * 60 * 6
    );

    return NextResponse.json({ keyword, ...result });
  } catch (err) {
    console.error(" Hashtag Agent Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
  }
}

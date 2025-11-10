import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { AnalyzeAgentSchema } from "./schema";
import {
  isWithinTokenLimit,
  splitTextByTokenLimit,
} from "@/app/api/utils/tokenUtils";
import { connectDB } from "@/app/api/utils/db";
import { cachedAgent, deleteCacheKey } from "@/lib/cache"; //  added cache helpers

const MAX_TOKENS = 2000;

//  Core analyzer generation logic
async function generateAnalysis(keyword: string) {
  //  Fetch SERP data
  const serpRes = await fetch(
    `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&api_key=${process.env.SERP_API_KEY}`
  );
  const serpJson = await serpRes.json();

  if (!serpJson.organic_results || serpJson.organic_results.length === 0) {
    throw new Error("No SERP data found");
  }

  const organicResults = serpJson.organic_results.slice(0, 5);
  const prompt = createPrompt(keyword, organicResults);

  if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
    const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS);
    throw new Error(
      `Prompt exceeded token limit. Reduce SERP results or truncate content.`
    );
  }

  //  Call Groq LLM for analysis
  const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are an SEO analyst and strategist." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  const aiJson = await aiRes.json();

  if (!aiJson.choices?.[0]?.message?.content) {
    throw new Error("No AI content returned.");
  }

  const rawOutput = aiJson.choices[0].message.content;

  //  Validate output
  let parsed;
  try {
    parsed = JSON.parse(rawOutput || "{}");
  } catch (err) {
    console.error(" JSON parse error:", err, "\nOutput:", rawOutput);
    throw new Error("Failed to parse AI output");
  }

  const validation = AnalyzeAgentSchema.safeParse(parsed);
  if (!validation.success) {
    console.error(" Schema validation failed:", validation.error.flatten());
    throw new Error("Output schema validation failed");
  }

  return validation.data;
}

//  API Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword, regenerate = false } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
    }

    await connectDB();

    const cacheKey = `agent:analyze:${keyword.toLowerCase()}`;

    //  Optional regenerate
    if (regenerate) {
      await deleteCacheKey(cacheKey);
      console.log(` Cache cleared for analyze agent: ${keyword}`);
    }

    //  Use cachedAgent (12-hour TTL)
    const result = await cachedAgent(
      cacheKey,
      () => generateAnalysis(keyword),
      60 * 60 * 12
    );

    return NextResponse.json({ keyword, ...result });
  } catch (err: unknown) {
    console.error(" Analyze Agent Fatal Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message || "Internal server error" },
      { status: 500 }
    );
  }
}

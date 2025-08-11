

import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { KeywordIntentSchema } from "./schema";

// Simple in-memory cache
const cache = new Map<string, any>();

export async function runKeywordAgent(keyword: string) {
  if (cache.has(keyword)) return { ...cache.get(keyword), cached: true };

  const prompt = createPrompt(keyword);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
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
    console.error("❌ JSON parse error:", err, "\nReturned:", raw);
    throw new Error("Invalid JSON from model");
  }

  const result = KeywordIntentSchema.safeParse(parsed);
  if (!result.success) {
    console.error("❌ Schema validation failed:", result.error.flatten());
    throw new Error("Invalid schema from model");
  }

  cache.set(keyword, result.data);
  return result.data;
}

// ✅ API route still works
export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json();
    if (!keyword) return NextResponse.json({ error: "Missing keyword" }, { status: 400 });

    const data = await runKeywordAgent(keyword);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Agent error" }, { status: 500 });
  }
}

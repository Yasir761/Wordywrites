import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { TopicSuggestionSchema } from "./schema";
import { z } from "zod";

type TopicSuggestion = z.infer<typeof TopicSuggestionSchema>;
const cache = new Map<string, TopicSuggestion>();

async function runTopicFinderAgent(keyword: string) {
  if (cache.has(keyword)) return { ...cache.get(keyword), cached: true };

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
        { role: "system", content: "You are a helpful SEO blog topic suggestion AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
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

  const result = TopicSuggestionSchema.safeParse(parsed);
  if (!result.success) {
    console.error(" Schema validation failed:", result.error.flatten());
    throw new Error("Invalid schema from model");
  }

  cache.set(keyword, result.data);
  return result.data;
}

export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json();
    if (!keyword) return NextResponse.json({ error: "Missing keyword" }, { status: 400 });

    const data = await runTopicFinderAgent(keyword);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Agent error" }, { status: 500 });
  }
}

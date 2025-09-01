import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { HashtagSchema } from "./schema";

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();

  if (!keyword) {
    return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
  }

  const prompt = createPrompt(keyword);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "You are a professional social media strategist." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });

    const json = await res.json();
    let rawOutput = json.choices?.[0]?.message?.content?.trim();

    if (!rawOutput) {
      return NextResponse.json({ error: "No content returned by LLM" }, { status: 500 });
    }

    // 🧼 Sanitize common LLM output quirks (like ```json)
    rawOutput = rawOutput.replace(/```json|```/g, "").trim();

    // 🛡️ Try parsing with soft fix if needed
    let parsed;
    try {
      const safeOutput = rawOutput.endsWith("}") ? rawOutput : rawOutput + "}";
      parsed = JSON.parse(safeOutput);
    } catch (err) {
      console.error("❌ JSON parse error in Hashtag agent:", err, "\nRaw:", rawOutput);
      return NextResponse.json({
        keyword,
        error: "❌ Failed to parse JSON from model",
        raw: rawOutput
      }, { status: 500 });
    }

    // ✅ Validate using zod
    const result = HashtagSchema.safeParse(parsed);
    if (!result.success) {
      console.error("❌ Hashtag schema validation failed:", result.error.flatten());
      return NextResponse.json({
        keyword,
        error: "❌ Hashtag output format invalid",
        issues: result.error.flatten(),
        raw: parsed
      }, { status: 422 });
    }

    return NextResponse.json({ keyword, tags: result.data.tags });
  } catch (err) {
    console.error("💥 Hashtag Agent Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

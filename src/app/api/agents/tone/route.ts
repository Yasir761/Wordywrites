import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { ToneSchema } from "./schema";

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();

  if (!keyword) {
    return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
  }

  try {
    const prompt = createPrompt(keyword);

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
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
      }),
    });

    const data = await aiRes.json();
    const raw = data.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      return NextResponse.json({ error: "No AI output received." }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Tone JSON parse failed:", err, "\nRaw output:", raw);
      return NextResponse.json({
        error: "Model returned invalid JSON.",
        raw
      }, { status: 500 });
    }

    const validated = ToneSchema.safeParse(parsed);

    if (!validated.success) {
      console.error("❌ Tone schema validation failed:", validated.error.format());
      return NextResponse.json({
        error: "Invalid tone/voice format",
        issues: validated.error.flatten(),
        raw: parsed
      }, { status: 422 });
    }

    return NextResponse.json({ keyword, ...validated.data });
  } catch (err) {
    console.error("💥 Tone Agent error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

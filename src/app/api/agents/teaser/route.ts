import { NextRequest, NextResponse } from "next/server";
import { createGeneralTeaserPrompt } from "./prompt";
import { GeneralTeaserSchema } from "./schema";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
  }

  try {
    // 🧠 Generate General Teasers
    const prompt = createGeneralTeaserPrompt(title, content);
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a professional content strategist." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const json = await res.json();
    let rawOutput = json.choices?.[0]?.message?.content?.trim() || "";

    // --- STEP 1: Clean markdown, bullets, and quotes ---
    rawOutput = rawOutput
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[*_]+/g, "") // remove markdown symbols
      .replace(/["“”]+/g, "")
      .trim();

    // --- STEP 2: Break into sections ---
    const sections = rawOutput
      .split(/\n+/)
      .map((s: string) => s.trim())
      .filter(Boolean);

    // --- STEP 3: Extract valid teasers ---
    let teasers = sections
      .filter((s: string) => s.length >= 30) // only keep meaningful lines
      .slice(0, 3); // max 3 teasers

    if (teasers.length === 0) {
      teasers = [rawOutput]; // fallback to whole output
    }

    // --- STEP 4: Extract hashtags ---
    let hashtags =
      sections
        .find((s: string) => s.includes("#"))
        ?.replace(/^[^\#]*/, "") 
        .split(/\s+/)
        .filter((tag: string) => /^#[\w]+$/.test(tag)) || [];

    if (hashtags.length === 0) {
      hashtags = ["#blog", "#content", "#marketing"]; // fallback hashtags
    }

    // --- STEP 5: Extract CTA ---
    const engagementCTA =
      sections.find((s: string) =>
        s.toLowerCase().includes("read") ||
        s.toLowerCase().includes("take") ||
        s.toLowerCase().includes("thought")
      ) || "Read the full blog here 👇";

    // --- STEP 6: Validate final output ---
    const validated = GeneralTeaserSchema.safeParse({ teasers, hashtags, engagementCTA });
    if (!validated.success) {
      console.error("❌ General Teaser validation failed:", validated.error.flatten());
      return NextResponse.json(
        {
          error: "Validation failed",
          raw: { teasers, hashtags, engagementCTA },
          issues: validated.error.flatten(),
        },
        { status: 422 }
      );
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error("💥 General Teaser Agent Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { BlogOutlineSchema } from "./schema";
// import {
//   countTokens,
//   isWithinTokenLimit,
//   splitTextByTokenLimit,
// } from "@/app/api/utils/tokenUtils";

// const MAX_TOKENS = 2048;

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { keyword, tone } = body;

//   if (!keyword || !tone) {
//     return NextResponse.json({ error: "Missing keyword or tone" }, { status: 400 });
//   }

//   const prompt = createPrompt(keyword, tone);

//   if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
//     const trimmed = splitTextByTokenLimit(prompt, MAX_TOKENS)[0] || "";
//     console.warn("⚠️ Prompt too long. Using trimmed version.");
//     return NextResponse.json({
//       warning: "Prompt exceeded token limit. Please shorten input.",
//       trimmedPrompt: trimmed,
//       tokens: countTokens(trimmed),
//     }, { status: 413 });
//   }

//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "llama3-8b-8192",
//         messages: [
//           { role: "system", content: "You are a concise blog strategist. Do not generate paragraphs." },
//           { role: "user", content: prompt }
//         ],
//         temperature: 0.4, // 🔽 Lower temp for less hallucination
//       })
//     });

//     const data = await response.json();
//     const rawOutput = data.choices?.[0]?.message?.content || "";

//     // 💡 Clean + dedupe bullet points
//     const outline = rawOutput
//       .split(/\n|•|-/)
//       .map((line: string) => line.trim())
//       .filter((line: string, i: number, arr: string[]) => line.length > 4 && arr.indexOf(line) === i);

//     const result = BlogOutlineSchema.safeParse({ outline });

//     if (!result.success) {
//       console.error("❌ Outline validation failed:", result.error.format());
//       return NextResponse.json({
//         error: "Invalid blog outline format.",
//         raw: rawOutput,
//         issues: result.error.flatten()
//       }, { status: 422 });
//     }

//     return NextResponse.json({ keyword, outline: result.data.outline });
//   } catch (err) {
//     console.error("💥 Blueprint Agent Error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { BlogOutlineSchema } from "./schema";
import {
  countTokens,
  isWithinTokenLimit,
  splitTextByTokenLimit,
} from "@/app/api/utils/tokenUtils";

const MAX_TOKENS = 2048;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { keyword, tone } = body;

  // 🎯 Allow Free plan to skip tone
  const finalKeyword = keyword || "general topic";
  const finalTone = tone || "neutral";

  const prompt = createPrompt(finalKeyword, finalTone);

  if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
    const trimmed = splitTextByTokenLimit(prompt, MAX_TOKENS)[0] || "";
    console.warn("⚠️ Prompt too long. Using trimmed version.");
    return NextResponse.json(
      {
        warning: "Prompt exceeded token limit. Please shorten input.",
        trimmedPrompt: trimmed,
        tokens: countTokens(trimmed),
      },
      { status: 413 }
    );
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
              "You are a concise blog strategist. Do not generate paragraphs.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const rawOutput = data.choices?.[0]?.message?.content || "";

    // 💡 Clean + dedupe bullet points
    const outline = rawOutput
      .split(/\n|•|-/)
      .map((line: string) => line.trim())
      .filter(
        (line: string, i: number, arr: string[]) =>
          line.length > 4 && arr.indexOf(line) === i
      );

    const result = BlogOutlineSchema.safeParse({ outline });

    if (!result.success) {
      console.error("❌ Outline validation failed:", result.error.format());
      return NextResponse.json(
        {
          error: "Invalid blog outline format.",
          raw: rawOutput,
          issues: result.error.flatten(),
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ keyword: finalKeyword, outline: result.data.outline });
  } catch (err) {
    console.error("💥 Blueprint Agent Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { BlogOutputSchema } from "./schema";
// import {
//   countTokens,
//   isWithinTokenLimit,
//   splitTextByTokenLimit,
// } from "@/app/api/utils/tokenUtils";
// import { connectDB } from "@/app/api/utils/db";
// // import { checkAndConsumeCredit } from "@/app/api/utils/creditUtils"; // Uncomment if credit check is needed

// const MAX_TOKENS = 2048;

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { keyword, outline, tone, seo } = body;

//   if (
//     !keyword ||
//     !outline ||
//     !tone ||
//     !seo?.optimized_title ||
//     !seo?.meta_description ||
//     typeof seo?.seo_score !== "number"
//   ) {
//     return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//   }

//   try {
//     // 🔗 Connect and check credit access
//     await connectDB();
//     // await checkAndConsumeCredit(email, { allowOnly: ["Starter", "Pro"] });

//     // ✨ Create AI-Powered prompt
//     const prompt = createPrompt({
//       keyword,
//       outline,
//       tone,
//       voice: body.voice || "",
//       title: seo.optimized_title,
//       meta: seo.meta_description,
//     });

//     // 🚀 Token safety check
//     if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
//       const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS);
//       if (chunks.length === 0) {
//         return NextResponse.json(
//           { error: "Prompt too long and could not be split." },
//           { status: 500 }
//         );
//       }

//       return NextResponse.json(
//         {
//           warning:
//             "Prompt was too long and has been trimmed. Please shorten input or upgrade your plan.",
//           trimmedPrompt: chunks[0],
//           tokens: countTokens(chunks[0]),
//         },
//         { status: 413 }
//       );
//     }

//     // 🎯 Generate blog content with OpenAI
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a professional blog writer. Write a blog article in clean, structured HTML using proper headings (h1, h2, h3), paragraphs, bold text, and lists where necessary. Avoid placeholder years (like 2023 or 2024); instead, use 'this year' or be timeless. Ensure the result is high quality and looks like a published blog.",
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         temperature: 0.5,
//         max_tokens: MAX_TOKENS,
//       }),
//     });

//     const data = await response.json();
//     const blog = data.choices?.[0]?.message?.content?.trim();
//     const wordCount = blog ? blog.split(/\s+/).length : 0;

//     // console.log("📨 Full OpenAI response:", JSON.stringify(data, null, 2));

//     // 🔍 Validate output schema
//     const result = BlogOutputSchema.safeParse({ blog, keyword, wordCount });

//     if (!result.success) {
//       return NextResponse.json(
//         {
//           keyword,
//           error: "Output schema invalid",
//           issues: result.error.flatten(),
//           raw: blog,
//           wordCount,
//         },
//         { status: 422 }
//       );
//     }

//     // ✅ Return blog + wordCount + seo (including seo_score)
//     return NextResponse.json({
//       ...result.data,
//       seo,        // pass through SEO agent object
//       wordCount,  // explicitly include word count
//     });
//   } catch (err: unknown) {
//     console.error("❌ Blog Agent Error:", err);
//     return NextResponse.json(
//       { error: (err instanceof Error ? err.message : "Internal error") },
//       { status: 500 }
//     );
//   }
// }













import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { BlogOutputSchema } from "./schema";
import {
  countTokens,
  isWithinTokenLimit,
  splitTextByTokenLimit,
} from "@/app/api/utils/tokenUtils";
import { connectDB } from "@/app/api/utils/db";

const MAX_TOKENS = 2048;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { keyword, outline, tone, seo } = body;

  // 🎯 Fallbacks for Free plan (when seo or tone missing)
  const finalKeyword = keyword || "a trending topic";
  const finalTone = tone || "neutral";
  const finalOutline = outline || "1. Introduction\n2. Key Points\n3. Conclusion";

  const finalSeo = {
    optimized_title: seo?.optimized_title || `Blog about ${finalKeyword}`,
    meta_description:
      seo?.meta_description ||
      `Learn key insights about ${finalKeyword} in this article.`,
    seo_score: typeof seo?.seo_score === "number" ? seo.seo_score : 50, // neutral default
  };

  try {
    await connectDB();

    const prompt = createPrompt({
      keyword: finalKeyword,
      outline: finalOutline,
      tone: finalTone,
      voice: body.voice || "",
      title: finalSeo.optimized_title,
      meta: finalSeo.meta_description,
    });

    if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
      const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS);
      if (chunks.length === 0) {
        return NextResponse.json(
          { error: "Prompt too long and could not be split." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          warning:
            "Prompt was too long and has been trimmed. Please shorten input or upgrade your plan.",
          trimmedPrompt: chunks[0],
          tokens: countTokens(chunks[0]),
        },
        { status: 413 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional blog writer. Write a blog article in clean, structured HTML using proper headings (h1, h2, h3), paragraphs, bold text, and lists where necessary. Avoid placeholder years; instead, use 'this year' or timeless phrasing. Ensure the result is high quality and looks like a published blog.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: MAX_TOKENS,
      }),
    });

    const data = await response.json();
    const blog = data.choices?.[0]?.message?.content?.trim();
    const wordCount = blog ? blog.split(/\s+/).length : 0;

    const result = BlogOutputSchema.safeParse({
      blog,
      keyword: finalKeyword,
      wordCount,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          keyword: finalKeyword,
          error: "Output schema invalid",
          issues: result.error.flatten(),
          raw: blog,
          wordCount,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      ...result.data,
      seo: finalSeo,
      wordCount,
    });
  } catch (err: unknown) {
    console.error("❌ Blog Agent Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

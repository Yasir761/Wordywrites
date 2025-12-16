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












// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "./prompt";
// import { BlogOutputSchema } from "./schema";
// import {
//   isWithinTokenLimit,
//   splitTextByTokenLimit,
// } from "@/app/api/utils/tokenUtils";

// import { connectDB } from "@/app/api/utils/db";
// import { cachedAgent, deleteCacheKey } from "@/lib/cache";

// import * as Sentry from "@sentry/nextjs";

// const MAX_TOKENS = 2048;



// // BLOG GENERATION LOGIC
// async function generateBlog(
//   keyword: string,
//   outline: string,
//   tone: string,
//   seo: any,
//   voice?: string
// ) {
//   return await Sentry.startSpan(
//     { name: "Blog Agent Execution", op: "agent.blog" },
//     async () => {
//       Sentry.addBreadcrumb({
//         category: "blog",
//         message: "Blog agent started",
//         level: "info",
//         data: { keyword, tone, voice },
//       });

      
//       const prompt = createPrompt({
//         keyword,
//         outline,
//         tone,
//         voice: voice || "",
//         title: seo.optimized_title,
//         meta: seo.meta_description,
//       });

//       Sentry.addBreadcrumb({
//         category: "prompt",
//         message: "Generated prompt for blog agent",
//         level: "debug",
//         data: { promptPreview: prompt.slice(0, 200) },
//       });

//       if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
//         Sentry.captureMessage("Prompt exceeded token limit", {
//           level: "warning",
//         });

//         const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS);
//         if (!chunks.length) throw new Error("Prompt too long and unsplittable.");

//         throw new Error("Prompt exceeded token limit.");
//       }

//       // CALLING OPENAI
//       Sentry.addBreadcrumb({
//         category: "openai",
//         message: "Calling OpenAI for blog generation",
//         level: "info",
//       });

//       const response = await fetch(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [
//               {
//                 role: "system",
//                 content:
//                   "You are a professional blog writer. Write clean, structured HTML with headings and lists. Avoid years like 2022/2023/2024; use timeless phrasing.",
//               },
//               { role: "user", content: prompt },
//             ],
//             temperature: 0.5,
//             max_tokens: MAX_TOKENS,
//           }),
//         }
//       );

//       if (!response.ok) {
//         Sentry.captureMessage("OpenAI API failure", {
//           level: "error",
//           extra: { status: response.status },
//         });
//         throw new Error(`OpenAI API error: ${response.status}`);
//       }

//       const data = await response.json();
//       const blog = data.choices?.[0]?.message?.content?.trim();

//       if (!blog) {
//         Sentry.captureMessage("Empty blog returned from OpenAI", {
//           level: "error",
//         });
//         throw new Error("OpenAI returned empty blog text");
//       }

//       const wordCount = blog.split(/\s+/).length;

//      // VALIDATTION
//       const parsed = BlogOutputSchema.safeParse({
//         blog,
//         keyword,
//         wordCount,
//       });

//       if (!parsed.success) {
//         Sentry.captureException(parsed.error, {
//           tags: { stage: "schema-validation" },
//         });
//         throw new Error("Blog schema validation failed");
//       }

//       return {
//         ...parsed.data,
//         seo,
//         wordCount,
//       };
//     }
//   );
// }

// // API ROUTE HANDLER
// export async function POST(req: NextRequest) {
//   return Sentry.startSpan(
//     { name: "Blog Agent API Request", op: "api.post" },
//     async () => {
//       try {
//         const body = await req.json();
//         const { keyword, outline, tone, seo, voice, regenerate = false } = body;

//         const finalKeyword = keyword || "a trending topic";
//         const finalTone = tone || "neutral";
//         const finalOutline =
//           outline || "1. Introduction\n2. Key Points\n3. Conclusion";

//         const finalSeo = {
//           optimized_title:
//             seo?.optimized_title || `Blog about ${finalKeyword}`,
//           meta_description:
//             seo?.meta_description ||
//             `Explore essential insights about ${finalKeyword}.`,
//           seo_score:
//             typeof seo?.seo_score === "number" ? seo.seo_score : 50,
//         };

//         await connectDB();

//         const cacheKey = `agent:blog:${finalKeyword.toLowerCase()}:${finalTone.toLowerCase()}:${finalSeo.optimized_title
//           .toLowerCase()
//           .slice(0, 50)}`;

//         if (regenerate) {
//           Sentry.addBreadcrumb({
//             category: "cache",
//             message: "Regenerate requested — clearing cache",
//             level: "info",
//             data: { cacheKey },
//           });
//           await deleteCacheKey(cacheKey);
//         }

//         const result = await cachedAgent(
//           cacheKey,
//           () =>
//             generateBlog(
//               finalKeyword,
//               finalOutline,
//               finalTone,
//               finalSeo,
//               voice
//             ),
//           60 * 60 * 24 // TTL: 24 hours
//         );

//         return NextResponse.json(result);
//       } catch (err) {
//         Sentry.captureException(err);
//         const message =
//           err instanceof Error ? err.message : "Internal server error";
//         return NextResponse.json({ error: message }, { status: 500 });
//       }
//     }
//   );
// }






import { NextRequest, NextResponse } from "next/server";
import { createPrompt } from "./prompt";
import { BlogOutputSchema } from "./schema";
import {
  isWithinTokenLimit,
  splitTextByTokenLimit,
} from "@/app/api/utils/tokenUtils";

import { connectDB } from "@/app/api/utils/db";
import { cachedAgent, deleteCacheKey } from "@/lib/cache";

import * as Sentry from "@sentry/nextjs";

const MAX_TOKENS = 2048;

// BLOG GENERATION LOGIC
async function generateBlog(
  keyword: string,
  outline: string,
  tone: string,
  seo: any,
  voice?: string
) {
  return await Sentry.startSpan(
    { name: "Blog Agent Execution", op: "agent.blog" },
    async () => {
      Sentry.addBreadcrumb({
        category: "blog",
        message: "Blog agent started",
        level: "info",
        data: { keyword, tone, voice },
      });

      const prompt = createPrompt({
        keyword,
        outline,
        tone,
        voice: voice || "",
        title: seo.optimized_title,
        meta: seo.meta_description,
      });

      Sentry.addBreadcrumb({
        category: "prompt",
        message: "Generated prompt for blog agent",
        level: "debug",
        data: { preview: prompt.slice(0, 200) },
      });

      if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
        Sentry.captureMessage("Prompt exceeded token limit", {
          level: "warning",
        });

        const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS);
        if (!chunks.length) {
          throw new Error("Prompt too long and unsplittable");
        }

        throw new Error("Prompt exceeded token limit");
      }

      Sentry.addBreadcrumb({
        category: "openai",
        message: "Calling OpenAI for blog generation",
        level: "info",
      });

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
                  "You are a professional blog writer. Write clean, structured HTML with headings and lists. Avoid years like 2022/2023/2024; use timeless phrasing.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.5,
            max_tokens: MAX_TOKENS,
          }),
        }
      );

      if (!response.ok) {
        Sentry.captureMessage("OpenAI API failure", {
          level: "error",
          extra: { status: response.status },
        });
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const blog = data?.choices?.[0]?.message?.content?.trim();

      if (!blog) {
        Sentry.captureMessage("Empty blog returned from OpenAI", {
          level: "error",
        });
        throw new Error("OpenAI returned empty blog text");
      }

      console.log(" BLOG GENERATED | length:", blog.length);

      const wordCount = blog.split(/\s+/).length;

      const parsed = BlogOutputSchema.safeParse({
        blog,
        keyword,
        wordCount,
      });

      if (!parsed.success) {
        Sentry.captureException(parsed.error, {
          tags: { stage: "schema-validation" },
        });
        throw new Error("Blog schema validation failed");
      }

      return {
        ...parsed.data,
        seo,
        wordCount,
      };
    }
  );
}

// API ROUTE HANDLER
export async function POST(req: NextRequest) {
  return Sentry.startSpan(
    { name: "Blog Agent API Request", op: "api.post" },
    async () => {
      try {
        const body = await req.json();
        const { keyword, outline, tone, seo, voice, regenerate = false } = body;

        const finalKeyword = keyword || "a trending topic";
        const finalTone = tone || "neutral";
        const finalOutline =
          outline || "1. Introduction\n2. Key Points\n3. Conclusion";

        const finalSeo = {
          optimized_title:
            seo?.optimized_title || `Blog about ${finalKeyword}`,
          meta_description:
            seo?.meta_description ||
            `Explore essential insights about ${finalKeyword}.`,
          seo_score:
            typeof seo?.seo_score === "number" ? seo.seo_score : 50,
        };

        await connectDB();

        const cacheKey = `agent:blog:${finalKeyword
          .toLowerCase()
          .slice(0, 50)}:${finalTone.toLowerCase()}:${finalSeo.optimized_title
          .toLowerCase()
          .slice(0, 50)}`;

        if (regenerate) {
          Sentry.addBreadcrumb({
            category: "cache",
            message: "Regenerate requested — clearing cache",
            level: "info",
            data: { cacheKey },
          });
          await deleteCacheKey(cacheKey);
        }

        const result = await cachedAgent(
          cacheKey,
          () =>
            generateBlog(
              finalKeyword,
              finalOutline,
              finalTone,
              finalSeo,
              voice
            ),
          60 * 60 * 24 // 24 hours
        );

        console.log(" BLOG AGENT RESPONSE SENT");

        return NextResponse.json(result);
      } catch (err) {
        Sentry.captureException(err);
        const message =
          err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
      }
    }
  );
}

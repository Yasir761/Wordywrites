
// import { NextRequest, NextResponse } from "next/server";
// import { createPrompt } from "../prompt";
// import { BlogOutputSchema } from "../schema";
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
//         data: { preview: prompt.slice(0, 200) },
//       });

//       if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
//         Sentry.captureMessage("Prompt exceeded token limit", {
//           level: "warning",
//         });

//         const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS);
//         if (!chunks.length) {
//           throw new Error("Prompt too long and unsplittable");
//         }

//         throw new Error("Prompt exceeded token limit");
//       }

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
//       const blog = data?.choices?.[0]?.message?.content?.trim();

//       if (!blog) {
//         Sentry.captureMessage("Empty blog returned from OpenAI", {
//           level: "error",
//         });
//         throw new Error("OpenAI returned empty blog text");
//       }

//       console.log(" BLOG GENERATED | length:", blog.length);

//       const wordCount = blog.split(/\s+/).length;

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

//         const cacheKey = `agent:blog:${finalKeyword
//           .toLowerCase()
//           .slice(0, 50)}:${finalTone.toLowerCase()}:${finalSeo.optimized_title
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
//           60 * 60 * 24 // 24 hours
//         );

//         console.log(" BLOG AGENT RESPONSE SENT");

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








import { NextRequest } from "next/server";
import { createPrompt } from "../prompt";
import { connectDB } from "@/app/api/utils/db";
import * as Sentry from "@sentry/nextjs";
import { BlogModel } from "@/app/models/blog";

// export const runtime = "edge";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function getBaseUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  return Sentry.startSpan(
    { name: "Blog Stream API", op: "api.stream" },
    async () => {
      try {
        const body = await req.json();
        const { blogId, keyword, outline, tone, seo, voice } = body;

        if (!blogId || !keyword || !outline || !seo) {
          return new Response("Missing required fields", { status: 400 });
        }

        await connectDB();

        const prompt = createPrompt({
          keyword,
          outline,
          tone: tone || "neutral",
          voice: voice || "",
          title: seo.optimized_title,
          meta: seo.meta_description,
        });

        const openaiRes = await fetch(OPENAI_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            stream: true,
            temperature: 0.5,
            messages: [
              {
                role: "system",
                content:
                  "You are a professional blog writer. Write clean, structured HTML with headings and lists. Avoid years; use timeless phrasing.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!openaiRes.ok || !openaiRes.body) {
          throw new Error("OpenAI streaming failed");
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let fullBlog = ""; // ✅ ACCUMULATE HERE

        const stream = new ReadableStream({
          async start(controller) {
            const reader = openaiRes.body!.getReader();

            try {
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);

                for (const line of chunk.split("\n")) {
                  if (!line.startsWith("data:")) continue;
                  if (line.includes("[DONE]")) break;

                  try {
                    const json = JSON.parse(line.replace("data:", "").trim());
                    const token =
                      json.choices?.[0]?.delta?.content;

                    if (token) {
                      fullBlog += token; // ✅ track content
                      controller.enqueue(encoder.encode(token));
                    }
                  } catch {
                    // ignore malformed chunks
                  }
                }
              }

              controller.close();

              // ✅ FINALIZE AFTER STREAM ENDS (BACKEND ONLY)
             const wordCount = fullBlog.split(/\s+/).length;

await BlogModel.updateOne(
  { _id: blogId },
  {
    $set: {
      "blogAgent.blog": fullBlog,
      "blogAgent.wordCount": wordCount,
      status: "generated",
    },
  }
);

              const previewRes = await fetch(
                `${getBaseUrl()}/api/agents/contentpreview`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: seo.optimized_title,
                    content: fullBlog,
                  }),
                }
              );

              if (previewRes.ok) {
                const preview = await previewRes.json();
                await BlogModel.updateOne(
                  { _id: blogId },
                  {
                    $set: {
                      ContentPreviewAgent: preview,
                      status: "completed",
                    },
                  }
                );
              }
            } catch (err) {
              Sentry.captureException(err);
              controller.error(err);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
            "Cache-Control": "no-store",
          },
        });
      } catch (err) {
        Sentry.captureException(err);
        return new Response("Streaming failed", { status: 500 });
      }
    }
  );
}

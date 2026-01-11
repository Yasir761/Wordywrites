






import { NextRequest } from "next/server";
import { createPrompt } from "../prompt";
import { connectDB } from "@/app/api/utils/db";
import * as Sentry from "@sentry/nextjs";
import { BlogModel } from "@/app/models/blog";

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
          title: seo.optimized_title || keyword,
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
        let fullBlog = "";

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
                  if (line.includes("[DONE]")) continue;

                  try {
                    const json = JSON.parse(line.replace("data:", "").trim());
                    const token = json.choices?.[0]?.delta?.content;

                    if (token) {
                      fullBlog += token;
                      controller.enqueue(encoder.encode(token));
                    }
                  } catch {
                    // ignore malformed chunks
                  }
                }
              }

              if (!fullBlog.trim()) {
                throw new Error("Streaming completed but blog content is empty");
              }

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

              // 🔐 SAFE TITLE FALLBACK
              const title =
                seo?.optimized_title?.trim() ||
                keyword?.trim() ||
                "";

              if (!title || !fullBlog.trim()) {
                Sentry.captureMessage("Skipping content preview generation", {
                  level: "warning",
                  extra: {
                    titlePresent: Boolean(title),
                    blogLength: fullBlog.length,
                  },
                });
                return;
              }

              Sentry.addBreadcrumb({
                category: "content-preview",
                message: "Calling content preview",
                level: "info",
                data: {
                  title: title.slice(0, 80),
                  blogLength: fullBlog.length,
                },
              });

              const previewRes = await fetch(
                `${getBaseUrl()}/api/agents/contentpreview`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title,
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
                      contentPreviewAgent: preview,
                      status: "completed",
                    },
                  }
                );
              } else {
                Sentry.captureMessage("Content preview API failed", {
                  level: "error",
                  extra: { status: previewRes.status },
                });
              }
            } catch (err) {
              Sentry.captureException(err);
              controller.error(err);
            } finally {
              controller.close();
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

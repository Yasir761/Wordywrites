
import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { CrawlEnhanceSchema } from "./schema";
import { createEnhancementPrompt } from "./prompt";
import { isWithinTokenLimit, splitTextByTokenLimit } from "@/app/api/utils/tokenUtils";
import { connectDB } from "@/app/api/utils/db";
import { CrawledBlogModel } from "@/app/models/crawledBlog";
import * as Sentry from "@sentry/nextjs";

const parser = new Parser();
const MAX_TOKENS = 4000;
const MAX_CONTENT_TOKENS = 2500; // Reserve tokens for system prompt and other content


// function isRSSFeed(url: string) {
//   const rssIndicators = [
//     '/rss',
//     '/feed',
//     '/atom',
//     '.xml',
//     'rss.xml',
//     'feed.xml',
//     'atom.xml'
//   ];
  
//   const lowerUrl = url.toLowerCase();
//   return rssIndicators.some(indicator => lowerUrl.includes(indicator));
// }

// Function to convert article URL to RSS feed URL
// function tryConvertTourl(url: string) {
//   const lowerUrl = url.toLowerCase();
  
//   // Medium user feeds
//   if (lowerUrl.includes('medium.com/@')) {
//     const username = url.match(/@([^/]+)/)?.[1];
//     if (username) {
//       return `https://medium.com/feed/@${username}`;
//     }
//   }
  
//   // Medium publication feeds  
//   if (lowerUrl.includes('medium.com/') && !lowerUrl.includes('@')) {
//     const pathMatch = url.match(/medium\.com\/([^/]+)/);
//     if (pathMatch && pathMatch[1] !== 'feed') {
//       return `https://medium.com/feed/${pathMatch[1]}`;
//     }
//   }
  
//   // Common blog platforms
//   const platformConversions = [
//     { pattern: /wordpress\.com/, rss: (url: string) => url.replace(/\/$/, '') + '/feed' },
//     { pattern: /blogspot\.com/, rss: (url: string) => url.replace(/\/$/, '') + '/feeds/posts/default' },
//     { pattern: /ghost\./, rss: (url: string) => url.replace(/\/$/, '') + '/rss' },
//     { pattern: /substack\.com/, rss: (url: string) => url.replace(/\/$/, '') + '/feed' }
//   ];
  
//   for (const conversion of platformConversions) {
//     if (conversion.pattern.test(lowerUrl)) {
//       return conversion.rss(url);
//     }
//   }
  
//   return null;
// }

// Function to intelligently truncate content while preserving structure
function intelligentContentTruncation(content: string, maxTokens: number) {
  // First, try to fit within token limit
  if (isWithinTokenLimit(content, maxTokens)) {
    return content;
  }
  
  console.log(` Content too long, truncating from ${content.length} chars`);
  Sentry.addBreadcrumb({
    category: "crawl.truncation",
    message: "Content exceeded token limit — starting truncation",
    level: "warning",
    data: { originalLength: content.length, maxTokens }
  });

  // Split into paragraphs and prioritize
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  
  let truncatedContent = '';
  let currentTokens = 0;
  
  // Always include first few paragraphs (usually intro)
  for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
    const testContent = truncatedContent + (truncatedContent ? '\n\n' : '') + paragraphs[i];
    if (isWithinTokenLimit(testContent, maxTokens)) {
      truncatedContent = testContent;
      currentTokens++;
    } else {
      break;
    }
  }
  
  // Add middle content if space available
  const midStart = Math.floor(paragraphs.length / 3);
  const midEnd = Math.floor(2 * paragraphs.length / 3);
  
  for (let i = midStart; i < midEnd && i < paragraphs.length; i++) {
    const testContent = truncatedContent + '\n\n' + paragraphs[i];
    if (isWithinTokenLimit(testContent, maxTokens)) {
      truncatedContent = testContent;
    } else {
      break;
    }
  }
  
  // Try to add conclusion paragraphs
  const lastParagraphs = paragraphs.slice(-2);
  for (const para of lastParagraphs) {
    const testContent = truncatedContent + '\n\n' + para;
    if (isWithinTokenLimit(testContent, maxTokens)) {
      truncatedContent = testContent;
    } else {
      break;
    }
  }
  
  // If still too long, do character-based truncation
  if (!isWithinTokenLimit(truncatedContent, maxTokens)) {
    const chunks = splitTextByTokenLimit(truncatedContent, maxTokens);
    truncatedContent = chunks[0];
  }
  
  console.log(` Content truncated to ${truncatedContent.length} chars`);
  Sentry.captureMessage("Content truncated for processing", {
    extra: { truncatedLength: truncatedContent.length, maxTokens }
  });
  return truncatedContent + '\n\n[Content truncated for processing...]';
}

// Function to safely fetch and parse HTML content
async function fetchArticleContent(url:string) {
  return await Sentry.startSpan(
    { name: "fetchArticleContent", op: "crawl.fetch" },
    async () => {
      console.log(" Fetching article content from:", url);
      Sentry.addBreadcrumb({
        category: "crawl.fetch",
        message: "Fetching article HTML",
        level: "info",
        data: { url }
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          Sentry.captureException(new Error(`HTTP ${response.status}: ${response.statusText}`), { extra: { url, status: response.status }});
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        console.log(" HTML fetched, length:", html.length);
        Sentry.addBreadcrumb({
          category: "crawl.fetch",
          message: "HTML fetched",
          level: "debug",
          data: { length: html.length, url }
        });

        // Clean HTML aggressively
        const cleanedHtml = html
          .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
          .replace(/<[^>]*@[^>]*>/g, '') // Remove tags with @ symbols
          .replace(/<([^>\s]*[^a-zA-Z0-9\-_\/\s][^>]*)>/g, ''); // Remove malformed tags

        const $ = cheerio.load(cleanedHtml, {
          xmlMode: false
        });

        // Extract title
        let title = $('h1').first().text().trim() ||
                    $('title').text().trim() ||
                    $('[property="og:title"]').attr('content') ||
                    $('meta[name="title"]').attr('content') ||
                    '';

        // Clean title
        title = title.replace(/\s+/g, ' ').trim();

        // Extract content using multiple strategies
        let content = '';
        const contentSelectors = [
          'article',
          '[role="main"]',
          '.post-content',
          '.entry-content',
          '.content',
          '.post-body',
          '.article-content',
          'main',
          '#content'
        ];

        for (const selector of contentSelectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            content = elements.find('p, div, h1, h2, h3, h4, h5, h6').map((_, el) => {
              const text = $(el).text().trim();
              return text.length > 30 ? text : '';
            }).get().filter(text => text.length > 0).join('\n\n');
            
            if (content.length > 300) {
              break;
            }
          }
        }

        // Fallback: get all paragraphs
        if (!content || content.length < 300) {
          content = $('p').map((_, el) => {
            const text = $(el).text().trim();
            return text.length > 30 ? text : '';
          }).get().filter(text => text.length > 0).join('\n\n');
        }

        // Extract meta description
        const meta = $("meta[name='description']").attr("content") || 
                     $("meta[property='og:description']").attr("content") || 
                     "";

        Sentry.addBreadcrumb({
          category: "crawl.extract",
          message: "Extracted article content",
          level: "info",
          data: { titleLength: title.length, contentLength: content.length, metaLength: meta.length, url }
        });

        return { title, content, meta };
      } catch (err) {
        clearTimeout(timeoutId);
        Sentry.captureException(err, { extra: { url } });
        throw err;
      }
    }
  );
}

// Enhanced AI processing with chunking support
async function processContentWithAI(
  content: string,
  title: string,
  meta: string,
  agents: { intent: any; toneVoice: any; seo: any }
) {
  return await Sentry.startSpan(
    { name: "processContentWithAI", op: "crawl.enhance" },
    async () => {
      try {
        // Truncate content if needed
        const processableContent = intelligentContentTruncation(content, MAX_CONTENT_TOKENS);
        
        const enhancedPrompt = `
You are an expert blog editor. Improve the following blog post:

Title: ${title}
Meta: ${meta}
Tone: ${agents.toneVoice?.tone || "informative"}
Voice: ${agents.toneVoice?.voice || "neutral"}
Intent: ${agents.intent?.intent || "Informational"}
SEO: ${agents.seo?.optimized_title || ""}, ${agents.seo?.meta_description || ""}

Content:
${processableContent}

Enhance by:
- Keep original meaning and key points
- Improve tone, grammar, flow
- Use Markdown headers (##, ###)
- Boost SEO where possible
- Maintain or expand content quality
- Add conclusion if missing
- Preserve technical accuracy

Return only the enhanced blog content in Markdown format.
        `.trim();

        console.log(` Enhancement prompt length: ${enhancedPrompt.length} chars`);
        Sentry.addBreadcrumb({
          category: "crawl.prompt",
          message: "Enhancement prompt created",
          level: "debug",
          data: { promptLength: enhancedPrompt.length }
        });

        // Double-check token limit
        if (!isWithinTokenLimit(enhancedPrompt, MAX_TOKENS)) {
          Sentry.captureMessage("Enhancement prompt exceeds token limit", { level: "error" });
          throw new Error("Content still too large after truncation");
        }

        // Call OpenAI API
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a precise and SEO-aware blog editor. Maintain the original content's technical accuracy and core message." },
              { role: "user", content: enhancedPrompt },
            ],
            temperature: 0.4,
            max_tokens: 3000,
          }),
        });

        if (!aiRes.ok) {
          const errorText = await aiRes.text();
          Sentry.captureException(new Error("OpenAI API error during enhancement"), { extra: { errorText }});
          console.error(" OpenAI API error:", errorText);
          throw new Error(`OpenAI API failed: ${aiRes.status}`);
        }

        const aiJson = await aiRes.json();
        const enhancedBlog = aiJson.choices?.[0]?.message?.content?.trim();
        
        if (!enhancedBlog || enhancedBlog.length < 200) {
          Sentry.captureMessage("Enhanced blog too short or missing", { level: "warning" });
          throw new Error("Enhanced blog is too short or missing");
        }

        Sentry.addBreadcrumb({
          category: "crawl.enhance",
          message: "AI enhancement completed",
          level: "info",
          data: { enhancedLength: enhancedBlog.length }
        });

        return enhancedBlog;
      } catch (err) {
        Sentry.captureException(err);
        throw err;
      }
    }
  );
}


async function crawlAnyUrl(url: string) {
  let title = "";
  let content = "";
  let meta = "";
let method: "rss" | "article" | "fallback" = "fallback";


  // 1️⃣ Try RSS (best effort)
  try {
    const feed = await parser.parseURL(url);
    const firstItem = feed.items?.[0];

    if (firstItem?.link) {
      method = "rss";
      title = firstItem.title || "";

      if (firstItem.content && firstItem.content.length > 300) {
        const $ = cheerio.load(firstItem.content);
        content = $.text().trim();
      }

      if (!content || content.length < 300) {
        const article = await fetchArticleContent(firstItem.link);
        title ||= article.title;
        content = article.content;
        meta = article.meta;
      }
    }
  } catch {
    // RSS is optional — ignore failure
  }

  // 2️⃣ Always fallback to article URL
  if (!content || content.length < 300) {
    method = "article";
    const article = await fetchArticleContent(url);
    title ||= article.title;
    content = article.content;
    meta = article.meta;
  }

  // 3️⃣ Final safety fallback
  if (!content || content.length < 100) {
    Sentry.captureMessage("Low confidence crawl result", {
      level: "warning",
      extra: { url, contentLength: content?.length || 0 }
    });

    content =
      content ||
      meta ||
      "The article could not be fully extracted, but enhancement was attempted based on available content.";
  }

  // Clamp title (CRITICAL)
  if (title.length > 200) {
    title = title.slice(0, 200);
  }

  return { title, content, meta, method };
}


export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "CrawlEnhance API Request", op: "api.post" },
    async () => {
      try {
        console.log(" Starting crawl & enhance agent");
        const { url, manualContent, manualTitle, userId } = await req.json();
        Sentry.setTag("agent", "crawl-enhance");
        if (userId) Sentry.setUser({ id: userId });
        console.log(" Request data:", { url, manualTitle, hasManualContent: !!manualContent });

        await connectDB();

        let title = manualTitle || "";
        let content = manualContent || "";
        let meta = "";





if (url && /^https?:\/\/.+/.test(url)) {
  Sentry.addBreadcrumb({
    category: "crawl.mode",
    message: "Processing any URL",
    level: "info",
    data: { url }
  });

  const crawlResult = await crawlAnyUrl(url);

  title = crawlResult.title || title;
  content = crawlResult.content || content;
  meta = crawlResult.meta || meta;

  Sentry.addBreadcrumb({
    category: "crawl.extract",
    message: "URL crawled successfully",
    level: "info",
    data: {
      method: crawlResult.method,
      titleLength: title.length,
      contentLength: content.length
    }
  });
}



        // --- MODE 2: Manual Input ---




        else if (manualContent && manualContent.trim().length > 100) {
          Sentry.addBreadcrumb({ category: "crawl.mode", message: "Processing manual input mode", level: "info" });
          console.log(" Processing manual input mode");
          title = manualTitle || "Untitled Blog";
          content = manualContent;
          meta = "Enhanced blog generated from manual input";
        } else {
          Sentry.captureMessage("Invalid input for crawl agent", { level: "warning" });
          return NextResponse.json(
            { error: "Provide either a valid URL or sufficient manual content " },
            { status: 400 }
          );
        }

        // --- AI Agents (Intent, Tone, SEO) ---
        let intent = { intent: "Informational" };
        let toneVoice = { tone: "informative", voice: "neutral" };
        let seo = { optimized_title: title, meta_description: meta };
        
        try {
          Sentry.addBreadcrumb({ category: "agents", message: "Calling AI agents", level: "info" });
          console.log(" Calling AI agents...");
          const agentResults = await Promise.allSettled([ // unchanged
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/keyword`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keyword: title }),
            }).then(res => res.ok ? res.json() : Promise.reject(res)),

            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/tone`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keyword: title }),
            }).then(res => res.ok ? res.json() : Promise.reject(res)),

            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/seo-optimizer`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                keyword: title,
                outline: [],
                tone: "informative",
                voice: "neutral",
                tags: [],
              }),
            }).then(res => res.ok ? res.json() : Promise.reject(res)),
          ]);

          if (agentResults[0].status === 'fulfilled') intent = agentResults[0].value;
          if (agentResults[1].status === 'fulfilled') toneVoice = agentResults[1].value;
          if (agentResults[2].status === 'fulfilled') seo = agentResults[2].value;
          
          Sentry.addBreadcrumb({ category: "agents", message: "AI agents completed", level: "debug", data: { intent: !!intent, toneVoice: !!toneVoice, seo: !!seo }});
          console.log(" AI agents completed");
        } catch (err) {
          Sentry.captureException(err, { level: "warning", extra: { stage: "ai-agents" }});
          console.log(" AI agents failed, using fallbacks");
        }

        // --- AI Enhancement with Content Management ---
        let enhancedBlog;
        try {
          Sentry.addBreadcrumb({ category: "enhancement", message: "Starting AI enhancement", level: "info" });
          console.log(" Processing content with AI...");
          enhancedBlog = await processContentWithAI(content, title, meta, {
            intent,
            toneVoice,
            seo
          });
          Sentry.addBreadcrumb({ category: "enhancement", message: "AI enhancement finished", level: "info", data: { enhancedLength: enhancedBlog.length }});
          console.log(" AI enhancement completed");
        } catch (enhancementError) {
          Sentry.captureException(enhancementError, { extra: { stage: "enhancement" }});
          console.error(
            " AI enhancement failed:",
            typeof enhancementError === "object" && enhancementError !== null && "message" in enhancementError
              ? (enhancementError as { message?: string }).message
              : String(enhancementError)
          );
          return NextResponse.json({ 
            error: "Failed to enhance content", 
            details: typeof enhancementError === "object" && enhancementError !== null && "message" in enhancementError
              ? (enhancementError as { message?: string }).message
              : String(enhancementError)
          }, { status: 500 });
        }

        // --- Simplified Comparison (skip if content was truncated) ---
        let comparison = {
          title_changed: false,
      meta_changed: false,
      tone_changed: false,
      word_count_diff: enhancedBlog.split(/\s+/).length - content.split(/\s+/).length,
      added_sections: [],
      removed_sections: [],
      keywords_added: [],
      seo_score_diff: 0,
      summary: "Initial enhancement comparison (fallback)."
        };

        // Only do detailed comparison for smaller content
        if (content.length < 5000) {
          try {
            Sentry.addBreadcrumb({ category: "comparison", message: "Starting comparison step", level: "info" });
            const diffPrompt = `Compare the original and enhanced blog content and return a JSON object with the following structure:
{
  "title_changed": boolean,
  "meta_changed": boolean, 
  "tone_changed": boolean,
  "word_count_diff": number,
  "added_sections": array of strings,
  "removed_sections": array of strings,
  "keywords_added": array of strings,
  "seo_score_diff": number between 0 and 1,
  "summary": string
}

Original: ${content.substring(0, 1000)}...
Enhanced: ${enhancedBlog.substring(0, 1000)}...

Focus on concrete differences and improvements made.`;

            if (isWithinTokenLimit(diffPrompt, MAX_TOKENS)) {
              const compareRes = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: "You are a JSON analyzer that compares blog content changes. Return only valid JSON." },
                    { role: "user", content: diffPrompt },
                  ],
                  temperature: 0.1,
                }),
              });

              if (compareRes.ok) {
                const compareJson = await compareRes.json();
                const aiComparison = JSON.parse(compareJson.choices?.[0]?.message?.content || JSON.stringify(comparison));
                
                // Calculate word counts for accurate diff
                const originalWordCount = content.split(/\s+/).length;
                const enhancedWordCount = enhancedBlog.split(/\s+/).length;

                // Merge AI analysis with our baseline comparison
                comparison = {
                  ...comparison,
                  ...aiComparison,
                  word_count_diff: enhancedWordCount - originalWordCount // Keep our accurate count
                };

                if (!Array.isArray(comparison.keywords_added)) comparison.keywords_added = [];
    if (typeof comparison.seo_score_diff !== "number") comparison.seo_score_diff = 0;
    if (typeof comparison.summary !== "string") comparison.summary = "No summary generated.";
              } else {
                Sentry.captureMessage("Comparison LLM call failed", { level: "warning", extra: { status: compareRes.status }});
              }
            } else {
              Sentry.captureMessage("Comparison prompt exceeds token limit", { level: "warning" });
            }
          } catch (comparisonError) {
            Sentry.captureException(comparisonError, { extra: { stage: "comparison" }});
            console.log(" Comparison failed, using fallback");
          }
        }

        // --- Validation with Debug Info ---
        const validationData = {
          original: {
            title,
            content: content.length > 10000 ? content.substring(0, 10000) + "..." : content,
            meta_description: meta,
            tone: toneVoice?.tone,
            voice: toneVoice?.voice,
            seo,
            intent: intent?.intent,
          },
          enhanced: {
            title: seo?.optimized_title || title,
            content: enhancedBlog,
            meta_description: seo?.meta_description || meta,
            tone: toneVoice?.tone,
            voice: toneVoice?.voice,
            seo,
            intent: intent?.intent,
          },
          changes: comparison,
        };

        Sentry.addBreadcrumb({
          category: "validation",
          message: "Validation data prepared",
          level: "debug",
          data: { originalLength: validationData.original.content.length, enhancedLength: validationData.enhanced.content.length }
        });

        const result = CrawlEnhanceSchema.safeParse(validationData);

        if (!result.success) {
          Sentry.captureException(result.error, { extra: { validationErrors: result.error.flatten() }});
          console.error(" Validation failed:", result.error.flatten());
          console.error(" Full error details:", JSON.stringify(result.error, null, 2));
          
          // Try to provide a more helpful error response
          const errorDetails = result.error.flatten();
          
          return NextResponse.json({
            error: "Validation failed - Schema mismatch",
            details: {
              fieldErrors: errorDetails.fieldErrors,
              formErrors: errorDetails.formErrors,
              providedChangesKeys: Object.keys(comparison),
              validationData: {
                hasOriginal: !!validationData.original,
                hasEnhanced: !!validationData.enhanced,
                hasChanges: !!validationData.changes
              }
            }
          }, { status: 422 });
        }

        // --- Save & Respond ---
        try {
          Sentry.addBreadcrumb({ category: "db", message: "Saving crawled blog to DB", level: "info", data: { sourceUrl: url || "manual-input" }});
          await CrawledBlogModel.create({
            sourceUrl: url || "manual-input",
            title,
            original: result.data.original,
            enhanced: result.data.enhanced,
            changes: result.data.changes,
            createdAt: new Date(),
          });
        } catch (dbError) {
          Sentry.captureException(dbError, { extra: { stage: "db-save" }});
          console.error(
            " Database save failed:",
            dbError && typeof dbError === "object" && "message" in dbError
              ? (dbError as { message?: string }).message
              : dbError
          );
          // Continue anyway
        }

        console.log(" Process completed successfully");
        Sentry.addBreadcrumb({ category: "crawl", message: "Process completed successfully", level: "info" });
        return NextResponse.json(result.data);

      } catch (err) {
        Sentry.captureException(err);
        console.error(" Crawl & Enhance Agent Error:", err);
        return NextResponse.json({ 
          error: "Internal server error - Crawl Agent Failed", 
          details: typeof err === "object" && err !== null && "message" in err ? (err as { message?: string }).message : String(err)
        }, { status: 500 });
      }
    }
  );
}

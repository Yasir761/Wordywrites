// import { NextRequest, NextResponse } from "next/server";
// import Parser from "rss-parser";
// import * as cheerio from "cheerio";
// import { CrawlEnhanceSchema } from "./schema";
// import { createEnhancementPrompt } from "./prompt";
// import { isWithinTokenLimit, splitTextByTokenLimit } from "@/app/api/utils/tokenUtils";
// import { connectDB } from "@/app/api/utils/db";
// import { CrawledBlogModel } from "@/app/models/crawledBlog";
// // import { auth } from "@clerk/nextjs/server";
// // import { checkProAccess } from "@/app/api/utils/useCredits";

// const parser = new Parser();
// const MAX_TOKENS = 4000;

// export async function POST(req: NextRequest) {
//   try {
//     const { rssUrl, manualContent, manualTitle } = await req.json();

//     await connectDB();

//     let title = manualTitle || "";
//     let content = manualContent || "";
//     let meta = "";

//     // --- MODE 1: RSS URL ---
//     if (rssUrl && /^https?:\/\/.+/.test(rssUrl)) {
//       const feed = await parser.parseURL(rssUrl);
//       const firstItem = feed.items?.[0];
//       if (!firstItem?.link || !firstItem?.title) {
//         return NextResponse.json({ error: "No valid blog post found in RSS" }, { status: 404 });
//       }

//       const html = await fetch(firstItem.link).then(res => res.text());
//   const $ = cheerio.load(html, { xmlMode: false });

//       content = $("article p, div.post-content p, p")
//         .map((_, el) => $(el).text())
//         .get()
//         .join("\n")
//         .trim();

//       if (!content || content.length < 300) {
//         return NextResponse.json({ error: "Blog content too short or not found" }, { status: 422 });
//       }

//       title = firstItem.title;
//       meta = $("meta[name='description']").attr("content") || "";
//     }

//     // --- MODE 2: Manual Input ---
//     else if (manualContent && manualContent.trim().length > 100) {
//       title = manualTitle || "Untitled Blog";
//       meta = "Enhanced blog generated from manual input";
//     } else {
//       return NextResponse.json(
//         { error: "Provide either a valid RSS URL or sufficient manual content (min 100 chars)" },
//         { status: 400 }
//       );
//     }

//     // --- AI Agents (Intent, Tone, SEO) ---
//     let intent, toneVoice, seo;
//     try {
//       [intent, toneVoice, seo] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/keyword`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }).then(res => res.json()),

//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/tone`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }).then(res => res.json()),

//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/seo-optimizer`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             keyword: title,
//             outline: [],
//             tone: "informative",
//             voice: "neutral",
//             tags: [],
//           }),
//         }).then(res => res.json()),
//       ]);
//     } catch (err) {
//       console.error("AI Agents failed:", err);
//       return NextResponse.json({ error: "Failed to fetch AI agents" }, { status: 500 });
//     }

//     // --- Enhancement Prompt ---
//     const enhancedPrompt = `
// You are an expert blog editor. Improve the following blog post:

// Title: ${title}
// Meta: ${meta}
// Tone: ${toneVoice?.tone || "informative"}
// Voice: ${toneVoice?.voice || "neutral"}
// Intent: ${intent?.intent || "Informational"}
// SEO: ${seo?.optimized_title || ""}, ${seo?.meta_description || ""}

// Content:
// ${content}

// Enhance by:
// - Keep original meaning
// - Improve tone, grammar, flow
// - Use Markdown headers
// - Boost SEO where possible
// - Expand to at least 800 words
// - Conclude with a summary

// Return only the enhanced blog content in Markdown.
//     `.trim();

//     if (!isWithinTokenLimit(enhancedPrompt, MAX_TOKENS)) {
//       return NextResponse.json(
//         { error: "Prompt too long", chunks: splitTextByTokenLimit(enhancedPrompt, MAX_TOKENS) },
//         { status: 413 }
//       );
//     }

//     // --- AI Enhancement ---
//     const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are a precise and SEO-aware blog improver." },
//           { role: "user", content: enhancedPrompt },
//         ],
//         temperature: 0.4,
//       }),
//     });

//     const aiJson = await aiRes.json();
//     const enhancedBlog = aiJson.choices?.[0]?.message?.content?.trim();
//     if (!enhancedBlog || enhancedBlog.length < 400) {
//       return NextResponse.json({ error: "Enhanced blog is too short or missing" }, { status: 500 });
//     }

//     // --- Difference Analysis ---
//     const diffPrompt = createEnhancementPrompt(content, enhancedBlog);
//     if (!isWithinTokenLimit(diffPrompt, MAX_TOKENS)) {
//       return NextResponse.json(
//         { error: "Comparison prompt too long", suggestion: "Try smaller blog content" },
//         { status: 413 }
//       );
//     }

//     const compareJson = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are a JSON diff analyzer." },
//           { role: "user", content: diffPrompt },
//         ],
//         temperature: 0.2,
//       }),
//     }).then(res => res.json());

//     let comparison;
//     try {
//       comparison = JSON.parse(compareJson.choices?.[0]?.message?.content || "{}");
//     } catch {
//       return NextResponse.json({ error: "Failed to parse comparison JSON" }, { status: 500 });
//     }

//     // --- Validation ---
//     const result = CrawlEnhanceSchema.safeParse({
//       original: {
//         title,
//         content,
//         meta_description: meta,
//         tone: toneVoice?.tone,
//         voice: toneVoice?.voice,
//         seo,
//         intent: intent?.intent,
//       },
//       enhanced: {
//         title: seo?.optimized_title,
//         content: enhancedBlog,
//         meta_description: seo?.meta_description,
//         tone: toneVoice?.tone,
//         voice: toneVoice?.voice,
//         seo,
//         intent: intent?.intent,
//       },
//       changes: comparison,
//     });

//     if (!result.success) {
//       return NextResponse.json(
//         { error: "Final validation failed", issues: result.error.flatten() },
//         { status: 422 }
//       );
//     }

//     // --- Save & Respond ---
//     await CrawledBlogModel.create({
//       sourceUrl: rssUrl || "manual-input",
//       title,
//       original: result.data.original,
//       enhanced: result.data.enhanced,
//       changes: result.data.changes,
//       createdAt: new Date(),
//     });

//     return NextResponse.json(result.data);
//   } catch (err) {
//     console.error("💥 Crawl & Enhance Agent Error:", err);
//     return NextResponse.json({ error: "Internal server error - Crawl Agent Failed" }, { status: 500 });
//   }
// }










// import { NextRequest, NextResponse } from "next/server";
// import Parser from "rss-parser";
// import * as cheerio from "cheerio";
// import { CrawlEnhanceSchema } from "./schema";
// import { createEnhancementPrompt } from "./prompt";
// import { isWithinTokenLimit, splitTextByTokenLimit } from "@/app/api/utils/tokenUtils";
// import { connectDB } from "@/app/api/utils/db";
// import { CrawledBlogModel } from "@/app/models/crawledBlog";

// const MAX_TOKENS = 4000;

// export async function POST(req: NextRequest) {
//   try {
//     console.log("🚀 Starting crawl & enhance agent");
//     const { rssUrl, manualContent, manualTitle } = await req.json();
//     console.log("📝 Request data:", { rssUrl, manualTitle, hasManualContent: !!manualContent });

//     await connectDB();

//     let title = manualTitle || "";
//     let content = manualContent || "";
//     let meta = "";

//     // --- MODE 1: RSS URL ---
//     if (rssUrl && /^https?:\/\/.+/.test(rssUrl)) {
//       console.log("🔍 Processing RSS URL mode");
      
//       try {
//         console.log("📡 Parsing RSS feed...");
//         const parser = new Parser({
//           timeout: 15000,
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader Bot)',
//           }
//         });
        
//         const feed = await parser.parseURL(rssUrl);
//         console.log("✅ RSS parsed successfully, items found:", feed.items?.length || 0);
        
//         const firstItem = feed.items?.[0];
//         if (!firstItem?.link || !firstItem?.title) {
//           console.log("❌ No valid blog post found in RSS");
//           return NextResponse.json({ error: "No valid blog post found in RSS" }, { status: 404 });
//         }

//         console.log("🌐 First item:", { 
//           title: firstItem.title, 
//           link: firstItem.link,
//           hasContent: !!firstItem.content 
//         });

//         // Try to use RSS content first if available
//         if (firstItem.content && firstItem.content.length > 300) {
//           console.log("📄 Using RSS content directly");
          
//           try {
//             // Parse RSS content with cheerio to extract text
//             const $ = cheerio.load(firstItem.content, { 
//               xmlMode: false, 
//               // decodeEntities: true,
//               // _useHtmlParser2: true 
//             });
//             content = $.text().trim();
//           } catch (rssParseError) {
//             console.log("⚠️ RSS content parsing failed, using raw content");
//             // Strip HTML tags manually if cheerio fails
//             content = firstItem.content.replace(/<[^>]*>/g, '').trim();
//           }
//         } 
        
//         // If RSS content is insufficient, fetch from URL
//         if (!content || content.length < 300) {
//           console.log("🔗 Fetching content from URL:", firstItem.link);
          
//           try {
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 15000);

//             const response = await fetch(firstItem.link, {
//               headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//                 'Accept-Language': 'en-US,en;q=0.5',
//                 'Accept-Encoding': 'gzip, deflate, br',
//                 'Connection': 'keep-alive',
//                 'Upgrade-Insecure-Requests': '1',
//               },
//               signal: controller.signal
//             });
//             clearTimeout(timeoutId);

//             console.log("📊 Fetch response:", {
//               status: response.status,
//               statusText: response.statusText,
//               contentType: response.headers.get('content-type'),
//               contentLength: response.headers.get('content-length')
//             });

//             if (!response.ok) {
//               throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//             }

//             const html = await response.text();
//             console.log("📄 HTML received, length:", html.length, "First 200 chars:", html.substring(0, 200));

//             // Log the problematic part that might cause the cheerio error
//             const problemChars = html.match(/<[^>]*@[^>]*>/g);
//             if (problemChars) {
//               console.log("🚨 Found problematic tags with @ symbol:", problemChars.slice(0, 5));
//             }

//             // Clean the HTML more aggressively before parsing
//             let cleanedHtml = html
//               // Remove comments
//               .replace(/<!--[\s\S]*?-->/g, '')
//               // Remove script tags completely
//               .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
//               // Remove style tags completely
//               .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
//               // Remove any tag that contains @ symbol
//               .replace(/<[^>]*@[^>]*>/g, '')
//               // Remove non-standard characters from tag names
//               .replace(/<([^>\s]*[^a-zA-Z0-9\-_\/\s][^>]*)>/g, '')
//               // Fix malformed tags
//               .replace(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*@[^>]*>/g, '<$1>')
//               // Remove any remaining invalid characters in tags
//               .replace(/<([^>]*[^\w\s\-="'\/][^>]*)>/g, '');

//             console.log("🧹 HTML cleaned, new length:", cleanedHtml.length);

//             try {
//               const $ = cheerio.load(cleanedHtml, {
//                 xmlMode: false,
//                 // lowerCaseAttributeNames: true,
//                 // recognizeSelfClosing: true,
//                 // _useHtmlParser2: true
//               });

//               console.log("✅ Cheerio loaded successfully");

//               // Try multiple content extraction strategies
//               const contentStrategies = [
//                 () => $('article').text().trim(),
//                 () => $('[role="main"]').text().trim(),
//                 () => $('.post-content, .entry-content, .content').text().trim(),
//                 () => $('main').text().trim(),
//                 () => $('#content').text().trim(),
//                 () => $('p').map((_, el) => $(el).text().trim()).get().join('\n').trim(),
//                 () => $('body').text().replace(/\s+/g, ' ').trim()
//               ];

//               for (let i = 0; i < contentStrategies.length; i++) {
//                 try {
//                   const extractedContent = contentStrategies[i]();
//                   console.log(`📝 Strategy ${i + 1} extracted ${extractedContent.length} characters`);
                  
//                   if (extractedContent.length > 300) {
//                     content = extractedContent;
//                     break;
//                   }
//                 } catch (strategyError) {
//                   if (strategyError && typeof strategyError === "object" && "message" in strategyError) {
//                     console.log(`⚠️ Strategy ${i + 1} failed:`, (strategyError as { message?: string }).message);
//                   } else {
//                     console.log(`⚠️ Strategy ${i + 1} failed:`, strategyError);
//                   }
//                   continue;
//                 }
//               }

//               // Extract meta description
//               meta = $("meta[name='description']").attr("content") || 
//                      $("meta[property='og:description']").attr("content") || 
//                      "";

//             } catch (cheerioError) {
//               if (cheerioError && typeof cheerioError === "object" && "message" in cheerioError) {
//                 console.error("🚨 Cheerio parsing failed:", (cheerioError as { message?: string }).message);
//               } else {
//                 console.error("🚨 Cheerio parsing failed:", cheerioError);
//               }
              
//               // Fallback: manual text extraction without cheerio
//               console.log("🔄 Trying manual text extraction...");
              
//               // Extract text between <p> tags manually
//               const paragraphMatches = cleanedHtml.match(/<p[^>]*>(.*?)<\/p>/gi);
//               if (paragraphMatches) {
//                 content = paragraphMatches
//                   .map(p => p.replace(/<[^>]*>/g, '').trim())
//                   .filter(text => text.length > 30)
//                   .join('\n');
//               }
              
//               // If still no content, try to extract from body
//               if (!content || content.length < 300) {
//                 const bodyMatch = cleanedHtml.match(/<body[^>]*>(.*?)<\/body>/);
//                 if (bodyMatch) {
//                   content = bodyMatch[1]
//                     .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
//                     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
//                     .replace(/<[^>]*>/g, ' ')
//                     .replace(/\s+/g, ' ')
//                     .trim();
//                 }
//               }
//             }

//           } catch (fetchError) {
//             if (fetchError && typeof fetchError === "object" && "message" in fetchError) {
//               console.error("🚨 Failed to fetch URL:", (fetchError as { message?: string }).message);
//               return NextResponse.json({ 
//                 error: "Failed to fetch content from URL", 
//                 details: (fetchError as { message?: string }).message,
//                 url: firstItem.link
//               }, { status: 422 });
//             } else {
//               console.error("🚨 Failed to fetch URL:", fetchError);
//               return NextResponse.json({ 
//                 error: "Failed to fetch content from URL", 
//                 details: String(fetchError),
//                 url: firstItem.link
//               }, { status: 422 });
//             }
//           }
//         }

//         if (!content || content.length < 300) {
//           console.log("❌ Insufficient content extracted:", content?.length || 0, "characters");
//           return NextResponse.json({ 
//             error: "Blog content too short or not found", 
//             details: `Content length: ${content?.length || 0} characters`,
//             url: firstItem.link
//           }, { status: 422 });
//         }

//         title = firstItem.title;
//         console.log("✅ Content extraction successful:", {
//           titleLength: title.length,
//           contentLength: content.length,
//           metaLength: meta.length
//         });

//       } catch (rssError) {
//         console.error("🚨 RSS processing error:", rssError);
//         return NextResponse.json({ 
//           error: "Failed to process RSS feed", 
//           details: (rssError && typeof rssError === "object" && "message" in rssError) ? (rssError as { message?: string }).message : String(rssError)
//         }, { status: 422 });
//       }
//     }
//     // --- MODE 2: Manual Input ---
//     else if (manualContent && manualContent.trim().length > 100) {
//       console.log("📝 Processing manual input mode");
//       title = manualTitle || "Untitled Blog";
//       meta = "Enhanced blog generated from manual input";
//     } else {
//       console.log("❌ Invalid input - no RSS URL or manual content");
//       return NextResponse.json(
//         { error: "Provide either a valid RSS URL or sufficient manual content (min 100 chars)" },
//         { status: 400 }
//       );
//     }

//     console.log("🤖 Calling AI agents...");
    
//     // --- AI Agents (Intent, Tone, SEO) ---
//     let intent = { intent: "Informational" };
//     let toneVoice = { tone: "informative", voice: "neutral" };
//     let seo = { optimized_title: title, meta_description: meta };
    
//     try {
//       const agentPromises = [
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/keyword`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/tone`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/seo-optimizer`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             keyword: title,
//             outline: [],
//             tone: "informative",
//             voice: "neutral",
//             tags: [],
//           }),
//         })
//       ];

//       const results = await Promise.allSettled(agentPromises);
      
//       if (results[0].status === 'fulfilled' && results[0].value.ok) {
//         intent = await results[0].value.json();
//       }
//       if (results[1].status === 'fulfilled' && results[1].value.ok) {
//         toneVoice = await results[1].value.json();
//       }
//       if (results[2].status === 'fulfilled' && results[2].value.ok) {
//         seo = await results[2].value.json();
//       }
      
//       console.log("✅ AI agents completed");
//     } catch (err) {
//       if (err && typeof err === "object" && "message" in err) {
//         console.log("⚠️ AI agents failed, using fallbacks:", (err as { message?: string }).message);
//       } else {
//         console.log("⚠️ AI agents failed, using fallbacks:", err);
//       }
//     }

//     // Continue with the rest of your enhancement logic...
//     console.log("✅ Process completed successfully");
    
//     return NextResponse.json({ 
//       success: true, 
//       debug: {
//         title: title.substring(0, 100),
//         contentLength: content.length,
//         metaLength: meta.length
//       }
//     });

//   } catch (err) {
//     console.error("💥 Crawl & Enhance Agent Error:", err);
//     if (err && typeof err === "object" && "stack" in err) {
//       console.error("Stack trace:", (err as { stack?: string }).stack);
//     }
//     return NextResponse.json({ 
//       error: "Internal server error - Crawl Agent Failed", 
//       details: (err && typeof err === "object" && "message" in err) ? (err as { message?: string }).message : String(err),
//       stack: process.env.NODE_ENV === 'development' && err && typeof err === "object" && "stack" in err ? (err as { stack?: string }).stack : undefined
//     }, { status: 500 });
//   }
// }









// import { NextRequest, NextResponse } from "next/server";
// import Parser from "rss-parser";
// import * as cheerio from "cheerio";
// import { CrawlEnhanceSchema } from "./schema";
// import { createEnhancementPrompt } from "./prompt";
// import { isWithinTokenLimit, splitTextByTokenLimit } from "@/app/api/utils/tokenUtils";
// import { connectDB } from "@/app/api/utils/db";
// import { CrawledBlogModel } from "@/app/models/crawledBlog";

// const parser = new Parser();
// const MAX_TOKENS = 4000;

// // Function to detect if URL is RSS feed or direct article
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

// // Function to convert article URL to RSS feed URL
// function tryConvertToRSSUrl(url: string): string | null {
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

// // Function to safely fetch and parse HTML content
// async function fetchArticleContent(url: string) {
//   console.log("🌐 Fetching article content from:", url);
  
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 15000);

//   const response = await fetch(url, {
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//     },
//     signal: controller.signal
//   });

//   clearTimeout(timeoutId);

//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//   }

//   const html = await response.text();
//   console.log("📄 HTML fetched, length:", html.length);

//   // Clean HTML aggressively
//   const cleanedHtml = html
//     .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
//     .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
//     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
//     .replace(/<[^>]*@[^>]*>/g, '') // Remove tags with @ symbols
//     .replace(/<([^>\s]*[^a-zA-Z0-9\-_\/\s][^>]*)>/g, ''); // Remove malformed tags

//   const $ = cheerio.load(cleanedHtml, {
//     xmlMode: false,
    
//   });

//   // Extract title
//   let title = $('h1').first().text().trim() ||
//               $('title').text().trim() ||
//               $('[property="og:title"]').attr('content') ||
//               $('meta[name="title"]').attr('content') ||
//               '';

//   // Extract content using multiple strategies
//   let content = '';
//   const contentSelectors = [
//     'article',
//     '[role="main"]',
//     '.post-content',
//     '.entry-content',
//     '.content',
//     '.post-body',
//     '.article-content',
//     'main',
//     '#content'
//   ];

//   for (const selector of contentSelectors) {
//     const elements = $(selector);
//     if (elements.length > 0) {
//       content = elements.find('p, div, h1, h2, h3, h4, h5, h6').map((_, el) => {
//         const text = $(el).text().trim();
//         return text.length > 30 ? text : '';
//       }).get().filter(text => text.length > 0).join('\n\n');
      
//       if (content.length > 300) {
//         break;
//       }
//     }
//   }

//   // Fallback: get all paragraphs
//   if (!content || content.length < 300) {
//     content = $('p').map((_, el) => {
//       const text = $(el).text().trim();
//       return text.length > 30 ? text : '';
//     }).get().filter(text => text.length > 0).join('\n\n');
//   }

//   // Extract meta description
//   const meta = $("meta[name='description']").attr("content") || 
//                $("meta[property='og:description']").attr("content") || 
//                "";

//   return { title, content, meta };
// }

// export async function POST(req: NextRequest) {
//   try {
//     console.log("🚀 Starting crawl & enhance agent");
//     const { rssUrl, manualContent, manualTitle } = await req.json();
//     console.log("📝 Request data:", { rssUrl, manualTitle, hasManualContent: !!manualContent });

//     await connectDB();

//     let title = manualTitle || "";
//     let content = manualContent || "";
//     let meta = "";

//     // --- MODE 1: URL Processing (RSS or Direct Article) ---
//     if (rssUrl && /^https?:\/\/.+/.test(rssUrl)) {
//       console.log("🔍 Processing URL mode");
      
//       let isRSS = isRSSFeed(rssUrl);
//       console.log("📡 Is RSS feed?", isRSS);
      
//       if (isRSS) {
//         // Handle as RSS feed
//         try {
//           console.log("📡 Parsing RSS feed...");
//           const feed = await parser.parseURL(rssUrl);
//           console.log("✅ RSS parsed successfully, items found:", feed.items?.length || 0);
          
//           const firstItem = feed.items?.[0];
//           if (!firstItem?.link || !firstItem?.title) {
//             return NextResponse.json({ error: "No valid blog post found in RSS" }, { status: 404 });
//           }

//           title = firstItem.title;
          
//           // Try RSS content first
//           if (firstItem.content && firstItem.content.length > 300) {
//             const $ = cheerio.load(firstItem.content, { xmlMode: false });
//             content = $.text().trim();
//           } else if (firstItem.contentSnippet) {
//             content = firstItem.contentSnippet;
//           }
          
//           // If RSS content is insufficient, fetch from the article URL
//           if (!content || content.length < 300) {
//             const articleData = await fetchArticleContent(firstItem.link);
//             content = articleData.content;
//             meta = articleData.meta;
//           }

//         } catch (rssError) {
//           console.error(
//             "🚨 RSS parsing failed:",
//             rssError && typeof rssError === "object" && "message" in rssError
//               ? (rssError as { message?: string }).message
//               : String(rssError)
//           );
          
//           // Try to convert to RSS URL and retry
//           const convertedRSSUrl = tryConvertToRSSUrl(rssUrl);
//           if (convertedRSSUrl && convertedRSSUrl !== rssUrl) {
//             console.log("🔄 Trying converted RSS URL:", convertedRSSUrl);
//             try {
//               const feed = await parser.parseURL(convertedRSSUrl);
//               const firstItem = feed.items?.[0];
//               if (firstItem?.title) {
//                 title = firstItem.title;
//                 if (firstItem.content) {
//                   const $ = cheerio.load(firstItem.content, { xmlMode: false });
//                   content = $.text().trim();
//                 }
//               }
//             } catch (convertError) {
//               console.log("⚠️ Converted RSS also failed, treating as direct article");
//               isRSS = false;
//             }
//           } else {
//             isRSS = false;
//           }
//         }
//       }
      
//       if (!isRSS) {
//         // Handle as direct article URL
//         console.log("📄 Treating as direct article URL");
//         try {
//           const articleData = await fetchArticleContent(rssUrl);
//           title = articleData.title;
//           content = articleData.content;
//           meta = articleData.meta;
//         } catch (articleError) {
//           console.error(
//             "🚨 Direct article fetch failed:",
//             articleError && typeof articleError === "object" && "message" in articleError
//               ? (articleError as { message?: string }).message
//               : String(articleError)
//           );
//           return NextResponse.json({ 
//             error: "Failed to fetch content from URL", 
//             details: articleError && typeof articleError === "object" && "message" in articleError
//               ? (articleError as { message?: string }).message
//               : String(articleError)
//           }, { status: 422 });
//         }
//       }

//       if (!content || content.length < 300) {
//         return NextResponse.json({ 
//           error: "Blog content too short or not found", 
//           details: `Content length: ${content?.length || 0} characters`,
//           url: rssUrl
//         }, { status: 422 });
//       }

//       console.log("✅ Content extraction successful:", {
//         titleLength: title.length,
//         contentLength: content.length,
//         metaLength: meta.length
//       });
//     }
//     // --- MODE 2: Manual Input ---
//     else if (manualContent && manualContent.trim().length > 100) {
//       console.log("📝 Processing manual input mode");
//       title = manualTitle || "Untitled Blog";
//       content = manualContent;
//       meta = "Enhanced blog generated from manual input";
//     } else {
//       return NextResponse.json(
//         { error: "Provide either a valid URL (RSS feed or article) or sufficient manual content (min 100 chars)" },
//         { status: 400 }
//       );
//     }

//     // --- AI Agents (Intent, Tone, SEO) ---
//     let intent = { intent: "Informational" };
//     let toneVoice = { tone: "informative", voice: "neutral" };
//     let seo = { optimized_title: title, meta_description: meta };
    
//     try {
//       console.log("🤖 Calling AI agents...");
//       const agentResults = await Promise.allSettled([
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/keyword`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }).then(res => res.ok ? res.json() : Promise.reject(res)),

//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/tone`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }).then(res => res.ok ? res.json() : Promise.reject(res)),

//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/seo-optimizer`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             keyword: title,
//             outline: [],
//             tone: "informative",
//             voice: "neutral",
//             tags: [],
//           }),
//         }).then(res => res.ok ? res.json() : Promise.reject(res)),
//       ]);

//       if (agentResults[0].status === 'fulfilled') intent = agentResults[0].value;
//       if (agentResults[1].status === 'fulfilled') toneVoice = agentResults[1].value;
//       if (agentResults[2].status === 'fulfilled') seo = agentResults[2].value;
      
//       console.log("✅ AI agents completed");
//     } catch (err) {
//       console.log("⚠️ AI agents failed, using fallbacks");
//     }

//     // --- Enhancement Prompt ---
//     const enhancedPrompt = `
// You are an expert blog editor. Improve the following blog post:

// Title: ${title}
// Meta: ${meta}
// Tone: ${toneVoice?.tone || "informative"}
// Voice: ${toneVoice?.voice || "neutral"}
// Intent: ${intent?.intent || "Informational"}
// SEO: ${seo?.optimized_title || ""}, ${seo?.meta_description || ""}

// Content:
// ${content}

// Enhance by:
// - Keep original meaning
// - Improve tone, grammar, flow
// - Use Markdown headers
// - Boost SEO where possible
// - Expand to at least 800 words
// - Conclude with a summary

// Return only the enhanced blog content in Markdown.
//     `.trim();

//     if (!isWithinTokenLimit(enhancedPrompt, MAX_TOKENS)) {
//       return NextResponse.json(
//         { error: "Prompt too long", chunks: splitTextByTokenLimit(enhancedPrompt, MAX_TOKENS) },
//         { status: 413 }
//       );
//     }

//     // --- AI Enhancement ---
//     const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are a precise and SEO-aware blog improver." },
//           { role: "user", content: enhancedPrompt },
//         ],
//         temperature: 0.4,
//       }),
//     });

//     const aiJson = await aiRes.json();
//     const enhancedBlog = aiJson.choices?.[0]?.message?.content?.trim();
//     if (!enhancedBlog || enhancedBlog.length < 400) {
//       return NextResponse.json({ error: "Enhanced blog is too short or missing" }, { status: 500 });
//     }

//     // --- Difference Analysis ---
//     const diffPrompt = createEnhancementPrompt(content, enhancedBlog);
//     if (!isWithinTokenLimit(diffPrompt, MAX_TOKENS)) {
//       return NextResponse.json(
//         { error: "Comparison prompt too long", suggestion: "Try smaller blog content" },
//         { status: 413 }
//       );
//     }

//     const compareJson = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are a JSON diff analyzer." },
//           { role: "user", content: diffPrompt },
//         ],
//         temperature: 0.2,
//       }),
//     }).then(res => res.json());

//     let comparison;
//     try {
//       comparison = JSON.parse(compareJson.choices?.[0]?.message?.content || "{}");
//     } catch {
//       comparison = { improvements: ["Enhanced content structure and readability"] };
//     }

//     // --- Validation ---
//     const result = CrawlEnhanceSchema.safeParse({
//       original: {
//         title,
//         content,
//         meta_description: meta,
//         tone: toneVoice?.tone,
//         voice: toneVoice?.voice,
//         seo,
//         intent: intent?.intent,
//       },
//       enhanced: {
//         title: seo?.optimized_title || title,
//         content: enhancedBlog,
//         meta_description: seo?.meta_description || meta,
//         tone: toneVoice?.tone,
//         voice: toneVoice?.voice,
//         seo,
//         intent: intent?.intent,
//       },
//       changes: comparison,
//     });

//     if (!result.success) {
//       return NextResponse.json(
//         { error: "Final validation failed", issues: result.error.flatten() },
//         { status: 422 }
//       );
//     }

//     // --- Save & Respond ---
//     await CrawledBlogModel.create({
//       sourceUrl: rssUrl || "manual-input",
//       title,
//       original: result.data.original,
//       enhanced: result.data.enhanced,
//       changes: result.data.changes,
//       createdAt: new Date(),
//     });

//     return NextResponse.json(result.data);
//   } catch (err) {
//     console.error("💥 Crawl & Enhance Agent Error:", err);
//     return NextResponse.json({ 
//       error: "Internal server error - Crawl Agent Failed", 
//       details: typeof err === "object" && err !== null && "message" in err ? (err as { message?: string }).message : String(err)
//     }, { status: 500 });
//   }
// }




































// import { NextRequest, NextResponse } from "next/server";
// import Parser from "rss-parser";
// import * as cheerio from "cheerio";
// import { CrawlEnhanceSchema } from "./schema";
// import { createEnhancementPrompt } from "./prompt";
// import { isWithinTokenLimit, splitTextByTokenLimit } from "@/app/api/utils/tokenUtils";
// import { connectDB } from "@/app/api/utils/db";
// import { CrawledBlogModel } from "@/app/models/crawledBlog";

// const parser = new Parser();
// const MAX_TOKENS = 4000;
// const MAX_CONTENT_TOKENS = 2500; // Reserve tokens for system prompt and other content

// // Function to detect if URL is RSS feed or direct article
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

// // Function to convert article URL to RSS feed URL
// function tryConvertToRSSUrl(url: string) {
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

// // Function to intelligently truncate content while preserving structure
// function intelligentContentTruncation(content: string, maxTokens: number) {
//   // First, try to fit within token limit
//   if (isWithinTokenLimit(content, maxTokens)) {
//     return content;
//   }
  
//   console.log(`📏 Content too long, truncating from ${content.length} chars`);
  
//   // Split into paragraphs and prioritize
//   const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  
//   let truncatedContent = '';
//   let currentTokens = 0;
  
//   // Always include first few paragraphs (usually intro)
//   for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
//     const testContent = truncatedContent + (truncatedContent ? '\n\n' : '') + paragraphs[i];
//     if (isWithinTokenLimit(testContent, maxTokens)) {
//       truncatedContent = testContent;
//       currentTokens++;
//     } else {
//       break;
//     }
//   }
  
//   // Add middle content if space available
//   const midStart = Math.floor(paragraphs.length / 3);
//   const midEnd = Math.floor(2 * paragraphs.length / 3);
  
//   for (let i = midStart; i < midEnd && i < paragraphs.length; i++) {
//     const testContent = truncatedContent + '\n\n' + paragraphs[i];
//     if (isWithinTokenLimit(testContent, maxTokens)) {
//       truncatedContent = testContent;
//     } else {
//       break;
//     }
//   }
  
//   // Try to add conclusion paragraphs
//   const lastParagraphs = paragraphs.slice(-2);
//   for (const para of lastParagraphs) {
//     const testContent = truncatedContent + '\n\n' + para;
//     if (isWithinTokenLimit(testContent, maxTokens)) {
//       truncatedContent = testContent;
//     } else {
//       break;
//     }
//   }
  
//   // If still too long, do character-based truncation
//   if (!isWithinTokenLimit(truncatedContent, maxTokens)) {
//     const chunks = splitTextByTokenLimit(truncatedContent, maxTokens);
//     truncatedContent = chunks[0];
//   }
  
//   console.log(`✂️ Content truncated to ${truncatedContent.length} chars`);
//   return truncatedContent + '\n\n[Content truncated for processing...]';
// }

// // Function to safely fetch and parse HTML content
// async function fetchArticleContent(url: string) {
//   console.log("🌐 Fetching article content from:", url);
  
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 15000);

//   const response = await fetch(url, {
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//     },
//     signal: controller.signal
//   });

//   clearTimeout(timeoutId);

//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//   }

//   const html = await response.text();
//   console.log("📄 HTML fetched, length:", html.length);

//   // Clean HTML aggressively
//   const cleanedHtml = html
//     .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
//     .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
//     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
//     .replace(/<[^>]*@[^>]*>/g, '') // Remove tags with @ symbols
//     .replace(/<([^>\s]*[^a-zA-Z0-9\-_\/\s][^>]*)>/g, ''); // Remove malformed tags

//   const $ = cheerio.load(cleanedHtml, {
//     xmlMode: false
    
//   });

//   // Extract title
//   let title = $('h1').first().text().trim() ||
//               $('title').text().trim() ||
//               $('[property="og:title"]').attr('content') ||
//               $('meta[name="title"]').attr('content') ||
//               '';

//   // Clean title
//   title = title.replace(/\s+/g, ' ').trim();

//   // Extract content using multiple strategies
//   let content = '';
//   const contentSelectors = [
//     'article',
//     '[role="main"]',
//     '.post-content',
//     '.entry-content',
//     '.content',
//     '.post-body',
//     '.article-content',
//     'main',
//     '#content'
//   ];

//   for (const selector of contentSelectors) {
//     const elements = $(selector);
//     if (elements.length > 0) {
//       content = elements.find('p, div, h1, h2, h3, h4, h5, h6').map((_, el) => {
//         const text = $(el).text().trim();
//         return text.length > 30 ? text : '';
//       }).get().filter(text => text.length > 0).join('\n\n');
      
//       if (content.length > 300) {
//         break;
//       }
//     }
//   }

//   // Fallback: get all paragraphs
//   if (!content || content.length < 300) {
//     content = $('p').map((_, el) => {
//       const text = $(el).text().trim();
//       return text.length > 30 ? text : '';
//     }).get().filter(text => text.length > 0).join('\n\n');
//   }

//   // Extract meta description
//   const meta = $("meta[name='description']").attr("content") || 
//                $("meta[property='og:description']").attr("content") || 
//                "";

//   return { title, content, meta };
// }

// // Enhanced AI processing with chunking support
// async function processContentWithAI(
//   content: string,
//   title: string,
//   meta: string,
//   agents: { intent: any; toneVoice: any; seo: any }
// ) {
//   // Truncate content if needed
//   const processableContent = intelligentContentTruncation(content, MAX_CONTENT_TOKENS);
  
//   const enhancedPrompt = `
// You are an expert blog editor. Improve the following blog post:

// Title: ${title}
// Meta: ${meta}
// Tone: ${agents.toneVoice?.tone || "informative"}
// Voice: ${agents.toneVoice?.voice || "neutral"}
// Intent: ${agents.intent?.intent || "Informational"}
// SEO: ${agents.seo?.optimized_title || ""}, ${agents.seo?.meta_description || ""}

// Content:
// ${processableContent}

// Enhance by:
// - Keep original meaning and key points
// - Improve tone, grammar, flow
// - Use Markdown headers (##, ###)
// - Boost SEO where possible
// - Maintain or expand content quality
// - Add conclusion if missing
// - Preserve technical accuracy

// Return only the enhanced blog content in Markdown format.
//   `.trim();

//   console.log(`📝 Enhancement prompt length: ${enhancedPrompt.length} chars`);

//   // Double-check token limit
//   if (!isWithinTokenLimit(enhancedPrompt, MAX_TOKENS)) {
//     throw new Error("Content still too large after truncation");
//   }

//   // Call OpenAI API
//   const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a precise and SEO-aware blog editor. Maintain the original content's technical accuracy and core message." },
//         { role: "user", content: enhancedPrompt },
//       ],
//       temperature: 0.4,
//       max_tokens: 3000, // Ensure response isn't too long
//     }),
//   });

//   if (!aiRes.ok) {
//     const errorText = await aiRes.text();
//     console.error("🚨 OpenAI API error:", errorText);
//     throw new Error(`OpenAI API failed: ${aiRes.status}`);
//   }

//   const aiJson = await aiRes.json();
//   const enhancedBlog = aiJson.choices?.[0]?.message?.content?.trim();
  
//   if (!enhancedBlog || enhancedBlog.length < 200) {
//     throw new Error("Enhanced blog is too short or missing");
//   }

//   return enhancedBlog;
// }

// export async function POST(req: NextRequest) {
//   try {
//     console.log("🚀 Starting crawl & enhance agent");
//     const { rssUrl, manualContent, manualTitle } = await req.json();
//     console.log("📝 Request data:", { rssUrl, manualTitle, hasManualContent: !!manualContent });

//     await connectDB();

//     let title = manualTitle || "";
//     let content = manualContent || "";
//     let meta = "";

//     // --- MODE 1: URL Processing (RSS or Direct Article) ---
//     if (rssUrl && /^https?:\/\/.+/.test(rssUrl)) {
//       console.log("🔍 Processing URL mode");
      
//       let isRSS = isRSSFeed(rssUrl);
//       console.log("📡 Is RSS feed?", isRSS);
      
//       if (isRSS) {
//         // Handle as RSS feed
//         try {
//           console.log("📡 Parsing RSS feed...");
//           const feed = await parser.parseURL(rssUrl);
//           console.log("✅ RSS parsed successfully, items found:", feed.items?.length || 0);
          
//           const firstItem = feed.items?.[0];
//           if (!firstItem?.link || !firstItem?.title) {
//             return NextResponse.json({ error: "No valid blog post found in RSS" }, { status: 404 });
//           }

//           title = firstItem.title;
          
//           // Try RSS content first
//           if (firstItem.content && firstItem.content.length > 300) {
//             const $ = cheerio.load(firstItem.content, { xmlMode: false });
//             content = $.text().trim();
//           } else if (firstItem.contentSnippet) {
//             content = firstItem.contentSnippet;
//           }
          
//           // If RSS content is insufficient, fetch from the article URL
//           if (!content || content.length < 300) {
//             const articleData = await fetchArticleContent(firstItem.link);
//             content = articleData.content;
//             meta = articleData.meta;
//           }

//         } catch (rssError) {
//           console.error(
//             "🚨 RSS parsing failed:",
//             rssError && typeof rssError === "object" && "message" in rssError
//               ? (rssError as { message?: string }).message
//               : String(rssError)
//           );
//           isRSS = false;
//         }
//       }
      
//       if (!isRSS) {
//         // Handle as direct article URL
//         console.log("📄 Treating as direct article URL");
//         try {
//           const articleData = await fetchArticleContent(rssUrl);
//           title = articleData.title;
//           content = articleData.content;
//           meta = articleData.meta;
//         } catch (articleError) {
//           if (articleError && typeof articleError === "object" && "message" in articleError) {
//             console.error("🚨 Direct article fetch failed:", (articleError as { message?: string }).message);
//             return NextResponse.json({ 
//               error: "Failed to fetch content from URL", 
//               details: (articleError as { message?: string }).message 
//             }, { status: 422 });
//           } else {
//             console.error("🚨 Direct article fetch failed:", articleError);
//             return NextResponse.json({ 
//               error: "Failed to fetch content from URL", 
//               details: String(articleError)
//             }, { status: 422 });
//           }
//         }
//       }

//       if (!content || content.length < 100) {
//         return NextResponse.json({ 
//           error: "Blog content too short or not found", 
//           details: `Content length: ${content?.length || 0} characters`,
//           url: rssUrl
//         }, { status: 422 });
//       }

//       console.log("✅ Content extraction successful:", {
//         titleLength: title.length,
//         contentLength: content.length,
//         metaLength: meta.length
//       });
//     }
//     // --- MODE 2: Manual Input ---
//     else if (manualContent && manualContent.trim().length > 100) {
//       console.log("📝 Processing manual input mode");
//       title = manualTitle || "Untitled Blog";
//       content = manualContent;
//       meta = "Enhanced blog generated from manual input";
//     } else {
//       return NextResponse.json(
//         { error: "Provide either a valid URL (RSS feed or article) or sufficient manual content (min 100 chars)" },
//         { status: 400 }
//       );
//     }

//     // --- AI Agents (Intent, Tone, SEO) ---
//     let intent = { intent: "Informational" };
//     let toneVoice = { tone: "informative", voice: "neutral" };
//     let seo = { optimized_title: title, meta_description: meta };
    
//     try {
//       console.log("🤖 Calling AI agents...");
//       const agentResults = await Promise.allSettled([
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/keyword`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }).then(res => res.ok ? res.json() : Promise.reject(res)),

//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/tone`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ keyword: title }),
//         }).then(res => res.ok ? res.json() : Promise.reject(res)),

//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/seo-optimizer`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             keyword: title,
//             outline: [],
//             tone: "informative",
//             voice: "neutral",
//             tags: [],
//           }),
//         }).then(res => res.ok ? res.json() : Promise.reject(res)),
//       ]);

//       if (agentResults[0].status === 'fulfilled') intent = agentResults[0].value;
//       if (agentResults[1].status === 'fulfilled') toneVoice = agentResults[1].value;
//       if (agentResults[2].status === 'fulfilled') seo = agentResults[2].value;
      
//       console.log("✅ AI agents completed");
//     } catch (err) {
//       console.log("⚠️ AI agents failed, using fallbacks");
//     }

//     // --- AI Enhancement with Content Management ---
//     let enhancedBlog;
//     try {
//       console.log("🎨 Processing content with AI...");
//       enhancedBlog = await processContentWithAI(content, title, meta, {
//         intent,
//         toneVoice,
//         seo
//       });
//       console.log("✅ AI enhancement completed");
//     } catch (enhancementError) {
//       const enhancementErrorMessage = (enhancementError && typeof enhancementError === "object" && "message" in enhancementError)
//         ? (enhancementError as { message?: string }).message
//         : String(enhancementError);
//       console.error("🚨 AI enhancement failed:", enhancementErrorMessage);
//       return NextResponse.json({ 
//         error: "Failed to enhance content", 
//         details: enhancementErrorMessage
//       }, { status: 500 });
//     }

//     // --- Simplified Comparison (skip if content was truncated) ---
//     let comparison = {
//       improvements: ["Enhanced content structure and readability"],
//       word_count_change: enhancedBlog.split(' ').length - content.split(' ').length,
//       seo_improvements: ["Improved headings and structure"],
//       content_additions: ["Enhanced flow and clarity"]
//     };

//     // Only do detailed comparison for smaller content
//     if (content.length < 5000) {
//       try {
//         const diffPrompt = createEnhancementPrompt(content, enhancedBlog);
//         if (isWithinTokenLimit(diffPrompt, MAX_TOKENS)) {
//           const compareRes = await fetch("https://api.openai.com/v1/chat/completions", {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               model: "gpt-4o-mini",
//               messages: [
//                 { role: "system", content: "You are a JSON diff analyzer." },
//                 { role: "user", content: diffPrompt },
//               ],
//               temperature: 0.2,
//             }),
//           });

//           if (compareRes.ok) {
//             const compareJson = await compareRes.json();
//             comparison = JSON.parse(compareJson.choices?.[0]?.message?.content || JSON.stringify(comparison));
//           }
//         }
//       } catch (comparisonError) {
//         console.log("⚠️ Comparison failed, using fallback");
//       }
//     }

//     // --- Validation ---
//     const result = CrawlEnhanceSchema.safeParse({
//       original: {
//         title,
//         content: content.length > 10000 ? content.substring(0, 10000) + "..." : content,
//         meta_description: meta,
//         tone: toneVoice?.tone,
//         voice: toneVoice?.voice,
//         seo,
//         intent: intent?.intent,
//       },
//       enhanced: {
//         title: seo?.optimized_title || title,
//         content: enhancedBlog,
//         meta_description: seo?.meta_description || meta,
//         tone: toneVoice?.tone,
//         voice: toneVoice?.voice,
//         seo,
//         intent: intent?.intent,
//       },
//       changes: comparison,
//     });

//     if (!result.success) {
//       console.error("⚠️ Validation failed:", result.error.flatten());
//       return NextResponse.json(
//         { error: "Final validation failed", issues: result.error.flatten() },
//         { status: 422 }
//       );
//     }

//     // --- Save & Respond ---
//     try {
//       await CrawledBlogModel.create({
//         sourceUrl: rssUrl || "manual-input",
//         title,
//         original: result.data.original,
//         enhanced: result.data.enhanced,
//         changes: result.data.changes,
//         createdAt: new Date(),
//       });
//     } catch (dbError) {
//       console.error(
//         "⚠️ Database save failed:",
//         dbError && typeof dbError === "object" && "message" in dbError
//           ? (dbError as { message?: string }).message
//           : dbError
//       );
//       // Continue anyway
//     }

//     console.log("🎉 Process completed successfully");
//     return NextResponse.json(result.data);

//   } catch (err) {
//     console.error("💥 Crawl & Enhance Agent Error:", err);
//     return NextResponse.json({ 
//       error: "Internal server error - Crawl Agent Failed", 
//       details: typeof err === "object" && err !== null && "message" in err ? (err as { message?: string }).message : String(err)
//     }, { status: 500 });
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { CrawlEnhanceSchema } from "./schema";
import { createEnhancementPrompt } from "./prompt";
import { isWithinTokenLimit, splitTextByTokenLimit } from "@/app/api/utils/tokenUtils";
import { connectDB } from "@/app/api/utils/db";
import { CrawledBlogModel } from "@/app/models/crawledBlog";
import { string } from "zod";

const parser = new Parser();
const MAX_TOKENS = 4000;
const MAX_CONTENT_TOKENS = 2500; // Reserve tokens for system prompt and other content

// Function to detect if URL is RSS feed or direct article
function isRSSFeed(url: string) {
  const rssIndicators = [
    '/rss',
    '/feed',
    '/atom',
    '.xml',
    'rss.xml',
    'feed.xml',
    'atom.xml'
  ];
  
  const lowerUrl = url.toLowerCase();
  return rssIndicators.some(indicator => lowerUrl.includes(indicator));
}

// Function to convert article URL to RSS feed URL
function tryConvertToRSSUrl(url: string) {
  const lowerUrl = url.toLowerCase();
  
  // Medium user feeds
  if (lowerUrl.includes('medium.com/@')) {
    const username = url.match(/@([^/]+)/)?.[1];
    if (username) {
      return `https://medium.com/feed/@${username}`;
    }
  }
  
  // Medium publication feeds  
  if (lowerUrl.includes('medium.com/') && !lowerUrl.includes('@')) {
    const pathMatch = url.match(/medium\.com\/([^/]+)/);
    if (pathMatch && pathMatch[1] !== 'feed') {
      return `https://medium.com/feed/${pathMatch[1]}`;
    }
  }
  
  // Common blog platforms
  const platformConversions = [
    { pattern: /wordpress\.com/, rss: (url: string) => url.replace(/\/$/, '') + '/feed' },
    { pattern: /blogspot\.com/, rss: (url: string) => url.replace(/\/$/, '') + '/feeds/posts/default' },
    { pattern: /ghost\./, rss: (url: string) => url.replace(/\/$/, '') + '/rss' },
    { pattern: /substack\.com/, rss: (url: string) => url.replace(/\/$/, '') + '/feed' }
  ];
  
  for (const conversion of platformConversions) {
    if (conversion.pattern.test(lowerUrl)) {
      return conversion.rss(url);
    }
  }
  
  return null;
}

// Function to intelligently truncate content while preserving structure
function intelligentContentTruncation(content: string, maxTokens: number) {
  // First, try to fit within token limit
  if (isWithinTokenLimit(content, maxTokens)) {
    return content;
  }
  
  console.log(`📏 Content too long, truncating from ${content.length} chars`);
  
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
  
  console.log(`✂️ Content truncated to ${truncatedContent.length} chars`);
  return truncatedContent + '\n\n[Content truncated for processing...]';
}

// Function to safely fetch and parse HTML content
async function fetchArticleContent(url:string) {
  console.log("🌐 Fetching article content from:", url);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    signal: controller.signal
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  console.log("📄 HTML fetched, length:", html.length);

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

  return { title, content, meta };
}

// Enhanced AI processing with chunking support
async function processContentWithAI(
  content: string,
  title: string,
  meta: string,
  agents: { intent: any; toneVoice: any; seo: any }
) {
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

  console.log(`📝 Enhancement prompt length: ${enhancedPrompt.length} chars`);

  // Double-check token limit
  if (!isWithinTokenLimit(enhancedPrompt, MAX_TOKENS)) {
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
      max_tokens: 3000, // Ensure response isn't too long
    }),
  });

  if (!aiRes.ok) {
    const errorText = await aiRes.text();
    console.error("🚨 OpenAI API error:", errorText);
    throw new Error(`OpenAI API failed: ${aiRes.status}`);
  }

  const aiJson = await aiRes.json();
  const enhancedBlog = aiJson.choices?.[0]?.message?.content?.trim();
  
  if (!enhancedBlog || enhancedBlog.length < 200) {
    throw new Error("Enhanced blog is too short or missing");
  }

  return enhancedBlog;
}

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Starting crawl & enhance agent");
    const { rssUrl, manualContent, manualTitle } = await req.json();
    console.log("📝 Request data:", { rssUrl, manualTitle, hasManualContent: !!manualContent });

    await connectDB();

    let title = manualTitle || "";
    let content = manualContent || "";
    let meta = "";

    // --- MODE 1: URL Processing (RSS or Direct Article) ---
    if (rssUrl && /^https?:\/\/.+/.test(rssUrl)) {
      console.log("🔍 Processing URL mode");
      
      let isRSS = isRSSFeed(rssUrl);
      console.log("📡 Is RSS feed?", isRSS);
      
      if (isRSS) {
        // Handle as RSS feed
        try {
          console.log("📡 Parsing RSS feed...");
          const feed = await parser.parseURL(rssUrl);
          console.log("✅ RSS parsed successfully, items found:", feed.items?.length || 0);
          
          const firstItem = feed.items?.[0];
          if (!firstItem?.link || !firstItem?.title) {
            return NextResponse.json({ error: "No valid blog post found in RSS" }, { status: 404 });
          }

          title = firstItem.title;
          
          // Try RSS content first
          if (firstItem.content && firstItem.content.length > 300) {
            const $ = cheerio.load(firstItem.content, { xmlMode: false});
            content = $.text().trim();
          } else if (firstItem.contentSnippet) {
            content = firstItem.contentSnippet;
          }
          
          // If RSS content is insufficient, fetch from the article URL
          if (!content || content.length < 300) {
            const articleData = await fetchArticleContent(firstItem.link);
            content = articleData.content;
            meta = articleData.meta;
          }

        } catch (rssError) {
          console.error(
            "🚨 RSS parsing failed:",
            typeof rssError === "object" && rssError !== null && "message" in rssError
              ? (rssError as { message?: string }).message
              : String(rssError)
          );
          isRSS = false;
        }
      }
      
      if (!isRSS) {
        // Handle as direct article URL
        console.log("📄 Treating as direct article URL");
        try {
          const articleData = await fetchArticleContent(rssUrl);
          title = articleData.title;
          content = articleData.content;
          meta = articleData.meta;
        } catch (articleError) {
          console.error(
            "🚨 Direct article fetch failed:",
            typeof articleError === "object" && articleError !== null && "message" in articleError
              ? (articleError as { message?: string }).message
              : String(articleError)
          );
          return NextResponse.json({ 
            error: "Failed to fetch content from URL", 
            details: typeof articleError === "object" && articleError !== null && "message" in articleError
              ? (articleError as { message?: string }).message
              : String(articleError)
          }, { status: 422 });
        }
      }

      if (!content || content.length < 100) {
        return NextResponse.json({ 
          error: "Blog content too short or not found", 
          details: `Content length: ${content?.length || 0} characters`,
          url: rssUrl
        }, { status: 422 });
      }

      console.log("✅ Content extraction successful:", {
        titleLength: title.length,
        contentLength: content.length,
        metaLength: meta.length
      });
    }
    // --- MODE 2: Manual Input ---
    else if (manualContent && manualContent.trim().length > 100) {
      console.log("📝 Processing manual input mode");
      title = manualTitle || "Untitled Blog";
      content = manualContent;
      meta = "Enhanced blog generated from manual input";
    } else {
      return NextResponse.json(
        { error: "Provide either a valid URL (RSS feed or article) or sufficient manual content (min 100 chars)" },
        { status: 400 }
      );
    }

    // --- AI Agents (Intent, Tone, SEO) ---
    let intent = { intent: "Informational" };
    let toneVoice = { tone: "informative", voice: "neutral" };
    let seo = { optimized_title: title, meta_description: meta };
    
    try {
      console.log("🤖 Calling AI agents...");
      const agentResults = await Promise.allSettled([
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
      
      console.log("✅ AI agents completed");
    } catch (err) {
      console.log("⚠️ AI agents failed, using fallbacks");
    }

    // --- AI Enhancement with Content Management ---
    let enhancedBlog;
    try {
      console.log("🎨 Processing content with AI...");
      enhancedBlog = await processContentWithAI(content, title, meta, {
        intent,
        toneVoice,
        seo
      });
      console.log("✅ AI enhancement completed");
    } catch (enhancementError) {
      console.error(
        "🚨 AI enhancement failed:",
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
          }
        }
      } catch (comparisonError) {
        console.log("⚠️ Comparison failed, using fallback");
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

    console.log("🔍 Validation data structure:", {
      hasOriginal: !!validationData.original,
      hasEnhanced: !!validationData.enhanced,
      hasChanges: !!validationData.changes,
      changesKeys: Object.keys(validationData.changes),
      originalKeys: Object.keys(validationData.original),
      enhancedKeys: Object.keys(validationData.enhanced)
    });

    const result = CrawlEnhanceSchema.safeParse(validationData);

    if (!result.success) {
      console.error("⚠️ Validation failed:", result.error.flatten());
      console.error("🔍 Full error details:", JSON.stringify(result.error, null, 2));
      
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
      await CrawledBlogModel.create({
        sourceUrl: rssUrl || "manual-input",
        title,
        original: result.data.original,
        enhanced: result.data.enhanced,
        changes: result.data.changes,
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error(
        "⚠️ Database save failed:",
        dbError && typeof dbError === "object" && "message" in dbError
          ? (dbError as { message?: string }).message
          : dbError
      );
      // Continue anyway
    }

    console.log("🎉 Process completed successfully");
    return NextResponse.json(result.data);

  } catch (err) {
    console.error("💥 Crawl & Enhance Agent Error:", err);
    return NextResponse.json({ 
      error: "Internal server error - Crawl Agent Failed", 
      details: typeof err === "object" && err !== null && "message" in err ? (err as { message?: string }).message : String(err)
    }, { status: 500 });
  }
}
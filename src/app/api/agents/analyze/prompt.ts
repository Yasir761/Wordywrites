// // Define the SerpResult type if not imported from elsewhere
// type SerpResult = {
//   title: string;
//   link: string;
//   snippet: string;
// };

// export function createPrompt(keyword: string, serp: SerpResult[]): string {
//   const topResults = serp.slice(0, 5).map((result, i) => {
//     return `Result ${i + 1}:
// Title: ${result.title}
// Link: ${result.link}
// Snippet: ${result.snippet}`
//   }).join("\n\n");

//   return `
// You are a professional SEO strategist and digital marketing expert trained in search intent analysis and SERP behavior.

// Your task is to analyze the following data for the keyword: "${keyword}".

// Top Google Search Results:
// ${topResults}

// Analyze the above and generate **ONLY** a valid, concise JSON response with these fields:

// {
//   "intent": "<Informational | Navigational | Transactional>",
//   "competition_level": "<Low | Medium | High>",
//   "keyword_difficulty_score": <0.0 to 1.0 as float>,
//   "suggested_strategy": "<Concise strategy, avoid vague tips, use strong SEO logic>",
//   "title_suggestions": ["...", "..."], // 2–3 highly engaging, SEO-friendly titles
//   "meta_description": "<High-converting meta description (max 160 chars), no fluff>"
// }

// ✅ Only return JSON — no explanations.
// ✅ Be grammatically correct and clear.
// ✅ Never hallucinate or guess data you don’t have.

// IMPORTANT:
// - Use SERP patterns and snippet language to derive **intent and competition**.
// - Score difficulty from 0 to 1 based on how competitive the SERP looks.
// - Keep title suggestions useful for content creators.
//   `.trim();
// }



// Define the SerpResult type if not imported from elsewhere
type SerpResult = {
  title: string;
  link: string;
  snippet: string;
};

export function createPrompt(keyword: string, serp: SerpResult[]): string {
  const topResults = serp.slice(0, 5).map((result, i) => {
    return `Result ${i + 1}:
Title: ${result.title}
Link: ${result.link}
Snippet: ${result.snippet}`
  }).join("\n\n");

  return `
You are an expert SEO strategist trained in **search intent classification, SERP analysis, and keyword difficulty scoring**.  

Your task: analyze the following Google search results for the keyword: "${keyword}".

Top Results:
${topResults}

Return your answer as **strict, valid JSON only** with this schema:

{
  "intent": "<Informational | Navigational | Transactional>",
  "competition_level": "<Low | Medium | High>",
  "keyword_difficulty_score": <float between 0.0 and 1.0>,
  "suggested_strategy": "<Precise SEO/content strategy based on SERP — no generic tips>",
  "title_suggestions": ["Title 1", "Title 2", "Title 3"],
  "meta_description": "<Compelling, high-CTR meta description (≤160 chars)>"
}

Rules:
- ❌ Do NOT include explanations or text outside JSON.
- ✅ Derive intent and competition from **SERP patterns & snippet language**.
- ✅ Keep strategies actionable and specific (e.g., “Focus on long-tail keywords targeting buyers”).
- ✅ Titles must be **clickworthy, SEO-friendly, and concise** (≤60 chars).
- ✅ Meta description must be **engaging, keyword-rich, ≤160 chars**.
- ❌ Never hallucinate numbers or data not inferable from SERP.
- ✅ Ensure JSON is always well-formed and free of trailing commas.
  `.trim();
}

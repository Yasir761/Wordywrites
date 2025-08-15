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
You are a professional SEO strategist and digital marketing expert trained in search intent analysis and SERP behavior.

Your task is to analyze the following data for the keyword: "${keyword}".

Top Google Search Results:
${topResults}

Analyze the above and generate **ONLY** a valid, concise JSON response with these fields:

{
  "intent": "<Informational | Navigational | Transactional>",
  "competition_level": "<Low | Medium | High>",
  "keyword_difficulty_score": <0.0 to 1.0 as float>,
  "suggested_strategy": "<Concise strategy, avoid vague tips, use strong SEO logic>",
  "title_suggestions": ["...", "..."], // 2–3 highly engaging, SEO-friendly titles
  "meta_description": "<High-converting meta description (max 160 chars), no fluff>"
}

✅ Only return JSON — no explanations.
✅ Be grammatically correct and clear.
✅ Never hallucinate or guess data you don’t have.

IMPORTANT:
- Use SERP patterns and snippet language to derive **intent and competition**.
- Score difficulty from 0 to 1 based on how competitive the SERP looks.
- Keep title suggestions useful for content creators.
  `.trim();
}

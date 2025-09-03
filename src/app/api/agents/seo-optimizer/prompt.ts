// export function createPrompt(
//   keyword: string,
//   outline: string[],
//   tone: string,
//   voice: string,
//   hashtags: string[]
// ): string {
//   return `
// You are an expert in SEO blog optimization.

// Your task:
// Based on the keyword and blog outline, generate optimized metadata for SEO including title, meta description, URL slug, and final hashtags.

// Given:
// - Keyword: "${keyword}"
// - Outline: ${JSON.stringify(outline)}
// - Tone: "${tone}"
// - Voice: "${voice}"
// - Suggested hashtags: ${JSON.stringify(hashtags)}

// Requirements:
// - Title: Must be engaging, relevant to the keyword, and under 65 characters.
// - Meta Description: Summarize the blog clearly, 140–160 characters.
// - Slug: Lowercase, hyphen-separated, no special characters or stop words.
// - Final Hashtags: Pick the most relevant 3–5 from suggestions or generate new ones. Must start with "#".
// - SEO Score: Return a number between 0–100 representing how strong the metadata is for SEO (based on keyword inclusion, clarity, relevance, and character limits).

// Only return a valid JSON in this format:
// {
//   "optimized_title": "Your perfect SEO blog title",
//   "meta_description": "Your perfect meta description",
//   "slug": "seo-blog-example",
//   "final_hashtags": ["#SEO", "#BlogWriting", "#AIContent"],
//   "seo_score": 87

// }

// Do not include explanation. Respond with JSON only.
// `.trim();
// }




export function createPrompt(
  keyword: string,
  outline: string[],
  tone: string,
  voice: string,
  hashtags: string[]
): string {
  return `
You are an expert in SEO blog optimization.

Your task:
Based on the keyword and blog outline, generate optimized metadata for SEO including title, meta description, URL slug, and final hashtags.

Given:
- Keyword: "${keyword}"
- Outline: ${JSON.stringify(outline)}
- Tone: "${tone}"
- Voice: "${voice}"
- Suggested hashtags: ${JSON.stringify(hashtags)}

Requirements:
- optimized_title: Must be engaging, include the keyword naturally, and stay under 65 characters.
- meta_description: Summarize the blog clearly in 140–160 characters. Must contain the keyword once, written for high CTR.
- slug: Lowercase, hyphen-separated, no special characters or filler/stop words (e.g., "and", "the", "of").
- final_hashtags: Select the 3–5 most relevant from suggestions or generate new ones. Each must start with "#", no spaces or special characters.
- seo_score: Return a whole number between 0 and 100 representing how strong the metadata is for SEO (based on keyword presence, clarity, relevance, and character limits).

Output Rules:
- Return strictly valid JSON only.
- Do not include explanations, markdown, or additional text.

JSON format:
{
  "optimized_title": "Your perfect SEO blog title",
  "meta_description": "Your perfect meta description",
  "slug": "seo-blog-example",
  "final_hashtags": ["#SEO", "#BlogWriting", "#AIContent"],
  "seo_score": 87
}
`.trim();
}

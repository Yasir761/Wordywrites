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
- Title: Must be engaging, relevant to the keyword, and under 65 characters.
- Meta Description: Summarize the blog clearly, 140–160 characters.
- Slug: Lowercase, hyphen-separated, no special characters or stop words.
- Final Hashtags: Pick the most relevant 3–5 from suggestions or generate new ones. Must start with "#".
- SEO Score: Return a number between 0–100 representing how strong the metadata is for SEO (based on keyword inclusion, clarity, relevance, and character limits).

Only return a valid JSON in this format:
{
  "optimized_title": "Your perfect SEO blog title",
  "meta_description": "Your perfect meta description",
  "slug": "seo-blog-example",
  "final_hashtags": ["#SEO", "#BlogWriting", "#AIContent"],
  "seo_score": 87

}

Do not include explanation. Respond with JSON only.
`.trim();
}

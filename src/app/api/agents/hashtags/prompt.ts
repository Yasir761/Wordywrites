// export function createPrompt(keyword: string): string {
//   return `
// You are a professional social media strategist.

// Your job is to generate high-quality hashtags to promote a blog post based on the following keyword: "${keyword}"

// Guidelines:
// - Return exactly 5–7 highly relevant hashtags.
// - Do not include general terms like #blog or #writing unless relevant.
// - Output must be a valid JSON with this format:

// {
//   "tags": ["#AIWriting", "#ContentMarketing", "#AIForCreators"]
// }

// Respond with **only** the JSON. Do not include any explanation, quotes, or formatting.
//   `.trim();
// }





export function createPrompt(keyword: string): string {
  return `
You are a professional social media strategist.

Your job is to generate high-quality hashtags to promote a blog post based on the following keyword: "${keyword}"

Guidelines:
- Return exactly 5–7 highly relevant hashtags tailored to the keyword.
- Avoid generic terms like #blog, #writing, or unrelated trending tags.
- Each hashtag must start with "#" and contain no spaces or symbols.
- Output must be valid JSON only, in the format:

{
  "tags": ["#AIWriting", "#ContentMarketing", "#AIForCreators"]
}

Output Rules:
- Do not include explanations, markdown, or quotes.
- Ensure the JSON is strictly valid and parseable.
- Always return exactly one "tags" field with 5–7 hashtags.
`.trim();
}

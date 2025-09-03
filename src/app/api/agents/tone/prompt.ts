// export function createPrompt(keyword: string): string {
//   return `
// You are an expert blog strategist.

// Your task is to determine the best **tone** and **voice** for writing a blog about the keyword provided.

// Definitions:
// - Tone: The emotional feel or attitude of the writing. Examples: informative, casual, persuasive, humorous, professional, inspiring
// - Voice: The personality or style of the writer. Examples: confident, friendly, authoritative, witty, neutral

// Only respond in this strict JSON format:
// {
//   "tone": "informative",
//   "voice": "confident"
// }

// Keyword: "${keyword}"

// Respond with JSON only. Do not add comments or extra text.
//   `.trim();
// }




// export function createPrompt(keyword: string): string {
//   return `
// You are an expert blog strategist.

// Your task is to determine the most effective **tone** and **voice** for writing a blog about the keyword provided.

// Definitions:
// - Tone: The emotional feel or attitude of the writing. Examples: informative, casual, persuasive, humorous, professional, inspiring.
// - Voice: The personality or style of the writer. Examples: confident, friendly, authoritative, witty, neutral.

// Requirements:
// - Choose exactly one tone and one voice that best fit the keyword.
// - Ensure both selections are consistent and realistic for blog writing.
// - Respond strictly in valid JSON only.

// JSON format:
// {
//   "tone": "informative",
//   "voice": "confident"
// }

// Keyword: "${keyword}"

// ⚠️ Do not include explanations, markdown, or extra text. Output must be strictly valid JSON.
// `.trim();
// }





export function createPrompt(keyword: string): string {
  return `
You are an expert blog strategist trained in SEO best practices and EEAT principles (Experience, Expertise, Authoritativeness, Trustworthiness).

Your task is to determine the most effective **tone** and **voice** for writing a blog about the keyword provided.

Definitions:
- Tone: The emotional feel or attitude of the writing. Examples: informative, professional, persuasive, casual, inspiring, authoritative.
- Voice: The personality or style of the writer. Examples: confident, friendly, trustworthy, authoritative, neutral, expert-driven.

Requirements:
- Select exactly one tone and one voice that best align with the keyword, user intent, and SEO authority.
- Ensure both selections are consistent, realistic, and enhance clarity and trustworthiness for the target audience.
- Respond strictly in valid JSON only.

JSON format:
{
  "tone": "informative",
  "voice": "confident"
}

Keyword: "${keyword}"

⚠️ Do not include explanations, markdown, or extra text. Output must be strictly valid JSON.
`.trim();
}
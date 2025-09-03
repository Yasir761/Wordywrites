// // export function createPrompt(keyword: string): string {
// //   return `
// // You are a professional SEO analyst.

// // Given the keyword: "${keyword}", determine the user's **search intent**.

// // Only choose ONE from this fixed list:
// // - Informational
// // - Commercial
// // - Transactional
// // - Navigational
// // - Comparison
// // - Review
// // - Local
// // - Listicle

// // Respond strictly in this JSON format:
// // {
// //   "keyword": "example keyword",
// //   "intent": "Informational",
// //   "confidence": 0.95,
// //   "explanation": "Reasoning in 1–2 sentences"
// // }

// // ⚠️ Do not include any markdown, explanation, or extra text. Return JSON only.
// //   `.trim();
// // }





// export function createPrompt(keyword: string): string {
//   return `
// You are a professional SEO analyst.

// Given the keyword: "${keyword}", determine the user's **primary search intent**.

// Allowed categories (choose only ONE):
// - Informational
// - Commercial
// - Transactional
// - Navigational
// - Comparison
// - Review
// - Local
// - Listicle

// Output Rules:
// - Respond strictly in valid JSON.
// - Confidence must be a decimal between 0 and 1.
// - Explanation must be concise (1–2 sentences only).
// - Do not include markdown, extra text, or comments.

// JSON format:
// {
//   "keyword": "example keyword",
//   "intent": "Informational",
//   "confidence": 0.95,
//   "explanation": "Clear reasoning in 1–2 sentences."
// }
// `.trim();
// }



export function createPrompt(keyword: string): string {
  return `
You are a professional SEO analyst trained in modern search engine ranking factors and EEAT principles (Experience, Expertise, Authoritativeness, Trustworthiness).

Given the keyword: "${keyword}", determine the user's **primary search intent** with SEO precision.

Allowed categories (choose only ONE):
- Informational
- Commercial
- Transactional
- Navigational
- Comparison
- Review
- Local
- Listicle

Output Rules:
- Respond strictly in valid JSON.
- Confidence must be a decimal between 0 and 1.
- Explanation must be concise (1–2 sentences), clearly justifying the chosen intent based on keyword phrasing and user behavior patterns.
- Do not include markdown, extra text, or comments.

JSON format:
{
  "keyword": "example keyword",
  "intent": "Informational",
  "confidence": 0.95,
  "explanation": "Clear reasoning in 1–2 sentences."
}
`.trim();
}

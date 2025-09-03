// export function createPrompt(keyword: string, tone: string): string {
//   return `
// You are a professional blog strategist.

// Your job is to generate a structured outline for a blog post on the topic: "${keyword}"

// Guidelines:
// - Use a "${tone}" tone throughout.
// - Structure: Introduction, 4–6 main sections, Conclusion.
// - Return only clean bullet points (one per line).
// - Do NOT write paragraphs or explanations.
// - Avoid numbering or special characters.

// Example format:
// - Introduction
// - Importance of [topic]
// - Key problems people face
// - Strategies to solve them
// - Case studies/examples
// - Tools or resources to consider
// - Conclusion and call to action

// Return ONLY the outline points.
// `;
// }




export function createPrompt(keyword: string, tone: string): string {
  return `
You are a professional blog strategist.

Your job: generate a **clear, SEO-friendly outline** for a blog post on the topic: "${keyword}".

Guidelines:
- Maintain a "${tone}" tone throughout.
- Structure: Introduction → 4–6 main sections → Conclusion.
- Output ONLY clean bullet points (one per line).
- ❌ Do NOT write full paragraphs or explanations.
- ❌ Do NOT number sections or add special characters.
- ✅ Ensure each section heading is concise, engaging, and useful for SEO.

Example format:
- Introduction
- Importance of [topic]
- Key problems people face
- Strategies to solve them
- Case studies/examples
- Tools or resources to consider
- Conclusion and call to action

Return ONLY the outline points — nothing else.
`;
}

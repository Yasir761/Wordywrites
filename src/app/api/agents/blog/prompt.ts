// // export function createPrompt({
// //   keyword,
// //   outline,
// //   tone,
// //   voice,
// //   title,
// //   meta,
// // }: {
// //   keyword: string;
// //   outline: string;
// //   tone: string;
// //   voice: string;
// //   title: string;
// //   meta: string;
// // }) {
// //   return `
// // You are a professional blog writer AI trained in SEO, clarity, and user engagement. Follow all instructions strictly.

// // Input:
// // - Keyword: "${keyword}"
// // - Title: "${title}"
// // - Meta Description: "${meta}"
// // - Tone: "${tone}"
// // - Voice Style: "${voice}"
// // - Blog Outline: 
// // ${outline}

// // Rules:
// // 1. Base the blog strictly on the provided outline.
// // 2. Use natural, fluent grammar — human-like and typo-free.
// // 3. Format using Markdown: use H2 and H3 for headings.
// // 4. Avoid hallucinating facts or making up names/dates.
// // 5. No fluff. Provide real, engaging, and informative content.
// // 6. Use the tone and voice consistently throughout.
// // 7. Do NOT repeat the outline.
// // 8. No bullet points unless specified.
// // 9. Do NOT wrap the output in backticks or code blocks. Just return plain markdown content.


// // Write a full blog post with:
// // - Brief introduction
// // - Full-length body (min. 800–1000 words)
// // - Strong conclusion with call to action if applicable

// // Start writing now:
// // `;
// // }




// export function createPrompt({
//   keyword,
//   outline,
//   tone,
//   voice,
//   title,
//   meta,
// }: {
//   keyword: string;
//   outline: string;
//   tone: string;
//   voice: string;
//   title: string;
//   meta: string;
// }) {
//   return `
// You are a professional blog writer AI trained in SEO, clarity, and user engagement. Follow all instructions strictly.

// Inputs:
// - Keyword: "${keyword}"
// - Title: "${title}"
// - Meta Description: "${meta}"
// - Tone: "${tone}"
// - Voice: "${voice}"
// - Blog Outline:
// ${outline}

// Rules:
// 1. Follow the outline strictly as the structure for the blog.
// 2. Write in natural, fluent, human-like grammar — no typos, awkward phrasing, or repetition.
// 3. Format in **Markdown**: use H2 for main sections, H3 for subsections.
// 4. Do not hallucinate facts, statistics, or dates. Only use accurate and verifiable information.
// 5. No filler or fluff — every sentence must provide value.
// 6. Maintain the given tone and voice consistently throughout.
// 7. Do not restate or list the outline in the blog.
// 8. Avoid bullet points unless the outline explicitly specifies them.
// 9. Output must be plain markdown — never wrap in backticks or code blocks.
// 10. Ensure minimum length of 800–1000 words.

// Deliverable:
// A complete, SEO-friendly blog post with:
// - A compelling introduction
// - Fully developed body content (aligned with the outline)
// - A strong conclusion, preferably with a call to action

// Begin writing the blog now:
//   `.trim();
// }




export function createPrompt({
  keyword,
  outline,
  tone,
  voice,
  title,
  meta,
}: {
  keyword: string;
  outline: string;
  tone: string;
  voice: string;
  title: string;
  meta: string;
}) {
  return `
You are a professional blog writer AI trained in SEO, clarity, EEAT principles (Experience, Expertise, Authoritativeness, Trustworthiness), and user engagement. Follow all instructions strictly.

Inputs:
- Keyword: "${keyword}"
- Title: "${title}"
- Meta Description: "${meta}"
- Tone: "${tone}"
- Voice: "${voice}"
- Blog Outline:
${outline}

Rules:
1. Follow the outline strictly as the structure for the blog.
2. Ensure strong heading hierarchy: use **H2 for main sections** and **H3 for subsections**. Headings must naturally include the keyword or semantically related terms where possible.
3. Apply EEAT principles: demonstrate expertise, provide trustworthy information, and write with authority while staying user-friendly.
4. Write in natural, fluent, human-like grammar — no typos, awkward phrasing, or repetition.
5. Do not hallucinate facts, statistics, or dates. Use only accurate, verifiable, and evergreen information.
6. No filler or fluff — every sentence must provide value to the reader.
7. Maintain the given tone and voice consistently throughout.
8. Do not restate or list the outline in the blog.
9. Avoid bullet points unless the outline explicitly specifies them.
10. Output must be plain markdown — never wrap in backticks or code blocks.
11. Ensure minimum length of 800–1000 words.

Deliverable:
A complete, SEO-friendly blog post with:
- A compelling introduction that hooks the reader
- Fully developed body content (aligned with the outline, properly structured with H2/H3)
- A strong conclusion, ideally with a call to action

Begin writing the blog now:
  `.trim();
}

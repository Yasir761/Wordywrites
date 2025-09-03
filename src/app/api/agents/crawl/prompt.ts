// export function createEnhancementPrompt(original: string, enhanced: string): string {
//   return `
// You are a content comparison expert.

// Compare the following two versions of a blog post and return a structured JSON analysis.

// --- Original Version ---
// ${original}

// --- Enhanced Version ---
// ${enhanced}

// Your task:
// 1. Identify improvements in **SEO**, **structure**, **clarity**, and **tone**.
// 2. Detect **added**, **removed**, or **significantly modified** sections.
// 3. List **keywords newly introduced** that improve SEO.
// 4. Estimate the **SEO score improvement** as a decimal between 0 and 1.

// Return ONLY valid JSON in the following format:

// {
//   "title_changed": boolean,
//   "meta_changed": boolean,
//   "tone_changed": boolean,
//   "word_count_diff": number, // enhanced word count minus original word count
//   "added_sections": [string], // headings or sections present only in enhanced version
//   "removed_sections": [string], // headings or sections removed from original
//   "keywords_added": [string], // keywords newly added in enhanced version
//   "seo_score_diff": number, // decimal between 0 and 1
//   "summary": string // concise summary of major changes
// }

// Do not include any extra text, explanations, or comments—return strictly valid JSON only.
//   `.trim();
// }



export function createEnhancementPrompt(original: string, enhanced: string): string {
  return `
You are a content comparison expert.

Compare the following two versions of a blog post and return a structured JSON analysis.

--- Original Version ---
${original}

--- Enhanced Version ---
${enhanced}

Your task:
1. Identify improvements in SEO, structure, clarity, and tone.
2. Detect added, removed, or significantly modified sections.
3. List keywords newly introduced that improve SEO.
4. Estimate the SEO score improvement as a decimal between 0 and 1.

Output Rules:
- Return ONLY valid JSON in the exact schema below.
- Do not include explanations, comments, markdown, or extra text.
- Ensure all arrays are present (use [] if none).
- Ensure values are properly typed (boolean, number, string).

JSON Schema:

{
  "title_changed": boolean,
  "meta_changed": boolean,
  "tone_changed": boolean,
  "word_count_diff": number, 
  "added_sections": [string], 
  "removed_sections": [string], 
  "keywords_added": [string], 
  "seo_score_diff": number, 
  "summary": string 
}
`.trim();
}

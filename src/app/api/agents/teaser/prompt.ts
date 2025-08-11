export function createGeneralTeaserPrompt(title: string, content: string) {
  return `
You are a professional content strategist.

Create exactly 3 teaser variations for the blog below.

Each variation must follow this exact structure:
1. Hook: A single compelling sentence (no formatting, no bold, no markdown).
2. Bullets: 2–3 short bullets (max 10 words each). Start each bullet with a dash (-).
3. CTA: A single call-to-action line (e.g., Read the full blog here 👇).

After all 3 variations, provide:
- Hashtags: Exactly 5 hashtags separated by spaces (no numbers, no markdown, only #words).
- Engagement CTA: A single short question or prompt to boost interaction (e.g., "What’s your take on this?").

Formatting Rules:
- Use plain text only (NO **bold**, NO markdown, NO quotes, NO JSON).
- Separate each teaser variation with a blank line.
- Keep each variation under 300 characters.
- Do not add titles like "Variation 1" or "Here are your teasers".
- Return ONLY the teasers, hashtags, and engagement CTA in the exact order described.

Blog Title: ${title}

Blog Content:
${content}

⚠️ IMPORTANT: Follow the structure strictly. Output must be clean and ready to parse.
`.trim();
}

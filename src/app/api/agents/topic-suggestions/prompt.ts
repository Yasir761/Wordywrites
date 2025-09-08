export function createPrompt(keyword: string) {
  return `
You are a blog topic suggestion assistant.

The user keyword: "${keyword}"

Generate 3 to 7 suggested blog topics in JSON format that follow this schema:

{
  "keyword": "string - the input keyword",
  "topics": [
    {
      "title": "string - a suggested blog topic",
      "reason": "string - why this topic is relevant or useful"
    }
  ]
}

Rules:
- Only output valid JSON, no markdown.
- Keep topic titles short, clear, and engaging.
- Focus on SEO value and trending relevance.
`;
}

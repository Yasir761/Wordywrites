import { z } from "zod";

export const TopicSuggestionSchema = z.object({
  keyword: z.string().describe("The input keyword"),
  topics: z.array(
    z.object({
      title: z.string().describe("Suggested blog topic/title"),
      reason: z.string().describe("Why this topic is relevant/trending"),
    })
  ).min(3).max(7),
});

export type TopicSuggestion = z.infer<typeof TopicSuggestionSchema>;

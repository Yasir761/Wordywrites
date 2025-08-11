import { z } from "zod";

export const BlogOutputSchema = z.object({
  blog: z.string().min(800, "Blog content is too short"),
  keyword: z.string().min(3, "Keyword is too short"),
  wordCount: z.number().min(100, "Word count is too low"), // You can adjust this min
});

export type BlogOutput = z.infer<typeof BlogOutputSchema>;

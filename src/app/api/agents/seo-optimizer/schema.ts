import { z } from "zod";

export const SEOOptimizerSchema = z.object({
  optimized_title: z.string().min(10, "Title too short"),
  meta_description: z.string()
    .min(40, "Meta description too short")
    .max(160, "Meta description too long"),
  slug: z.string()
    .min(5, "Slug too short")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, hyphen-separated"),
  final_hashtags: z.array(
    z.string().startsWith("#")
  ).min(3).max(5),

  seo_score: z.number().min(0).max(100).optional()
});

export type SEOOptimizerResult = z.infer<typeof SEOOptimizerSchema>;

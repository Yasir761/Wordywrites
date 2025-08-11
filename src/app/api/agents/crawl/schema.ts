import { z } from "zod";

// Crawl & Enhance result schema
export const CrawlEnhanceSchema = z.object({
  original: z.object({
    title: z.string(), // Original blog title
    content: z.string(), // Original blog content
    meta_description: z.string(), // Original meta description
    tone: z.string().optional(), // Detected tone (optional for original)
    voice: z.string().optional(), // Detected voice (optional for original)
    seo: z
      .object({
        optimized_title: z.string(), // AI-suggested optimized title
        meta_description: z.string(), // AI-suggested meta description
        slug: z.string(), // Suggested slug
        final_hashtags: z.array(z.string()) // Suggested hashtags
      })
      .optional(), // SEO data may not exist for original
    intent: z.string().optional() // Detected intent (optional for original)
  }),

  enhanced: z.object({
    title: z.string(), // Enhanced blog title (required)
    content: z.string(), // Enhanced blog content (required)
    meta_description: z.string(), // Enhanced meta description (required)
    tone: z.string(), // Final tone used (required)
    voice: z.string(), // Final voice used (required)
    seo: z.object({
      optimized_title: z.string(), // Final optimized title
      meta_description: z.string(), // Final optimized meta description
      slug: z.string(), // Final slug
      final_hashtags: z.array(z.string()) // Final hashtags
    }),
    intent: z.string() // Final intent (required)
  }),

  changes: z.object({
    title_changed: z.boolean(), // Indicates if title changed
    meta_changed: z.boolean(), // Indicates if meta description changed
    tone_changed: z.boolean(), // Indicates if tone changed
    word_count_diff: z.number(), // Difference in word count (enhanced - original)
    added_sections: z.array(z.string()), // Sections added in enhanced version
    removed_sections: z.array(z.string()), // Sections removed from original
    keywords_added: z.array(z.string()).optional(), // Keywords added (optional)
    seo_score_diff: z.number().optional(), // SEO improvement score (0-1, optional)
    summary: z.string() // Summary of key changes
  })
});

export type CrawlEnhanceResult = z.infer<typeof CrawlEnhanceSchema>;

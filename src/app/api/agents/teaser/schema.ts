import { z } from "zod";

export const GeneralTeaserSchema = z.object({
  teasers: z
    .array(
      z.string()
        .min(30, "Each teaser is too short")
        .max(600, "Each teaser is too long")
    )
    .min(1, "At least one teaser is required")
    .max(3, "A maximum of 3 teasers is allowed"),

  hashtags: z
    .array(
      z.string().regex(/^#[\w]+$/, "Invalid hashtag format")
    )
    .min(1, "At least one hashtag is required")
    .max(10, "A maximum of 10 hashtags is allowed"),

  engagementCTA: z
    .string()
    .min(10, "CTA is too short")
    .max(200, "CTA is too long"),
});

// Input type
export type GeneralTeaserInput = {
  title: string;
  content: string;
};

// Response type
export type GeneralTeaserResponse = z.infer<typeof GeneralTeaserSchema>;

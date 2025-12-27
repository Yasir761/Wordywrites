import { z } from "zod";

export const WordPressPostSchema = z.object({
  siteUrl: z
    .string(),
    // .url("Invalid site URL format. Must be a valid URL (e.g., http://test.localite.io)"),
  
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  applicationPassword: z
    .string()
    .min(10, "Application password must be at least 10 characters"),

  title: z
    .string()
    .min(5, "Title must be at least 5 characters"),

  content: z
    .string(),
    // .min(100, "Content must be at least 100 characters"),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug must be lowercase and use hyphens (e.g., my-blog-post)",
    })
    .optional(),

  meta_description: z
    .string()
    .max(160, "Meta description must be 160 characters or less")
    .optional(),

  //  Added support for tags and categories
  tags: z.array( z.string()).optional(),
  categories: z.array( z.string()).optional(),
});

export type WordPressPostInput = z.infer<typeof WordPressPostSchema>;

export interface WordPressPostResponse {
  id: number; // Unique ID of the post in WordPress
  date: string; // ISO date string of post creation (e.g., "2025-07-22T10:00:00")
  slug: string; // Slug used in the URL
  link: string; // Full public URL of the published blog post
  status: "publish" | "draft" | "pending" | "private"; // Status of the post

  title: {
    rendered: string; // The post title as HTML-safe string
  };

  content: {
    rendered: string; // The full blog content, possibly with HTML formatting
  };
}

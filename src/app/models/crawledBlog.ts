
import mongoose from "mongoose";

const CrawledBlogSchema = new mongoose.Schema({
  userId: String, // Optional, if using Clerk
  sourceUrl: String,
  title: String,
  original: {
    content: String,
    meta_description: String,
    tone: String,
    voice: String,
    intent: String,
    seo: Object,
  },
  enhanced: {
    content: String,
    meta_description: String,
    title: String,
    tone: String,
    voice: String,
    intent: String,
    seo: Object,
  },
  changes: Object,
  createdAt: { type: Date, default: Date.now }
});

export const CrawledBlogModel = mongoose.models.CrawledBlog || mongoose.model("CrawledBlog", CrawledBlogSchema);

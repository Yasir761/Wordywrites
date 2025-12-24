
import mongoose from "mongoose";

const ContentPreviewAgentSchema = new mongoose.Schema(
  {
    teasers: { type: [String], default: [] },
    hashtags: { type: [String], default: [] },
    engagementCTA: { type: String, default: "" },
  },
  { _id: false }
);

const BlogSchema = new mongoose.Schema({
  userId: { type: String, index: true },

  keywordAgent: {
    keyword: { type: String, required: true, index: true },
    intent: { type: String, required: true },
  },

  toneAgent: {
    tone: String,
    voice: String,
  },

  blueprintAgent: {
    outline: { type: [String], required: true },
  },

  seoAgent: {
    optimized_title: String,
    meta_description: String,
    slug: String,
    final_hashtags: [String],
    seo_score: { type: Number, min: 0, max: 100 },
  },

  //  STREAM-SAFE BLOG AGENT
  blogAgent: {
    blog: {
      type: String,
      default: "",
    },
    wordCount: {
      type: Number,
      default: 0,
    },
  },

  analyzeAgent: {
    top_keywords: [String],
    avg_word_count: Number,
    competitors: [String],
  },

  crawlAgent: {
    urls: [String],
    extracted_texts: [String],
  },

  ContentPreviewAgent: ContentPreviewAgentSchema,

  status: {
    type: String,
    enum: [
      "draft",
      "streaming",
      "generated",
      "completed",
      "published",
      "failed",
    ],
    default: "draft",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//  DEV-ONLY schema refresh
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Blog;
}

BlogSchema.index({ userId: 1, createdAt: -1 });
BlogSchema.index({ "keywordAgent.keyword": 1, createdAt: -1 });

export const BlogModel =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

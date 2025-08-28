import mongoose from "mongoose";



const ContentPreviewAgentSchema = new mongoose.Schema(
  {
    teasers: { type: [String], default: [] },
    hashtags: { type: [String], default: [] },
    engagementCTA: { type: String, default: "" },
  },
  { _id: false } // Prevents Mongoose from generating an _id for the subdocument
);




const BlogSchema = new mongoose.Schema({
  userId: { type: String, required: false },

  keywordAgent: {
    keyword: { type: String, required: true },
    intent: { type: String, required: true },
  },

  toneAgent: {
    tone: { type: String, required: false },
    voice: { type: String, required: false },
  },

  blueprintAgent: {
    outline: { type: [String], required: true },
  },

  seoAgent: {
    optimized_title: { type: String, required: false },
    meta_description: { type: String, required: false },
    slug: { type: String, required: false },
    final_hashtags: { type: [String], required: false },
    seo_score: { type: Number, min: 0, max: 100, required: false },
  },

  blogAgent: {
    blog: { type: String, required: true },
    keyword: { type: String },
    wordCount: { type: Number, required: true  },
  },

  analyzeAgent: {
    top_keywords: { type: [String] },
    avg_word_count: { type: Number },
    competitors: { type: [String] },
  },

  crawlAgent: {
    urls: { type: [String] },
    extracted_texts: { type: [String] },
  },

  // NEW: Teaser Agent
 ContentPreviewAgent: ContentPreviewAgentSchema,

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


delete mongoose.models.Blog;
export const BlogModel =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

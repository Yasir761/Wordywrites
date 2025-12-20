// import mongoose from "mongoose";



// const ContentPreviewAgentSchema = new mongoose.Schema(
//   {
//     teasers: { type: [String], default: [] },
//     hashtags: { type: [String], default: [] },
//     engagementCTA: { type: String, default: "" },
//   },
//   { _id: false } // Prevents Mongoose from generating an _id for the subdocument
// );




// const BlogSchema = new mongoose.Schema({
//   userId: { type: String, required: false, index:true },

//   keywordAgent: {
//     keyword: { type: String, required: true, index:true },
//     intent: { type: String, required: true },
//   },

//   toneAgent: {
//     tone: { type: String, required: false },
//     voice: { type: String, required: false },
//   },

//   blueprintAgent: {
//     outline: { type: [String], required: true },
//   },

//   seoAgent: {
//     optimized_title: { type: String, required: false },
//     meta_description: { type: String, required: false },
//     slug: { type: String, required: false },
//     final_hashtags: { type: [String], required: false },
//     seo_score: { type: Number, min: 0, max: 100, required: false },
//   },

//   blogAgent: {
//     blog: {
//     type: String,
//     required: false,
//     default: "",
//   },
//   },

//   analyzeAgent: {
//     top_keywords: { type: [String] },
//     avg_word_count: { type: Number },
//     competitors: { type: [String] },
//   },

//   crawlAgent: {
//     urls: { type: [String] },
//     extracted_texts: { type: [String] },
//   },

//   // NEW: Teaser Agent
//  ContentPreviewAgent: ContentPreviewAgentSchema,

//   status: {
//     type: String,
//      enum: [
//     "draft",        // created, not started
//     "streaming",    // blog streaming in progress
//     "generated",    // blog text complete
//     "completed",    // preview + metadata done
//     "published",    // user published
//     "failed",       // generation failed
//   ],
//     default: "draft",
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });



// if (process.env.NODE_ENV === "development") {
//   delete mongoose.models.Blog;
// }

// BlogSchema.index({ userId: 1, createdAt: -1 });
// BlogSchema.index({ "keywordAgent.keyword": 1, createdAt: -1 });
// export const BlogModel =
//   mongoose.models.Blog || mongoose.model("Blog", BlogSchema);







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

  // ✅ STREAM-SAFE BLOG AGENT
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

// 🔥 DEV-ONLY schema refresh
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Blog;
}

BlogSchema.index({ userId: 1, createdAt: -1 });
BlogSchema.index({ "keywordAgent.keyword": 1, createdAt: -1 });

export const BlogModel =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

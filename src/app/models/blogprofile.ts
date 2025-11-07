import mongoose from "mongoose";

const BlogProfileSchema = new mongoose.Schema({
  userId: { 
    type: String,
    ref: "User", 
    required: true, 
    index: true }, // link to User
  profileName: { type: String, required: true }, // e.g. "Marketing Blog"

  // WordPress connection
  siteUrl: { type: String, required: true },
  username: { type: String, required: true },
  appPassword: { type: String, required: true }, // 🔒 encrypt before saving

  // Blog identity
  blogName: { type: String, required: true },
  blogDescription: { type: String },
  authorName: { type: String },
  location: { type: String },

  // Target audience filters
  targetAudience: {
    age: { type: String },       // e.g. "18-35"
    gender: { type: String },    // e.g. "Male, Female, All"
    occupation: { type: String },// e.g. "Developers, Marketers"
    industry: { type: String },  // e.g. "Tech, Health, Finance"
    region: { type: String },    // e.g. "US, India, Europe"
  },

  // Plan limiting
  isDefault: { type: Boolean, default: false },

}, { timestamps: true });

export const BlogProfileModel = mongoose.models.BlogProfile || mongoose.model("BlogProfile", BlogProfileSchema);

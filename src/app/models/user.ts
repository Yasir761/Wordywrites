import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  plan: {
    type: String,
    enum: ['Free', 'Pro'],
    default: 'Free',
  },
  credits: { type: Number, default: 5 },
   blogsGeneratedThisMonth: { type: Number, default: 0 },
  lastBlogReset: { type: Date, default: Date.now },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

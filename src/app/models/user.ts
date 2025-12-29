import { Users } from "lucide-react";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index:true},
  email: { type: String, required: true, unique: true, index :true },
  plan: {
    type: String,
    enum: ['Free', 'Pro'],
    default: 'Free',
  },
  credits: { type: Number, default: 5 },
   blogsGeneratedThisMonth: { type: Number, default: 0 },
  lastBlogReset: { type: Date, default: Date.now },
   paddleCustomerId: { type: String, unique: true, sparse: true },
  
}, { timestamps: true });

UserSchema.index({ userId: 1, plan: 1 });
// UserSchema.index({ paddleSubscriptionId: 1 }, { unique: true, sparse: true });

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema, "users");

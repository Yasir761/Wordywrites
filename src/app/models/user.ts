import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  plan: {
    type: String,
    enum: ['Free', 'Starter', 'Pro'],
    default: 'Free',
  },
  credits: { type: Number, default: 3 },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

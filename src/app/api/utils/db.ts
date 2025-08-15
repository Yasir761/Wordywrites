
import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL as string;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    // console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

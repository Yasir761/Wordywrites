
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  plan: String,
  amount: Number,
  paddleEventId: { type: String, unique: true },
  orderId: String,
  createdAt: { type: Date, default: Date.now },
});

export const TransactionModel = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

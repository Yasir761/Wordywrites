
import { PLANS } from "@/app/constants/plans";
import { UserModel } from "@/app/models/user"; // or wherever you store user subscription

export const getUserPlan = async (userId: string) => {
  const user = await UserModel.findOne({ userId });

  const planName = (user?.plan || "Free") as keyof typeof PLANS; // fallback
  return PLANS[planName] || PLANS["Free"];
};

import { UserModel } from "@/app/models/user";
import { CREDIT_COST, CreditAction } from "@/app/constants/credits";

export async function consumeCredits(
  userId: string,
  action: CreditAction
) {
  const user = await UserModel.findOne({ userId });

  if (!user) {
    throw new Error("User not found");
  }

  // Pro users = unlimited
  if (user.plan === "Pro") {
    return {
      allowed: true,
      remainingCredits: Infinity,
    };
  }

  const cost = CREDIT_COST[action];

  if (user.credits < cost) {
    return {
      allowed: false,
      remainingCredits: user.credits,
      requiredCredits: cost,
    };
  }

  // Deduct credits
  user.credits -= cost;
  await user.save();

  return {
    allowed: true,
    remainingCredits: user.credits,
  };
}

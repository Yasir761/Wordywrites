
import { PLANS } from "@/app/constants/plans";
import { UserModel } from "@/app/models/user"; // or wherever you store user subscription




export async function getUserPlan(userId: string, email?: string) {
  let user = await UserModel.findOne({ $or: [{ userId }, { email }] });

  if (!user) {
    user = new UserModel({
      userId,
      email: email || "",
      plan: "Free",
      credits: 5,
      blogsGeneratedThisMonth: 0,
      lastBlogReset: new Date(),
    });
    await user.save();
  }

  const planName = user.plan as keyof typeof PLANS;
  return PLANS[planName];
}


import { PLANS } from "@/app/constants/plans";
import { UserModel } from "@/app/models/user"; // or wherever you store user subscription

// export const getUserPlan = async (userId: string) => {
//   const user = await UserModel.findOne({ userId });
//   console.log("User from DB:", user);

//   const planName = (user?.plan || "Free") as keyof typeof PLANS; // fallback
//    console.log("Resolved planName:", planName);
//    const plan = PLANS[planName] || PLANS["Free"];
//   console.log("Resolved plan object:", plan);
//   return plan;
// };



export const getUserPlan = async (userId: string) => {
  try {
    console.log("getUserPlan CALLED with userId:", userId);
    const user = await UserModel.findOne({ userId });
    console.log("User from DB:", user);

    const planName = (user?.plan || "Free") as keyof typeof PLANS;
    console.log("Resolved planName:", planName);

    const plan = PLANS[planName] || PLANS["Free"];
    console.log("Resolved plan object:", plan);

    return plan;
  } catch (err) {
    console.error("❌ getUserPlan error:", err);
    return PLANS["Free"];
  }
};

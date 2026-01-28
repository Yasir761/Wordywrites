

// import { NextRequest, NextResponse } from "next/server";
// import { orchestratorHandler } from "./handler";
// import { auth } from "@clerk/nextjs/server";
// import { UserModel } from "@/app/models/user";
// import { connectDB } from "../../utils/db";
// import * as Sentry from "@sentry/nextjs";



// export async function POST(req: NextRequest) {
//   return await Sentry.startSpan({ name: "Orchestrator API", op: "api.post" }, async () => {
//     try {
//       const { userId } = await auth();
//       if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//       Sentry.setUser({ id: userId });
//       await connectDB();

//       const body = await req.json();
//       const { keyword, crawlUrl } = body;

//       if (!keyword) {
//         return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
//       }

//       //  RUN ORCHESTRATOR (creates user if needed)
//       const result = await orchestratorHandler({ userId, keyword, crawlUrl });

//       if (!result || typeof result !== "object" || !("blogId" in result)) {
//         throw new Error("Orchestrator returned invalid result");
//       }

//       //  NOW GET REAL USER
//       const user = await UserModel.findOne({ userId });
//       if (!user) throw new Error("User creation failed");

//       //  CREDIT SYSTEM
//       let creditsLeft = user.credits;

//       if (user.plan === "Free") {
//         if (creditsLeft <= 0) {
//           return NextResponse.json(
//             { error: "You are out of free credits. Upgrade to continue." },
//             { status: 402 }
//           );
//         }

//         user.credits -= 1;
//         await user.save();
//         creditsLeft = user.credits;
//       }

//       //  RESPONSE
//       return NextResponse.json({
//         ...JSON.parse(JSON.stringify(result)),
//         remainingCredits: creditsLeft,
//       });

//     } catch (err) {
//       console.error("ORCHESTRATOR ROUTE ERROR:", err);
//   const message = err instanceof Error ? err.message : String(err);
//   return NextResponse.json({ error: message }, { status: 500 });
//     }
//   });
// }





import { NextRequest, NextResponse } from "next/server";
import { orchestratorHandler } from "./handler";
import { auth } from "@clerk/nextjs/server";
import { UserModel } from "@/app/models/user";
import { connectDB } from "../../utils/db";
import { getUserPlan } from "@/app/api/utils/planUtils";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  return await Sentry.startSpan({ name: "Orchestrator API", op: "api.post" }, async () => {
    try {
      const { userId } = await auth();
      if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      await connectDB();
      const { keyword, crawlUrl } = await req.json();
      if (!keyword) return NextResponse.json({ error: "Missing keyword" }, { status: 400 });

      //  GET OR CREATE USER
     let user = await UserModel.findOne({ userId });

if (!user) {
  return NextResponse.json(
    { error: "User sync failed. Try logging out and back in." },
    { status: 500 }
  );
}


      //  MONTHLY CREDIT RESET
const now = new Date();
const reset = new Date(user.lastBlogReset);

if (now.getMonth() !== reset.getMonth() || now.getFullYear() !== reset.getFullYear()) {
  user.credits = 5;
  user.lastBlogReset = now;
  await user.save();
}


      //  SYNC PLAN FROM BILLING
      const billingPlan = await getUserPlan(userId).catch(() => ({ name: "Free" }));

      if (user.plan !== billingPlan.name) {
        user.plan = billingPlan.name;
        await user.save();
      }

      //  CREDIT SYSTEM (BEFORE AI RUNS)
      let creditsLeft = user.credits;

      if (user.plan === "Free") {
        if (creditsLeft <= 0) {
          return NextResponse.json(
            { error: "You are out of free credits. Upgrade to continue." },
            { status: 402 }
          );
        }

        user.credits -= 1;
        await user.save();
        creditsLeft = user.credits;
      }

      //  RUN AI ORCHESTRATOR
      const result = await orchestratorHandler({ userId, keyword, crawlUrl });

      if (!result?.blogId) throw new Error("Orchestrator failed");

      return NextResponse.json({
        ...result,
        remainingCredits: creditsLeft,
      });

    } catch (err) {
      console.error("ORCHESTRATOR ROUTE ERROR:", err);
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}






// // Credit based version

// import { NextRequest, NextResponse } from "next/server";
// import { orchestratorHandler } from "@/app/api/agents/orchestrator/handler";
// import { UserModel } from "@/app/models/user";
// import * as Sentry from "@sentry/nextjs";
// import { connectDB } from "@/app/api/utils/db";
// export async function POST(req: NextRequest) {
//   return Sentry.startSpan({ name: "worker.orchestrator" }, async () => {
//     try {

//      await connectDB();
//       const body = await req.json();
//       const { userId, keyword } = body;

//       if (!userId || !keyword) {
//         return NextResponse.json(
//           { error: "Missing userId or keyword" },
//           { status: 400 }
//         );
//       }

//       //  Fetch user from DB
//       const user = await UserModel.findOne({ userId });

//       if (!user) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//       }

//       //  Credits check for Free plan
//       if (user.plan === "Free") {
//         if (user.credits <= 0) {
//           return NextResponse.json(
//             { error: "You are out of free credits. Upgrade to continue." },
//             { status: 402 }
//           );
//         }

//         // Deduct 1 credit BEFORE running the AI
//         user.credits -= 1;
//         await user.save();
//         console.log(` Deducted 1 credit → Remaining: ${user.credits}`);
//       }

//       //  Run orchestrator after credits OK
//       await orchestratorHandler(body);

//       return NextResponse.json({ success: true });
//     } catch (err: any) {
//       Sentry.captureException(err);
//       return NextResponse.json(
//         { error: err?.message || "Worker failed" },
//         { status: 500 }
//       );
//     }
//   });
// }







import { NextRequest, NextResponse } from "next/server";
import { orchestratorHandler } from "@/app/api/agents/orchestrator/handler";
import { UserModel } from "@/app/models/user";
import * as Sentry from "@sentry/nextjs";
import { connectDB } from "@/app/api/utils/db";


export async function POST(req: NextRequest) {
  return Sentry.startSpan({ name: "worker.orchestrator" }, async () => {
    try {
  
      await connectDB();
      const body = await req.json();
      const { userId, keyword, crawlUrl } = body;

      if (!userId || !keyword) {
        return NextResponse.json(
          { error: "Missing userId or keyword" },
          { status: 400 }
        );
      }

      //  Fetch user safely
      const user = await UserModel.findOne({ userId });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      //  Credit enforcement
      if (user.plan === "Free") {
        if (user.credits <= 0) {
          return NextResponse.json(
            { error: "You are out of free credits. Upgrade to continue." },
            { status: 402 }
          );
        }

        user.credits -= 1;
        await user.save();
      }

      //  Run orchestrator (FAIL HARD if it fails)
      await orchestratorHandler({ userId, keyword, crawlUrl });

      return NextResponse.json({ success: true });
    } catch (err: any) {
      Sentry.captureException(err);

      return NextResponse.json(
        { error: err?.message || "Worker failed" },
        { status: 500 }
      );
    }
  });
}

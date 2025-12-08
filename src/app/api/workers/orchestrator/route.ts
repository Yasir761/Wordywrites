
// import { NextRequest, NextResponse } from "next/server";
// import { orchestratorHandler } from "@/app/api/agents/orchestrator/handler";

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   console.log(" QStash triggered orchestrator for:", body.keyword);

//   try {
//     await orchestratorHandler(body);
//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     console.error(" Worker orchestrator failed:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }







// import { NextRequest, NextResponse } from "next/server";
// import { orchestratorHandler } from "@/app/api/agents/orchestrator/handler";
// import * as Sentry from "@sentry/nextjs";

// export async function POST(req: NextRequest) {
//   const span = Sentry.startSpan({ name: "worker.orchestrator" }, (s) => s);

//   try {
//     const body = await req.json();

//     Sentry.addBreadcrumb({
//       category: "orchestrator",
//       message: "QStash orchestrator triggered",
//       data: {
//         keyword: body?.keyword,
//         userId: body?.userId,
//         crawlUrl: body?.crawlUrl,
//       },
//       level: "info",
//     });

//     if (!body || !body.keyword || !body.userId) {
//       Sentry.captureMessage("Orchestrator missing required fields", "error");

//       return NextResponse.json(
//         { error: "Missing required fields: keyword or userId" },
//         { status: 400 }
//       );
//     }

//     // Call your actual orchestrator logic
//     await orchestratorHandler(body);

//     Sentry.addBreadcrumb({
//       category: "orchestrator",
//       message: "Orchestrator completed successfully",
//       data: {
//         keyword: body.keyword,
//         userId: body.userId,
//       },
//       level: "info",
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     Sentry.captureException(err, {
//       extra: {
//         location: "worker.orchestrator.POST",
//       },
//     });

//     console.error(" Worker orchestrator failed:", err);

//     return NextResponse.json(
//       { error: err?.message || "Worker failed" },
//       { status: 500 }
//     );
//   } finally {
//     span.end();
//   }
// }





// Credit based version

import { NextRequest, NextResponse } from "next/server";
import { orchestratorHandler } from "@/app/api/agents/orchestrator/handler";
import { UserModel } from "@/app/models/user";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  return Sentry.startSpan({ name: "worker.orchestrator" }, async () => {
    try {
      const body = await req.json();
      const { userId, keyword } = body;

      if (!userId || !keyword) {
        return NextResponse.json(
          { error: "Missing userId or keyword" },
          { status: 400 }
        );
      }

      //  Fetch user from DB
      const user = await UserModel.findOne({ userId });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      //  Credits check for Free plan
      if (user.plan === "Free") {
        if (user.credits <= 0) {
          return NextResponse.json(
            { error: "You are out of free credits. Upgrade to continue." },
            { status: 402 }
          );
        }

        // Deduct 1 credit BEFORE running the AI
        user.credits -= 1;
        await user.save();
        console.log(` Deducted 1 credit → Remaining: ${user.credits}`);
      }

      //  Run orchestrator after credits OK
      await orchestratorHandler(body);

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


// import { NextRequest, NextResponse } from "next/server";
// import { orchestratorHandler } from "./handler";
// import { auth } from "@clerk/nextjs/server";
// import { UserModel } from "@/app/models/user";
// import { connectDB } from "../../utils/db";
// import * as Sentry from "@sentry/nextjs";


// export async function POST(req: NextRequest) {
//   return await Sentry.startSpan(
//     { name: "Orchestrator API", op: "api.post" },
//     async () => {
//       try {
//         const { userId } = await auth();
//         Sentry.addBreadcrumb({
//   category: "auth",
//   message: "Auth result",
//   level: "info",
//   data: { userId },
// });

//         if (!userId) {
//           return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         Sentry.setUser({ id: userId });

//         await connectDB();

//         let body;
//         try {
//           body = await req.json();
//         } catch {
//           return NextResponse.json(
//             { error: "Invalid JSON body" },
//             { status: 400 }
//           );
//         }

//         const { keyword, crawlUrl } = body;

//         if (!keyword) {
//           return NextResponse.json(
//             { error: "Missing keyword" },
//             { status: 400 }
//           );
//         }

//         const user = await UserModel.findOne({ userId });
//         if (!user) {
//           return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         if (user.plan === "Free") {
//           if (user.credits <= 0) {
//             return NextResponse.json(
//               { error: "You are out of free credits. Upgrade to continue." },
//               { status: 402 }
//             );
//           }
//           user.credits -= 1;
//           await user.save();
//         }

//         const result = await orchestratorHandler({ userId, keyword, crawlUrl });

//         if (!result || typeof result !== "object" || !("blogId" in result)) {
//           throw new Error("Orchestrator returned invalid result");
//         }

//         Sentry.addBreadcrumb({
//           category: "orchestrator",
//           message: "Orchestrator completed successfully",
//           level: "info",
//           data: { keyword, blogId: result.blogId },
//         });

//         return NextResponse.json(
//           JSON.parse(JSON.stringify(result))
//         );
//       } catch (err) {
//         Sentry.captureException(err);
//         const message = err instanceof Error ? err.message : String(err);

//         return NextResponse.json(
//           { error: message || "Internal server error" },
//           { status: 500 }
//         );
//       }
//     }
//   );
// }







import { NextRequest, NextResponse } from "next/server";
import { orchestratorHandler } from "./handler";
import { auth } from "@clerk/nextjs/server";
import { UserModel } from "@/app/models/user";
import { connectDB } from "../../utils/db";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "api.orchestrator", op: "http.server" },
    async (span) => {
      try {
        // ---------- AUTH ----------
        const { userId } = await auth();

        Sentry.addBreadcrumb({
          category: "auth",
          message: "Auth resolved",
          level: "info",
          data: { userId },
        });

        if (!userId) {
          Sentry.captureMessage("Unauthorized orchestrator access", {
            level: "warning",
          });
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        Sentry.setUser({ id: userId });

        // ---------- DB ----------
        await Sentry.startSpan(
          { name: "db.connect", op: "db" },
          async () => {
            await connectDB();
          }
        );

        // ---------- BODY ----------
        let body: any;
        try {
          body = await req.json();
        } catch (err) {
          Sentry.captureMessage("Invalid JSON body", {
            level: "warning",
          });
          return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
          );
        }

        const { keyword, crawlUrl } = body;

        Sentry.addBreadcrumb({
          category: "request",
          message: "Parsed request body",
          level: "info",
          data: { keyword, crawlUrlPresent: !!crawlUrl },
        });

        if (!keyword) {
          return NextResponse.json(
            { error: "Missing keyword" },
            { status: 400 }
          );
        }

        // ---------- USER ----------
        const user = await UserModel.findOne({ userId }).lean();

        Sentry.addBreadcrumb({
          category: "db.user",
          message: "User lookup result",
          level: "info",
          data: {
            found: !!user,
            plan: user?.plan,
            credits: user?.credits,
          },
        });

        if (!user) {
          Sentry.captureMessage("User not found in orchestrator", {
            level: "error",
            extra: { userId },
          });
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ---------- CREDITS ----------
        if (user.plan === "Free") {
          if (user.credits <= 0) {
            Sentry.captureMessage("Out of credits", {
              level: "warning",
              extra: { userId },
            });
            return NextResponse.json(
              { error: "You are out of free credits. Upgrade to continue." },
              { status: 402 }
            );
          }

          await UserModel.updateOne(
            { userId },
            { $inc: { credits: -1 } }
          );

          Sentry.addBreadcrumb({
            category: "billing",
            message: "Free credit deducted",
            level: "info",
            data: { remainingCredits: user.credits - 1 },
          });
        }

        // ---------- ORCHESTRATOR ----------
        const result = await Sentry.startSpan(
          { name: "orchestrator.execute", op: "ai.pipeline" },
          async () => {
            return orchestratorHandler({ userId, keyword, crawlUrl });
          }
        );

        if (!result || typeof result !== "object" || !("blogId" in result)) {
          throw new Error("Orchestrator returned invalid result");
        }

        Sentry.addBreadcrumb({
          category: "orchestrator",
          message: "Orchestrator completed",
          level: "info",
          data: {
            blogId: result.blogId,
            keyword,
          },
        });

        span.setStatus({ code: 1 }); // OK
        return NextResponse.json(
          JSON.parse(JSON.stringify(result))
        );
      } catch (err) {
        Sentry.captureException(err);
        span.setStatus({ code: 2 }); // ERROR

        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
          { error: message || "Internal server error" },
          { status: 500 }
        );
      }
    }
  );
}

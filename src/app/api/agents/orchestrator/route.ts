
import { NextRequest, NextResponse } from "next/server";
import { orchestratorHandler } from "./handler";
import { auth } from "@clerk/nextjs/server";
import { UserModel } from "@/app/models/user";
import { connectDB } from "../../utils/db";
import * as Sentry from "@sentry/nextjs";


export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "Orchestrator API", op: "api.post" },
    async () => {
      try {
        const { userId } = await auth();

        if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        Sentry.setUser({ id: userId });

        await connectDB();

        let body;
        try {
          body = await req.json();
        } catch {
          return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
          );
        }

        const { keyword, crawlUrl } = body;

        if (!keyword) {
          return NextResponse.json(
            { error: "Missing keyword" },
            { status: 400 }
          );
        }

        const user = await UserModel.findOne({ userId });
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

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

        const result = await orchestratorHandler({ userId, keyword, crawlUrl });

        if (!result || typeof result !== "object" || !("blogId" in result)) {
          throw new Error("Orchestrator returned invalid result");
        }

        Sentry.addBreadcrumb({
          category: "orchestrator",
          message: "Orchestrator completed successfully",
          level: "info",
          data: { keyword, blogId: result.blogId },
        });

        return NextResponse.json(
          JSON.parse(JSON.stringify(result))
        );
      } catch (err) {
        Sentry.captureException(err);
        const message = err instanceof Error ? err.message : String(err);

        return NextResponse.json(
          { error: message || "Internal server error" },
          { status: 500 }
        );
      }
    }
  );
}

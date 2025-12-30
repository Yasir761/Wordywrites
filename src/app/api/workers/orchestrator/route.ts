
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

      // Fetch user
      const user = await UserModel.findOne({ userId });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

     

      // Run orchestrator
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

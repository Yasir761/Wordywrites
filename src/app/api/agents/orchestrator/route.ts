
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { Client } from "@upstash/qstash";

// const client = new Client({ token: process.env.QSTASH_TOKEN! });

// export async function POST(req: NextRequest) {
//   const { userId } = await auth();
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { keyword, crawlUrl } = await req.json();

//   const result = await client.publishJSON({
//     url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workers/orchestrator`,
//     body: { userId, keyword, crawlUrl },
//     retries: 1,
//   });

//   console.log(" Orchestrator job queued:", result.messageId);
//   return NextResponse.json({ queued: true, jobId: result.messageId });
// }



import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Client } from "@upstash/qstash";
import * as Sentry from "@sentry/nextjs";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: NextRequest) {
  return await Sentry.startSpan(
    { name: "Orchestrator Trigger API", op: "api.post" },
    async () => {
      try {
        const { userId } = await auth();

        if (userId) Sentry.setUser({ id: userId });
        Sentry.setTag("queue", "qstash");
        Sentry.addBreadcrumb({
          category: "auth",
          message: "User authenticated for Orchestrator queue",
          level: "info",
          data: { userId },
        });

        if (!userId) {
          Sentry.captureMessage("Unauthorized orchestrator request", {
            level: "warning",
          });
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
        }

        const { keyword, crawlUrl } = await req.json();
        Sentry.addBreadcrumb({
          category: "orchestrator",
          message: "Queue job payload received",
          level: "info",
          data: { keyword, hasCrawlUrl: !!crawlUrl },
        });

        const job = await client.publishJSON({
          url: `${process.env.APP_URL}/api/workers/orchestrator`,
          body: { userId, keyword, crawlUrl },
          retries: 1,
        });

        Sentry.addBreadcrumb({
          category: "qstash",
          message: "QStash job queued",
          level: "info",
          data: { messageId: job.messageId },
        });

        return NextResponse.json({
          queued: true,
          jobId: job.messageId,
        });
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

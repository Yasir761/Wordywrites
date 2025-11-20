
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







import { NextRequest, NextResponse } from "next/server";
import { orchestratorHandler } from "@/app/api/agents/orchestrator/handler";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  const span = Sentry.startSpan({ name: "worker.orchestrator" }, (s) => s);

  try {
    const body = await req.json();

    Sentry.addBreadcrumb({
      category: "orchestrator",
      message: "QStash orchestrator triggered",
      data: {
        keyword: body?.keyword,
        userId: body?.userId,
        crawlUrl: body?.crawlUrl,
      },
      level: "info",
    });

    if (!body || !body.keyword || !body.userId) {
      Sentry.captureMessage("Orchestrator missing required fields", "error");

      return NextResponse.json(
        { error: "Missing required fields: keyword or userId" },
        { status: 400 }
      );
    }

    // Call your actual orchestrator logic
    await orchestratorHandler(body);

    Sentry.addBreadcrumb({
      category: "orchestrator",
      message: "Orchestrator completed successfully",
      data: {
        keyword: body.keyword,
        userId: body.userId,
      },
      level: "info",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    Sentry.captureException(err, {
      extra: {
        location: "worker.orchestrator.POST",
      },
    });

    console.error(" Worker orchestrator failed:", err);

    return NextResponse.json(
      { error: err?.message || "Worker failed" },
      { status: 500 }
    );
  } finally {
    span.end();
  }
}

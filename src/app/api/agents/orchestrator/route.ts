
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { keyword, crawlUrl } = await req.json();

  const result = await client.publishJSON({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workers/orchestrator`,
    body: { userId, keyword, crawlUrl },
    retries: 1,
  });

  console.log(" Orchestrator job queued:", result.messageId);
  return NextResponse.json({ queued: true, jobId: result.messageId });
}




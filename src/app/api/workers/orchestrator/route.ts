
import { NextRequest, NextResponse } from "next/server";
import { orchestratorHandler } from "@/app/api/agents/orchestrator/handler";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(" QStash triggered orchestrator for:", body.keyword);

  try {
    await orchestratorHandler(body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(" Worker orchestrator failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

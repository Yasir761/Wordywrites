
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  console.time("PING");
  await redis.ping();
  console.timeEnd("PING");
  console.time("GET");
  await redis.get("test-key");
  console.timeEnd("GET");
  return NextResponse.json({ ok: true });
}

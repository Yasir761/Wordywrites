import { redis } from "@/lib/redis";

export async function GET() {
  await redis.set("hello", "world");
  const value = await redis.get("hello");
  return Response.json({ value });
}


// this is for testing and can be deleted later 
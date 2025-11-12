import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

/**
 * Batch Redis MGET - fetch multiple cached agents at once.
 * @param keys string[] - cache keys
 */
export async function batchGet(keys: string[]) {
  if (!keys.length) return [];
  const results = await redis.mget(...keys);
  return results.map((res:any) => (res ? JSON.parse(res) : null));
}

/**
 * Batch Redis pipeline SETs - store multiple agent results in one go.
 * @param entries Array<[key, value, ttl]>
 */
export async function batchSet(entries: Array<[string, any, number]>) {
  if (!entries.length) return;
  const pipeline = redis.pipeline();
  for (const [key, value, ttl] of entries) {
    pipeline.set(key, JSON.stringify(value), { ex: ttl });
  }
  await pipeline.exec();
}

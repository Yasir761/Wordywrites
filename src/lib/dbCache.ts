import { redis } from "@/lib/redis";

type QueryFn<T> = () => Promise<T>;

export async function cachedQuery<T>(
  key: string,
  queryFn: QueryFn<T>,
  ttlSeconds = 60 * 5 // 5 minutes default
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    console.log(`DB CACHE HIT → ${key}`);
    const cachedStr = typeof cached === "string" ? cached : JSON.stringify(cached);
    return JSON.parse(cachedStr) as T;
  }

  console.log(` DB CACHE MISS → ${key}`);
  const result = await queryFn();
  await redis.set(key, JSON.stringify(result), { ex: ttlSeconds });
  return result;
}

export async function invalidateQueryCache(prefix: string) {
  const keys = await redis.keys(`${prefix}*`);
  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(` Cleared ${keys.length} cache keys for prefix: ${prefix}`);
  }
}


import { redis } from "./redis";

type GeneratorFn<T> = () => Promise<T>;

export async function cachedAgent<T>(
  key: string,
  generatorFn: GeneratorFn<T>,
  ttlSeconds = 60 * 60 * 6 // default 6 hours
): Promise<T> {
  // Try to read
  const raw  = await redis.get(key);
  if (raw) {
    try {
      if (typeof raw === "string") {
        return JSON.parse(raw) as T;
      } else {
        // If redis returned a non-string (some clients may return objects/buffers),
        // treat it as already-parsed and return it.
        return raw as unknown as T;
      }
    } catch (err) {
      // fallback: return raw as unknown
      // continue to regenerate if parse fails
      console.warn("Cache parse failed for", key, err);
    }
  }

  // Miss -> generate
  const result = await generatorFn();

  try {
    await redis.set(key, JSON.stringify(result), { ex: ttlSeconds });
    // add to a master set so we can clean up keys by suffix/prefix later
    // NOTE: keep this set trimmed in high volume systems (rotate or TTL store)
    await redis.sadd("wordywrites:cached_keys", key);
  } catch (err) {
    console.warn("Failed setting cache for", key, err);
  }

  return result;
}

// delete one cache key (and remove from bookkeeping set)
export async function deleteCacheKey(key: string) {
  await Promise.all([redis.del(key), redis.srem("wordywrites:cached_keys", key)]);
}

// find keys by prefix using the bookkeeping set
export async function keysByPrefix(prefix: string) {
  const all = await redis.smembers("wordywrites:cached_keys");
  return all.filter((k) => k.startsWith(prefix));
}

// delete keys by prefix
export async function deleteByPrefix(prefix: string) {
  const keys = await keysByPrefix(prefix);
  if (keys.length === 0) return 0;
  await redis.del(...keys);
  await redis.srem("wordywrites:cached_keys", ...keys);
  return keys.length;
}

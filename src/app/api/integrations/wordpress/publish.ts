

import { WordPressPostInput } from "./schema";
import { getWordPressAuthToken } from "./auth";
import { WordPressPostResponse } from "./types";


 //  SAFE FETCH (prevents ECONNRESET)

async function safeFetch(
  url: string,
  options: RequestInit,
  timeoutMs = 12_000
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      keepalive: false, //  critical for WP + Undici
    });
  } finally {
    clearTimeout(timer);
  }
}


  // SIMPLE KEYWORD EXTRACTION (LIMITED)

function extractKeywords(text: string, limit = 4): string[] {
  const stopwords = new Set([
    "the","is","and","to","in","of","a","for","on","with","as","by","this","that",
    "from","at","an","be","are","was","it","or","can","will","how","what","when"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopwords.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}


 //  SAFE TERM CREATION (NO CRASHES)

async function ensureTerms(
  siteUrl: string,
  authHeader: string,
  names: string[] = [],
  type: "tags" | "categories"
): Promise<number[]> {
  const ids: number[] = [];
  const BASE = siteUrl.replace(/\/$/, "");

  //  Hard limits to avoid WP overload
  const SAFE_LIMIT = type === "tags" ? 4 : 2;
  const safeNames = names.slice(0, SAFE_LIMIT);

  for (const name of safeNames) {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    try {
      //  Check existing
      const checkRes = await safeFetch(
        `${BASE}/wp-json/wp/v2/${type}?slug=${slug}`,
        { headers: { Authorization: authHeader } }
      );

      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        ids.push(existing[0].id);
        continue;
      }

      //  Create
      const createRes = await safeFetch(
        `${BASE}/wp-json/wp/v2/${type}`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!createRes.ok) continue;

      const created = await createRes.json();
      if (created?.id) ids.push(created.id);
    } catch {
      //  Never block publishing because of tags
      continue;
    }
  }

  return ids;
}


 //  MAIN PUBLISH FUNCTION

export async function publishBlogToWordPress(
  data: WordPressPostInput,
  publishNow: boolean = false
): Promise<WordPressPostResponse> {
  const {
    siteUrl,
    username,
    applicationPassword,
    title,
    content,
    slug,
    meta_description,
    tags,
    categories,
  } = data;

  if (!siteUrl || !username || !applicationPassword || !title || !content) {
    throw new Error("Missing required fields for publishing");
  }

  const endpoint = `${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts`;
  const authHeader = getWordPressAuthToken(username, applicationPassword);

  const requestBody: any = {
    title,
    content,
  status: publishNow ? "publish" : "draft",
    excerpt: meta_description || "",
    slug: slug
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""),
  };

  //  Tags
  const finalTags =
    Array.isArray(tags) && tags.length > 0
      ? tags
      : extractKeywords(content);

  if (finalTags.length > 0) {
    requestBody.tags = await ensureTerms(
      siteUrl,
      authHeader,
      finalTags,
      "tags"
    );
  }

  //  Categories
  if (Array.isArray(categories) && categories.length > 0) {
    requestBody.categories = await ensureTerms(
      siteUrl,
      authHeader,
      categories,
      "categories"
    );
  }

  //  Publish
  const res = await safeFetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `Failed to publish post: ${res.status} ${res.statusText} — ${text}`
    );
  }

  return JSON.parse(text) as WordPressPostResponse;
}

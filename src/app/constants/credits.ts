export const CREDIT_COST = {
  BLOG_GENERATE: 1,
  BLOG_REGENERATE: 1,
  BLOG_PUBLISH_WORDPRESS: 1,
  BLOG_CRAWL: 2,
  BLOG_ENHANCE: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COST;

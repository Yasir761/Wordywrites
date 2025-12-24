export const PLANS = {
  Free: {
    name: "Free",
    price: 0,
    monthlyCredits: 5,

    //  Everything enabled
    aiAgents: [
      "keyword",
      "blueprint",
      "tone",
      "seo",
      "hashtags",
      "blog",
      "analyze",
      "contentpreview",
      "crawl",
    ],

    integrations: ["wordpress"],

    features: ["All features unlocked (credit-based)"],

    maxProfiles: 3, // reasonable free limit
  },

  Pro: {
    name: "Pro",
    price: 9.99,
    monthlyCredits: Infinity,

    aiAgents: [
      "keyword",
      "blueprint",
      "tone",
      "seo",
      "hashtags",
      "blog",
      "analyze",
      "contentpreview",
      "crawl",
    ],

    integrations: ["wordpress"],

    features: [
      "Unlimited credits",
      "Unlimited blog profiles",
      "Priority processing",
    ],

    maxProfiles: Infinity,
  },
};










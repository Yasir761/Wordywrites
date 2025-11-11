export const PLANS = {
  Free: {
    name: "Free",
    price: 0,
    monthlyCredits: 5,
    aiAgents: [ "keyword","blog", "blueprint" ],
    integrations: [],
    features: ["Basic blog generation"],
    maxProfiles: 0, //  Free users get only 1 profile
  },
  // Starter: {
  //   name: "Starter",
  //   price: 7.99,
  //   monthlyCredits: 25,
  //   aiAgents: ["keyword", "blueprint", "tone", "seo", "hashtags", "blog", "teaser"],
  //   integrations: ["googleDocs", "linkedin"],
  //   features: ["Advanced blog", "Tone/Voice", "SEO Optimization", "Google Docs export", "LinkedIn publish"],
  // },
  Pro: {
    name: "Pro",
    price: 9.99,
    monthlyCredits: Infinity,
    aiAgents: ["keyword", "blueprint", "tone", "seo", "hashtags", "blog", "analyze", "contentpreview", "crawl"],
    integrations: ["wordpress"],
    features: ["Everything Unlimited", "All integrations", "Crawl competitor blogs"],
    maxProfiles: Infinity, 

  },


};












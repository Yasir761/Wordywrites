export const PLANS = {
  Free: {
    name: "Free",
    price: 0,
    monthlyCredits: 5,
    aiAgents: [ "keyword","blog", "blueprint" ],
    integrations: [],
    features: ["Basic blog generation"],
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
    aiAgents: ["keyword", "blueprint", "tone", "seo", "hashtags", "blog", "analyze", "teaser", "crawl"],
    integrations: ["googleDocs", "linkedin", "wordpress", "x", "repurposeKit"],
    features: ["Everything Unlimited", "All integrations", "Crawl competitor blogs"],
  },


};



export const LEMON_VARIANTS = {
  FREE: "951873", 
  PRO: "951884",
};




// plans =609841



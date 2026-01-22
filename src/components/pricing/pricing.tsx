
"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useAuth } from "@clerk/nextjs";

const PRO_PRICE_ID = "pri_01k3amkh5jpxnsb12by5ae99fw";

const freeFeatures = [
  {
    title: "5 free credits",
    desc: "Try Wordywrites with 5 free blog credits.",
  },
  {
    title: "Basic blog writer",
    desc: "Generate blog content with essential AI writing.",
  },
  {
    title: "SEO outline",
    desc: "Create structured outlines optimized for SEO.",
  },
  {
    title: "Tone & style settings",
    desc: "Basic tone customization for your writing.",
  },
  {
    title: "WordPress publishing",
    desc: "Publish directly to WordPress from the app.",
  },
];

const proFeatures = [
  {
    title: "Unlimited blog generation",
    desc: "Generate as many blogs as you want.",
  },
  {
    title: "Keyword research + intent",
    desc: "Find high-intent keywords for your niche.",
  },
  {
    title: "Advanced outline generator",
    desc: "Detailed blueprint with headings and structure.",
  },
  {
    title: "SEO optimization",
    desc: "Improve titles, headings & on-page SEO automatically.",
  },
  {
    title: "Tone & audience control",
    desc: "Adapt tone for casual, professional, and more.",
  },
  {
    title: "Hashtags + social snippets",
    desc: "Generate hashtags and promotion-ready snippets.",
  },
  {
    title: "Competitor / SERP analysis",
    desc: "Understand what’s ranking and why.",
  },
  {
    title: "Crawl your WordPress blog",
    desc: "Analyze your existing posts & learn your style.",
  },
  {
    title: "1-click WordPress publishing",
    desc: "Publish blogs instantly with formatting ready.",
  },
  {
    title: "Copy-ready export for Medium",
    desc: "Fast repurpose workflow for Medium publishing.",
  },
];

export default function Pricing() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [localPrice, setLocalPrice] = useState<string>("$9.99");
  const { isSignedIn } = useAuth();

  // Fetch Paddle localized price
  useEffect(() => {
    async function getPrice() {
      try {
        const res = await fetch(`/api/paddle/price?priceId=${PRO_PRICE_ID}`);
        const data = await res.json();
        if (data?.formatted) {
          setLocalPrice(`${data.formatted}`);
        }
      } catch (e) {
        console.error("Price fetch failed", e);
      }
    }
    getPrice();
  }, []);

  // Initialize Paddle
  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle);
  }, []);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(
        "/pricing?plan=pro",
      )}`;
      return;
    }
    if (!paddle) {
      alert("Paddle not initialized");
      return;
    }

    const planRes = await fetch("/api/user/plan");
    const planData = await planRes.json();

    if (planData.plan === "Pro") {
      alert("You already have an active Pro subscription.");
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: PRO_PRICE_ID }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert("Payment failed, try again");
      return;
    }

    window.location.href = data.checkoutUrl;
  };

  return (
    <section
      className="py-24 sm:py-32 scroll-mt-28 bg-gradient-to-b from-white via-indigo-50/20 to-white"
      id="pricing"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14 sm:mb-16">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Pricing
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 font-heading">
          Simple, creator-friendly pricing
        </h2>
        <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          No hidden fees. Upgrade when you are ready. Your first 5 blogs are
          free to publish.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
       

{/* FREE PLAN */}
<div className="relative rounded-3xl border border-gray-200/70 bg-white/80 backdrop-blur-sm p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
  <div className="flex items-center justify-between gap-3">
    <div className="text-left">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
        Free
      </h3>
      <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
        Best for trying Wordywrites
      </p>
    </div>
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
      No card needed
    </span>
  </div>

  <div className="mt-4">
  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
    Free Trial
  </div>
  <p className="mt-1 text-xs sm:text-sm text-gray-500">
    Includes 5 credits
  </p>
</div>

  <p className="mt-3 text-sm text-gray-600">
    Perfect for exploring the workflow and shipping your first posts.
  </p>

 <ul className="mt-6 space-y-4 text-left text-sm flex-1">
  {freeFeatures.map((feature) => (
    <li key={feature.title} className="flex items-start gap-3 text-gray-700">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50">
        <Check className="h-3.5 w-3.5 text-green-600" />
      </span>

      <div className="leading-snug">
        <p className="font-medium text-gray-900">{feature.title}</p>
        <p className="text-xs text-gray-500">{feature.desc}</p>
      </div>
    </li>
  ))}
</ul>




  <Button
    className="mt-6 w-full rounded-full text-sm font-semibold"
    variant="outline"
    onClick={() =>
      isSignedIn
        ? (window.location.href = "/dashboard")
        : (window.location.href = "/sign-up")
    }
  >
    Start for Free
  </Button>
</div>

        {/* PRO PLAN */}
        <div className="relative rounded-3xl border border-indigo-500/70 bg-gradient-to-b from-indigo-600 to-indigo-700 p-[1px] shadow-md shadow-indigo-200/80">
          <div className="h-full rounded-3xl bg-white/95 p-6 sm:p-7 flex flex-col">
            <div className="absolute -top-3 right-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
              Most Popular
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Pro
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-indigo-500">
                  For active bloggers & teams
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                Localized pricing
              </span>
            </div>

            <div className="mt-4 flex items-end gap-2">
  <span className="text-4xl font-bold">{localPrice}</span>
  <span className="text-sm text-gray-500 mb-1">/month</span>
</div>

            <p className="mt-3 text-sm text-gray-600">
              Unlock all premium features, unlimited blog generation, and direct publishing workflows
            </p>

            <ul className="mt-6 space-y-4 text-left text-sm flex-1">
              {proFeatures.map((feature) => (
                <li
                  key={feature.title}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50">

                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </span>
                  <div className="leading-snug">
                    <p className="font-medium text-gray-900">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleCheckout}
            >
              Go Pro
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs sm:text-sm text-gray-500 px-4">
        Prices are shown in your local currency at checkout. You can cancel
        anytime with one click from your account settings.
      </p>
    </section>
  );
}

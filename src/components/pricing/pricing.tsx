
"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useAuth } from "@clerk/nextjs";

const PRO_PRICE_ID = "pri_01k3amkh5jpxnsb12by5ae99fw";

const freeFeatures = [
  'Try Wordywrites with 5 free credits. Upgrade anytime for unlimited writing.',
  "Access to basic AI writing agent for blog creation.",
  "Publish directly to WordPress with our integration.",
  "Generate SEO-optimized content outlines.",
  "Basic tone and style customization options.",];

const proFeatures = [
  "Unlimited Blog Writing",
  "Keyword Agent",
  "Outline Agent",
  "SEO Agent",
  "Tone Agent",
  "Hashtag Agent",
  "Analyze Agent",
  "Crawl Agent",
  "Publish to WordPress",
  "Copy for Medium",
];

export default function Pricing() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [localPrice, setLocalPrice] = useState<string>("$9.99/mo");
  const { isSignedIn } = useAuth();

  // Fetch Paddle localized price
  useEffect(() => {
    async function getPrice() {
      try {
        const res = await fetch(`/api/paddle/price?priceId=${PRO_PRICE_ID}`);
        const data = await res.json();
        if (data?.formatted) {
          setLocalPrice(`${data.formatted}/mo`);
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

  <ul className="mt-6 space-y-3 text-left text-sm flex-1">
    {freeFeatures.map((feature) => (
      <li
        key={feature}
        className="flex items-center gap-2 text-gray-700"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50">
          <Check className="h-3.5 w-3.5 text-green-600" />
        </span>
        {feature}
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

            <div className="mt-4 flex items-baseline gap-1 text-gray-900">
              <span className="text-3xl sm:text-4xl font-bold">
                {localPrice}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Unlock every AI agent, unlimited blogs, and direct publishing
              workflows.
            </p>

            <ul className="mt-6 space-y-3 text-left text-sm flex-1">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </span>
                  {feature}
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

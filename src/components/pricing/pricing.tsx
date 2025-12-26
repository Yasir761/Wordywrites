

"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useAuth } from "@clerk/nextjs";

const PRO_PRICE_ID = "pri_01k3amkh5jpxnsb12by5ae99fw"; 

export default function Pricing() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [localPrice, setLocalPrice] = useState<string>("$9.99/mo");
  const { isSignedIn } = useAuth();

  //  Fetch Paddle localized price
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
    window.location.href = `/sign-in?redirect_url=${encodeURIComponent("/pricing?plan=pro")}`;
    return;
  }
  if (!paddle) return alert("Paddle not initialized");

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
  if (!res.ok) return alert("Payment failed, try again");

  window.location.href = data.checkoutUrl;
};

  return (
    <section className="py-24 scroll-mt-28" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-gray-600 text-base sm:text-lg">
          No hidden fees. No credit card required for Free plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 sm:px-6">
        {/* FREE PLAN */}
        <div className="relative rounded-3xl p-6 border shadow-sm hover:shadow-md border-gray-200">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-1 text-3xl font-bold">$0</p>
          <p className="mt-2 text-gray-600 text-sm">
            Perfect for testing Wordywrites.
          </p>

          <ul className="mt-6 space-y-3 text-left text-sm">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Keyword Agent</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Outline Agent</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> 5 Blogs / month</li>
          </ul>

          <Button
            className="mt-6 w-full"
            onClick={() =>
              isSignedIn ? (window.location.href = "/dashboard") : (window.location.href = "/sign-up")
            }
          >
            Start for Free
          </Button>
        </div>

        {/* PRO PLAN */}
        <div className="relative rounded-3xl p-6 border shadow-md border-indigo-500 ring-2 ring-indigo-300">
          <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
            Most Popular
          </div>

          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-1 text-3xl font-bold">{localPrice}</p> {/*  GEOPRICING HERE */}
          <p className="mt-2 text-gray-600 text-sm">
            Everything you need to blog better.
          </p>

          <ul className="mt-6 space-y-3 text-left text-sm">
            {[
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
            ].map((f, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" /> {f}
              </li>
            ))}
          </ul>

          <Button className="mt-6 w-full" onClick={handleCheckout}>
            Go Pro
          </Button>
        </div>
      </div>
    </section>
  );
}

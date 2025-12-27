
"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Check, Loader2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRO_PRICE_ID = "pri_01k3amkh5jpxnsb12by5ae99fw";

export default function CheckoutPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [paddle, setPaddle] = useState<Paddle>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localPrice, setLocalPrice] = useState<string>("$9.99/mo"); // default

  // Fetch localized price
  useEffect(() => {
    async function fetchPrice() {
      const res = await fetch(`/api/paddle/price?priceId=${PRO_PRICE_ID}`);
      const data = await res.json();
      if (data?.formatted) setLocalPrice(`${data.formatted}/mo`);
    }
    fetchPrice();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/checkout?plan=pro");
    }
  }, [isSignedIn, router]);

  // Initialize Paddle
  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle);
  }, []);

  const handlePayment = async () => {
    if (!paddle) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: PRO_PRICE_ID }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      window.location.href = data.checkoutUrl;
    } catch (err) {
      alert("Payment failed — try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow bg-card border border-border">

        {/* LEFT — Plan & Payment */}
        <div className="p-12 space-y-8">
          <h1 className="text-4xl font-semibold">Checkout</h1>
          <p className="text-muted-foreground">Upgrade to unlock all AI agents</p>

          <div className="bg-secondary rounded-2xl p-6 border">
            <span className="px-3 py-1 text-xs bg-ai-accent/10 text-ai-accent font-semibold rounded-full">
              Most Popular
            </span>
            <h2 className="text-2xl font-bold mt-4">Pro Plan</h2>

            {/* LOCALIZED PRICE HERE */}
            <p className="text-xl font-semibold mt-2">{localPrice}</p>
            <p className="text-sm text-muted-foreground">Monthly subscription</p>
          </div>

          {/* User email */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Account Email</p>
            <p className="text-lg font-medium">{user?.emailAddresses[0].emailAddress}</p>
          </div>

          <Button
            className="w-full h-14 text-lg font-semibold bg-ai-accent hover:bg-ai-accent/90"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Redirecting…
              </span>
            ) : (
              "Continue to Secure Payment"
            )}
          </Button>

          <div className="space-y-3 mt-8">
            {[
              "Unlimited AI Blog Writing",
              "SEO Optimization Agent",
              "Outline + Tone + Hashtags Agents",
              "Analyze & Crawl Agents",
              "Publish to WordPress",
              "Copy for Medium & LinkedIn",
            ].map((feat, i) => (
              <p key={i} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-ai-accent" /> {feat}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="bg-ai-accent/10 dark:bg-ai-accent/20 p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ai-accent" /> Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{localPrice}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-5 flex justify-between text-lg font-semibold">
              <span>Total Due Today</span>
              <span>{localPrice}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-8">
            <Shield className="w-4 h-4 text-ai-accent" /> Secured payment — cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
}

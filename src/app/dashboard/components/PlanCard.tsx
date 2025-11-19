
"use client";

import { IconLock } from "@tabler/icons-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useUserPlan } from "@/hooks/useUserPlan"; 
import { useState, useEffect } from "react";

export default function UserPlanCard() {
  const { data, error, isLoading } = useUserPlan();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [paddle, setPaddle] = useState<Paddle>();

  // Initialize Paddle
  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle);
  }, []);

  const handleUpgrade = async () => {
    setUpgradeLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "pri_01k3amkh5jpxnsb12by5ae99fw" }),
    });

    const json = await res.json();

    if (json.checkoutUrl) {
      window.location.href = json.checkoutUrl;
    }

    setUpgradeLoading(false);
  };

  if (isLoading) {
    return (
      <Card className="p-5 animate-pulse">
        <CardTitle className="text-sm font-medium text-gray-600">Loading...</CardTitle>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-5 bg-red-50 border border-red-200">
        <CardTitle>Error</CardTitle>
        <CardDescription>{error.toString()}</CardDescription>
      </Card>
    );
  }

  const isFree = data?.plan === "Free";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="relative rounded-2xl bg-white/70 backdrop-blur-md">
        {/* Badge */}
        <div className="absolute top-4 right-4">
          {isFree ? (
            <Badge className="border-yellow-300 bg-yellow-50 text-yellow-700">
              {data.blogsLeft} left
            </Badge>
          ) : (
            <Badge className="border-green-300 bg-green-50 text-green-700">
              Pro
            </Badge>
          )}
        </div>

        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <IconLock className="w-5 h-5" />
            </div>
            <div>
              <CardDescription className="text-sm font-medium text-gray-600">Your Plan</CardDescription>
              <CardTitle className="text-2xl font-bold text-gray-900">{data.plan}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col items-start gap-2">
          {isFree ? (
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleUpgrade}
              disabled={upgradeLoading}
            >
              {upgradeLoading ? "Starting checkout..." : "Upgrade to Pro"}
            </Button>
          ) : (
            <p className="text-sm font-medium">Enjoy unlimited blogs</p>
          )}
          <span className="text-xs text-muted-foreground">Tracked in real-time</span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

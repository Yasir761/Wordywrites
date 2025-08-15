"use client"

import { useEffect, useState } from "react";
import { IconLock } from "@tabler/icons-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function UserPlanCard() {
  const [planData, setPlanData] = useState<{ plan?: string; blogsLeft?: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/user/plan", { 
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", res.status, errorText);
          throw new Error(`Failed to fetch user plan: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Plan data received:", data);
        setPlanData({ plan: data.plan, blogsLeft: data.blogsLeft });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, []);

  const isFree = planData.plan === "Free";

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-cyan-50/30 backdrop-blur-md shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-md animate-pulse">
                <IconLock className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <CardDescription className="text-sm font-medium text-gray-600">
                  Loading...
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden rounded-2xl border border-red-200 bg-red-50/30 backdrop-blur-md shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-md">
                <IconLock className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <CardDescription className="text-sm font-medium text-red-600">
                  Error loading plan
                </CardDescription>
                <CardTitle className="text-lg font-bold text-red-900">
                  {error}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-cyan-50/30 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all">
        {/* Animated background accent */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl animate-blob1 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-200/30 rounded-full blur-3xl animate-blob2 pointer-events-none"></div>

        <CardHeader>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-md animate-pulse">
              <IconLock className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <CardDescription className="text-sm font-medium text-gray-600">
                Your Plan
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {planData.plan || "Free"}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col gap-2 relative z-10">
          {isFree ? (
            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 text-sm">
              {planData.blogsLeft ?? 5} blogs left this month
            </Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 text-sm">
              Unlimited blogs 🚀
            </Badge>
          )}
          <span className="text-xs text-gray-500">Tracked in real-time</span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { IconArticle, IconWriting, IconStar, IconLock } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useUserStats } from "@/hooks/useUserstats";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Button } from "@/components/ui/button";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString());
  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);
  return <motion.span>{rounded}</motion.span>;
}

export default function OverviewCards() {
  const { data, error } = useUserStats();
  const { data: planData, isLoading: planLoading } = useUserPlan();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [paddle, setPaddle] = useState<Paddle>();

  const [stats, setStats] = useState([
    { label: "Blogs Created", value: 0, icon: IconArticle, trend: "+0%", description: "New blogs this month", direction: "down" },
    { label: "Words Written", value: 0, icon: IconWriting, trend: "+0%", description: "Word count across all blogs", direction: "down" },
    { label: "Avg SEO Score", value: 0, icon: IconStar, trend: "+0%", description: "Improved SEO performance", direction: "down" },
  ]);

  useEffect(() => {
    if (data && !error) {
      const trends = data.trends || { blogs: 0, words: 0, seo: 0 };
      const planName = data.plan ?? "";
      const blogsGeneratedThisMonth = data.blogsGeneratedThisMonth ?? 0;
      setStats([
        {
          label: "Blogs Created",
          value: data.blogCount || 0,
          icon: IconArticle,
          trend: `${trends.blogs >= 0 ? "+" : ""}${Math.round(trends.blogs)}%`,
          description:
            planName.toLowerCase() === "free"
              ? `${Math.max(0, 5 - blogsGeneratedThisMonth)} blogs left this month`
              : "Unlimited blog creation",
          direction: trends.blogs >= 0 ? "up" : "down",
        },
        {
          label: "Words Written",
          value: data.totalWords || 0,
          icon: IconWriting,
          trend: `${trends.words >= 0 ? "+" : ""}${Math.round(trends.words)}%`,
          description: "Total words across generated blogs",
          direction: trends.words >= 0 ? "up" : "down",
        },
        {
          label: "Avg SEO Score",
          value: data.avgSEO || 0,
          icon: IconStar,
          trend: `${trends.seo >= 0 ? "+" : ""}${Math.round(trends.seo)}%`,
          description: "SEO improvement over time",
          direction: trends.seo >= 0 ? "up" : "down",
        },
      ]);
    }
  }, [data, error]);

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
    if (json.checkoutUrl) window.location.href = json.checkoutUrl;
    setUpgradeLoading(false);
  };

  return (
    <div
      className="
        grid gap-6 px-3 sm:px-4 xl:px-6 mt-6
        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
      "
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const trendUp = stat.direction === "up";

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            <Card
              className="
                h-full relative flex flex-col justify-between
                rounded-2xl bg-card/70 dark:bg-card/30 backdrop-blur-xl
                border border-border/60
                shadow-[0_0_25px_-10px_rgba(0,0,0,0.2)]
                transition-all
                hover:shadow-[0_0_35px_-8px_var(--ai-accent)]
                hover:border-ai-accent/40
                hover:-translate-y-0.5
                group
              "
            >
              <div
                className="
                  absolute -top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center
                  bg-ai-accent/15 dark:bg-ai-accent/25 border border-ai-accent/20 text-ai-accent
                  shadow-[0_0_15px_-4px_var(--ai-accent)]
                  transition-all group-hover:scale-105 group-hover:shadow-[0_0_22px_-4px_var(--ai-accent)]
                "
              >
                <Icon className="w-5 h-5" />
              </div>

              <CardHeader className="pt-10 pb-1">
                <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
                  {typeof stat.value === "number" ? (
                    <AnimatedNumber value={stat.value as number} />
                  ) : (
                    stat.value
                  )}
                  {stat.label === "Avg SEO Score" && "%"}
                </CardTitle>
                <CardDescription className="text-xs mt-1 text-muted-foreground">
                  {stat.label}
                </CardDescription>
              </CardHeader>

              <div className="absolute top-3 right-3">
                <Badge
                  className={`
                    text-[11px] font-medium px-1.5 py-0.5 rounded-md border
                    ${trendUp
                      ? "text-green-400 border-green-500/20 bg-green-500/10"
                      : "text-red-400 border-red-500/20 bg-red-500/10"}
                  `}
                >
                  {trendUp ? "▲" : "▼"} {stat.trend}
                </Badge>
              </div>

              <CardFooter className="px-4 pb-4 pt-0 text-[12px] leading-relaxed text-muted-foreground">
                {stat.description}
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}

      {/* PLAN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="h-full"
      >
        <Card
          className="
            relative h-full rounded-2xl bg-card/70 dark:bg-card/30 backdrop-blur-xl
            border border-border/60
            shadow-[0_0_25px_-10px_rgba(0,0,0,0.25)]
            hover:shadow-[0_0_35px_-8px_var(--ai-accent)]
            hover:border-ai-accent/40
            transition-all
            group
          "
        >
          <div
            className="
              absolute -top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center
              bg-ai-accent/15 dark:bg-ai-accent/25 border border-ai-accent/20 text-ai-accent
              shadow-[0_0_18px_-4px_var(--ai-accent)]
              transition-all group-hover:shadow-[0_0_28px_-4px_var(--ai-accent)] group-hover:scale-105
            "
          >
            <IconLock className="w-5 h-5" />
          </div>

          <div className="absolute top-3 right-3">
            {planLoading ? (
              <Badge className="px-2 py-0.5 text-[10px]">...</Badge>
            ) : planData?.plan === "Free" ? (
              <Badge className="px-2 py-0.5 text-[10px] border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
                {planData.creditsLeft} credit left
              </Badge>
            ) : (
              <Badge className="px-2 py-0.5 text-[10px] border border-ai-accent/40 bg-ai-accent/10 text-ai-accent">
                 PRO MEMBER
              </Badge>
            )}
          </div>

          <CardHeader className="pt-10 pb-0">
            <CardTitle className="text-xl font-heading font-semibold text-foreground">
              {planLoading ? "..." : planData?.plan}
            </CardTitle>

            <CardDescription className="text-[13px] mt-1 text-muted-foreground">
              {planLoading
                ? "Loading your plan info…"
                : planData?.plan === "Free"
                ? "You're on Free — limited monthly AI blog generation."
                : "You have full access to all AI writing tools & unlimited limits."}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col gap-3 pt-0 pb-4 px-4">
            {planData?.plan === "Free" ? (
              <Button
                onClick={handleUpgrade}
                disabled={upgradeLoading}
                className="
                  w-full h-9 font-heading text-sm
                  bg-ai-accent text-white hover:bg-ai-accent/90
                  transition-colors
                  shadow-[0_0_10px_-4px_var(--ai-accent)]
                  group-hover:shadow-[0_0_14px_-2px_var(--ai-accent)]
                "
              >
                {upgradeLoading ? "Redirecting…" : "Unlock Full AI Suite →"}
              </Button>
            ) : (
              <p className="text-sm font-heading text-ai-accent">
                All AI tools fully unlocked. No limits.
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}


"use client";

import * as React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  Target,
  Search,
  ListTree,
  Type,
  FileText,
  Sparkles,
  Hash,
  Globe2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAgentsActivity } from "@/hooks/useAgentsActivity";

// Canonical pipeline (7 steps only — Crawl/Enhance removed)
const PIPELINE_STEPS = [
  {
    key: "keyword",
    label: "Start with the Topic",
    caption: "Everything begins with the right idea.",
    icon: Target,
  },
  {
    key: "analyze",
    label: "Check Competition",
    caption: "Know what top-ranking blogs are doing.",
    icon: Search,
  },
  {
    key: "blueprint",
    label: "Shape the Outline",
    caption: "Organize thoughts into an SEO-ready structure.",
    icon: ListTree,
  },
  {
    key: "tone",
    label: "Tune the Voice",
    caption: "Match your brand’s personality, not generic AI.",
    icon: Type,
  },
  {
    key: "blog",
    label: "Let AI Write",
    caption: "A full blog, tailored to your outline & tone.",
    icon: FileText,
  },
  {
    key: "seo",
    label: "Optimize Meta",
    caption: "Titles, meta description & links refined.",
    icon: Sparkles,
  },
  {
    key: "hashtags",
    label: "Prep Social Hooks",
    caption: "Generate trending tags to boost reach.",
    icon: Hash,
  },
];

export default function AIAgentsPanel() {
  const { data, error, isLoading } = useAgentsActivity();
  const agents = Array.isArray(data?.agents) ? data!.agents : [];

  // attach active/inactive from API
  const steps = PIPELINE_STEPS.map((step) => ({
    ...step,
    active: Boolean(agents.find((a: any) => a.key === step.key)?.active),
  }));

  if (isLoading)
    return (
      <section className="mt-10">
        <div className="h-7 w-40 rounded-md bg-muted/40 animate-pulse mb-4" />
        <div className="h-40 rounded-xl bg-muted/30 animate-pulse" />
      </section>
    );

  if (error)
    return (
      <section className="mt-10">
        <p className="text-sm text-destructive">Failed to load modules.</p>
      </section>
    );

  return (
    <TooltipProvider>
      <section className="mt-14 space-y-10">
        {/* Section Title */}
        <div className="px-1">
          <h3 className="text-lg font-heading font-semibold text-foreground tracking-tight">
            AI Writing Pipeline
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            The full journey — from topic idea → optimized blog → social push.
          </p>
        </div>

        {/* Auto-wrap grid (no scroll) */}
        <div className="flex flex-wrap gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = step.active;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, ease: "easeOut" }}
                className="w-full sm:w-[47%] lg:w-[31%] 2xl:w-[23%]"
              >
                <Card
                  className={clsx(
                    `
                      p-4 h-full rounded-xl
                      border bg-card shadow-[0_0_0_1px_var(--border)]
                      transition-all
                      hover:shadow-[0_0_0_1px_var(--ai-accent)]
                    `,
                    active && "border-ai-accent/40"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={clsx(
                        `
                          w-10 h-10 rounded-lg flex items-center justify-center
                          transition-colors
                        `,
                        active
                          ? "bg-ai-accent-dim text-ai-accent"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="text-sm font-heading font-semibold text-foreground">
                      {step.label}
                    </h4>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground leading-relaxed cursor-help">
                        {step.caption}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {step.caption}
                    </TooltipContent>
                  </Tooltip>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/*  Premium Standalone Crawl & Enhance Card */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Card
            className="
              relative overflow-hidden rounded-2xl border border-ai-accent/40
              bg-gradient-to-br from-ai-accent-dim/25 to-transparent
              shadow-[0_0_0_1px_var(--ai-accent)]
              px-6 py-7
            "
          >
            {/* Glow element */}
            <div className="pointer-events-none absolute inset-0 bg-ai-accent/10 blur-[80px]" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-12 h-12 rounded-xl bg-ai-accent text-background
                    flex items-center justify-center text-xl
                  "
                >
                  <Globe2 className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-lg font-heading font-semibold tracking-tight text-foreground">
                    Crawl & Enhance
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Refresh existing content using live URLs — AI rewrites,
                    restructures and upgrades SEO for better rankings.
                  </p>
                </div>
              </div>

              <button
                onClick={() => (window.location.href = "/dashboard/crawlenhance")}
                className="
                  inline-flex items-center justify-center px-5 py-2.5
                  text-sm font-heading rounded-lg border border-ai-accent/50
                  text-ai-accent hover:bg-ai-accent hover:text-background
                  transition-all
                "
              >
                Open Enhancer
              </button>
            </div>
          </Card>
        </motion.div>
      </section>
    </TooltipProvider>
  );
}

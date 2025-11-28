"use client";

import { Stars, Feather, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function DashboardHeroBanner() {
    const { user } = useUser();
     const firstName = user?.firstName || "Writer"
  return (
    <div className="relative px-6 pt-8 pb-10">
      {/* Glow Background Accent */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-ai-accent/10 via-transparent to-transparent rounded-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Stars className="w-4 h-4 text-ai-accent" />
            <span className="text-sm font-medium text-ai-accent">
              Welcome back, {firstName}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Create impactful blogs with AI — effortlessly
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
            You focus on ideas. Our AI handles optimization, research, SEO and publishing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/dashboard/create">
              <Button size="lg" className="rounded-lg gap-2">
                <Feather className="w-4 h-4" />
                Generate Blog
              </Button>
            </Link>

            <Link href="/dashboard/crawl">
              <Button
                size="lg"
                variant="outline"
                className="rounded-lg gap-2 border-ai-accent text-ai-accent hover:bg-ai-accent/10"
              >
                <ScanSearch className="w-4 h-4" />
                Crawl & Enhance
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-right">
            <div className="text-3xl font-bold leading-none">14,239</div>
            <div className="text-xs text-muted-foreground tracking-wide mt-1">
              Words written
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold leading-none">14</div>
            <div className="text-xs text-muted-foreground tracking-wide mt-1">
              Blogs created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

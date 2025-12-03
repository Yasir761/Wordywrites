"use client";

import OverviewCards from "./components/OverviewCards";
import UsageChart from "./components/UsageChart";
import RecentBlogs from "./components/RecentBlogs";
import SmartTools from "./components/SmartTools";
import AIAgentsPanel from "./components/AiAgents";
import HeroValueBanner from "./components/HeroValueBanner";

import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="px-4 xl:px-8 pb-24 space-y-20">
      
      {/*  HERO */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pt-4"
      >
        <HeroValueBanner />
      </motion.section>

      {/*  METRICS */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        className="section-surface"
      >
        <OverviewCards />
      </motion.section>

      {/*  CHART */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.10 }}
        className="section-surface"
      >
        <UsageChart />
      </motion.section>

      {/*  RECENT BLOGS */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="section-surface"
      >
        <RecentBlogs />
      </motion.section>

      {/* SMART TOOLS */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.20 }}
        className="section-surface"
      >
        <SmartTools />
      </motion.section>

      {/*  Future Agents Panel */}
      {/* 
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
        className="section-surface"
      >
        <AIAgentsPanel />
      </motion.section>
      */}
    </div>
  );
}

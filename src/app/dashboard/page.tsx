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
    <div className="space-y-12 px-4 xl:px-6 pb-12">
      
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <HeroValueBanner />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
      >
        <OverviewCards />
      </motion.div>

      {/* Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.10 }}
      >
        <UsageChart />
      </motion.div>

      {/* Recent Blogs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
      >
        <RecentBlogs />
      </motion.div>

      {/* Smart Tools */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.20 }}
      >
        <SmartTools />
      </motion.div>

      {/* If Agents get added later */}
      {/* 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
      >
        <AIAgentsPanel />
      </motion.div>
      */}


    </div>
  );
}

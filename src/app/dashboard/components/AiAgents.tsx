"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Lock, Unlock, Zap } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Label mapping for agent names
const AGENT_LABELS: Record<string, string> = {
  keyword: "Topic Keyword Finder",
  blueprint: "SEO Outline Generator",
  seo: "Meta Optimizer",
  tone: "Tone & Voice Styler",
  hashtags: "Hashtag Generator",
  ContentPreview: "Teaser Creator",
  analyze: "Competitor Analyzer",
  crawl: "Content Scraper",
  blog: "AI Blog Writer",
};

// Helper to truncate description for preview
function getPreview(text: string, wordLimit = 15) {
  const words = text.split(" ");
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
}

export default function AIAgentsPanel() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents/activity");
        const data = await res.json();
        setAgents(data.agents || []);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading smart modules...</div>;

  return (
    <TooltipProvider delayDuration={100}>
      <section className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 tracking-tight">
          Smart Content Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card
                className={clsx(
                  "group relative flex flex-col justify-between rounded-2xl p-5 transition-all shadow-md backdrop-blur-md border overflow-hidden",
                  agent.active
                    ? "bg-white/80 border-indigo-200 ring-1 ring-indigo-300/30"
                    : "bg-white/60 border-gray-200"
                )}
              >
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100/20 via-transparent to-cyan-100/20 rounded-2xl" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
                      agent.active
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white">
                      {AGENT_LABELS[agent.key] || agent.name}
                    </div>
                  </div>
                </div>

                {/* Description Preview + Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 cursor-help">
                      {getPreview(agent.description)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs bg-gray-800 text-white text-sm font-normal rounded-md px-3 py-2 shadow-lg"
                  >
                    {agent.description}
                  </TooltipContent>
                </Tooltip>

                {/* Footer: Lock or Unlock Icon */}
                <div className="flex justify-end mt-auto pt-2">
                  {agent.active ? (
                    <Unlock className="w-5 h-5 text-green-600" />
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lock className="w-5 h-5 text-red-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-gray-800 text-white text-xs font-medium rounded-md px-3 py-1 shadow-lg"
                      >
                        {agent.requiredPlan ? `${agent.requiredPlan} only` : "Upgrade to unlock"}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </TooltipProvider>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Lock, Unlock, Zap } from "lucide-react";
// import clsx from "clsx";
// import { motion } from "framer-motion";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { PLANS } from "@/app/constants/plans"; // import your plans

// const AGENT_LABELS: Record<string, string> = {
//   keyword: "Topic Keyword Finder",
//   blueprint: "SEO Outline Generator",
//   seo: "Meta Optimizer",
//   tone: "Tone & Voice Styler",
//   hashtags: "Hashtag Generator",
//   contentpreview: "Teaser Creator",
//   analyze: "Competitor Analyzer",
//   crawl: "Content Scraper",
//   blog: "AI Blog Writer",
// };

// function getPreview(text: string, wordLimit = 15) {
//   const words = text.split(" ");
//   return words.length <= wordLimit
//     ? text
//     : words.slice(0, wordLimit).join(" ") + "...";
// }

// export default function AIAgentsPanel() {
//   const [agents, setAgents] = useState<any[]>([]);
//   const [plan, setPlan] = useState<keyof typeof PLANS>("Free"); // default Free
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. Fetch agents metadata
//         const res = await fetch("/api/agents/activity");
//         const data = await res.json();

//         // 2. Fetch current user plan
//         const planRes = await fetch("/api/user/plan");
//         const planData = await planRes.json();

//         setAgents(data.agents || []);
//         setPlan(planData.plan || "Free");
//       } catch (error) {
//         console.error("Failed to fetch agents/plan", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <div className="text-sm text-gray-500">Loading smart modules...</div>;

//   return (
//     <TooltipProvider delayDuration={100}>
//       <section className="mt-10">
//         <h3 className="text-xl font-semibold text-gray-800 mb-6 tracking-tight">
//           Smart Content Modules
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {agents.map((agent, i) => {
//             const allowedAgents = PLANS[plan].aiAgents;
//             const isUnlocked = allowedAgents.includes(agent.key);

//             return (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1, duration: 0.4 }}
//               >
//                 <Card
//                   className={clsx(
//                     "group relative flex flex-col justify-between rounded-2xl p-5 transition-all shadow-md backdrop-blur-md border overflow-hidden",
//                     isUnlocked
//                       ? "bg-white/80 border-indigo-200 ring-1 ring-indigo-300/30"
//                       : "bg-white/60 border-gray-200"
//                   )}
//                 >
//                   <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100/20 via-transparent to-cyan-100/20 rounded-2xl" />

//                   <div className="flex items-center gap-3 mb-4">
//                     <div
//                       className={clsx(
//                         "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
//                         isUnlocked
//                           ? "bg-indigo-100 text-indigo-600"
//                           : "bg-muted text-muted-foreground"
//                       )}
//                     >
//                       <Zap className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <div className="text-sm font-semibold text-gray-800 dark:text-white">
//                         {AGENT_LABELS[agent.key?.toLowerCase() || ""] || agent.name}
//                       </div>
//                     </div>
//                   </div>

//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 cursor-help">
//                         {getPreview(agent.description)}
//                       </p>
//                     </TooltipTrigger>
//                     <TooltipContent
//                       side="bottom"
//                       className="max-w-xs bg-gray-800 text-white text-sm font-normal rounded-md px-3 py-2 shadow-lg"
//                     >
//                       {agent.description}
//                     </TooltipContent>
//                   </Tooltip>

//                   <div className="flex justify-end mt-auto pt-2">
//                     {isUnlocked ? (
//                       <Unlock className="w-5 h-5 text-green-600" />
//                     ) : (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Lock className="w-5 h-5 text-red-500 cursor-pointer" />
//                         </TooltipTrigger>
//                         <TooltipContent
//                           side="top"
//                           className="bg-gray-800 text-white text-xs font-medium rounded-md px-3 py-1 shadow-lg"
//                         >
//                           {PLANS.Pro.aiAgents.includes(agent.key)
//                             ? "Pro only"
//                             : "Upgrade to unlock"}
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                   </div>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>
//       </section>
//     </TooltipProvider>
//   );
// }




// "use client";

// import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Lock, Unlock, Zap } from "lucide-react";
// import clsx from "clsx";
// import { motion } from "framer-motion";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { PLANS } from "@/app/constants/plans";

// const AGENT_LABELS: Record<string, string> = {
//   keyword: "Topic Keyword Finder",
//   blueprint: "SEO Outline Generator",
//   seo: "Meta Optimizer",
//   tone: "Tone & Voice Styler",
//   hashtags: "Hashtag Generator",
//   contentpreview: "Teaser Creator",
//   analyze: "Competitor Analyzer",
//   crawl: "Content Scraper",
//   blog: "AI Blog Writer",
// };

// function getPreview(text: string, wordLimit = 15) {
//   const words = text.split(" ");
//   return words.length <= wordLimit
//     ? text
//     : words.slice(0, wordLimit).join(" ") + "...";
// }

// export default function AIAgentsPanel() {
//   const [agents, setAgents] = useState<any[]>([]);
//   const [plan, setPlan] = useState<string>("Free");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch agents metadata
//         const res = await fetch("/api/agents/activity");
//         const data = await res.json();

//         // Fetch user plan
//         const planRes = await fetch("/api/user/plan");
//         const planData = await planRes.json();

//         setAgents(data.agents || []);
//         setPlan(planData.plan || "Free");
//       } catch (error) {
//         console.error("Failed to fetch agents/plan", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading)
//     return <div className="text-sm text-gray-500">Loading smart modules...</div>;

//   // Normalize plan to match PLANS keys
//   const normalizedPlan =
//     plan?.charAt(0).toUpperCase() + plan?.slice(1).toLowerCase();



//   return (
//     <TooltipProvider delayDuration={100}>
//       <section className="mt-10">
//         <h3 className="text-xl font-semibold text-gray-800 mb-6 tracking-tight">
//           Smart Content Modules
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {agents
//             .filter(agent => agent.key) // filter out agents with missing keys
//             .map((agent, i) => {
//               const keyLower = agent.key?.toLowerCase() || "";
//               const isUnlocked = allowedAgents.includes(agent.key);

//               return (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: i * 0.1, duration: 0.4 }}
//                 >
//                   <Card
//                     className={clsx(
//                       "group relative flex flex-col justify-between rounded-2xl p-5 transition-all shadow-md backdrop-blur-md border overflow-hidden",
//                       isUnlocked
//                         ? "bg-white/80 border-indigo-200 ring-1 ring-indigo-300/30"
//                         : "bg-white/60 border-gray-200"
//                     )}
//                   >
//                     {/* Hover shimmer */}
//                     <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100/20 via-transparent to-cyan-100/20 rounded-2xl" />

//                     {/* Header */}
//                     <div className="flex items-center gap-3 mb-4">
//                       <div
//                         className={clsx(
//                           "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
//                           isUnlocked
//                             ? "bg-indigo-100 text-indigo-600"
//                             : "bg-muted text-muted-foreground"
//                         )}
//                       >
//                         <Zap className="w-5 h-5" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-semibold text-gray-800 dark:text-white">
//                           {AGENT_LABELS[keyLower] || agent.name}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Description Preview + Tooltip */}
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 cursor-help">
//                           {getPreview(agent.description)}
//                         </p>
//                       </TooltipTrigger>
//                       <TooltipContent
//                         side="bottom"
//                         className="max-w-xs bg-gray-800 text-white text-sm font-normal rounded-md px-3 py-2 shadow-lg"
//                       >
//                         {agent.description}
//                       </TooltipContent>
//                     </Tooltip>

//                     {/* Footer: Lock/Unlock */}
//                     <div className="flex justify-end mt-auto pt-2">
//                       {isUnlocked ? (
//                         <Unlock className="w-5 h-5 text-green-600" />
//                       ) : (
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Lock className="w-5 h-5 text-red-500 cursor-pointer" />
//                           </TooltipTrigger>
//                           <TooltipContent
//                             side="top"
//                             className="bg-gray-800 text-white text-xs font-medium rounded-md px-3 py-1 shadow-lg"
//                           >
//                             {PLANS.Pro.aiAgents.includes(agent.key)
//                               ? "Pro only"
//                               : "Upgrade to unlock"}
//                           </TooltipContent>
//                         </Tooltip>
//                       )}
//                     </div>
//                   </Card>
//                 </motion.div>
//               );
//             })}
//         </div>
//       </section>
//     </TooltipProvider>
//   );
// }

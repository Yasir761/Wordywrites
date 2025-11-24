
// "use client";

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
// import { useAgentsActivity } from "@/hooks/useAgentsActivity"; // ← USE YOUR SWR HOOK
// import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

// // Label mapping for agent names
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

// // Helper to truncate description for preview
// function getPreview(text: string, wordLimit = 15) {
//   const words = text.split(" ");
//   return words.length <= wordLimit
//     ? text
//     : words.slice(0, wordLimit).join(" ") + "...";
// }

// export default function AIAgentsPanel() {
//   const { data, error, isLoading } = useAgentsActivity();

//   if (isLoading) return <div className="text-sm text-gray-500">Loading smart modules...</div>;
//   if (error) return <div className="text-sm text-red-500">Failed to load agents</div>;

//   const agents = data?.agents || [];

//   return (
//     <TooltipProvider delayDuration={100}>
//       <section className="mt-10">
//         <h3 className="text-xl font-semibold text-gray-800 mb-6 tracking-tight">
//           Smart Content Modules
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {agents.map((agent: { key: string | number; active: any; name: any; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, i: number) => (
//             <motion.div
//               key={agent.key || i}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.1, duration: 0.4 }}
//             >
//               <Card
//                 className={clsx(
//                   "group relative flex flex-col justify-between rounded-2xl p-5 transition-all shadow-md backdrop-blur-md border overflow-hidden",
//                   agent.active
//                     ? "bg-white/80 border-indigo-200 ring-1 ring-indigo-300/30"
//                     : "bg-white/60 border-gray-200"
//                 )}
//               >
//                 {/* Hover shimmer effect */}
//                 <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100/20 via-transparent to-cyan-100/20 rounded-2xl" />

//                 {/* Header */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <div
//                     className={clsx(
//                       "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
//                       agent.active
//                         ? "bg-indigo-100 text-indigo-600"
//                         : "bg-muted text-muted-foreground"
//                     )}
//                   >
//                     <Zap className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <div className="text-sm font-semibold text-gray-800 dark:text-white">
//                       {AGENT_LABELS[agent.key] || agent.name}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Description + Tooltip */}
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 cursor-help">
//                       {getPreview(String(agent.description || ""))}
//                     </p>
//                   </TooltipTrigger>
//                   <TooltipContent
//                     side="bottom"
//                     className="max-w-xs bg-gray-800 text-white text-sm rounded-md px-3 py-2 shadow-lg"
//                   >
//                     {String(agent.description || "")}
//                   </TooltipContent>
//                 </Tooltip>

//                 {/* Footer: Lock/Unlock */}
//                 <div className="flex justify-end mt-auto pt-2">
//                   {agent.active ? (
//                     <Unlock className="w-5 h-5 text-green-600" />
//                   ) : (
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Lock className="w-5 h-5 text-red-500 cursor-pointer" />
//                       </TooltipTrigger>
//                       <TooltipContent
//                         side="top"
//                         className="bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-lg"
//                       >
//                         Upgrade to unlock
//                       </TooltipContent>
//                     </Tooltip>
//                   )}
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </section>
//     </TooltipProvider>
//   );
// }





"use client";

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
import { useAgentsActivity } from "@/hooks/useAgentsActivity";

const AGENT_LABELS: Record<string, string> = {
  keyword: "Topic Keyword Finder",
  blueprint: "SEO Outline Generator",
  seo: "Meta Optimizer",
  tone: "Tone & Voice Styler",
  hashtags: "Hashtag Generator",
  contentpreview: "Teaser Creator",
  analyze: "Competitor Analyzer",
  crawl: "Content Scraper",
  blog: "AI Blog Writer",
};

function getPreview(text: string, wordLimit = 15) {
  const words = text.split(" ");
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(" ") + "...";
}

export default function AIAgentsPanel() {
  const { data, error, isLoading } = useAgentsActivity();

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading modules…</p>;

  if (error)
    return <p className="text-sm text-destructive">Failed to load agents</p>;

  const agents = data?.agents || [];

  return (
    <TooltipProvider>
      <section className="mt-10">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6 tracking-tight">
          Smart Content Modules
        </h3>

        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
          "
        >
          {agents.map((agent: any, i: number) => (
            <motion.div
              key={agent.key || i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease: "easeOut" }}
            >
              <Card
                className={clsx(
                  `
                  relative flex flex-col justify-between p-4 rounded-lg
                  border border-border bg-card
                  shadow-[0_0_0_1px_var(--border)]
                  transition-all hover:shadow-[0_0_0_1px_var(--ai-accent)]
                  group
                `,
                  agent.active && "border-ai-accent/40"
                )}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={clsx(
                      `
                      w-10 h-10 rounded-md flex items-center justify-center
                      transition-colors
                    `,
                      agent.active
                        ? "bg-ai-accent/10 text-ai-accent"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Zap className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="text-sm font-heading text-foreground">
                      {AGENT_LABELS[agent.key] || agent.name}
                    </p>
                  </div>
                </div>

                {/* Description Preview */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground cursor-help mb-3">
                      {getPreview(String(agent.description || ""))}
                    </p>
                  </TooltipTrigger>

                  <TooltipContent
                    side="bottom"
                    className="
                      max-w-xs bg-popover text-popover-foreground
                      border border-border rounded-md text-xs p-2 shadow-md
                    "
                  >
                    {String(agent.description || "")}
                  </TooltipContent>
                </Tooltip>

                {/* Status Lock/Unlock */}
                <div className="flex justify-end pt-2">
                  {agent.active ? (
                    <Unlock className="w-4 h-4 text-green-400" />
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Lock className="w-4 h-4 text-red-400 cursor-pointer opacity-80 hover:opacity-100" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="text-xs bg-popover text-muted-foreground border border-border px-2 py-1 rounded-sm"
                      >
                        Upgrade to unlock
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

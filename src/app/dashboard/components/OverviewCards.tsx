

// "use client";

// import { useEffect, useState } from "react";
// import { IconArticle, IconWriting, IconStar } from "@tabler/icons-react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";
// import { motion, animate, useMotionValue, useTransform } from "framer-motion";
// import PlanCard from "./PlanCard";
// import { useUserStats } from "@/hooks/useUserstats"; 

// // Animated number (same as yours)
// function AnimatedNumber({ value }: { value: number }) {
//   const count = useMotionValue(0);
//   const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString());

//   useEffect(() => {
//     const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
//     return controls.stop;
//   }, [value, count]);

//   return <motion.span>{rounded}</motion.span>;
// }

// type StatCard = {
//   label: string;
//   value: number | string;
//   icon: any;
//   trend: string;
//   description: string;
//   direction: "up" | "down";
// };

// export default function OverviewCards() {
//   const { data, error, isLoading } = useUserStats();
//   // default placeholders
//   const [stats, setStats] = useState<StatCard[]>([
//     {
//       label: "Blogs Created",
//       value: 0,
//       icon: IconArticle,
//       trend: "+0%",
//       description: "New blogs this month",
//       direction: "down",
//     },
//     {
//       label: "Words Written",
//       value: 0,
//       icon: IconWriting,
//       trend: "+0%",
//       description: "Word count across all blogs",
//       direction: "down",
//     },
//     {
//       label: "Avg SEO Score",
//       value: 0,
//       icon: IconStar,
//       trend: "+0%",
//       description: "Improved SEO performance",
//       direction: "down",
//     },
//   ]);

//   useEffect(() => {
//     if (data && !error) {
//       const trends = data.trends || { blogs: 0, words: 0, seo: 0 };
//       const planName = data.plan ?? "";
//       const blogsGeneratedThisMonth = data.blogsGeneratedThisMonth ?? 0;

//       setStats([
//         {
//           label: "Blogs Created",
//           value: typeof data.blogCount === "number" ? data.blogCount : 0,
//           icon: IconArticle,
//           trend: `${trends.blogs >= 0 ? "+" : ""}${Math.round(trends.blogs)}%`,
//           description:
//             planName && planName.toLowerCase() === "free"
//               ? `${Math.max(0, 5 - blogsGeneratedThisMonth)} blogs left this month`
//               : "You can create unlimited blogs",
//           direction: trends.blogs >= 0 ? "up" : "down",
//         },
//         {
//           label: "Words Written",
//           value: typeof data.totalWords === "number" ? data.totalWords : 0,
//           icon: IconWriting,
//           trend: `${trends.words >= 0 ? "+" : ""}${Math.round(trends.words)}%`,
//           description: "Word count across all blogs",
//           direction: trends.words >= 0 ? "up" : "down",
//         },
//         {
//           label: "Avg SEO Score",
//           value: typeof data.avgSEO === "number" ? data.avgSEO : 0,
//           icon: IconStar,
//           trend: `${trends.seo >= 0 ? "+" : ""}${Math.round(trends.seo)}%`,
//           description: "Improved SEO performance",
//           direction: trends.seo >= 0 ? "up" : "down",
//         },
//       ]);
//     }
//   }, [data, error]);

//   // simple error UI - you can style this more
//   if (error) {
//     return (
//       <div className="p-4 rounded bg-red-50 text-red-700">
//         Failed to load stats. Try refreshing the page.
//       </div>
//     );
//   }

//   return (
//     <div
//       className="
//         grid gap-6 px-3 sm:px-4 xl:px-6 mt-6
//          sm:grid-cols-2
//         md:grid-cols-3 lg:grid-cols-4
//         [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
//       "
//     >
//       {stats.map((stat, i) => {
//         const Icon = stat.icon;
//         const trendUp = stat.direction === "up";
//         const TrendEmoji = trendUp ? "📈" : "📉";
//         const badgeColor = trendUp
//           ? "border-green-300 text-green-700 bg-green-50"
//           : "border-red-300 text-red-600 bg-red-50";

//         return (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileTap={{ scale: 0.98 }}
//             transition={{ delay: i * 0.1 }}
//             className="h-full"
//           >
//             <Card className="h-full relative overflow-hidden flex flex-col justify-between rounded-2xl border border-white/30 bg-white/80 backdrop-blur-md shadow-sm transition-all hover:shadow-xl hover:scale-[1.01]">
//               <motion.div
//                 initial={{ opacity: 0, y: -5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.15 }}
//                 className="absolute top-3 right-3 z-10"
//               >
//                 <Badge className={`text-xs px-2 py-0.5 border ${badgeColor}`}>
//                   {TrendEmoji} {stat.trend}
//                 </Badge>
//               </motion.div>

//               <CardHeader className="pb-2 sm:pb-3 relative z-10">
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm shrink-0">
//                     <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-label={`${stat.label} icon`} />
//                   </div>
//                   <div className="flex flex-col">
//                     <CardDescription className="text-xs sm:text-sm font-medium text-gray-600">
//                       {stat.label}
//                     </CardDescription>
//                     <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
//                       {typeof stat.value === "number" ? (
//                         // while loading, this animates from 0 to current value
//                         <AnimatedNumber value={stat.value as number} />
//                       ) : (
//                         stat.value
//                       )}
//                       {stat.label === "Avg SEO Score" && "%"}
//                     </CardTitle>
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardFooter className="flex flex-col items-start gap-1 px-4 pb-4 pt-0 text-xs sm:text-sm text-muted-foreground relative z-10">
//                 <span className="font-medium text-foreground line-clamp-2">
//                   {stat.description}
//                 </span>
//                 <span className="text-[11px] sm:text-xs">
//                   {isLoading ? "Loading…" : "Tracked in real-time"}
//                 </span>
//               </CardFooter>
//             </Card>
//           </motion.div>
//         );
//       })}

//       {/* Plan Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         whileTap={{ scale: 0.98 }}
//         transition={{ delay: 0.15 }}
//         className="h-full"
//       >
//         <PlanCard />
//       </motion.div>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { IconArticle, IconWriting, IconStar } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import PlanCard from "./PlanCard";
import { useUserStats } from "@/hooks/useUserstats";

// Animated Number
function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

type StatCard = {
  label: string;
  value: number | string;
  icon: any;
  trend: string;
  description: string;
  direction: "up" | "down";
};

export default function OverviewCards() {
  const { data, error, isLoading } = useUserStats();

  const [stats, setStats] = useState<StatCard[]>([
    {
      label: "Blogs Created",
      value: 0,
      icon: IconArticle,
      trend: "+0%",
      description: "New blogs this month",
      direction: "down",
    },
    {
      label: "Words Written",
      value: 0,
      icon: IconWriting,
      trend: "+0%",
      description: "Word count across all blogs",
      direction: "down",
    },
    {
      label: "Avg SEO Score",
      value: 0,
      icon: IconStar,
      trend: "+0%",
      description: "Improved SEO performance",
      direction: "down",
    },
  ]);

  useEffect(() => {
    if (data && !error) {
      const trends = data.trends || { blogs: 0, words: 0, seo: 0 };
      const planName = data.plan ?? "";
      const blogsGeneratedThisMonth = data.blogsGeneratedThisMonth ?? 0;

      setStats([
        {
          label: "Blogs Created",
          value: typeof data.blogCount === "number" ? data.blogCount : 0,
          icon: IconArticle,
          trend: `${trends.blogs >= 0 ? "+" : ""}${Math.round(trends.blogs)}%`,
          description:
            planName && planName.toLowerCase() === "free"
              ? `${Math.max(0, 5 - blogsGeneratedThisMonth)} blogs left this month`
              : "Unlimited blog creation",
          direction: trends.blogs >= 0 ? "up" : "down",
        },
        {
          label: "Words Written",
          value: typeof data.totalWords === "number" ? data.totalWords : 0,
          icon: IconWriting,
          trend: `${trends.words >= 0 ? "+" : ""}${Math.round(trends.words)}%`,
          description: "Total words across generated blogs",
          direction: trends.words >= 0 ? "up" : "down",
        },
        {
          label: "Avg SEO Score",
          value: typeof data.avgSEO === "number" ? data.avgSEO : 0,
          icon: IconStar,
          trend: `${trends.seo >= 0 ? "+" : ""}${Math.round(trends.seo)}%`,
          description: "SEO improvement over time",
          direction: trends.seo >= 0 ? "up" : "down",
        },
      ]);
    }
  }, [data, error]);

  if (error) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive">
        Failed to load stats. Try refreshing the page.
      </div>
    );
  }

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
                rounded-xl border border-border bg-card
                shadow-[0_0_0_1px_var(--border)]
                hover:shadow-[0_0_0_1px_var(--ai-accent)]
                transition-all
              "
            >
              <div className="absolute top-3 right-3">
                <Badge
                  className={`
                    text-[11px] font-medium px-1.5 py-0.5 rounded-md
                    border
                    ${
                      trendUp
                        ? "text-green-400 border-green-500/20 bg-green-500/10"
                        : "text-red-400 border-red-500/20 bg-red-500/10"
                    }
                  `}
                >
                  {trendUp ? "▲" : "▼"} {stat.trend}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10 h-10 rounded-lg flex items-center justify-center
                      bg-ai-accent-dim text-ai-accent
                    "
                  >
                    <Icon className="w-5 h-5" aria-label={`${stat.label} icon`} />
                  </div>

                  <div className="flex flex-col">
                    <CardDescription className="text-xs font-heading tracking-tight text-muted-foreground">
                      {stat.label}
                    </CardDescription>

                    <CardTitle className="text-2xl font-heading font-semibold text-foreground">
                      {typeof stat.value === "number" ? (
                        <AnimatedNumber value={stat.value as number} />
                      ) : (
                        stat.value
                      )}
                      {stat.label === "Avg SEO Score" && "%"}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="flex flex-col items-start gap-1 px-4 pb-4 pt-0 text-[11px] text-muted-foreground">
                <span className="text-foreground">{stat.description}</span>
                <span>{isLoading ? "Loading…" : "Tracked in real-time"}</span>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}

      {/* Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="h-full"
      >
        <PlanCard />
      </motion.div>
    </div>
  );
}

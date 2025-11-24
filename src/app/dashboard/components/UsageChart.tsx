
// "use client";

// import * as React from "react";
// import {
//   AreaChart,
//   Area,
//   Line,
//   XAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   YAxis,
// } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardAction,
// } from "@/components/ui/card";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useUserChart } from "@/hooks/useUserchart"; 

// export default function BlogUsageChart() {
//   const [range, setRange] = React.useState("7d");


//   const { data, error, isLoading } = useUserChart();

//   const chartData = data || [];

//   // Insight state
//   const [insight, setInsight] = React.useState("");

//   // Generate insights
//   React.useEffect(() => {
//     if (!chartData || chartData.length < 2) {
//       setInsight("Not enough data to analyze trends yet.");
//       return;
//     }

//     const seoChange =
//       chartData[chartData.length - 1].avgSEO - chartData[0].avgSEO;

//     const blogChange =
//       chartData[chartData.length - 1].blogs - chartData[0].blogs;

//     if (seoChange > 0 && blogChange > 0)
//       setInsight("Consistency increasing, SEO improving steadily.");
//     else if (seoChange > 0)
//       setInsight("SEO quality improving even with fewer blogs.");
//     else if (blogChange > 0)
//       setInsight("More blogs published, but SEO needs attention.");
//     else
//       setInsight("Engagement and quality are stable. Try experimenting.");
//   }, [chartData, range]);

//   // Filter based on range
//   const filteredData = React.useMemo(() => {
//     if (!chartData) return [];
//     if (range === "7d") return chartData.slice(-7);
//     if (range === "30d") return chartData.slice(-30);
//     return chartData;
//   }, [range, chartData]);

//   const isEmpty = !filteredData || filteredData.length === 0;

//   return (
//     <Card className="w-full mt-10 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-md transition-all">
//       <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
//         <div>
//           <CardTitle className="text-xl font-semibold tracking-tight text-gray-800">
//             Engagement & Quality Over Time
//           </CardTitle>
//           <CardDescription className="text-sm text-gray-500">
//             Blogs and average SEO score for the last{" "}
//             {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "all time"}
//           </CardDescription>
//         </div>

//         <CardAction>
//           <ToggleGroup
//             type="single"
//             value={range}
//             onValueChange={(val) => val && setRange(val)}
//             variant="outline"
//             className="flex gap-2 bg-white/60 border border-white/30 backdrop-blur-sm rounded-lg p-1"
//           >
//             <ToggleGroupItem value="7d" className="text-sm">
//               7 Days
//             </ToggleGroupItem>
//             <ToggleGroupItem value="30d" className="text-sm">
//               30 Days
//             </ToggleGroupItem>
//             <ToggleGroupItem value="all" className="text-sm">
//               All Time
//             </ToggleGroupItem>
//           </ToggleGroup>
//         </CardAction>
//       </CardHeader>

//       <CardContent className="pt-2">
//         {isLoading ? (
//           <Skeleton className="w-full h-[280px] rounded-xl bg-gray-100/40 animate-pulse" />
//         ) : isEmpty ? (
//           <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">
//             No blog data available for this range.
//           </div>
//         ) : (
//           <>
//             <ResponsiveContainer width="100%" height={280}>
//               <AreaChart
//                 data={filteredData}
//                 margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
//                     <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
//                   </linearGradient>
//                 </defs>

//                 <CartesianGrid strokeDasharray="4 4" vertical={false} strokeOpacity={0.08} />

//                 <XAxis
//                   dataKey="date"
//                   axisLine={false}
//                   tickLine={false}
//                   tickMargin={8}
//                   className="text-sm fill-gray-500"
//                 />

//                 <YAxis hide />

//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: 8,
//                     border: "1px solid #e5e7eb",
//                     background: "#fff",
//                     fontSize: 14,
//                     boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//                   }}
//                   labelStyle={{ fontWeight: 600, color: "#4b5563" }}
//                   formatter={(value: number, name: string) => {
//                     return name === "avgSEO"
//                       ? [`${value}% SEO`, "SEO Score"]
//                       : [`${value} blogs`, "Blogs"];
//                   }}
//                 />

//                 <Area
//                   type="monotone"
//                   dataKey="blogs"
//                   stroke="#6366f1"
//                   strokeWidth={2}
//                   fill="url(#colorBlogs)"
//                 />

//                 <Line
//                   type="monotone"
//                   dataKey="avgSEO"
//                   stroke="#f59e0b"
//                   strokeWidth={2}
//                   dot={false}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>

//             <p className="text-sm text-gray-600 mt-3">{insight}</p>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }




"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserChart } from "@/hooks/useUserchart";

export default function BlogUsageChart() {
  const [range, setRange] = React.useState("7d");
  const { data, error, isLoading } = useUserChart();
  const chartData = data || [];

  const [insight, setInsight] = React.useState("");

  // Insight generation
  React.useEffect(() => {
    if (!chartData || chartData.length < 2) {
      setInsight("Not enough data to analyze trends yet.");
      return;
    }

    const seoChange =
      chartData[chartData.length - 1].avgSEO - chartData[0].avgSEO;
    const blogChange =
      chartData[chartData.length - 1].blogs - chartData[0].blogs;

    if (seoChange > 0 && blogChange > 0)
      setInsight("Consistency rising — SEO improving steadily.");
    else if (seoChange > 0)
      setInsight("SEO improving even with fewer posts.");
    else if (blogChange > 0)
      setInsight("More posts published — improve SEO quality.");
    else setInsight("Stable performance — try experimenting.");
  }, [chartData, range]);

  // Range filtering
  const filteredData = React.useMemo(() => {
    if (!chartData) return [];
    if (range === "7d") return chartData.slice(-7);
    if (range === "30d") return chartData.slice(-30);
    return chartData;
  }, [range, chartData]);

  const isEmpty = !filteredData || filteredData.length === 0;

  return (
    <Card
      className="
        w-full mt-10 rounded-lg border border-border bg-card
        shadow-[0_0_0_1px_var(--border)]
        hover:shadow-[0_0_0_1px_var(--ai-accent)]
        transition-all
      "
    >
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-heading font-semibold text-foreground">
            Engagement & Quality Over Time
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Tracking blogs + SEO score for{" "}
            {range === "7d" ? "the last 7 days" : range === "30d" ? "30 days" : "all available data"}
          </CardDescription>
        </div>

        <CardAction>
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(val) => val && setRange(val)}
            variant="outline"
            className="
              flex gap-2 rounded-md border border-border
              bg-secondary/50 px-1 py-1
            "
          >
            <ToggleGroupItem
              value="7d"
              className="text-xs font-heading text-muted-foreground data-[state=on]:bg-ai-accent/20 data-[state=on]:text-ai-accent"
            >
              7 Days
            </ToggleGroupItem>
            <ToggleGroupItem
              value="30d"
              className="text-xs font-heading text-muted-foreground data-[state=on]:bg-ai-accent/20 data-[state=on]:text-ai-accent"
            >
              30 Days
            </ToggleGroupItem>
            <ToggleGroupItem
              value="all"
              className="text-xs font-heading text-muted-foreground data-[state=on]:bg-ai-accent/20 data-[state=on]:text-ai-accent"
            >
              All Time
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-2">
        {isLoading ? (
          <Skeleton className="w-full h-[280px] rounded-md bg-muted/30 animate-pulse" />
        ) : isEmpty ? (
          <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
            No chart data available yet.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="blogsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--ai-accent)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--ai-accent)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.25} />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  className="text-[11px] fill-muted-foreground"
                />

                <YAxis hide />

                <Tooltip
                  contentStyle={{
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    padding: "6px 8px",
                  }}
                  labelStyle={{ fontWeight: 600, color: "var(--foreground)" }}
                  formatter={(value: number, name: string) => {
                    return name === "avgSEO"
                      ? [`${value}%`, "SEO Score"]
                      : [`${value}`, "Blogs"];
                  }}
                />

                {/* Blogs Filled Area */}
                <Area
                  type="monotone"
                  dataKey="blogs"
                  stroke="var(--ai-accent)"
                  strokeWidth={2}
                  fill="url(#blogsGradient)"
                />

                {/* SEO Score Line */}
                <Line
                  type="monotone"
                  dataKey="avgSEO"
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>

            <p className="text-sm font-heading text-muted-foreground mt-3">
              {insight}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

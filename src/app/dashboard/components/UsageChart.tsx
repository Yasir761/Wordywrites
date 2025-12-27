

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

  React.useEffect(() => {
    if (!chartData || chartData.length < 2) {
      setInsight("Not enough data to analyze trends yet.");
      return;
    }
    const seoChange = chartData[chartData.length - 1].avgSEO - chartData[0].avgSEO;
    const blogChange = chartData[chartData.length - 1].blogs - chartData[0].blogs;
    if (seoChange > 0 && blogChange > 0) setInsight("Consistency rising — SEO improving steadily.");
    else if (seoChange > 0) setInsight("SEO improving even with fewer posts.");
    else if (blogChange > 0) setInsight("More posts published — improve SEO quality.");
    else setInsight("Stable performance — try experimenting.");
  }, [chartData, range]);

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
        w-full mt-12 rounded-2xl bg-card/70 dark:bg-card/30 backdrop-blur-xl
        border border-border/60
        shadow-[0_0_25px_-10px_rgba(0,0,0,0.25)]
        hover:shadow-[0_0_35px_-8px_var(--ai-accent)]
        transition-all
      "
    >
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-0">
        <div>
          <CardTitle className="text-xl font-heading text-foreground">
            Writing Progress
          </CardTitle>
          <CardDescription className="mt-1 font-heading text-[13px] text-muted-foreground">
            Your journey across writing volume & SEO strength
          </CardDescription>
        </div>

        <CardAction>
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(val) => val && setRange(val)}
            className="
              flex items-center gap-1 bg-secondary/40 dark:bg-secondary/20
              p-1 rounded-xl border border-border/60
            "
          >
            {["7d", "30d", "all"].map((v) => (
              <ToggleGroupItem
                key={v}
                value={v}
                className="
                  text-[11px] font-heading px-3 py-1.5 rounded-lg
                  transition-all duration-200

                  data-[state=on]:bg-ai-accent/25
                  data-[state=on]:text-ai-accent
                  data-[state=on]:shadow-[0_0_10px_-4px_var(--ai-accent)]

                  hover:bg-ai-accent/10 hover:text-ai-accent
                  hover:shadow-[0_0_8px_-4px_var(--ai-accent)]
                "
              >
                {v === "7d" ? "7 Days" : v === "30d" ? "30 Days" : "All Time"}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading ? (
          <Skeleton className="w-full h-[290px] rounded-lg bg-muted/30 animate-pulse" />
        ) : isEmpty ? (
          <div className="flex items-center justify-center h-[290px] text-muted-foreground text-sm">
            No writing data available yet.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="blogsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--ai-accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--ai-accent)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.18} />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  className="text-[10px] fill-muted-foreground"
                />

                <YAxis hide />

                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    padding: "6px 10px",
                  }}
                  labelStyle={{ fontWeight: 600, color: "var(--foreground)" }}
                  formatter={(value, name) =>
                    name === "avgSEO" ? [`${value}%`, "SEO Score"] : [`${value}`, "Blogs Created"]
                  }
                />

                <Area
                  type="monotone"
                  dataKey="blogs"
                  stroke="var(--ai-accent)"
                  strokeWidth={2}
                  fill="url(#blogsGradient)"
                  animationDuration={500}
                />

                <Line
                  type="monotone"
                  dataKey="avgSEO"
                  stroke="var(--foreground)"
                  strokeWidth={2.2}
                  dot={false}
                  animationDuration={700}
                />
              </AreaChart>
            </ResponsiveContainer>

            <div
              className="
                mt-4 text-[13px] rounded-lg py-2.5 px-3
                bg-secondary/50 dark:bg-secondary/40
                text-muted-foreground border border-border/60
                font-heading
              "
            >
              {insight}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

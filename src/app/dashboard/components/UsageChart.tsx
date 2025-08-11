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

export default function BlogUsageChart() {
  const [range, setRange] = React.useState("7d");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [insight, setInsight] = React.useState("");

  // Fetch data from API
  React.useEffect(() => {
    async function fetchChartData() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/chart");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  // Generate insights based on current data
  React.useEffect(() => {
    if (data.length > 1) {
      const seoChange = data[data.length - 1].avgSEO - data[0].avgSEO;
      const blogChange = data[data.length - 1].blogs - data[0].blogs;

      if (seoChange > 0 && blogChange > 0) {
        setInsight("Consistency increasing, SEO improving steadily.");
      } else if (seoChange > 0) {
        setInsight("SEO quality improving even with fewer blogs.");
      } else if (blogChange > 0) {
        setInsight("More blogs published, but SEO needs attention.");
      } else {
        setInsight("Engagement and quality are stable. Try experimenting.");
      }
    } else {
      setInsight("Not enough data to analyze trends yet.");
    }
  }, [range, data]);

  // Filter based on range
  const filteredData = data.slice(
    range === "30d" ? -30 : range === "7d" ? -7 : undefined
  );

  const isEmpty = filteredData.length === 0;

  return (
    <Card className="w-full mt-10 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-md transition-all">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold tracking-tight text-gray-800">
            Engagement & Quality Over Time
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Blogs and average SEO score for the last{" "}
            {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "all time"}
          </CardDescription>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(val) => val && setRange(val)}
            variant="outline"
            className="flex gap-2 bg-white/60 border border-white/30 backdrop-blur-sm rounded-lg p-1"
          >
            <ToggleGroupItem value="7d" className="text-sm">
              7 Days
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="text-sm">
              30 Days
            </ToggleGroupItem>
            <ToggleGroupItem value="all" className="text-sm">
              All Time
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-2">
        {loading ? (
          <Skeleton className="w-full h-[280px] rounded-xl bg-gray-100/40 animate-pulse" />
        ) : isEmpty ? (
          <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">
            No blog data available for this range.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} strokeOpacity={0.08} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  className="text-sm fill-gray-500"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 14,
                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
                  }}
                  labelStyle={{ fontWeight: 600, color: "#4b5563" }}
                  formatter={(value: number, name: string) => {
                    return name === "avgSEO"
                      ? [`${value}% SEO`, "SEO Score"]
                      : [`${value} blogs`, "Blogs"];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="blogs"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorBlogs)"
                  dot={{
                    stroke: "#6366f1",
                    strokeWidth: 2,
                    fill: "#fff",
                    r: 3,
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "#4f46e5",
                    strokeWidth: 2,
                    fill: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgSEO"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, stroke: "#f59e0b", fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-3">{insight}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

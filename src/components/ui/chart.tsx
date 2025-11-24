"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// theme switching support
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within <ChartContainer />");
  return ctx;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          `
          relative aspect-video flex justify-center items-center
          text-xs rounded-lg
          bg-card border border-border
          transition-all duration-200 overflow-hidden
          hover:ring-2 hover:ring-ai-accent/20 hover:border-ai-accent/30
          [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground
          [&_.recharts-cartesian-grid_line]:stroke-border/40
          [&_.recharts-tooltip-cursor]:fill-muted/50
          [&_.recharts-reference-line]:stroke-border/50
        `,
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// inject dynamic color variables
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const activeColorConfigs = Object.entries(config).filter(
    ([, c]) => c.color || c.theme
  );
  if (!activeColorConfigs.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${activeColorConfigs
  .map(([key, cfg]) => {
    const color = cfg.theme?.[theme as keyof typeof THEMES] || cfg.color;
    return color ? `--color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: any) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  const formatLabel = () => {
    if (hideLabel) return null;
    const text =
      labelFormatter?.(label, payload) ||
      config[label as keyof typeof config]?.label ||
      label;
    return text ? (
      <div className={cn("font-heading text-sm font-semibold text-foreground", labelClassName)}>
        {text}
      </div>
    ) : null;
  };

  return (
    <div
      className={cn(
        `
        border border-border bg-popover
        backdrop-blur-sm rounded-md
        px-3 py-2 text-xs shadow-lg
        animate-in fade-in zoom-in-90 duration-150
      `,
        className
      )}
    >
      {formatLabel()}
      <div className="mt-1 grid gap-1.5">
        {payload.map((item: any) => {
          const k = nameKey || item.name || item.dataKey;
          const cfg = config[k];
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div key={k} className="flex items-center gap-2 text-muted-foreground">
              {!indicator || indicator === "dot" ? (
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: indicatorColor }}
                />
              ) : null}

              <div className="flex flex-1 justify-between items-center">
                <span>{cfg?.label || k}</span>
                <span className="font-mono tabular-nums font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({ payload, className }: any) {
  if (!payload?.length) return null;

  return (
    <div className={cn("flex items-center justify-center gap-4 text-xs text-muted-foreground pt-3", className)}>
      {payload.map((item: any) => (
        <div key={item.value} className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};

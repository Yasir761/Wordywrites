

"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const smartTools = [
  {
    name: "Publish to WordPress",
    caption: "One-click publish from dashboard",
    logo: "/icons/wordpress.svg",
    link: "/dashboard/integrations/wordpress",
    available: true,
  },
  {
    name: "Copy for Medium",
    caption: "Copy fully formatted Markdown",
    logo: "/icons/medium.svg",
    link: "",
    available: true,
  },
  {
    name: "Export to Google Docs",
    caption: "Send draft to your editor",
    logo: "/icons/googledocs.svg",
    link: "",
    available: false,
  },
];

export default function SmartToolsPanel() {
  const router = useRouter();

  return (
    <section className="mt-12">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-6 tracking-tight">
        Smart Tools
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {smartTools.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, ease: "easeOut" }}
          >
            <Card
              onClick={() => item.available && item.link && router.push(item.link)}
              className={clsx(
                `
                  group relative rounded-2xl p-5 flex flex-col gap-3
                  bg-card border border-border
                  shadow-[0_0_25px_-10px_rgba(0,0,0,0.25)]
                  dark:shadow-[0_0_25px_-10px_rgba(0,0,0,0.5)]
                  transition-all duration-300
                `,
                item.available
                  ? "cursor-pointer hover:shadow-[0_0_35px_-8px_var(--ai-accent)] hover:border-primary/50"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Coming soon badge only if unavailable */}
              {!item.available && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-muted border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Coming soon
                </div>
              )}

              {/* Tool icon - Light background for visibility */}
              <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-200 border border-border flex items-center justify-center p-2">
                <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
              </div>

              {/* Tool title + caption */}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-heading font-semibold text-foreground">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {item.caption}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
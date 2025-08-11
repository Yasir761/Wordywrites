"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const smartTools = [
  {
    name: "Publish to WordPress",
    logo: "/icons/wordpress.svg",
    // link: "/dashboard/integrations/wordpress",
    available: true,
  },
  {
    name: "Copy for Medium",
    logo: "/icons/medium.svg",
    // link: "/dashboard/integrations/medium",
    available: true,
  },
  {
    name: "Export to Google Docs",
    logo: "/icons/googledocs.svg",
    link: "",
    available: false,
  },
//   {
//     name: "Publish to Ghost",
//     logo: "/icons/ghost.svg",
//     link: "",
//     available: false,
//   },
];

export default function SmartToolsPanel() {
  const router = useRouter();

  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 tracking-tight">
        Smart Tools
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {smartTools.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card
              onClick={() => item.available && item.link && router.push(item.link)}
              className={clsx(
                "group relative rounded-2xl p-5 border backdrop-blur-md transition-all overflow-hidden shadow-sm",
                item.available
                  ? "cursor-pointer hover:shadow-xl hover:scale-[1.015] bg-white/70 border-gray-200"
                  : "opacity-60 cursor-not-allowed bg-white/50 border-gray-100"
              )}
            >
              {/* Hover Gradient */}
              {item.available && (
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100/20 via-transparent to-cyan-100/20 rounded-2xl" />
              )}

              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl border p-1.5 shadow-sm flex items-center justify-center bg-white">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm font-semibold">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Name + Status */}
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-gray-800 dark:text-white">
                    {item.name}
                  </div>
                  {!item.available && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

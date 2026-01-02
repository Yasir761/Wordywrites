// "use client";

// import Image from "next/image";

// const integrations = [
//   {
//     name: "WordPress",
//     icon: "/icons/wordpress.svg",
//     description: "Publish directly to your blog",
//   },
//   {
//     name: "Medium",
//     icon: "/icons/medium.svg",
//     description: "Copy & paste formatted HTML",
//   },
// ];

// export default function IntegrationGrid() {
//   return (
//     <section className="py-24" id="integrations">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
//           Seamless Publishing
//         </h2>
//         <p className="mt-2 text-gray-600 text-base sm:text-lg">
//           Go live in seconds with direct WordPress publishing or ready-to-paste Medium formatting.
//         </p>
//       </div>

//       <div className="max-w-md mx-auto grid grid-cols-2 gap-8 px-6">
//         {integrations.map((integration, i) => (
//           <div
//             key={i}
//             className="flex flex-col items-center text-center space-y-3 group cursor-default"
//           >
//             <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-full transition-transform group-hover:scale-110">
//               <Image
//                 src={integration.icon}
//                 alt={integration.name}
//                 width={32}
//                 height={32}
//                 className="object-contain"
//               />
//             </div>
//             <p className="text-sm font-medium text-gray-800">{integration.name}</p>
//             <p className="text-xs text-gray-500">{integration.description}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }





"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Zap } from "lucide-react";


const integrations = [
  {
    name: "WordPress",
    icon: "/icons/wordpress.svg",
    description: "Publish directly to your blog with one click",
    features: ["Direct publishing", "SEO tags included", "Schedule posts"],
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    name: "Medium",
    icon: "/icons/medium.svg",
    description: "Copy & paste formatted HTML ready to publish",
    features: ["Formatted HTML", "Instant copying", "Rich media support"],
    gradient: "from-gray-800 to-gray-600",
    bgGradient: "from-gray-800/5 to-gray-600/5",
  },
  {
    name: "Google Docs",
    icon: "/icons/google-docs.svg",
    description: "Export as Google Docs for collaborative editing",
    features: ["Collaborative", "Easy sharing", "Cloud storage"],
    gradient: "from-blue-600 to-red-500",
    bgGradient: "from-blue-600/10 to-red-500/10",
  },
  {
    name: "PDF Export",
    icon: "/icons/pdf.svg",
    description: "Download as professionally formatted PDF",
    features: ["High quality", "Print ready", "Portable format"],
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-500/10 to-orange-500/10",
  },
];


export default function IntegrationGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-24 bg-gradient-to-b from-white via-indigo-50/20 to-white" id="integrations">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/50 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Integrations
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-heading mt-4 leading-tight">
            Seamless Publishing
          </h2>
          
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Go live in seconds with direct WordPress publishing, formatted HTML, cloud exports, and more — all from one place.
          </p>
        </motion.div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {integrations.map((integration, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative h-full"
            >
              {/* Animated background glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${integration.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card */}
              <motion.div
                className="relative h-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm group-hover:shadow-xl transition-all duration-300 flex flex-col"
                whileHover={{ 
                  y: -8,
                  borderColor: "rgba(129, 103, 249, 0.3)"
                }}
              >
                {/* Icon Container */}
                <div className="mb-4 flex-shrink-0">
                  <motion.div
                    className={`inline-flex p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${integration.gradient} shadow-lg`}
                    whileHover={{ 
                      scale: 1.15,
                      rotate: 6
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Image
                      src={integration.icon}
                      alt={integration.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain brightness-0 invert"
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {integration.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow">
                    {integration.description}
                  </p>

                  {/* Features List */}
                  <motion.div
                    className="space-y-2 pt-2"
                    animate={{ 
                      opacity: hoveredIndex === i ? 1 : 0.6,
                      height: hoveredIndex === i ? "auto" : "0px"
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    {integration.features.map((feature, j) => (
                      <motion.div
                        key={j}
                        className="flex items-center gap-2 text-xs sm:text-sm text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: hoveredIndex === i ? 1 : 0,
                          x: hoveredIndex === i ? 0 : -10
                        }}
                        transition={{ delay: j * 0.05 }}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${integration.gradient}`} />
                        {feature}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Bottom accent line */}
                <motion.div 
                  className={`h-1 bg-gradient-to-r ${integration.gradient} rounded-full mt-4`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />

                {/* CTA Indicator */}
                <motion.div
                  className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ x: hoveredIndex === i ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Connect now <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p className="text-gray-600 text-lg">
            All integrations available on{" "}
            <motion.span 
              className="font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              Pro and Team plans
            </motion.span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
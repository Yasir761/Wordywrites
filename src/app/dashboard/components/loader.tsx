// 'use client'

// import { motion } from 'framer-motion'

// export default function BlogLoader() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5, ease: 'easeOut' }}
//         className="relative bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl px-8 py-10 w-[90%] max-w-md text-center space-y-6"
//       >
//         {/* Subtle gradient aura matching hero */}
//         <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-50 z-[-1]" />

//         {/* Floating dots matching hero style */}
//         <div className="absolute top-4 right-6 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-60"></div>
//         <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse opacity-60"></div>

//         <motion.h2
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: 'easeOut' }}
//           className="text-xl font-bold text-gray-900 leading-tight"
//         >
//           Creating Your{" "}
//           <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//             AI-Powered
//           </span>{" "}
//           Blog
//         </motion.h2>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4, duration: 0.8 }}
//           className="text-gray-600 text-base leading-relaxed"
//         >
//           Turning your keywords into ready-to-rank content...
//         </motion.p>

//         {/* Hero-style spinning loader */}
//         <motion.div
//           className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"
//           initial={{ rotate: 0 }}
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
//         />

//         {/* Subtle pulse ring matching hero animations */}
//         <div className="w-12 h-12 rounded-full border border-blue-400/20 opacity-30 animate-ping absolute left-1/2 top-[75%] transform -translate-x-1/2 -translate-y-1/2 z-[-1]" />

//         {/* Progress indicator dots */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6, duration: 0.6 }}
//           className="flex justify-center space-x-2"
//         >
//           {[0, 1, 2].map((i) => (
//             <motion.div
//               key={i}
//               className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
//               animate={{
//                 scale: [1, 1.3, 1],
//                 opacity: [0.4, 1, 0.4]
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//                 delay: i * 0.2,
//                 ease: "easeInOut"
//               }}
//             />
//           ))}
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }



"use client"

import { motion } from "framer-motion"

export default function BlogLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl px-8 py-10 w-[90%] max-w-md text-center space-y-6"
      >
        {/* Subtle gradient glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-50 z-[-1]" />

        {/* Floating accent dots */}
        <div className="absolute top-4 right-6 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse opacity-60"></div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xl font-bold text-gray-900 leading-tight"
        >
          Creating Your{" "}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI-Powered
          </span>{" "}
          Blog
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-600 text-base leading-relaxed"
        >
          Turning your keywords into ready-to-rank content...
        </motion.p>

        {/* Smooth spinning loader */}
        <motion.div
          className="w-12 h-12 mx-auto border-4 border-gray-200 rounded-full border-t-blue-500"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />

        {/* Pulse aura centered */}
        <motion.div
          // className="absolute w-16 h-16 rounded-full border border-blue-400/30"
          // animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          // transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          // style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
        />

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

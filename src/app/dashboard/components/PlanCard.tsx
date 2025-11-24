
// "use client";

// import { IconLock } from "@tabler/icons-react";
// import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { motion } from "framer-motion";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { initializePaddle, Paddle } from "@paddle/paddle-js";
// import { useUserPlan } from "@/hooks/useUserPlan"; 
// import { useState, useEffect } from "react";

// export default function UserPlanCard() {
//   const { data, error, isLoading } = useUserPlan();
//   const [upgradeLoading, setUpgradeLoading] = useState(false);
//   const [paddle, setPaddle] = useState<Paddle>();

//   // Initialize Paddle
//   useEffect(() => {
//     initializePaddle({
//       environment: "production",
//       token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
//     }).then(setPaddle);
//   }, []);

//   const handleUpgrade = async () => {
//     setUpgradeLoading(true);

//     const res = await fetch("/api/checkout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ priceId: "pri_01k3amkh5jpxnsb12by5ae99fw" }),
//     });

//     const json = await res.json();

//     if (json.checkoutUrl) {
//       window.location.href = json.checkoutUrl;
//     }

//     setUpgradeLoading(false);
//   };

//   if (isLoading) {
//     return (
//       <Card className="p-5 animate-pulse">
//         <CardTitle className="text-sm font-medium text-gray-600">Loading...</CardTitle>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="p-5 bg-red-50 border border-red-200">
//         <CardTitle>Error</CardTitle>
//         <CardDescription>{error.toString()}</CardDescription>
//       </Card>
//     );
//   }

//   const isFree = data?.plan === "Free";

//   return (
//     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
//       <Card className="relative rounded-2xl bg-white/70 backdrop-blur-md">
//         {/* Badge */}
//         <div className="absolute top-4 right-4">
//           {isFree ? (
//             <Badge className="border-yellow-300 bg-yellow-50 text-yellow-700">
//               {data.blogsLeft} left
//             </Badge>
//           ) : (
//             <Badge className="border-green-300 bg-green-50 text-green-700">
//               Pro
//             </Badge>
//           )}
//         </div>

//         <CardHeader>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
//               <IconLock className="w-5 h-5" />
//             </div>
//             <div>
//               <CardDescription className="text-sm font-medium text-gray-600">Your Plan</CardDescription>
//               <CardTitle className="text-2xl font-bold text-gray-900">{data.plan}</CardTitle>
//             </div>
//           </div>
//         </CardHeader>

//         <CardFooter className="flex flex-col items-start gap-2">
//           {isFree ? (
//             <Button
//               className="w-full bg-indigo-600 hover:bg-indigo-700"
//               onClick={handleUpgrade}
//               disabled={upgradeLoading}
//             >
//               {upgradeLoading ? "Starting checkout..." : "Upgrade to Pro"}
//             </Button>
//           ) : (
//             <p className="text-sm font-medium">Enjoy unlimited blogs</p>
//           )}
//           <span className="text-xs text-muted-foreground">Tracked in real-time</span>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// }





"use client";

import { IconLock } from "@tabler/icons-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useState, useEffect } from "react";

export default function UserPlanCard() {
  const { data, error, isLoading } = useUserPlan();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [paddle, setPaddle] = useState<Paddle>();

  // Initialize Paddle
  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle);
  }, []);

  const handleUpgrade = async () => {
    setUpgradeLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "pri_01k3amkh5jpxnsb12by5ae99fw" }),
    });

    const json = await res.json();
    if (json.checkoutUrl) window.location.href = json.checkoutUrl;

    setUpgradeLoading(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-4 rounded-lg border border-border bg-card animate-pulse">
        <CardTitle className="text-sm font-heading text-muted-foreground">Loading...</CardTitle>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-4 rounded-lg border border-red-500/20 bg-red-500/10">
        <CardTitle className="text-foreground font-heading">Error</CardTitle>
        <CardDescription className="text-muted-foreground">{`${error}`}</CardDescription>
      </Card>
    );
  }

  const isFree = data?.plan === "Free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card
        className="
          relative rounded-lg border border-border bg-card
          shadow-[0_0_0_1px_var(--border)]
          hover:shadow-[0_0_0_1px_var(--ai-accent)]
          transition-all
        "
      >
        {/* Badge */}
        <div className="absolute top-3 right-3">
          {isFree ? (
            <Badge className="text-[10px] font-medium px-2 py-0.5 border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
              {data.blogsLeft} left
            </Badge>
          ) : (
            <Badge className="text-[10px] font-medium px-2 py-0.5 border border-ai-accent/40 bg-ai-accent/10 text-ai-accent">
              Pro
            </Badge>
          )}
        </div>

        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10 rounded-lg flex items-center justify-center
                bg-ai-accent-dim text-ai-accent
              "
            >
              <IconLock className="w-5 h-5" />
            </div>

            <div>
              <CardDescription className="text-xs font-heading tracking-tight text-muted-foreground">
                Your Plan
              </CardDescription>

              <CardTitle className="text-xl font-heading font-semibold text-foreground">
                {data.plan}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col items-start gap-2 pt-0">
          {isFree ? (
            <Button
              className="
                w-full text-sm font-heading
                bg-ai-accent text-white
                hover:bg-ai-accent/90 transition-colors
              "
              onClick={handleUpgrade}
              disabled={upgradeLoading}
            >
              {upgradeLoading ? "Starting checkout..." : "Upgrade to Pro"}
            </Button>
          ) : (
            <p className="text-sm font-heading text-foreground">Unlimited blog access</p>
          )}

          <span className="text-[11px] text-muted-foreground">
            Tracked in real-time
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}


// 'use client'

// import { useEffect, useState } from 'react'
// import { Check, X } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { initializePaddle, Paddle } from "@paddle/paddle-js";
// import { useAuth } from "@clerk/nextjs";

// const plans = [
//   {
//     name: 'Free',
//     price: '$0',
//     description: 'Perfect for testing Wordywrites.',
//     features: [
//       { label: 'Keyword Agent', included: true },
//       { label: 'Outline Agent', included: true },
//       { label: 'Blog Writing Agent — 5 posts/month', included: true },
//       { label: 'SEO Agent', included: false },
//       { label: 'Tone Agent', included: false },
//       { label: 'Hashtag Agent', included: false },
//       { label: 'Content Preview Agent', included: false },
//       { label: 'Analyze Agent', included: false },
//       { label: 'Crawl Agent', included: false },
//       { label: 'Publish to WordPress', included: false },
//       { label: 'Copy for Medium', included: false },
//     ],
//     cta: 'Start for Free',
//     highlight: false,
//   },
//   {
//     name: 'Pro',
//     price: '$9.99/mo',
//     description: 'Everything you need to blog better.',
//     features: [
//       { label: 'Unlimited Blog Writing', included: true },
//       { label: 'Keyword Agent', included: true },
//       { label: 'Outline Agent', included: true },
//       { label: 'SEO Agent', included: true },
//       { label: 'Tone Agent', included: true },
//       { label: 'Hashtag Agent', included: true },
//       { label: 'Content Preview Agent', included: true },
//       { label: 'Analyze Agent', included: true },
//       { label: 'Crawl Agent', included: true },
//       { label: 'Publish to WordPress', included: true },
//       { label: 'Copy for Medium', included: true },
//     ],
//     cta: 'Go Pro',
//     highlight: true,
//     priceId: 'pri_01k3amkh5jpxnsb12by5ae99fw', 
//   },
// ]

// export default function Pricing() {
//   const [paddle, setPaddle] = useState<Paddle>()


//   // Initialize Paddle once on mount
//   useEffect(() => {
//     initializePaddle({
//       environment: "production", // or "sandbox" while testing
//       token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
//     }).then((paddleInstance) => setPaddle(paddleInstance))
//   }, [])




//   const { isSignedIn } = useAuth();



//   useEffect(() => {
//   const url = new URL(window.location.href);
//   if (url.searchParams.get("plan") === "pro" && isSignedIn) {
//     handleCheckout(plans[1].priceId);
//   }
// }, [isSignedIn, paddle]);



//   const handleCheckout = async (priceId?: string) => {


//     if (!isSignedIn) {
//     // redirect user to sign-in page before doing checkout
//     window.location.href = "/sign-in?redirect_url=components/pricinpricing?plan=pro"
// ; 
//     return;
//   }
//     if (!paddle) return alert("Paddle not initialized")
//     if (!priceId) return alert("Missing priceId")

//     // paddle.Checkout.open({
//     //   items: [{ priceId, quantity: 1 }],
     
//     //   settings: {
//     //     displayMode: "overlay",
//     //     theme: "dark",
//     //     successUrl: "http://localhost:3000/dashboard",
//     //     // cancelUrl: "https://wordywrite.app/cancel",
//     //   },
//     // })

// try {
//     const res = await fetch("/api/checkout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ priceId }),
//     })

//     if (!res.ok) {
//       const text = await res.text()
//       throw new Error(`Checkout API failed: ${res.status} ${text}`)
//     }

//     const data = await res.json()

//     if (data.checkoutUrl) {
//       window.location.href = data.checkoutUrl
//     } else {
//       alert("Failed to get checkout URL. Please try again.")
//     }
//   } catch (err) {
//     console.error("Checkout error:", err)
//     alert(err instanceof Error ? err.message : "Unknown error occurred")
//   } 

//   }

//   return (
//     <section className="py-24 scroll-mt-28" id="pricing">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
//         <p className="mt-2 text-gray-600 text-base sm:text-lg">
//           No hidden fees. No credit card required for Free plan.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 sm:px-6">
//         {plans.map((plan, i) => (
//           <div
//             key={i}
//             className={`relative rounded-3xl p-6 border transition duration-300 shadow-sm hover:shadow-md
//               ${
//                 plan.highlight
//                   ? 'border-indigo-500 bg-white/80 backdrop-blur-lg ring-2 ring-indigo-300'
//                   : 'border-gray-200 bg-white/70'
//               }`}
//           >
//             {plan.highlight && (
//               <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
//                 Most Popular
//               </div>
//             )}

//             <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
//             <p className="mt-1 text-3xl font-bold text-gray-900">{plan.price}</p>
//             <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>

//             <ul className="mt-6 space-y-3 text-left text-sm text-gray-700">
//               {plan.features.map((feature, idx) => (
//                 <li key={idx} className="flex items-center gap-2">
//                   {feature.included ? (
//                     <Check className="w-4 h-4 text-green-600" />
//                   ) : (
//                     <X className="w-4 h-4 text-gray-400" />
//                   )}
//                   {feature.label}
//                 </li>
//               ))}
//             </ul>

//             <Button
//               className="mt-6 w-full"
//  onClick={() => {
//   if (plan.name === "Free") {
//     return isSignedIn
//       ? (window.location.href = "/dashboard")
//       : (window.location.href = "/sign-up");
//   }

//   if (!isSignedIn) {
//     return (window.location.href = "/sign-in?redirect_url=/pricing?plan=pro");
//   }

//   handleCheckout(plan.priceId);
// }}

//             >
//               {plan.cta}
//             </Button>
//           </div>
//         ))}
//       </div>
//     </section>
//   )
// }









"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useAuth } from "@clerk/nextjs";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for testing Wordywrites.",
    features: [
      { label: "Keyword Agent", included: true },
      { label: "Outline Agent", included: true },
      { label: "Blog Writing Agent — 5 posts/month", included: true },
      { label: "SEO Agent", included: false },
      { label: "Tone Agent", included: false },
      { label: "Hashtag Agent", included: false },
      { label: "Content Preview Agent", included: false },
      { label: "Analyze Agent", included: false },
      { label: "Crawl Agent", included: false },
      { label: "Publish to WordPress", included: false },
      { label: "Copy for Medium", included: false },
    ],
    cta: "Start for Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    description: "Everything you need to blog better.",
    features: [
      { label: "Unlimited Blog Writing", included: true },
      { label: "Keyword Agent", included: true },
      { label: "Outline Agent", included: true },
      { label: "SEO Agent", included: true },
      { label: "Tone Agent", included: true },
      { label: "Hashtag Agent", included: true },
      { label: "Content Preview Agent", included: true },
      { label: "Analyze Agent", included: true },
      { label: "Crawl Agent", included: true },
      { label: "Publish to WordPress", included: true },
      { label: "Copy for Medium", included: true },
    ],
    cta: "Go Pro",
    highlight: true,
    priceId: "pri_01k3amkh5jpxnsb12by5ae99fw",
  },
];

export default function Pricing() {
  const [paddle, setPaddle] = useState<Paddle>();
  const { isSignedIn } = useAuth();

  // 1) Initialize Paddle
  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(setPaddle);
  }, []);

  // 2) Resume checkout after login
  useEffect(() => {
    if (!isSignedIn || !paddle) return;

    const url = new URL(window.location.href);
    if (url.searchParams.get("plan") === "pro") {
      handleCheckout(plans[1].priceId);
      url.searchParams.delete("plan");
      window.history.replaceState({}, "", url); // clean url
    }
  }, [isSignedIn, paddle]);

  const handleCheckout = async (priceId?: string) => {
    if (!isSignedIn) {
      // redirect for login and return back to checkout
      window.location.href = "/sign-in?redirect_url=/pricing?plan=pro";
      return;
    }

    if (!paddle) return alert("Paddle not initialized");
    if (!priceId) return alert("Missing priceId");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment failed — please try again.");
    }
  };

  return (
    <section className="py-24 scroll-mt-28" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-gray-600 text-base sm:text-lg">
          No hidden fees. No credit card required for Free plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 sm:px-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative rounded-3xl p-6 border transition shadow-sm hover:shadow-md
            ${plan.highlight ? "border-indigo-500 ring-2 ring-indigo-300" : "border-gray-200"}`}
          >
            {plan.highlight && (
              <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-3xl font-bold">{plan.price}</p>
            <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>

            <ul className="mt-6 space-y-3 text-left text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  {feature.label}
                </li>
              ))}
            </ul>

            <Button
  className="mt-6 w-full"
  type="button"         // prevents button from acting like a link or form submitter
  onClick={() => {
    if (plan.name === "Free") {
  return isSignedIn
    ? (window.location.href = "/dashboard")
    : (window.location.href = "/sign-up");
}
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }
    handleCheckout(plan.priceId);
  }}
>
  {plan.cta}
</Button>
          </div>
        ))}
      </div>
    </section>
  );
}

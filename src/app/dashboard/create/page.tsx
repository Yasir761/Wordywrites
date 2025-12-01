

// "use client";

// import { useEffect, useState } from "react";
// import Loader from "@/app/dashboard/components/loader";
// import BlogEditor from "@/components/blog/blogEditor";
// import { useRouter } from "next/navigation";
// import TeaserSection from "@/app/dashboard/components/TeaserSection";
// import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
// import {showToast} from "@/lib/toast";

// // FeatureLock wrapper
// const FeatureLock = ({ isLocked, children }: { isLocked: boolean; children: React.ReactNode }) => {
//   return (
    
//     <div className="relative">
//       <div className={isLocked ? "blur-sm select-none pointer-events-none" : ""}>{children}</div>
//       {isLocked && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-xl backdrop-blur-sm">
//           <button
//             onClick={() => (window.location.href = "/pricing")}
//             className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold shadow hover:from-purple-700 hover:to-cyan-700"
//           >
//             🔒 Upgrade to Publish
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// interface BlogData {
//   keyword: string;
//   intent?: string;
//   tone?: string;
//   voice?: string;
//   outline?: any;
//   tags?: string[];
//   seo?: {
//     optimized_title?: string;
//     meta_description?: string;
//     slug?: string;
//     final_hashtags?: string[];
//   };
//   blog?: string;
//   contentpreview?: {
//     teasers: string[];
//     hashtags: string[];
//     engagementCTA: string;
//   };
// }

// export default function BlogGenerator() {
//   const [keyword, setKeyword] = useState("");
//   const [tone, setTone] = useState("Informative");
//   const [isLoading, setIsLoading] = useState(false);
//   const [blogData, setBlogData] = useState<BlogData | null>(null);
//   const [isClient, setIsClient] = useState(false);

//   const [userPlan, setUserPlan] = useState<string | null>(null);
//   const [blogsLeft, setBlogsLeft] = useState<number | null>(null);

//   // New subject/topic flow
//   const [subject, setSubject] = useState("");
//   const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
//   const [step, setStep] = useState<"input" | "choose-topic" | "generate">("input");

//   const router = useRouter();

//   // Fetch user plan from backend
//   useEffect(() => {
//     setIsClient(true);
//     const fetchPlan = async () => {
//       try {
//         const res = await fetch("/api/user/plan");
//         const data = await res.json();
//         setUserPlan(data.plan);
//         setBlogsLeft(data.blogsLeft);
//       } catch (err) {
//         console.error("Failed to fetch user plan:", err);
//         setUserPlan("Free");
//       }
//     };
//     fetchPlan();

//     const savedBlog = localStorage.getItem("blogData");
//     if (savedBlog) {
//       setBlogData(JSON.parse(savedBlog));
//       console.log("🧠 Loaded from localStorage:", savedBlog);
//     }
//   }, []);

//   // Save blogData
//   useEffect(() => {
//     if (blogData) {
//       localStorage.setItem("blogData", JSON.stringify(blogData));
//       console.log("✅ Saved to localStorage:", blogData);
//     }
//   }, [blogData]);

//   const fetchSuggestions = async () => {
//     if (!keyword.trim()) return;
//     setIsLoading(true);
//     try {
//       const res = await fetch(`/api/agents/topic-suggestions`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ keyword }),
//       });
//       const data = await res.json();
//       setSuggestedTopics(data.topics || []);
//       setStep("choose-topic");
//     } catch (err) {
//       console.error("Failed to fetch topics:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const generateBlog = async () => {
//     if (!subject) return;
//     setIsLoading(true);
//     try {
//       const res = await fetch(`/api/agents/orchestrator`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ keyword, subject, tone }),
//       });
// const data = await res.json();
// setBlogData(data);
// setStep("generate");
// showToast({
//   type: "success",
//   title: "Your blog is ready!",
//   description: "You can now preview, edit, and publish it.",
// });
//     } catch (error) {
//       console.error("Error generating blog:", error);
//       showToast({
//         type: "error",
//         title: "Blog generation failed",
//         description: "Please try again later.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <LocalErrorBoundary>
//     <div className="min-h-screen bg-white relative overflow-hidden">
//       <div className="relative max-w-4xl mx-auto py-20 px-4 space-y-10">
//         {isLoading && <Loader />}

//         {/* Step 1: Input */}
//        {/* STEP 1 — INPUT */}
// {!isLoading && !blogData && step === "input" && (
//   <div className="flex flex-col items-center text-center space-y-10">
//     <div>
//       {/* <span className="text-xs px-4 py-1.5 rounded-full bg-ai-accent/10 border border-ai-accent/30 text-ai-accent font-medium tracking-wide">
//         ⚡ AI-Powered Content Creation
//       </span> */}

//       <h1 className="mt-6 text-[46px] md:text-[62px] font-black tracking-tight text-foreground">
//         Generate <span className="text-ai-accent">SEO Blogs</span> Instantly
//       </h1>
//       <p className="text-[17px] text-muted-foreground max-w-2xl mt-4">
//         Turn a simple keyword into a high-converting blog post with title,
//         metadata, hashtags and teasers — crafted by autonomous AI agents.
//       </p>
//     </div>

//     {/* MODULE CARD */}
//     <div className="w-full max-w-2xl bg-white/90 border border-border rounded-2xl shadow-xl p-6 space-y-5 backdrop-blur-md">
//       <input
//         type="text"
//         placeholder="e.g. Fitness apps for seniors..."
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         className="w-full px-5 py-4 bg-muted/50 rounded-xl border border-border focus:border-ai-accent outline-none text-lg"
//       />

//       <div className="flex gap-4 justify-center">
//         <button
//           onClick={() => {
//             setSubject(keyword);
//             generateBlog();
//           }}
//           disabled={!keyword.trim()}
//           className="px-6 py-3 rounded-xl font-semibold bg-ai-accent text-white shadow hover:brightness-110 disabled:opacity-50"
//         >
//            Generate Blog
//         </button>

//         <button
//           onClick={fetchSuggestions}
//           disabled={!keyword.trim()}
//           className="px-6 py-3 rounded-xl font-medium bg-muted hover:bg-muted/70 border disabled:opacity-50"
//         >
//            Find Trending Topics
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//         {/* Step 2: Choose topic */}
//       {/* Step 2: Choose topic */}
// {!isLoading && !blogData && step === "choose-topic" && (
//   <div className="space-y-6">
//     <h3 className="text-2xl font-bold text-gray-900 text-center">
//       Choose a Topic
//     </h3>
//     <div className="grid gap-4">
//       {suggestedTopics.map((topic: any, index) => {
//         const chosen = typeof topic === "string" ? topic : topic.title;
//         return (
//           <button
//             key={index}
//             onClick={() => {
//               setSubject(chosen);
//               generateBlog();
//             }}
//             className="w-full text-left px-6 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
//           >
//             {typeof topic === "string" ? (
//               topic
//             ) : (
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-900">{topic.title}</span>
//                 {topic.reason && (
//                   <span className="text-sm text-gray-500">{topic.reason}</span>
//                 )}
//               </div>
//             )}
//           </button>
//         );
//       })}
//     </div>
//     <div className="text-center">
//       <button
//         onClick={() => setStep("input")}
//         className="text-sm text-gray-500 hover:underline"
//       >
//         ← Back
//       </button>
//     </div>
//   </div>
// )}


//         {/* Step 3: Generated Blog */}
//         {/* STEP 3 — BLOG OUTPUT PIPELINE */}
// {/* STEP 3 — BLOG OUTPUT PIPELINE */}
// {!isLoading && blogData && step === "generate" && (
//   <div className="space-y-14 animate-in fade-in duration-700">

//     {/* Pipeline indicator */}
//     <div className="flex items-center justify-center gap-3 text-[13px] font-medium text-ai-accent/80">
//       <span className="w-1.5 h-1.5 rounded-full bg-ai-accent"></span>
//       Powered by Multi-Agent AI Pipeline
//       <span className="w-1.5 h-1.5 rounded-full bg-ai-accent"></span>
//     </div>

//     {/* KEYWORD */}
//     <div
//       className="
//         bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl
//         shadow-[0_8px_24px_-6px_rgba(0,0,0,0.18),0_0_30px_-12px_var(--ai-accent)]
//         hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.22),0_0_40px_-8px_var(--ai-accent)]
//         p-8 transition-all duration-300 hover:-translate-y-[2px]
//       "
//     >
//       <h3 className="text-sm uppercase font-semibold tracking-wider text-purple-600 mb-2">
//         Target Keyword
//       </h3>
//       <p className="text-2xl font-bold text-foreground">{blogData.keyword}</p>
//     </div>

//     {/* SEO TITLE */}
//     <FeatureLock isLocked={userPlan === "Free"}>
//       <div
//         className="
//           bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl
//           shadow-[0_8px_24px_-6px_rgba(0,0,0,0.18),0_0_30px_-12px_var(--ai-accent)]
//           hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.22),0_0_40px_-8px_var(--ai-accent)]
//           p-8 transition-all duration-300 hover:-translate-y-[2px]
//         "
//       >
//         <h3 className="text-sm uppercase font-semibold tracking-wider text-cyan-600 mb-2">
//           SEO Title
//         </h3>
//         <p className="text-xl font-semibold text-foreground">{blogData.seo?.optimized_title}</p>
//       </div>
//     </FeatureLock>

//     {/* META DESCRIPTION */}
//     <FeatureLock isLocked={userPlan === "Free"}>
//       <div
//         className="
//           bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl
//           shadow-[0_8px_24px_-6px_rgba(0,0,0,0.18),0_0_30px_-12px_var(--ai-accent)]
//           hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.22),0_0_40px_-8px_var(--ai-accent)]
//           p-8 transition-all duration-300 hover:-translate-y-[2px]
//         "
//       >
//         <h3 className="text-sm uppercase font-semibold tracking-wider text-emerald-600 mb-2">
//           Meta Description
//         </h3>
//         <p className="text-[15px] text-muted-foreground leading-relaxed">
//           {blogData.seo?.meta_description}
//         </p>
//       </div>
//     </FeatureLock>

//     {/* HASHTAGS */}
//     <FeatureLock isLocked={userPlan === "Free"}>
//       <div
//         className="
//           bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl
//           shadow-[0_8px_24px_-6px_rgba(0,0,0,0.18),0_0_30px_-12px_var(--ai-accent)]
//           hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.22),0_0_40px_-8px_var(--ai-accent)]
//           p-8 transition-all duration-300 hover:-translate-y-[2px]
//         "
//       >
//         <h3 className="text-sm uppercase font-semibold tracking-wider text-pink-600 mb-4">
//           Hashtags
//         </h3>
//         <div className="flex flex-wrap gap-2">
//           {blogData.seo?.final_hashtags?.map((tag) => (
//             <span key={tag} className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-medium">
//               #{tag}
//             </span>
//           ))}
//         </div>
//       </div>
//     </FeatureLock>

//     {/* BLOG EDITOR */}
//     <div
//       className="
//         bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl
//         shadow-[0_8px_24px_-6px_rgba(0,0,0,0.20),0_0_40px_-10px_var(--ai-accent)]
//         hover:shadow-[0_12px_38px_-4px_rgba(0,0,0,0.26),0_0_55px_-6px_var(--ai-accent)]
//         p-10 transition-all duration-300 hover:-translate-y-[3px]
//       "
//     >
//       <h3 className="text-sm uppercase font-semibold tracking-wider text-indigo-600 mb-6">
//         Blog Content Editor
//       </h3>
//       {isClient ? (
//         <BlogEditor content={blogData.blog ?? ""} onSave={() => {}} />
//       ) : (
//         <div className="text-sm text-muted-foreground">Loading editor…</div>
//       )}
//     </div>

//     {/* TEASERS */}
//     {blogData.contentpreview && (
//       <FeatureLock isLocked={userPlan === "Free"}>
//         <TeaserSection
//           teasers={blogData.contentpreview.teasers}
//           hashtags={blogData.contentpreview.hashtags}
//           engagementCTA={blogData.contentpreview.engagementCTA}
//         />
//       </FeatureLock>
//     )}

//     {/* ACTION BUTTONS */}
//     <div className="flex justify-center gap-4 pt-4">
//       <button
//         onClick={() => {
//           setBlogData(null);
//           setStep("input");
//           localStorage.removeItem("blogData");
//         }}
//         className="px-6 py-3 rounded-xl font-medium border bg-muted hover:bg-muted/80 transition-all"
//       >
//         Generate New
//       </button>

//       <FeatureLock isLocked={userPlan === "Free"}>
//         <button
//           onClick={() => router.push("/dashboard/wordpress")}
//           className="px-6 py-3 rounded-xl font-semibold bg-ai-accent text-white shadow-lg hover:brightness-110 transition-all"
//         >
//           Publish Blog
//         </button>
//       </FeatureLock>
//     </div>
//   </div>
// )}


//       </div>
//     </div>
//     </LocalErrorBoundary>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import Loader from "@/app/dashboard/components/loader";
import BlogEditor from "@/components/blog/blogEditor";
import { useRouter } from "next/navigation";
import TeaserSection from "@/app/dashboard/components/TeaserSection";
import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
import { showToast } from "@/lib/toast";

// Lock Wrapper
const FeatureLock = ({ isLocked, children }: { isLocked: boolean; children: React.ReactNode }) => (
  <div className="relative">
    <div className={isLocked ? "blur-sm select-none pointer-events-none" : ""}>{children}</div>
    {isLocked && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-xl backdrop-blur-sm">
        <button
          onClick={() => (window.location.href = "/pricing")}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold shadow hover:from-purple-700 hover:to-cyan-700"
        >
          🔒 Upgrade to Publish
        </button>
      </div>
    )}
  </div>
);

interface BlogData {
  keyword: string;
  intent?: string;
  tone?: string;
  voice?: string;
  outline?: any;
  tags?: string[];
  seo?: {
    optimized_title?: string;
    meta_description?: string;
    slug?: string;
    final_hashtags?: string[];
  };
  blog?: string;
  contentpreview?: {
    teasers: string[];
    hashtags: string[];
    engagementCTA: string;
  };
}

export default function BlogGenerator() {
  const [keyword, setKeyword] = useState("");
  const [tone] = useState("Informative");
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [suggestedTopics, setSuggestedTopics] = useState<Array<string | { title: string; reason?: string }>>([]);
  const [step, setStep] = useState<"input" | "choose-topic" | "generate">("input");

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const load = async () => {
      try {
        const res = await fetch("/api/user/plan");
        const data = await res.json();
        setUserPlan(data.plan);
      } catch {
        setUserPlan("Free");
      }
    };
    load();
    const saved = localStorage.getItem("blogData");
    if (saved) setBlogData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (blogData) localStorage.setItem("blogData", JSON.stringify(blogData));
  }, [blogData]);

  const fetchSuggestions = async () => {
    if (!keyword.trim()) return;
    setIsLoading(true);
    try {
      const r = await fetch(`/api/agents/topic-suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const d = await r.json();
      setSuggestedTopics(d.topics || []);
      setStep("choose-topic");
    } finally {
      setIsLoading(false);
    }
  };

  const generateBlog = async () => {
    if (!subject) return;
    setIsLoading(true);
    try {
      const r = await fetch(`/api/agents/orchestrator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, subject, tone }),
      });
      const d = await r.json();
      setBlogData(d);
      setStep("generate");
      showToast({
        type: "success",
        title: "Your blog is ready!",
        description: "You can now preview, edit, and publish it.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Blog generation failed",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalErrorBoundary>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-[#fafbff] to-[#f4f7ff]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,137,255,0.16),transparent_60%)] blur-3xl" />

        <div className="relative max-w-4xl mx-auto py-20 px-4 space-y-14 animate-in fade-in duration-700">
          {isLoading && <Loader />}

          {/* STEP 1 — INPUT */}
          {!isLoading && !blogData && step === "input" && (
            <div className="flex flex-col items-center text-center space-y-10 animate-in fade-in duration-500">
              <h1 className="text-[46px] md:text-[62px] font-semibold tracking-tight leading-[1.1] text-foreground">
                Generate <span className="text-ai-accent font-extrabold">SEO Blogs</span> Instantly
              </h1>
              <p className="text-[17px] text-muted-foreground max-w-2xl leading-relaxed">
                AI turns your keyword into a fully-optimized blog post — title, metadata, hashtags & teasers,
                crafted by autonomous writing agents.
              </p>

              {/* Card */}
              <div className="w-full max-w-2xl bg-white/90 border border-border/60 rounded-2xl backdrop-blur-xl p-7 space-y-6 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_42px_-6px_rgba(0,0,0,0.26)] transition-all duration-300">
                <input
                  type="text"
                  placeholder="e.g. Fitness apps for seniors..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-neutral-50/70 border border-border/60 focus:border-ai-accent focus:ring-2 focus:ring-ai-accent/30 outline-none text-lg transition-all"
                />

                <p className="text-[13px] text-muted-foreground">
                  Try something like: <span className="font-medium text-foreground">“Marketing tools for dentists”</span>
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSubject(keyword);
                      generateBlog();
                    }}
                    disabled={!keyword.trim()}
                    className="px-6 py-3 rounded-xl font-semibold bg-ai-accent text-white shadow hover:brightness-110 disabled:opacity-50"
                  >
                    Generate Blog
                  </button>
                  <button
                    onClick={fetchSuggestions}
                    disabled={!keyword.trim()}
                    className="px-6 py-3 rounded-xl font-medium bg-muted hover:bg-muted/80 border disabled:opacity-50"
                  >
                    Find Trending Topics
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — TOPIC SELECTION */}
          {!isLoading && !blogData && step === "choose-topic" && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-2xl font-bold text-center">Choose a Topic</h3>
              <div className="grid gap-4">
                {suggestedTopics.map((topic, i) => {
                  const chosen = typeof topic === "string" ? topic : topic.title;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSubject(chosen);
                        generateBlog();
                      }}
                      className="w-full text-left px-6 py-4 rounded-xl bg-white border hover:bg-muted/60 shadow transition-all"
                    >
                      {typeof topic === "string" ? topic : (
                        <>
                          <span className="font-medium">{topic.title}</span>
                          <span className="block text-sm text-muted-foreground">{topic.reason}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setStep("input")} className="text-sm text-muted-foreground hover:underline mx-auto block">
                ← Back
              </button>
            </div>
          )}

          {/* STEP 3 — OUTPUT */}
          {!isLoading && blogData && step === "generate" && (
            <div className="space-y-14 animate-in fade-in duration-700">

              {/* Label */}
              <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-ai-accent/80">
                <span className="w-1.5 h-1.5 rounded-full bg-ai-accent"></span>
                Multi-Agent AI Pipeline Completed
                <span className="w-1.5 h-1.5 rounded-full bg-ai-accent"></span>
              </div>

              {/* Cards */}
              {/** KEYWORD CARD */}
              <div className="premium-card">
                <h3 className="section-title text-purple-600">Target Keyword</h3>
                <p className="section-text">{blogData.keyword}</p>
              </div>

              {/** SEO TITLE */}
              <FeatureLock isLocked={userPlan === "Free"}>
                <div className="premium-card">
                  <h3 className="section-title text-cyan-600">SEO Title</h3>
                  <p className="section-text">{blogData.seo?.optimized_title}</p>
                </div>
              </FeatureLock>

              {/** META */}
              <FeatureLock isLocked={userPlan === "Free"}>
                <div className="premium-card">
                  <h3 className="section-title text-emerald-600">Meta Description</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {blogData.seo?.meta_description}
                  </p>
                </div>
              </FeatureLock>

              {/** HASHTAGS */}
              <FeatureLock isLocked={userPlan === "Free"}>
                <div className="premium-card">
                  <h3 className="section-title text-pink-600 mb-4">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogData.seo?.final_hashtags?.map(tag => (
                      <span key={tag} className="tag-badge">#{tag}</span>
                    ))}
                  </div>
                </div>
              </FeatureLock>

              {/** EDITOR */}
              <div className="premium-card p-10 hover:-translate-y-[3px] duration-300">
                <h3 className="section-title text-indigo-600 mb-6">Blog Content Editor</h3>
                {isClient ? (
                  <BlogEditor content={blogData.blog ?? ""} onSave={() => {}} />
                ) : <p className="text-sm text-muted-foreground">Loading editor…</p>}
              </div>

              {/** TEASERS */}
              {blogData.contentpreview && (
                <FeatureLock isLocked={userPlan === "Free"}>
                  <TeaserSection
                    teasers={blogData.contentpreview.teasers}
                    hashtags={blogData.contentpreview.hashtags}
                    engagementCTA={blogData.contentpreview.engagementCTA}
                  />
                </FeatureLock>
              )}

              {/* ACTIONS */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setBlogData(null);
                    setStep("input");
                    localStorage.removeItem("blogData");
                  }}
                  className="px-6 py-3 rounded-xl font-medium border bg-muted hover:bg-muted/80 transition-all"
                >
                  Generate New
                </button>
                <FeatureLock isLocked={userPlan === "Free"}>
                  <button
                    onClick={() => router.push("/dashboard/wordpress")}
                    className="px-6 py-3 rounded-xl font-semibold bg-ai-accent text-white shadow-lg hover:brightness-110 transition-all"
                  >
                    Publish Blog
                  </button>
                </FeatureLock>
              </div>
            </div>
          )}
        </div>
      </div>
    </LocalErrorBoundary>
  );
}

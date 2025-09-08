

// "use client";

// import { useEffect, useState } from "react";
// import Loader from "@/app/dashboard/components/loader";
// import BlogEditor from "@/components/blog/blogEditor";
// import { useRouter } from "next/navigation";
// import TeaserSection from "@/app/dashboard/components/TeaserSection";

// // FeatureLock wrapper
// const FeatureLock = ({ isLocked, children }: { isLocked: boolean; children: React.ReactNode }) => {
//   return (
//     <div className="relative">
//       <div className={isLocked ? "blur-sm select-none pointer-events-none" : ""}>{children}</div>
//       {isLocked && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-xl backdrop-blur-sm">
//           {/* <p className="text-gray-800 font-medium mb-8"> Upgrade to unlock this feature</p> */}
//           <button
//             onClick={() => window.location.href = "/pricing"} // 👈 redirect to upgrade page
//             className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold shadow hover:from-purple-700 hover:to-cyan-700"
//           >
//            🔒 Upgrade to Publish
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

//   const [userPlan, setUserPlan] = useState<string | null>(null); // 👈 dynamic plan
//   const [blogsLeft, setBlogsLeft] = useState<number | null>(null);


//   // suggestions


//   const [subject, setSubject] = useState("");  // subject/title chosen
// const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
// const [step, setStep] = useState<"input" | "choose-topic" | "generate">("input");

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
//         setUserPlan("Free"); // fallback
//       }
//     };
//     fetchPlan();

//     // Load blogData from localStorage
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
// const fetchSuggestions = async () => {
//   if (!keyword.trim()) return;
//   setIsLoading(true);
//   try {
//     const res = await fetch(`/api/agents/topic-suggestions`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ keyword }),
//     });
//     const data = await res.json();
//     setSuggestedTopics(data.topics || []);
//     setStep("choose-topic");
//   } catch (err) {
//     console.error("Failed to fetch topics:", err);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // const generateBlog = async () => {
//   //   if (!keyword) return;
//   //   setIsLoading(true);
//   //   try {
//   //     const res = await fetch(`/api/agents/orchestrator`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ keyword, tone }),
//   //     });
//   //     const data = await res.json();
//   //     setBlogData(data);
//   //   } catch (error) {
//   //     console.error("Error generating blog:", error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };



//   const generateBlog = async () => {
//   if (!subject) return; // now based on subject, not just keyword
//   setIsLoading(true);
//   try {
//     const res = await fetch(`/api/agents/orchestrator`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ keyword, subject, tone }),
//     });
//     const data = await res.json();
//     setBlogData(data);
//     setStep("generate");
//   } catch (error) {
//     console.error("Error generating blog:", error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-white relative overflow-hidden">
//       <div className="relative max-w-4xl mx-auto py-20 px-4 space-y-10">
//         {isLoading && <Loader />}

//         {/* Initial UI */}
//         {!isLoading && !blogData && (
//           <div className="flex flex-col items-center space-y-8 text-center">
//             <div className="space-y-6">
//               <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm">
//                 <span className="text-sm font-medium text-cyan-300">
//                   ✨ AI-Powered Content Creation
//                 </span>
//               </div>
//               <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
//                 Generate SEO Blogs
//                 <span className="block bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
//                   Instantly
//                 </span>
//               </h1>
//               <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
//                 Transform your keywords into high-converting, SEO-optimized blog
//                 posts with our advanced AI technology
//               </p>
//               {/* {blogsLeft !== null && (
//                 <p className="text-sm text-gray-500">
//                   {userPlan} Plan • {blogsLeft} blogs left this month
//                 </p>
//               )} */}
//             </div>

//             {/* Search Input */}
//             <div className="w-full max-w-2xl">
//               <div className="relative group">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
//                 <div className="relative flex rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shadow-lg">
//                   <input
//                     type="text"
//                     placeholder="Enter your keyword or topic..."
//                     value={keyword}
//                     onChange={(e) => setKeyword(e.target.value)}
//                     className="flex-grow px-6 py-4 text-lg bg-transparent text-gray-900 placeholder-gray-500 outline-none"
//                     onKeyPress={(e) => e.key === "Enter" && generateBlog()}
//                   />
//                   <button
//                     onClick={generateBlog}
//                     disabled={!keyword.trim()}
//                     className="relative bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
//                   >
//                     <span className="relative z-10">Generate</span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Generated Blog UI */}
//         {!isLoading && blogData && (
//           <div className="space-y-8 animate-in fade-in duration-700">
//             {/* Keyword Card */}
//             <div className="relative group">
//               <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
//               <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
//                 <div className="flex items-center space-x-3 mb-3">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                   <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
//                     Target Keyword
//                   </h3>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {blogData.keyword}
//                 </p>
//               </div>
//             </div>

//             {/* SEO Title (locked for Free) */}
//             <FeatureLock isLocked={userPlan === "Free"}>
//               <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
//                 <h3 className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">
//                   SEO Title
//                 </h3>
//                 <p className="text-xl font-semibold text-gray-900 leading-relaxed">
//                   {blogData.seo?.optimized_title}
//                 </p>
//               </div>
//             </FeatureLock>

//             {/* Meta Description (locked for Free) */}
//             <FeatureLock isLocked={userPlan === "Free"}>
//               <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
//                 <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
//                   Meta Description
//                 </h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   {blogData.seo?.meta_description}
//                 </p>
//               </div>
//             </FeatureLock>

//             {/* Hashtags (locked for Free) */}
//             <FeatureLock isLocked={userPlan === "Free"}>
//               <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
//                 <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wider mb-4">
//                   Hashtags
//                 </h3>
//                 <div className="flex flex-wrap gap-3">
//                   {blogData.seo?.final_hashtags?.map((tag, index) => (
//                     <span
//                       key={tag}
//                       className="px-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-sm font-medium"
//                       style={{ animationDelay: `${index * 100}ms` }}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </FeatureLock>

//             {/* Blog Content (always visible) */}
//             <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
//               <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-6">
//                 Blog Content
//               </h3>
//               {isClient && (
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <BlogEditor
//                     content={blogData.blog ?? ""}
//                     onSave={(updated) => console.log("Updated Blog:", updated)}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Teaser Section (locked for Free) */}
//             {blogData.contentpreview && (
//               <FeatureLock isLocked={userPlan === "Free"}>
//                 <TeaserSection
//                   teasers={blogData.contentpreview.teasers}
//                   hashtags={blogData.contentpreview.hashtags}
//                   engagementCTA={blogData.contentpreview.engagementCTA}
//                 />
//               </FeatureLock>
//             )}

//             {/* Action Buttons */}
//             <div className="flex justify-center space-x-4 pt-8">
//               <button
//                 onClick={() => {
//                   setBlogData(null);
//                   localStorage.removeItem("blogData");
//                 }}
//                 className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border border-gray-300 transition-all duration-300 font-medium"
//               >
//                 Generate Another
//               </button>

//               <FeatureLock isLocked={userPlan === "Free"}>
//                 <button
//                   onClick={() => router.push("/dashboard/wordpress")}
//                   className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg"
//                 >
//                   Publish Blog
//                 </button>
//               </FeatureLock>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import Loader from "@/app/dashboard/components/loader";
import BlogEditor from "@/components/blog/blogEditor";
import { useRouter } from "next/navigation";
import TeaserSection from "@/app/dashboard/components/TeaserSection";

// FeatureLock wrapper
const FeatureLock = ({ isLocked, children }: { isLocked: boolean; children: React.ReactNode }) => {
  return (
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
};

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
  const [tone, setTone] = useState("Informative");
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [blogsLeft, setBlogsLeft] = useState<number | null>(null);

  // New subject/topic flow
  const [subject, setSubject] = useState("");
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [step, setStep] = useState<"input" | "choose-topic" | "generate">("input");

  const router = useRouter();

  // Fetch user plan from backend
  useEffect(() => {
    setIsClient(true);
    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/user/plan");
        const data = await res.json();
        setUserPlan(data.plan);
        setBlogsLeft(data.blogsLeft);
      } catch (err) {
        console.error("Failed to fetch user plan:", err);
        setUserPlan("Free");
      }
    };
    fetchPlan();

    const savedBlog = localStorage.getItem("blogData");
    if (savedBlog) {
      setBlogData(JSON.parse(savedBlog));
      console.log("🧠 Loaded from localStorage:", savedBlog);
    }
  }, []);

  // Save blogData
  useEffect(() => {
    if (blogData) {
      localStorage.setItem("blogData", JSON.stringify(blogData));
      console.log("✅ Saved to localStorage:", blogData);
    }
  }, [blogData]);

  const fetchSuggestions = async () => {
    if (!keyword.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/agents/topic-suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      setSuggestedTopics(data.topics || []);
      setStep("choose-topic");
    } catch (err) {
      console.error("Failed to fetch topics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBlog = async () => {
    if (!subject) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/agents/orchestrator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, subject, tone }),
      });
      const data = await res.json();
      setBlogData(data);
      setStep("generate");
    } catch (error) {
      console.error("Error generating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto py-20 px-4 space-y-10">
        {isLoading && <Loader />}

        {/* Step 1: Input */}
        {!isLoading && !blogData && step === "input" && (
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm">
                <span className="text-sm font-medium text-cyan-300">✨ AI-Powered Content Creation</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                Generate SEO Blogs
                <span className="block bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Transform your keywords into high-converting, SEO-optimized blog posts with our advanced AI technology
              </p>
            </div>

            {/* Keyword/Subject Input */}
            <div className="w-full max-w-2xl space-y-4">
              <div className="relative flex rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shadow-lg">
                <input
                  type="text"
                  placeholder="Enter your keyword or subject..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-grow px-6 py-4 text-lg bg-transparent text-gray-900 placeholder-gray-500 outline-none"
                />
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setSubject(keyword);
                    generateBlog();
                  }}
                  disabled={!keyword.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg shadow font-medium disabled:opacity-50"
                >
                  Use as Subject
                </button>
                <button
                  onClick={fetchSuggestions}
                  disabled={!keyword.trim()}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border border-gray-300 font-medium disabled:opacity-50"
                >
                  Find Trending Topics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Choose topic */}
      {/* Step 2: Choose topic */}
{!isLoading && !blogData && step === "choose-topic" && (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-gray-900 text-center">
      Choose a Topic
    </h3>
    <div className="grid gap-4">
      {suggestedTopics.map((topic: any, index) => {
        const chosen = typeof topic === "string" ? topic : topic.title;
        return (
          <button
            key={index}
            onClick={() => {
              setSubject(chosen);
              generateBlog();
            }}
            className="w-full text-left px-6 py-4 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
          >
            {typeof topic === "string" ? (
              topic
            ) : (
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{topic.title}</span>
                {topic.reason && (
                  <span className="text-sm text-gray-500">{topic.reason}</span>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
    <div className="text-center">
      <button
        onClick={() => setStep("input")}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back
      </button>
    </div>
  </div>
)}


        {/* Step 3: Generated Blog */}
        {!isLoading && blogData && step === "generate" && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Keyword Card */}
            <div className="relative group">
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Target Keyword</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{blogData.keyword}</p>
              </div>
            </div>

            {/* SEO Title */}
            <FeatureLock isLocked={userPlan === "Free"}>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">SEO Title</h3>
                <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {blogData.seo?.optimized_title}
                </p>
              </div>
            </FeatureLock>

            {/* Meta Description */}
            <FeatureLock isLocked={userPlan === "Free"}>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Meta Description</h3>
                <p className="text-gray-700 leading-relaxed">{blogData.seo?.meta_description}</p>
              </div>
            </FeatureLock>

            {/* Hashtags */}
            <FeatureLock isLocked={userPlan === "Free"}>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wider mb-4">Hashtags</h3>
                <div className="flex flex-wrap gap-3">
                  {blogData.seo?.final_hashtags?.map((tag, index) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-sm font-medium"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FeatureLock>

            {/* Blog Content */}
            <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-6">Blog Content</h3>
              {isClient && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <BlogEditor content={blogData.blog ?? ""} onSave={(updated) => console.log("Updated Blog:", updated)} />
                </div>
              )}
            </div>

            {/* Teasers */}
            {blogData.contentpreview && (
              <FeatureLock isLocked={userPlan === "Free"}>
                <TeaserSection
                  teasers={blogData.contentpreview.teasers}
                  hashtags={blogData.contentpreview.hashtags}
                  engagementCTA={blogData.contentpreview.engagementCTA}
                />
              </FeatureLock>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-8">
              <button
                onClick={() => {
                  setBlogData(null);
                  setStep("input");
                  localStorage.removeItem("blogData");
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border border-gray-300 transition-all duration-300 font-medium"
              >
                Generate Another
              </button>

              <FeatureLock isLocked={userPlan === "Free"}>
                <button
                  onClick={() => router.push("/dashboard/wordpress")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg"
                >
                  Publish Blog
                </button>
              </FeatureLock>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

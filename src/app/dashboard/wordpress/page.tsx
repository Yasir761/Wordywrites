
// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useSearchParams } from "next/navigation";

// export default function PublishBlogPage() {
//   const [profiles, setProfiles] = useState<any[]>([]);
//   const [selectedProfile, setSelectedProfile] = useState<string>("");

//   const [siteUrl, setSiteUrl] = useState("");
//   const [username, setUsername] = useState("");
//   const [appPassword, setAppPassword] = useState("");

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loadingStep, setLoadingStep] = useState(0);
//   const [error, setError] = useState("");
//   const [plan, setPlan] = useState<"Free" | "Pro">("Free");

//   const searchParams = useSearchParams();

//   // Fetch user plan
//   useEffect(() => {
//     const fetchPlan = async () => {
//       try {
//         const res = await fetch("/api/user/plan");
//         if (!res.ok) throw new Error("Failed to fetch user plan");
//         const data = await res.json();
//         setPlan(data.plan || "Free");
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchPlan();
//   }, []);

//   // Fetch blog profiles
//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         const res = await fetch("/api/blog-profile");
//         if (!res.ok) throw new Error("Failed to fetch blog profiles");
//         const data = await res.json();
//         setProfiles(data || []);
//         if (data?.length > 0) {
//           setSelectedProfile(data[0]._id);
//           setSiteUrl(data[0].siteUrl);
//           setUsername(data[0].username);
//           setAppPassword(data[0].appPassword);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProfiles();
//   }, []);

//   // Load blog data from URL/localStorage
//   useEffect(() => {
//     const titleFromUrl = searchParams.get("title");
//     const contentFromUrl = searchParams.get("content");

//     if (titleFromUrl && contentFromUrl) {
//       setTitle(decodeURIComponent(titleFromUrl));
//       setContent(decodeURIComponent(contentFromUrl));
//     } else {
//       const savedBlog = localStorage.getItem("blogData");
//       if (savedBlog) {
//         const parsed = JSON.parse(savedBlog);
//         setTitle(parsed?.seo?.optimized_title || "");
//         setContent(parsed?.blog || "");
//       }
//     }
//   }, [searchParams]);

//   // Cycle loading steps
//   useEffect(() => {
//     if (!loading) return;
//     const steps = [
//       "Analyzing content...",
//       "Generating tags...",
//       "Preparing post...",
//       "Publishing to WordPress...",
//     ];
//     let i = 0;
//     setLoadingStep(0);

//     const interval = setInterval(() => {
//       i = (i + 1) % steps.length;
//       setLoadingStep(i);
//     }, 1500);

//     return () => clearInterval(interval);
//   }, [loading]);

//   const handleProfileChange = (id: string) => {
//     setSelectedProfile(id);
//     const profile = profiles.find((p) => p._id === id);
//     if (profile) {
//       setSiteUrl(profile.siteUrl);
//       setUsername(profile.username);
//       setAppPassword(profile.appPassword);
//     }
//   };

//   const handlePublish = async () => {
//     if (plan !== "Pro") {
//       alert("Publishing to WordPress is available only for Pro users. Please upgrade.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/integrations/wordpress/export", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           siteUrl,
//           username,
//           applicationPassword: appPassword,
//           title,
//           content,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Failed to publish blog");
//         setLoading(false);
//         return;
//       }

//       if (data.editLink) {
//         window.open(data.editLink, "_blank");
//       } else {
//         setError("No edit link returned from server");
//         setLoading(false);
//       }
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//       setLoading(false);
//     }
//   };

//   const loadingMessages = [
//     "Analyzing content...",
//     "Generating tags...",
//     "Preparing post...",
//     "Publishing to WordPress...",
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="max-w-2xl mx-auto p-6 space-y-8"
//     >
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="text-4xl font-black text-center bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"
//       >
//         Publish to WordPress
//       </motion.h1>

//       {plan === "Pro" && (
//         <div className="space-y-6">
//           {/* Profile Selector */}
//           {profiles.length > 0 ? (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Choose Blog Profile</label>
//               <select
//                 value={selectedProfile}
//                 onChange={(e) => handleProfileChange(e.target.value)}
//                 className="mt-1 w-full p-3 border rounded-lg"
//               >
//                 {profiles.map((profile) => (
//                   <option key={profile._id} value={profile._id}>
//                     {profile.profileName} ({profile.blogName})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ) : (
//             <p className="text-gray-500">No blog profiles yet. Add one in settings.</p>
//           )}

//           {/* Blog Preview */}
//           <div>
//             <h2 className="text-xl font-semibold">Blog Preview</h2>
//             <h3 className="text-lg font-bold">{title}</h3>
//             <div
//               className="prose max-w-none mt-2"
//               dangerouslySetInnerHTML={{ __html: content }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Publish Button */}
//       <motion.button
//         whileHover={{ scale: loading ? 1 : 1.03 }}
//         whileTap={{ scale: loading ? 1 : 0.97 }}
//         onClick={handlePublish}
//         disabled={loading || plan !== "Pro"}
//         className="w-full py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//       >
//         {loading ? (
//           <>
//             <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
//             {loadingMessages[loadingStep]}
//           </>
//         ) : plan !== "Pro" ? (
//           "Upgrade to Pro to Publish"
//         ) : (
//           "Publish to WordPress"
//         )}
//       </motion.button>

//       {plan !== "Pro" && !loading && (
//         <p className="text-center text-gray-500 text-sm">
//           Publishing is available only for Pro users. Please upgrade to unlock this feature.
//         </p>
//       )}

//       {error && (
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-red-500 text-center"
//         >
//           {error}
//         </motion.p>
//       )}
//     </motion.div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useSearchParams } from "next/navigation";
// import useSWR from "swr";

// import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
// import { useUserPlan } from "@/hooks/useUserPlan";

// const fetcher = (url: string) => fetch(url).then(r => r.json());

// function PublishBlogContent() {
//   const searchParams = useSearchParams();

//   // 1. Use SWR instead of useEffect fetching
//   const { data: planData, error: planError } = useUserPlan();
//   const { data: profiles, error: profileError } = useSWR("/api/blog-profile", fetcher);

//   const plan = planData?.plan || "Free";

//   const [selectedProfile, setSelectedProfile] = useState("");
//   const [siteUrl, setSiteUrl] = useState("");
//   const [username, setUsername] = useState("");
//   const [appPassword, setAppPassword] = useState("");

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loadingStep, setLoadingStep] = useState(0);
//   const [error, setError] = useState("");

//   // Load blog from URL/localStorage
//   useEffect(() => {
//     const titleURL = searchParams.get("title");
//     const contentURL = searchParams.get("content");

//     if (titleURL && contentURL) {
//       setTitle(decodeURIComponent(titleURL));
//       setContent(decodeURIComponent(contentURL));
//       return;
//     }

//     const saved = localStorage.getItem("blogData");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setTitle(parsed?.seo?.optimized_title || "");
//       setContent(parsed?.blog || "");
//     }
//   }, [searchParams]);

//   // When profiles load from SWR, pick first one
//   useEffect(() => {
//     if (profiles && profiles.length > 0) {
//       const p = profiles[0];
//       setSelectedProfile(p._id);
//       setSiteUrl(p.siteUrl);
//       setUsername(p.username);
//       setAppPassword(p.appPassword);
//     }
//   }, [profiles]);

//   function handleProfileChange(id: string) {
//     setSelectedProfile(id);
//     const p = profiles.find((x: any) => x._id === id);
//     if (p) {
//       setSiteUrl(p.siteUrl);
//       setUsername(p.username);
//       setAppPassword(p.appPassword);
//     }
//   }

//   // Publish blog
//   async function handlePublish() {
//     if (plan !== "Pro") {
//       alert("Upgrade required");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/integrations/wordpress/export", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ siteUrl, username, applicationPassword: appPassword, title, content }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Failed publishing");

//       window.open(data.editLink, "_blank");
//     } catch (err: any) {
//       setError(err.message);
//     }

//     setLoading(false);
//   }

//   // --------------------------------------------

//   if (planError) return <p>Error loading plan</p>;
//   if (profileError) return <p>Error loading blog profiles</p>;
//   if (!profiles) return <p>Loading...</p>;

//   return (
//     <motion.div className="max-w-2xl mx-auto p-6 space-y-8">
//       <h1 className="text-4xl font-bold text-center">Publish to WordPress</h1>

//       {plan === "Pro" && (
//         <>
//           <select
//             value={selectedProfile}
//             onChange={(e) => handleProfileChange(e.target.value)}
//             className="w-full p-3 border rounded"
//           >
//             {profiles.map((p: any) => (
//               <option key={p._id} value={p._id}>{p.profileName}</option>
//             ))}
//           </select>

//           <div className="prose mt-3" dangerouslySetInnerHTML={{ __html: content }} />
//         </>
//       )}

//       <button
//         onClick={handlePublish}
//         disabled={loading || plan !== "Pro"}
//         className="w-full py-3 bg-blue-600 text-white rounded"
//       >
//         {loading ? "Publishing..." : plan !== "Pro" ? "Upgrade to Pro" : "Publish Now"}
//       </button>

//       {error && <p className="text-red-500 text-center">{error}</p>}
//     </motion.div>
//   );
// }

// export default function PublishBlogPage() {
//   return (
//     <LocalErrorBoundary>
//       <PublishBlogContent />
//     </LocalErrorBoundary>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useSearchParams } from "next/navigation";
// import useSWR from "swr";

// import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
// import { useUserPlan } from "@/hooks/useUserPlan";
// import { showToast } from "@/lib/toast"; // <-- ADD THIS

// const fetcher = (url: string) => fetch(url).then(r => r.json());

// function PublishBlogContent() {
//   const searchParams = useSearchParams();

//   const { data: planData, error: planError } = useUserPlan();
//   const { data: profiles, error: profileError } = useSWR("/api/blog-profile", fetcher);

//   const plan = planData?.plan || "Free";

//   const [selectedProfile, setSelectedProfile] = useState("");
//   const [siteUrl, setSiteUrl] = useState("");
//   const [username, setUsername] = useState("");
//   const [appPassword, setAppPassword] = useState("");

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Load blog from URL/localStorage
//   useEffect(() => {
//     const titleURL = searchParams.get("title");
//     const contentURL = searchParams.get("content");

//     if (titleURL && contentURL) {
//       setTitle(decodeURIComponent(titleURL));
//       setContent(decodeURIComponent(contentURL));
//       return;
//     }

//     const saved = localStorage.getItem("blogData");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setTitle(parsed?.seo?.optimized_title || "");
//       setContent(parsed?.blog || "");
//     }
//   }, [searchParams]);

//   // When profiles load from SWR, pick first one
//   useEffect(() => {
//     if (profiles && profiles.length > 0) {
//       const p = profiles[0];
//       setSelectedProfile(p._id);
//       setSiteUrl(p.siteUrl);
//       setUsername(p.username);
//       setAppPassword(p.appPassword);
//     }
//   }, [profiles]);

//   function handleProfileChange(id: string) {
//     setSelectedProfile(id);
//     const p = profiles.find((x: any) => x._id === id);
//     if (p) {
//       setSiteUrl(p.siteUrl);
//       setUsername(p.username);
//       setAppPassword(p.appPassword);
//     }
//   }

//   // Publish blog
//   async function handlePublish() {
//     if (plan !== "Pro") {
//       showToast({
//         type: "warning",
//         title: "Upgrade required",
//         description: "Publishing to WordPress is available only for Pro users.",
//       });
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/integrations/wordpress/export", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ siteUrl, username, applicationPassword: appPassword, title, content }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Failed publishing");

//       if (!data.editLink) {
//         showToast({
//           type: "error",
//           title: "Publishing completed, but no edit link returned",
//           description: "Please open WordPress manually.",
//         });
//         return;
//       }

//       showToast({
//         type: "success",
//         title: "Published successfully!",
//         description: "Your blog has been pushed to WordPress.",
//       });

//       window.open(data.editLink, "_blank");

//     } catch (err: any) {
//       setError(err.message);

//       showToast({
//         type: "error",
//         title: "Publishing failed",
//         description: err.message || "Something went wrong.",
//       });
//     }

//     setLoading(false);
//   }

//   // Error handling for plan or profile fetch
//   if (planError) {
//     showToast({
//       type: "error",
//       title: "Plan fetch error",
//       description: "Unable to load your subscription plan.",
//     });
//     return <p>Error loading plan</p>;
//   }

//   if (profileError) {
//     showToast({
//       type: "error",
//       title: "Profile fetch error",
//       description: "Unable to load WordPress profiles.",
//     });
//     return <p>Error loading blog profiles</p>;
//   }

//   if (!profiles) return <p>Loading...</p>;

//   return (
//     <motion.div className="max-w-2xl mx-auto p-6 space-y-8">
//       <h1 className="text-4xl font-bold text-center">Publish to WordPress</h1>

//       {plan === "Pro" && (
//         <>
//           <select
//             value={selectedProfile}
//             onChange={(e) => handleProfileChange(e.target.value)}
//             className="w-full p-3 border rounded"
//           >
//             {profiles.map((p: any) => (
//               <option key={p._id} value={p._id}>{p.profileName}</option>
//             ))}
//           </select>

//           <div
//             className="prose mt-3"
//             dangerouslySetInnerHTML={{ __html: content }}
//           />
//         </>
//       )}

//       <button
//         onClick={handlePublish}
//         disabled={loading || plan !== "Pro"}
//         className="w-full py-3 bg-blue-600 text-white rounded"
//       >
//         {loading ? "Publishing..." : plan !== "Pro" ? "Upgrade to Pro" : "Publish Now"}
//       </button>

//       {error && <p className="text-red-500 text-center">{error}</p>}
//     </motion.div>
//   );
// }

// export default function PublishBlogPage() {
//   return (
//     <LocalErrorBoundary>
//       <PublishBlogContent />
//     </LocalErrorBoundary>
//   );
// }










"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
import { useUserPlan } from "@/hooks/useUserPlan";
import { showToast } from "@/lib/toast";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function PublishBlogContent() {
  const searchParams = useSearchParams();
  const { data: planData, error: planError } = useUserPlan();
  const { data: profiles, error: profileError } = useSWR("/api/blog-profile", fetcher);

  const plan = planData?.plan || "Free";

  const [selectedProfile, setSelectedProfile] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Blog from URL or LS
  useEffect(() => {
    const titleURL = searchParams.get("title");
    const contentURL = searchParams.get("content");

    if (titleURL && contentURL) {
      setTitle(decodeURIComponent(titleURL));
      setContent(decodeURIComponent(contentURL));
      return;
    }

    const saved = localStorage.getItem("blogData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTitle(parsed?.seo?.optimized_title || "");
      setContent(parsed?.blog || "");
    }
  }, [searchParams]);

  // Preselect first profile
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const p = profiles[0];
      setSelectedProfile(p._id);
      setSiteUrl(p.siteUrl);
      setUsername(p.username);
      setAppPassword(p.appPassword);
    }
  }, [profiles]);

  const handleProfileChange = (id: string) => {
    setSelectedProfile(id);
    const p = profiles.find((x: any) => x._id === id);
    if (p) {
      setSiteUrl(p.siteUrl);
      setUsername(p.username);
      setAppPassword(p.appPassword);
    }
  };

  async function handlePublish() {
    if (plan !== "Pro") {
      showToast({
        type: "warning",
        title: "Upgrade required",
        description: "Publishing to WordPress is available only for Pro users.",
      });
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/integrations/wordpress/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl, username, applicationPassword: appPassword, title, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed publishing");

      showToast({
        type: "success",
        title: "Published successfully!",
        description: "Your blog has been pushed to WordPress.",
      });

      if (data.editLink) window.open(data.editLink, "_blank");
    } catch (err: any) {
      setError(err.message);
      showToast({
        type: "error",
        title: "Publishing failed",
        description: err.message,
      });
    }

    setLoading(false);
  }

  if (planError) return <p>Error loading plan</p>;
  if (profileError) return <p>Error loading blog profiles</p>;
  if (!profiles) return <p>Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto p-6 space-y-8"
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Publish to WordPress
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose a site → review → publish instantly
        </p>
      </div>

      {/* Select profile */}
      {plan === "Pro" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-muted-foreground">
            Select WordPress Profile
          </label>
          <select
            value={selectedProfile}
            onChange={(e) => handleProfileChange(e.target.value)}
            className="
              w-full rounded-lg px-3 py-2 border border-border 
              bg-card text-foreground transition
              focus:ring-2 focus:ring-ai-accent/40 focus:border-ai-accent/50
            "
          >
            {profiles.map((p: any) => (
              <option key={p._id} value={p._id}>
                {p.profileName}
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Blog preview */}
      <div
        className="
          border border-border/60 rounded-xl bg-card/60 backdrop-blur 
          p-5 max-h-[500px] overflow-y-auto prose prose-gray dark:prose-invert
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Publish button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handlePublish}
        disabled={loading || plan !== "Pro"}
        className="
          w-full py-3 rounded-lg font-medium text-base
          bg-ai-accent text-white
          disabled:opacity-60 disabled:cursor-not-allowed
          transition shadow-[0_0_10px_-4px_var(--ai-accent)]
          hover:bg-ai-accent/90 hover:shadow-[0_0_14px_-2px_var(--ai-accent)]
        "
      >
        {loading ? "Publishing…" : plan !== "Pro" ? "Upgrade to Pro" : "Publish Now"}
      </motion.button>

      {error && (
        <p className="text-center text-red-500 text-sm">{error}</p>
      )}
    </motion.div>
  );
}

export default function PublishBlogPage() {
  return (
    <LocalErrorBoundary>
      <PublishBlogContent />
    </LocalErrorBoundary>
  );
}

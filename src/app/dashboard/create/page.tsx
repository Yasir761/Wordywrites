

"use client";

import { useEffect, useState } from "react";
import Loader from "@/app/dashboard/components/loader";
import BlogEditor from "@/components/blog/blogEditor";
import { useRouter } from "next/navigation";
import TeaserSection from "@/app/dashboard/components/TeaserSection";
import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
import {showToast} from "@/lib/toast";

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
showToast({
  type: "success",
  title: "Your blog is ready!",
  description: "You can now preview, edit, and publish it.",
});
    } catch (error) {
      console.error("Error generating blog:", error);
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto py-20 px-4 space-y-10">
        {isLoading && <Loader />}

        {/* Step 1: Input */}
       {/* STEP 1 — INPUT */}
{!isLoading && !blogData && step === "input" && (
  <div className="flex flex-col items-center text-center space-y-10">
    <div>
      <span className="text-xs px-4 py-1.5 rounded-full bg-ai-accent/10 border border-ai-accent/30 text-ai-accent font-medium tracking-wide">
        ⚡ AI-Powered Content Creation
      </span>

      <h1 className="mt-6 text-[46px] md:text-[62px] font-black tracking-tight text-foreground">
        Generate <span className="text-ai-accent">SEO Blogs</span> Instantly
      </h1>
      <p className="text-[17px] text-muted-foreground max-w-2xl mt-4">
        Turn a simple keyword into a high-converting blog post with title,
        metadata, hashtags and teasers — crafted by autonomous AI agents.
      </p>
    </div>

    {/* MODULE CARD */}
    <div className="w-full max-w-2xl bg-white/90 border border-border rounded-2xl shadow-xl p-6 space-y-5 backdrop-blur-md">
      <input
        type="text"
        placeholder="e.g. Fitness apps for seniors..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full px-5 py-4 bg-muted/50 rounded-xl border border-border focus:border-ai-accent outline-none text-lg"
      />

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
          className="px-6 py-3 rounded-xl font-medium bg-muted hover:bg-muted/70 border disabled:opacity-50"
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
        {/* STEP 3 — BLOG OUTPUT PIPELINE */}
{!isLoading && blogData && step === "generate" && (
  <div className="space-y-10 animate-in fade-in duration-700">

    {/* PIPELINE MARKER */}
    <div className="flex items-center justify-center gap-2 text-sm font-medium text-ai-accent">
      <span className="w-2 h-2 bg-ai-accent rounded-full"></span>
      Blog Generated by WordyWrites AI Agents
      <span className="w-2 h-2 bg-ai-accent rounded-full"></span>
    </div>

    {/* AI RESULTS PIPELINE */}
    <div className="space-y-6">
      
      {/* KEYWORD */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-md">
        <div className="text-xs uppercase tracking-wider font-semibold text-purple-600 mb-2">Target Keyword</div>
        <div className="text-2xl font-bold">{blogData.keyword}</div>
      </div>

      {/* SEO TITLE */}
      <FeatureLock isLocked={userPlan === "Free"}>
        <div className="bg-card p-6 rounded-xl border border-border shadow-md">
          <div className="text-xs uppercase tracking-wider font-semibold text-cyan-600 mb-2">SEO Title</div>
          <div className="text-xl font-semibold">{blogData.seo?.optimized_title}</div>
        </div>
      </FeatureLock>

      {/* META DESCRIPTION */}
      <FeatureLock isLocked={userPlan === "Free"}>
        <div className="bg-card p-6 rounded-xl border border-border shadow-md">
          <div className="text-xs uppercase tracking-wider font-semibold text-emerald-600 mb-2">Meta Description</div>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {blogData.seo?.meta_description}
          </p>
        </div>
      </FeatureLock>

      {/* HASHTAGS */}
      <FeatureLock isLocked={userPlan === "Free"}>
        <div className="bg-card p-6 rounded-xl border border-border shadow-md">
          <div className="text-xs uppercase tracking-wider font-semibold text-pink-600 mb-4">Hashtags</div>
          <div className="flex flex-wrap gap-2">
            {blogData.seo?.final_hashtags?.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </FeatureLock>

      {/* BLOG CONTENT EDITOR */}
      <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
        <div className="text-xs uppercase tracking-wider font-semibold text-indigo-600 mb-4">Blog Content Editor</div>
        {isClient ? (
          <BlogEditor content={blogData.blog ?? ""} onSave={(v) => console.log(v)} />
        ) : (
          <div className="text-sm text-muted-foreground">Loading editor…</div>
        )}
      </div>

      {/* TEASERS */}
      {blogData.contentpreview && (
        <FeatureLock isLocked={userPlan === "Free"}>
          <TeaserSection
            teasers={blogData.contentpreview.teasers}
            hashtags={blogData.contentpreview.hashtags}
            engagementCTA={blogData.contentpreview.engagementCTA}
          />
        </FeatureLock>
      )}
    </div>

    {/* ACTIONS */}
    <div className="flex justify-center gap-4 pt-4">
      <button
        onClick={() => {
          setBlogData(null);
          setStep("input");
          localStorage.removeItem("blogData");
        }}
        className="px-6 py-3 rounded-xl font-medium border bg-muted hover:bg-muted/80"
      >
        Generate New
      </button>

      <FeatureLock isLocked={userPlan === "Free"}>
        <button
          onClick={() => router.push("/dashboard/wordpress")}
          className="px-6 py-3 rounded-xl font-semibold bg-ai-accent text-white shadow hover:brightness-110"
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






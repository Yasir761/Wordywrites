"use client";

import { useEffect, useState } from "react";
import Loader from "@/app/dashboard/components/loader";
import BlogEditor from "@/components/blog/blogEditor";
import { useRouter } from "next/navigation";
import TeaserSection from "@/app/dashboard/components/TeaserSection";
import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
import { showToast } from "@/lib/toast";
import { marked } from "marked";


marked.setOptions({
  gfm: true,
  breaks: true,
});


function handleCreditToast(res: Response, data: any) {
  if (res.status === 402) {
    showToast({
      type: "error",
      title: "No credits left",
      description:
        typeof data?.remainingCredits === "number"
          ? `You have ${data.remainingCredits} credits remaining. Upgrade to continue.`
          : "You have no credits left. Upgrade to continue.",
    });
    window.location.href = "/pricing";
    return false;
  }

  if (typeof data?.remainingCredits === "number") {
    showToast({
      type: "info",
      title: "Credit used",
      description: `Remaining credits: ${data.remainingCredits}`,
    });
  }

  return true;
}


const FeatureLock = ({ isLocked, children }: { isLocked: boolean; children: React.ReactNode }) => (
  <div className="relative">
    <div className={isLocked ? "blur-sm select-none pointer-events-none" : ""}>{children}</div>
    {isLocked && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 dark:bg-background/90 rounded-xl backdrop-blur-sm">
        <button
          onClick={() => (window.location.href = "/pricing")}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow hover:from-purple-700 hover:to-blue-700"
        >
           Upgrade to Publish
        </button>
      </div>
    )}
  </div>
);

interface BlogData {
  keyword: string;
  seo?: {
    optimized_title?: string;
    meta_description?: string;
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
  const [subject, setSubject] = useState("");
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [suggestedTopics, setSuggestedTopics] = useState<Array<string | { title: string; reason?: string }>>([]);
  const [step, setStep] = useState<"input" | "choose-topic" | "generate">("input");
const [isStreaming, setIsStreaming] = useState(false);
const [streamedBlog, setStreamedBlog] = useState("");

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => setUserPlan(data.plan))
      .catch(() => setUserPlan("Free"));

    
  }, []);


  const fetchSuggestions = async () => {
    if (!keyword.trim()) return;
    setIsLoading(true);
    const res = await fetch(`/api/agents/topic-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });
    const data = await res.json();
    setSuggestedTopics(data.topics || []);
    setIsLoading(false);
    setStep("choose-topic");
  };

 

function TypingCursor() {
  return (
    <span
      className="
        inline-block
        ml-1
        text-foreground
        animate-[blink_1s_step-start_infinite]
      "
    >
      |
    </span>
  );
}





function StreamingPreview({ markdown }: { markdown: string }) {
  const html = marked.parse(markdown, { async: false }) as string;

  return (
    <div className="relative">
      <div
        className="
          prose prose-lg prose-neutral dark:prose-invert
          max-w-none leading-relaxed
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <TypingCursor />
    </div>
  );
}

const generateBlog = async () => {
  if (!subject) return;

  setIsLoading(true);
  setStreamedBlog("");
  setBlogData(null);

  try {
    //  Run orchestrator FIRST (fast)
 const orchestratorRes = await fetch(`/api/agents/orchestrator`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ keyword, subject, tone }),
});

const orchestratorData = await orchestratorRes.json();

//  CREDIT HANDLING
if (!handleCreditToast(orchestratorRes, orchestratorData)) {
  setIsLoading(false);
  return;
}

if (!orchestratorRes.ok) {
  throw new Error(orchestratorData?.error || "Orchestrator failed");
}

    setStep("generate");

    // Pre-fill SEO + metadata immediately
    setBlogData({
      keyword,
      seo: orchestratorData.seo,
      blog: "",
      contentpreview: orchestratorData.contentpreview,
    });

    //  START STREAMING BLOG
    setIsLoading(false);
    setIsStreaming(true);

    const streamRes = await fetch("/api/agents/blog/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blogId: orchestratorData.blogId,
        keyword,
        outline: orchestratorData.blueprint?.outline,
        tone,
        seo: orchestratorData.seo,
      }),
    });

    if (!streamRes.body) {
      throw new Error("No stream received");
    }

    const reader = streamRes.body.getReader();
    const decoder = new TextDecoder();

    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullText += chunk;

      setStreamedBlog(fullText);
     
    }

    setIsStreaming(false);
    const finalHtml = marked.parse(fullText, { async: false }) as string;
    setBlogData(prev =>
  prev ? { ...prev, blog: finalHtml } : prev
);



    showToast({
      type: "success",
      title: "Blog ready",
      description: "Your blog has been generated successfully.",
    });
  } catch (err) {
    setIsStreaming(false);
    setIsLoading(false);

    showToast({
      type: "error",
      title: "Generation failed",
      description: "Please try again.",
    });
  }
};



  return (
    <LocalErrorBoundary>
      <div className="min-h-screen bg-background dark:bg-background text-foreground relative">
        <div className="max-w-4xl mx-auto py-20 px-4 space-y-14">
          {isLoading && !isStreaming && <Loader />}

          {/* STEP 1 — INPUT */}
          {!isLoading && !blogData && step === "input" && (
            <div className="flex flex-col items-center text-center space-y-10">
              <h1 className="text-[46px] md:text-[62px] font-semibold leading-[1.1] text-foreground">
                Generate <span className="text-ai-accent font-extrabold">SEO Blogs</span> Instantly
              </h1>
              <p className="text-[16px] text-muted-foreground max-w-2xl">
                Convert a keyword into a high-converting blog — title, metadata, hashtags & teasers generated by AI.
              </p>

              {/* Input Card */}
              <div className="
                w-full max-w-2xl bg-card border border-border rounded-2xl p-7 space-y-6
                shadow-[0_4px_30px_-12px_rgba(0,0,0,0.3)]
                dark:shadow-[0_4px_30px_-12px_rgba(0,0,0,0.5)]
                hover:shadow-[0_4px_40px_-6px_var(--ai-accent)]
                transition-all duration-300
              ">
                <input
                  type="text"
                  placeholder="e.g. Fitness apps for seniors..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="
                    w-full px-5 py-4 rounded-xl bg-secondary border border-border
                    text-foreground placeholder-muted-foreground
                    focus:border-primary outline-none text-lg
                    transition-colors duration-200
                  "
                />

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => { setSubject(keyword); generateBlog(); }}
                    disabled={!keyword.trim()}
                    className="px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    Generate Blog
                  </button>
                  <button
                    onClick={fetchSuggestions}
                    disabled={!keyword.trim()}
                    className="px-6 py-3 rounded-xl font-medium bg-secondary text-foreground border border-border hover:bg-secondary/80 disabled:opacity-50 transition-all"
                  >
                    Find Trending Topics
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — TOPIC SELECT */}
          {!isLoading && !blogData && step === "choose-topic" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-foreground">Choose a Topic</h3>
              <div className="grid gap-4">
                {suggestedTopics.map((topic, i) => {
                  const chosen = typeof topic === "string" ? topic : topic.title;
                  return (
                    <button
                      key={i}
                      onClick={() => { setSubject(chosen); generateBlog(); }}
                      className="
                        text-left px-6 py-4 rounded-xl border bg-card text-foreground
                        border-border hover:border-primary/50
                        hover:shadow-[0_4px_40px_-6px_var(--ai-accent)]
                        transition-all duration-200
                      "
                    >
                      {typeof topic === "string"
                        ? topic
                        : (
                          <>
                            <span className="font-medium">{topic.title}</span>
                            <span className="block text-sm text-muted-foreground">{topic.reason}</span>
                          </>
                        )}
                    </button>
                  );
                })}
              </div>
              <button className="text-sm text-muted-foreground hover:text-foreground hover:underline mx-auto block transition-colors" onClick={() => setStep("input")}>
                ← Back
              </button>
            </div>
          )}

          {/* STEP 3 — BLOG OUTPUT */}
          {!isLoading && blogData && step === "generate" && (
            <div className="space-y-14 animate-in fade-in duration-700">
              {/* Template for each card */}
              {/** KEYWORD */}
              <div className="gen-card">
                <h3 className="gen-label text-purple-600">Target Keyword</h3>
                <p className="gen-value">{blogData.keyword}</p>
              </div>

              {/** SEO TITLE */}
              <FeatureLock isLocked={userPlan === "Free"}>
                <div className="gen-card">
                  <h3 className="gen-label text-blue-600">SEO Title</h3>
                  <p className="gen-value">{blogData.seo?.optimized_title}</p>
                </div>
              </FeatureLock>

              {/** META */}
              <FeatureLock isLocked={userPlan === "Free"}>
                <div className="gen-card">
                  <h3 className="gen-label text-emerald-600">Meta Description</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {blogData.seo?.meta_description}
                  </p>
                </div>
              </FeatureLock>

              {/** HASHTAGS */}
              <FeatureLock isLocked={userPlan === "Free"}>
                <div className="gen-card">
                  <h3 className="gen-label text-pink-600 mb-3">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogData.seo?.final_hashtags?.map(tag => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FeatureLock>

              {/** EDITOR */}
             <div className="gen-card p-10">
  <h3 className="gen-label text-indigo-600 mb-6">
    Blog Content
  </h3>

  {/* STREAMING */}
  {isStreaming && (
    <div className="relative">
      <StreamingPreview markdown={streamedBlog} />
      
    </div>
  )}

  {/* FINAL EDITOR */}
  {!isStreaming && blogData.blog && isClient && (
    <BlogEditor
      content={blogData.blog}
      onSave={() => {}}
    />
  )}
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
                  onClick={() => { setBlogData(null); setStep("input");  }}
                  className="px-6 py-3 rounded-xl font-medium border border-border bg-secondary text-foreground hover:bg-secondary/80 transition-all"
                >
                  Generate New
                </button>

                <FeatureLock isLocked={userPlan === "Free"}>
                  <button
                    onClick={() => router.push("/dashboard/wordpress")}
                    className="px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-lg hover:brightness-110 transition-all"
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




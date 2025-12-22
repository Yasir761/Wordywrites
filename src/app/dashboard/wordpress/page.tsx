
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
import { useUserPlan } from "@/hooks/useUserPlan";
import { showToast } from "@/lib/toast";
import { Lock, Globe } from "lucide-react";

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

  /* ------------------------- Load Blog Content ------------------------- */
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

  /* ------------------------- Load Profiles ------------------------- */
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const p = profiles[0];
      setSelectedProfile(p._id);
      setSiteUrl(p.siteUrl);
      setUsername(p.username);
      setAppPassword(p.appPassword);
    }
  }, [profiles]);

  function handleProfileChange(id: string) {
    setSelectedProfile(id);
    const p = profiles.find((x: any) => x._id === id);
    if (p) {
      setSiteUrl(p.siteUrl);
      setUsername(p.username);
      setAppPassword(p.appPassword);
    }
  }

  /* ------------------------- Publish to WP ------------------------- */
  async function handlePublish() {
    if (plan !== "Pro") {
      showToast({
        type: "warning",
        title: "Pro Feature",
        description: "Upgrade to publish directly to WordPress.",
      });
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/integrations/wordpress/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({profileId: selectedProfile,
          //  siteUrl,
          //   username,
          //    applicationPassword: appPassword,
              title,
               content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed publishing");

      showToast({
        type: "success",
        title: "Published Successfully",
        description: "Your blog has been pushed to WordPress.",
      });

      if (data.editLink) window.open(data.editLink, "_blank");
    } catch (err: any) {
      setError(err.message);
      showToast({
        type: "error",
        title: "Publishing Failed",
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10"
    >
      {/* Banner */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Publish to WordPress
        </h1>
        
         <p className="text-muted-foreground text-sm">
          Send your finished blog straight to your WordPress site — fully formatted and SEO-ready with one click.
        </p>
      </div>

      {/* Profile Selector */}
      {plan === "Pro" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Select publishing profile
          </label>

          <div className="relative">
            <select
              value={selectedProfile}
              onChange={(e) => handleProfileChange(e.target.value)}
              className="
                w-full rounded-xl px-3 py-2 text-sm
                bg-card border border-border/70
                transition focus:ring-2 focus:ring-ai-accent/40 focus:border-ai-accent/50
              "
            >
              {profiles.map((p: any) => (
                <option key={p._id} value={p._id}>
                  {p.profileName}
                </option>
              ))}
            </select>

            {/* <Globe className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" /> */}
          </div>
        </div>
      )}

      {/* Blog Preview */}
      <div
  className="
    border border-border/60 rounded-xl 
    bg-card/70 backdrop-blur-sm
    p-5 max-h-[550px] overflow-y-auto
    prose dark:prose-invert
    shadow-[0_0_28px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_0_38px_-8px_var(--ai-accent)]
    transition-shadow duration-300
  "
  dangerouslySetInnerHTML={{ __html: content }}
/>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handlePublish}
        disabled={loading || plan !== "Pro"}
        className="
          w-full py-3 rounded-xl font-medium
          bg-ai-accent text-white text-base
          transition disabled:opacity-60 disabled:cursor-not-allowed
          shadow-[0_0_10px_-4px_var(--ai-accent)]
          hover:bg-ai-accent/90 hover:shadow-[0_0_14px_-2px_var(--ai-accent)]
        "
      >
        {loading
          ? "Publishing..."
          : plan !== "Pro"
          ? <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Upgrade to Pro
            </span>
          : "Publish to WordPress"}
      </motion.button>

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}
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

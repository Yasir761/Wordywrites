"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function PublishBlogPage() {
  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<"Free" | "Pro">("Free");

  const searchParams = useSearchParams();

  // Fetch user plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/user/plan");
        if (!res.ok) throw new Error("Failed to fetch user plan");
        const data = await res.json();
        setPlan(data.plan || "Free");
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlan();
  }, []);

  // Load blog data from localStorage or URL
  useEffect(() => {
    const titleFromUrl = searchParams.get("title");
    const contentFromUrl = searchParams.get("content");

    if (titleFromUrl && contentFromUrl) {
      setTitle(decodeURIComponent(titleFromUrl));
      setContent(decodeURIComponent(contentFromUrl));
    } else {
      const savedBlog = localStorage.getItem("blogData");
      if (savedBlog) {
        const parsed = JSON.parse(savedBlog);
        setTitle(parsed?.seo?.optimized_title || "");
        setContent(parsed?.blog || "");
      }
    }
  }, [searchParams]);

  // Cycle loading steps
  useEffect(() => {
    if (!loading) return;
    const steps = [
      "Analyzing content...",
      "Generating tags...",
      "Preparing post...",
      "Publishing to WordPress...",
    ];
    let i = 0;
    setLoadingStep(0);

    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      setLoadingStep(i);
    }, 1500);

    return () => clearInterval(interval);
  }, [loading]);

  const handlePublish = async () => {
    if (plan !== "Pro") {
      alert("Publishing to WordPress is available only for Pro users. Please upgrade.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/integrations/wordpress/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl,
          username,
          applicationPassword: appPassword,
          title,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to publish blog");
        setLoading(false);
        return;
      }

      if (data.editLink) {
        window.open(data.editLink, "_blank");
      } else {
        setError("No edit link returned from server");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  const loadingMessages = [
    "Analyzing content...",
    "Generating tags...",
    "Preparing post...",
    "Publishing to WordPress...",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto p-6 space-y-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-center bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"
      >
        Publish to WordPress
      </motion.h1>

      {plan === "Pro" && (
        <div className="space-y-6">
          {/* Site URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Site URL</label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://yourblog.com"
              className="mt-1 w-full p-3 border rounded-lg"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="mt-1 w-full p-3 border rounded-lg"
            />
          </div>

          {/* App Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">App Password</label>
            <input
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="Application password"
              className="mt-1 w-full p-3 border rounded-lg"
            />
          </div>

          {/* Blog Preview */}
          <div>
            <h2 className="text-xl font-semibold">Blog Preview</h2>
            <h3 className="text-lg font-bold">{title}</h3>
            <div
              className="prose max-w-none mt-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )}

      {/* Publish Button */}
      <motion.button
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        onClick={handlePublish}
        disabled={loading || plan !== "Pro"}
        className="w-full py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
            {loadingMessages[loadingStep]}
          </>
        ) : plan !== "Pro" ? (
          "Upgrade to Pro to Publish"
        ) : (
          "Publish to WordPress"
        )}
      </motion.button>

      {plan !== "Pro" && !loading && (
        <p className="text-center text-gray-500 text-sm">
          Publishing is available only for Pro users. Please upgrade to unlock this feature.
        </p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-center"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

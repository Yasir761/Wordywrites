"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PublishBlogPage() {
  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedBlog = localStorage.getItem("blogData");
    if (savedBlog) {
      const parsed = JSON.parse(savedBlog);
      setTitle(parsed?.seo?.optimized_title || "");
      setContent(parsed?.blog || "");
    }
  }, []);

  // Cycle loading steps
  useEffect(() => {
    if (!loading) return;
    const steps = [
      "Analyzing content...",
      "Generating tags...",
      "Preparing post...",
      "Publishing to WordPress..."
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
    "Publishing to WordPress..."
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto p-6 space-y-8"
    >
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-center bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"
      >
        Publish to WordPress
      </motion.h1>

      {/* Credentials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {[
          { type: "url", placeholder: "WordPress Site URL (e.g., https://myblog.com)", value: siteUrl, setter: setSiteUrl },
          { type: "text", placeholder: "WordPress Username", value: username, setter: setUsername },
          { type: "password", placeholder: "Application Password", value: appPassword, setter: setAppPassword }
        ].map((input, i) => (
          <motion.input
            key={i}
            
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            onChange={(e) => input.setter(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            className="w-full p-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-purple-500 transition-all"
          />
        ))}
      </motion.div>

      {/* Blog Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full p-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </motion.div>

      {/* Publish Button */}
      <motion.button
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        onClick={handlePublish}
        disabled={loading}
        className="w-full py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
            {loadingMessages[loadingStep]}
          </>
        ) : (
          "Publish to WordPress"
        )}
      </motion.button>

      {/* Error */}
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

"use client";

import { useEffect, useState } from "react";
import Loader from "@/app/dashboard/components/loader";
import BlogEditor from "@/components/blog/blogEditor";
import { useRouter } from "next/navigation";
import TeaserSection from "@/app/dashboard/components/TeaserSection";

// Type Definitions
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
  teaser?: {
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

  const router = useRouter();

  // Load blogData from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedBlog = localStorage.getItem("blogData");
    if (savedBlog) {
      setBlogData(JSON.parse(savedBlog));
      console.log("🧠 Loaded from localStorage:", savedBlog);
    }
  }, []);

  // Save blogData to localStorage when it changes
  useEffect(() => {
    if (blogData) {
      localStorage.setItem("blogData", JSON.stringify(blogData));
      console.log("✅ Saved to localStorage:", blogData);
    }
  }, [blogData]);

  const generateBlog = async () => {
    if (!keyword) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/agents/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, tone }),
      });
      const data = await res.json();
      setBlogData(data);
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

        {/* Initial UI */}
        {!isLoading && !blogData && (
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

            {/* Search Input */}
            <div className="w-full max-w-2xl">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative flex rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shadow-lg">
                  <input
                    type="text"
                    placeholder="Enter your keyword or topic..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-grow px-6 py-4 text-lg bg-transparent text-gray-900 placeholder-gray-500 outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && generateBlog()}
                  />
                  <button
                    onClick={generateBlog}
                    disabled={!keyword.trim()}
                    className="relative bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="relative z-10">Generate</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  SEO Optimized
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  AI Generated
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                  Ready to Publish
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Generated Blog UI */}
        {!isLoading && blogData && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Results Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
                <span className="text-sm font-medium text-green-300">🎉 Generation Complete</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Your SEO-Optimized Blog is Ready!</h2>
            </div>

            {/* Keyword Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Target Keyword</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">{blogData.keyword}</p>
              </div>
            </div>

            {/* Title Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-cyan-600 uppercase tracking-wider">SEO Title</h3>
                </div>
                <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {blogData.seo?.optimized_title}
                </p>
              </div>
            </div>

            {/* Meta Description Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Meta Description</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{blogData.seo?.meta_description}</p>
              </div>
            </div>

            {/* Tags Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wider">Hashtags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {blogData.seo?.final_hashtags?.map((tag, index) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-sm font-medium hover:bg-pink-100 transition-all duration-300 animate-in slide-in-from-left"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog Content Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Blog Content</h3>
                </div>
                {isClient && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <BlogEditor
                      content={blogData.blog ?? ""}
                      onSave={(updated) => console.log("Updated Blog:", updated)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Teaser Section (New Collapsible Component) */}
            {blogData.teaser && (
              <TeaserSection
                teasers={blogData.teaser.teasers}
                hashtags={blogData.teaser.hashtags}
                engagementCTA={blogData.teaser.engagementCTA}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-8">
              <button
                onClick={() => {
                  setBlogData(null);
                  localStorage.removeItem("blogData");
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border border-gray-300 transition-all duration-300 font-medium"
              >
                Generate Another
              </button>
              <button
                onClick={() => router.push("/dashboard/wordpress")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg"
              >
                Publish Blog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

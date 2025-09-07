// "use client";

// import { useState, useEffect } from "react";
// import { diffWords } from "diff";
// import BlogEditor from "@/components/blog/blogEditor";

// export default function CrawlEnhancePage() {
//   const [mode, setMode] = useState<"rss" | "manual">("rss");
//   const [rssUrl, setRssUrl] = useState("");
//   const [manualTitle, setManualTitle] = useState("");
//   const [manualContent, setManualContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [result, setResult] = useState<any>(null);
//   const [editedContent, setEditedContent] = useState<string>("");
//   const [showDiff, setShowDiff] = useState(false);
//   const [plan, setPlan] = useState<"Free" | "Pro">("Free"); // plan state

//   // Load saved result
//   useEffect(() => {
//     const savedResult = localStorage.getItem("crawlResult");
//     if (savedResult) {
//       const parsed = JSON.parse(savedResult);
//       setResult(parsed);
//       setEditedContent(parsed?.enhanced?.content || "");
//     }
//   }, []);

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

//   const handleEnhance = async () => {
//     if (plan !== "Pro") {
//       alert("Enhancing blogs is available only for Pro users. Please upgrade.");
//       return;
//     }

//     setError(null);
//     setResult(null);
//     setEditedContent("");

//     if (mode === "rss" && !rssUrl.trim()) {
//       setError("Please enter a valid RSS feed URL");
//       return;
//     }

//     if (mode === "manual" && manualContent.trim().length < 100) {
//       setError("Please provide at least 100 characters of blog content");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch("/api/agents/crawl", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           mode === "rss" ? { rssUrl } : { manualContent, manualTitle }
//         ),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.error || "Failed to process blog");
//         return;
//       }

//       setResult(data);
//       setEditedContent(data.enhanced.content);

//       localStorage.setItem("crawlResult", JSON.stringify(data));
//     } catch {
//       setError("Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderDiff = (original: string, enhanced: string) => {
//     const diff = diffWords(original, enhanced);
//     return diff.map((part, index) => {
//       const style = part.added
//         ? "bg-green-200 text-green-800 px-1 rounded"
//         : part.removed
//         ? "bg-red-200 text-red-800 px-1 rounded line-through"
//         : "";
//       return (
//         <span key={index} className={style}>
//           {part.value}
//         </span>
//       );
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f4f8ff] via-white to-[#fdf2f8] p-8">
//       <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
//         <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Crawl & Enhance
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Import a blog via RSS or paste your content manually to enhance it with AI.
//         </p>

//         {/* Mode Switch */}
//         <div className="mt-6 flex gap-4">
//           <button
//             onClick={() => setMode("rss")}
//             className={`px-4 py-2 rounded-lg ${
//               mode === "rss" ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//           >
//             Use RSS Feed
//           </button>
//           <button
//             onClick={() => setMode("manual")}
//             className={`px-4 py-2 rounded-lg ${
//               mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
//             }`}
//           >
//             Paste Blog Content
//           </button>
//         </div>

//         {/* Input Fields */}
//         {mode === "rss" ? (
//           <div className="mt-6 flex gap-3">
//             <input
//               type="url"
//               placeholder="https://example.com/feed"
//               value={rssUrl}
//               onChange={(e) => setRssUrl(e.target.value)}
//               className="flex-1 border rounded-xl px-4 py-3"
//             />
//           </div>
//         ) : (
//           <div className="mt-6 space-y-3">
//             <input
//               type="text"
//               placeholder="Blog Title (optional)"
//               value={manualTitle}
//               onChange={(e) => setManualTitle(e.target.value)}
//               className="w-full border rounded-xl px-4 py-3"
//             />
//             <textarea
//               placeholder="Paste your blog content..."
//               value={manualContent}
//               onChange={(e) => setManualContent(e.target.value)}
//               className="w-full border rounded-xl px-4 py-3 min-h-[150px]"
//             />
//           </div>
//         )}

//         {/* Enhance Button */}
//         <button
//           onClick={handleEnhance}
//           disabled={loading || plan !== "Pro"} // disable for Free users
//           className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading
//             ? "Processing..."
//             : plan !== "Pro"
//             ? "Upgrade to Pro to Enhance"
//             : "Enhance Blog"}
//         </button>

//         {plan !== "Pro" && !loading && (
//           <p className="text-center text-gray-500 text-sm mt-2">
//             Enhancing blogs is available only for Pro users. Please upgrade to unlock this feature.
//           </p>
//         )}

//         {error && <p className="text-red-500 mt-4">{error}</p>}

//         {/* --- RESULTS SECTION --- */}
//         {result && (
//           <div className="mt-10 space-y-10">
//             {/* Original Blog */}
//             <section className="p-6 rounded-2xl bg-gray-50 border">
//               <h2 className="text-2xl font-semibold text-gray-800">Original Blog</h2>
//               <h3 className="text-lg font-medium mt-2">{result.original.title}</h3>
//               <p className="text-gray-600 mt-1">{result.original.meta_description}</p>
//               <div className="mt-3 whitespace-pre-line text-gray-700 bg-white p-4 rounded-xl border">
//                 {result.original.content}
//               </div>
//             </section>

//             {/* Enhanced Blog */}
//             <section className="p-6 rounded-2xl bg-green-50 border">
//               <h2 className="text-2xl font-semibold text-green-700">Enhanced Blog (Editable)</h2>
//               <h3 className="text-lg font-medium mt-2">{result.enhanced.title}</h3>
//               <p className="text-gray-600 mt-1">{result.enhanced.meta_description}</p>
//               <div className="mt-4">
//                 <BlogEditor
//                   content={editedContent}
//                   onSave={(updated) => setEditedContent(updated)}
//                 />
//               </div>
//               <button
//                 onClick={() => setShowDiff(true)}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
//               >
//                 See What Changed
//               </button>
//             </section>
//           </div>
//         )}

//         {/* --- DIFF MODAL --- */}
//         {showDiff && result && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
//               <button
//                 onClick={() => setShowDiff(false)}
//                 className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
//               >
//                 ✕
//               </button>
//               <h2 className="text-2xl font-semibold text-blue-700">Content Changes</h2>
//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 p-4 rounded-xl border overflow-y-auto max-h-[60vh]">
//                   <h3 className="text-lg font-medium text-red-600">Original</h3>
//                   <div className="mt-2 text-gray-700 whitespace-pre-line">
//                     {result.original.content}
//                   </div>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-xl border overflow-y-auto max-h-[60vh]">
//                   <h3 className="text-lg font-medium text-green-600">Enhanced</h3>
//                   <div className="mt-2 text-gray-700 whitespace-pre-wrap">
//                     {renderDiff(result.original.content, result.enhanced.content)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { diffWords } from "diff";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CrawlEnhancePage() {
  const [mode, setMode] = useState<"rss" | "manual">("rss");
  const [rssUrl, setRssUrl] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showDiff, setShowDiff] = useState(false);
  const [plan, setPlan] = useState<"Free" | "Pro">("Pro"); // ⚠️ for now set Pro directly

  const handleEnhance = async () => {
    if (plan !== "Pro") {
      alert("Enhancing blogs is available only for Pro users. Please upgrade.");
      return;
    }

    setError(null);
    setResult(null);
    setEditedContent("");

    if (mode === "rss" && !rssUrl.trim()) {
      setError("Please enter a valid RSS feed URL");
      return;
    }

    if (mode === "manual" && manualContent.trim().length < 100) {
      setError("Please provide at least 100 characters of blog content");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/agents/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "rss" ? { rssUrl } : { manualContent, manualTitle }
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to process blog");
        return;
      }

      setResult(data);
      setEditedContent(data.enhanced.content);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Simple inline diff renderer
  const renderDiff = (original: string, enhanced: string) => {
    const diff = diffWords(original, enhanced);
    return diff.map((part, index) => {
      const style = part.added
        ? "bg-green-200 text-green-800 px-1 rounded"
        : part.removed
        ? "bg-red-200 text-red-800 px-1 rounded line-through"
        : "";
      return (
        <span key={index} className={style}>
          {part.value}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f8ff] via-white to-[#fdf2f8] p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Crawl & Enhance
        </h1>
        <p className="text-gray-500 mt-2">
          Import a blog via RSS or paste your content manually to enhance it with AI.
        </p>

        {/* Mode Switch */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setMode("rss")}
            className={`px-4 py-2 rounded-lg ${
              mode === "rss" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Use RSS Feed
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-lg ${
              mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Paste Blog Content
          </button>
        </div>

        {/* Input Fields */}
        {mode === "rss" ? (
          <div className="mt-6 flex gap-3">
            <input
              type="url"
              placeholder="https://example.com/feed"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-3"
            />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <input
              type="text"
              placeholder="Blog Title (optional)"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
            <textarea
              placeholder="Paste your blog content..."
              value={manualContent}
              onChange={(e) => setManualContent(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 min-h-[150px]"
            />
          </div>
        )}

        {/* Enhance Button */}
        <button
          onClick={handleEnhance}
          disabled={loading || plan !== "Pro"}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Processing..."
            : plan !== "Pro"
            ? "Upgrade to Pro to Enhance"
            : "Enhance Blog"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* --- RESULTS SECTION --- */}
        {result && (
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {/* Original Blog */}
            <section className="p-6 rounded-2xl bg-gray-50 border shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">Original Blog</h2>
              <h3 className="text-lg font-semibold mt-2">{result.original.title}</h3>
              <p className="text-gray-500 mb-4">{result.original.meta_description}</p>
              <MonacoEditor
                height="400px"
                language="markdown"
                value={result.original.content}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                }}
              />
            </section>

            {/* Enhanced Blog */}
            <section className="p-6 rounded-2xl bg-green-50 border shadow-sm">
              <h2 className="text-2xl font-bold text-green-700">Enhanced Blog</h2>
              <h3 className="text-lg font-semibold mt-2">{result.enhanced.title}</h3>
              <p className="text-gray-600 mb-4">{result.enhanced.meta_description}</p>
              <MonacoEditor
                height="400px"
                language="markdown"
                value={editedContent}
                onChange={(val) => setEditedContent(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                }}
              />
              <button
                onClick={() => setShowDiff(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                See What Changed
              </button>
            </section>
          </div>
        )}

        {/* --- DIFF MODAL --- */}
        {showDiff && result && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setShowDiff(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold text-blue-700">Content Changes</h2>
              <div className="mt-6 bg-gray-900 text-white rounded-xl p-4 font-mono overflow-auto max-h-[65vh] whitespace-pre-wrap">
                {renderDiff(result.original.content, editedContent)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

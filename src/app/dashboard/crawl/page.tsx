
// "use client";

// import { useState } from "react";
// import dynamic from "next/dynamic";
// import { diffWords } from "diff";
// import { motion } from "framer-motion";
// import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
// import { showToast } from "@/lib/toast";

// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// export default function CrawlEnhancePage() {
//   const [mode, setMode] = useState<"rss" | "manual">("rss");
//   const [rssUrl, setRssUrl] = useState("");
//   const [manualTitle, setManualTitle] = useState("");
//   const [manualContent, setManualContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [editedContent, setEditedContent] = useState("");
//   const [showDiff, setShowDiff] = useState(false);
//   const [plan] = useState<"Free" | "Pro">("Pro");

//   const handleEnhance = async () => {
//     if (plan !== "Pro") {
//       showToast({
//         type: "warning",
//         title: "Upgrade required",
//         description: "Enhancing content is available only for Pro users.",
//       });
//       return;
//     }

//     if (mode === "rss" && !rssUrl.trim()) {
//       showToast({
//         type: "error",
//         title: "Enter RSS URL",
//         description: "Provide a valid feed URL.",
//       });
//       return;
//     }

//     if (mode === "manual" && manualContent.trim().length < 100) {
//       showToast({
//         type: "error",
//         title: "Content too short",
//         description: "Paste at least 100 characters.",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("/api/agents/crawl", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           mode === "rss" ? { rssUrl } : { manualContent, manualTitle }
//         ),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Enhancing failed");

//       setResult(data);
//       setEditedContent(data.enhanced.content);

//       showToast({
//         type: "success",
//         title: "Enhanced successfully",
//         description: "Your blog has been polished by AI.",
//       });
//     } catch {
//       showToast({
//         type: "error",
//         title: "Unexpected error",
//         description: "Try again.",
//       });
//     }
//     setLoading(false);
//   };

//   const renderDiff = (original: string, enhanced: string) =>
//     diffWords(original, enhanced).map((part, index) => {
//       const style = part.added
//         ? "bg-green-500/25 text-green-700 px-1 rounded"
//         : part.removed
//         ? "bg-red-500/25 text-red-700 line-through px-1 rounded"
//         : "";
//       return (
//         <span key={index} className={style}>
//           {part.value}
//         </span>
//       );
//     });

//   return (
//     <LocalErrorBoundary>
      
//       <motion.div
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//         className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12"
//       >
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-semibold tracking-tight">
//             Crawl & Enhance
//           </h1>
//           <p className="text-muted-foreground text-sm mt-1">
//             Import from RSS or paste manually — AI rewrites, improves SEO & readability.
//           </p>
//           <p className="text-muted-foreground text-sm mt-2 leading-relaxed max-w-2xl">
//     WordyWrites refines your blogs like a professional editor —
//     improving grammar, clarity, sentence structure, flow and storytelling
//     while preserving your original tone and intent.
//   </p>
//         </div>
        

//         {/* Step container */}
//         <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 space-y-6 shadow-[0_0_25px_-10px_rgba(0,0,0,0.2)]">
//           {/* Mode Switch */}
//           <div className="flex gap-2">
//             {["rss", "manual"].map((m) => (
//               <button
//                 key={m}
//                 onClick={() => setMode(m as any)}
//                 className={`
//                 px-4 py-2 text-sm rounded-lg font-medium transition-all
//                 ${mode === m
//                   ? "bg-ai-accent text-white shadow-[0_0_10px_-3px_var(--ai-accent)]"
//                   : "bg-secondary/60 text-muted-foreground hover:bg-secondary/80"}
//               `}
//               >
//                 {m === "rss" ? "RSS Feed" : "Paste Content"}
//               </button>
//             ))}
//           </div>

//           {/* Inputs */}
//           {mode === "rss" ? (
//             <input
//               placeholder="https://example.com/feed"
//               value={rssUrl}
//               onChange={(e) => setRssUrl(e.target.value)}
//               className="w-full rounded-xl px-4 py-3 border bg-card text-sm"
//             />
//           ) : (
//             <div className="space-y-3">
//               <input
//                 placeholder="Blog Title (optional)"
//                 value={manualTitle}
//                 onChange={(e) => setManualTitle(e.target.value)}
//                 className="w-full rounded-xl px-4 py-3 border bg-card text-sm"
//               />
//               <textarea
//                 placeholder="Paste your blog content…"
//                 value={manualContent}
//                 onChange={(e) => setManualContent(e.target.value)}
//                 className="w-full rounded-xl px-4 py-3 min-h-[150px] border bg-card text-sm"
//               />
//             </div>
//           )}

//           {/* CTA */}
//           <motion.button
//             whileTap={{ scale: 0.97 }}
//             onClick={handleEnhance}
//             disabled={loading || plan !== "Pro"}
//             className="
//               w-full py-3 rounded-xl font-medium bg-ai-accent text-white
//               disabled:opacity-60 disabled:cursor-not-allowed text-base
//               shadow-[0_0_10px_-4px_var(--ai-accent)]
//               hover:bg-ai-accent/90 hover:shadow-[0_0_14px_-2px_var(--ai-accent)]
//             "
//           >
//             {loading
//               ? "Enhancing…"
//               : plan !== "Pro"
//               ? "Upgrade to Pro to Enhance"
//               : "Enhance Blog"}
//           </motion.button>
//         </div>

//         {/* Results */}
//         {result && (
//           <div className="grid md:grid-cols-2 gap-8">
//             {/* Original */}
//             <div className="p-5 border rounded-2xl bg-card/70 backdrop-blur space-y-2">
//               <h2 className="text-lg font-medium">Original Blog</h2>
//               <MonacoEditor
//                 height="420px"
//                 language="markdown"
//                 value={result.original.content}
//                 options={{
//                   readOnly: true,
//                   fontSize: 14,
//                   minimap: { enabled: false },
//                 }}
//               />
//             </div>

//             {/* Enhanced */}
//             <div className="p-5 border rounded-2xl bg-card/70 backdrop-blur space-y-2">
//               <h2 className="text-lg font-medium text-ai-accent">
//                 Enhanced Blog
//               </h2>
//               <MonacoEditor
//                 height="420px"
//                 language="markdown"
//                 value={editedContent}
//                 onChange={(v) => setEditedContent(v || "")}
//                 options={{
//                   fontSize: 14,
//                   minimap: { enabled: false },
//                 }}
//               />

//               <button
//                 onClick={() => setShowDiff(true)}
//                 className="mt-3 px-4 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition"
//               >
//                 View Changes
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Diff modal */}
//         {showDiff && result && (
//           <div className="fixed inset-0 grid place-items-center bg-black/50 z-50">
//             <div className="bg-card rounded-2xl border shadow-xl max-w-4xl w-full max-h-[85vh] p-6 overflow-y-auto relative">
//               <button
//                 onClick={() => setShowDiff(false)}
//                 className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
//               >
//                 ✕
//               </button>
//               <h2 className="text-xl font-semibold mb-4">
//                 AI Change Breakdown
//               </h2>
//               <div className="bg-black text-white rounded-xl p-4 font-mono overflow-auto max-h-[70vh] whitespace-pre-wrap text-sm">
//                 {renderDiff(result.original.content, editedContent)}
//               </div>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </LocalErrorBoundary>
//   );
// }




"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { diffWords } from "diff";
import { motion } from "framer-motion";
import { LocalErrorBoundary } from "../components/LocalErrorBoundary";
import { showToast } from "@/lib/toast";
import { Sparkles, Rss, FileText } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CrawlEnhancePage() {
  const [mode, setMode] = useState<"rss" | "manual">("rss");
  const [rssUrl, setRssUrl] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [editedContent, setEditedContent] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [plan] = useState<"Free" | "Pro">("Pro");

  const handleEnhance = async () => {
    if (plan !== "Pro") {
      showToast({
        type: "warning",
        title: "Upgrade required",
        description: "Enhancing content is available only for Pro users.",
      });
      return;
    }

    if (mode === "rss" && !rssUrl.trim()) {
      showToast({
        type: "error",
        title: "Enter RSS URL",
        description: "Provide a valid feed URL.",
      });
      return;
    }

    if (mode === "manual" && manualContent.trim().length < 100) {
      showToast({
        type: "error",
        title: "Content too short",
        description: "Paste at least 100 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/agents/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "rss" ? { rssUrl } : { manualContent, manualTitle }
        ),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enhancing failed");

      setResult(data);
      setEditedContent(data.enhanced.content);

      showToast({
        type: "success",
        title: "Enhanced successfully",
        description: "Your blog has been polished by AI.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Unexpected error",
        description: "Try again.",
      });
    }
    setLoading(false);
  };

  const renderDiff = (original: string, enhanced: string) =>
    diffWords(original, enhanced).map((part, index) => {
      const style = part.added
        ? "bg-green-500/25 text-green-700 px-1 rounded"
        : part.removed
        ? "bg-red-500/25 text-red-700 line-through px-1 rounded"
        : "";
      return (
        <span key={index} className={style}>
          {part.value}
        </span>
      );
    });

  return (
    <LocalErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-6xl mx-auto px-4 xl:px-6 py-10 space-y-12"
      >
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            
            Crawl & Enhance
          </h1>
          <p className="text-muted-foreground text-sm">
            Import via RSS or paste manually — then WordyWrites enhances readability, structure & SEO without losing your tone.
          </p>
        </div>

        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl 
            p-6 space-y-6 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.4)]
            hover:shadow-[0_4px_40px_-8px_var(--ai-accent)] transition-all
          "
        >
          {/* Mode Switch */}
          <div className="flex gap-2">
            {["rss", "manual"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`
                  px-4 py-2 text-sm rounded-lg font-medium transition-all flex items-center gap-2
                  ${mode === m
                    ? "bg-ai-accent text-white shadow-[0_0_10px_-3px_var(--ai-accent)]"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary/80"}
                `}
              >
                {m === "rss" ? <Rss className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {m === "rss" ? "RSS Feed" : "Paste Content"}
              </button>
            ))}
          </div>

          {/* Inputs */}
          {mode === "rss" ? (
            <input
              placeholder="https://example.com/feed"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border bg-card text-sm"
            />
          ) : (
            <div className="space-y-3">
              <input
                placeholder="Blog Title (optional)"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border bg-card text-sm"
              />
              <textarea
                placeholder="Paste your blog content…"
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                className="w-full rounded-xl px-4 py-3 min-h-[150px] border bg-card text-sm"
              />
            </div>
          )}

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleEnhance}
            disabled={loading || plan !== "Pro"}
            className="
              w-full py-3 rounded-xl font-medium bg-ai-accent text-white text-base
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-[0_0_10px_-4px_var(--ai-accent)]
              hover:bg-ai-accent/90 hover:shadow-[0_0_14px_-2px_var(--ai-accent)]
            "
          >
            {loading
              ? "Enhancing…"
              : plan !== "Pro"
              ? "Upgrade to Pro to Enhance"
              : "Enhance Blog"}
          </motion.button>
        </motion.div>

        {/* Results */}
        {result && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Original */}
            <div className="
              p-5 border border-border/60 rounded-2xl bg-card/70 backdrop-blur space-y-2
              shadow-[0_0_15px_-6px_rgba(0,0,0,0.4)]
            ">
              <h2 className="text-lg font-medium">Original Blog</h2>
              <MonacoEditor
                height="420px"
                language="markdown"
                value={result.original.content}
                options={{
                  readOnly: true,
                  fontSize: 14,
                  minimap: { enabled: false },
                }}
              />
            </div>

            {/* Enhanced */}
            <div className="
              p-5 border border-border/60 rounded-2xl bg-card/70 backdrop-blur space-y-2
              shadow-[0_0_15px_-6px_rgba(0,0,0,0.4)]
            ">
              <h2 className="text-lg font-medium text-ai-accent">
                Enhanced Blog
              </h2>
              <MonacoEditor
                height="420px"
                language="markdown"
                value={editedContent}
                onChange={(v) => setEditedContent(v || "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                }}
              />

              <button
                onClick={() => setShowDiff(true)}
                className="mt-3 px-4 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition"
              >
                View Changes
              </button>
            </div>
          </div>
        )}

        {/* Diff Modal */}
        {showDiff && result && (
          <div className="fixed inset-0 grid place-items-center bg-black/50 z-50">
            <div className="
              bg-card rounded-2xl border border-border/70 shadow-xl 
              max-w-4xl w-full max-h-[85vh] p-6 overflow-y-auto relative
            ">
              <button
                onClick={() => setShowDiff(false)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">AI Change Breakdown</h2>
              <div className="
                bg-black text-white rounded-xl p-4 font-mono overflow-auto 
                max-h-[70vh] whitespace-pre-wrap text-sm
              ">
                {renderDiff(result.original.content, editedContent)}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </LocalErrorBoundary>
  );
}

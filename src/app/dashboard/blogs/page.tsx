
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, PlusIcon, UploadIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBlogs } from "@/hooks/useBlogs";
import { LocalErrorBoundary } from "../components/LocalErrorBoundary";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });


marked.setOptions({
  gfm: true,
  breaks: true,
});


export default function BlogsPage() {
  const router = useRouter();
  const { data, error, isLoading } = useBlogs();
  const [publishingId, setPublishingId] = useState<string | null>(null);


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const blogs = useMemo(() => {
    if (!data) return [];
    
    return data.map((b: any) => {
      const blogContent = b?.blogAgent?.blog || "";
      const plainText = blogContent.replace(/[#_*~`>!-]/g, "").trim();
      const wordCount =
        b?.blogAgent?.wordCount ||
        plainText.split(/\s+/).filter(Boolean).length;
      const titleMatch = blogContent.match(/^\s*#\s+(.*)/m);

      return {
        _id: b._id,
        title: titleMatch?.[1]?.trim() || b?.keywordAgent?.keyword || "Untitled",
        createdAt: b.createdAt?.slice(0, 10) || "N/A",
        wordCount,
        status: b.status,
wordpressEditLink: b.wordpressEditLink,
wordpressPublicLink: b.wordpressPublicLink,
      
        blog: blogContent,
      };
    });
  }, [data]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: any) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  if (isLoading)
    return <p className="text-center py-10 text-muted-foreground">Loading blogs...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">Failed to load blogs.</p>;

  return (
    <LocalErrorBoundary>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">
  Every Blog You Create Makes You Better
</h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full sm:w-72 rounded-lg bg-secondary/40 backdrop-blur
                border border-border/50 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-ai-accent/60
                transition
              "
            />

            <Link
              href={{
                pathname: "/dashboard/create",
                query: { onSuccess: "true" },
              }}
            >
              <Button className="gap-1 bg-ai-accent hover:bg-ai-accent/90 shadow-[0_0_12px_-2px_var(--ai-accent)]">
                <PlusIcon className="size-4" /> Create New
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="bg-border/70" />


        {/* Blogs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog: any, index: number) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <Card className="
                group rounded-2xl overflow-hidden 
                bg-card/70 backdrop-blur-xl border border-border/50
                shadow-[0_0_20px_-12px_rgba(0,0,0,0.4)]
                hover:border-ai-accent/40 hover:shadow-[0_0_32px_-8px_var(--ai-accent)]
                transition-all
              ">
                <CardHeader>
                  <CardTitle className="
                    text-base font-semibold line-clamp-2
                    group-hover:text-ai-accent transition-colors
                  ">
                    {blog.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  {/* Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 opacity-70" />
                      {blog.createdAt}
                    </span>

                    {/* Status Badge */}
                    <span
  className={`
    px-2 py-0.5 rounded-md text-[10px] font-medium capitalize
    ${
      blog.status === "published"
        ? "bg-green-500/10 text-green-400 border border-green-500/30"
        : blog.status === "completed"
        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
    }
  `}
>
  {blog.status === "published" ? "Published ✓" : blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
</span>
                  </div>

                  {/* Word Count */}
                  <div className="flex items-center gap-1">
                    <FileTextIcon className="w-4 h-4 opacity-70" />
                    <span>
                      <strong className="text-foreground">{blog.wordCount}</strong> words
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="grid gap-2 pt-2">
  {/* DRAFT → Edit / Generate */}
  {blog.status === "draft" && (
    <Button
      size="sm"
      variant="outline"
      className="w-full border-ai-accent/40 hover:bg-ai-accent/10"
      onClick={() => router.push(`/dashboard/create?blogId=${blog._id}`)}
    >
      Edit / Generate
    </Button>
  )}

  {/* COMPLETED → Publish + Preview */}
  {blog.status === "completed" && (
    <>
      <Button
  size="sm"
  className="w-full gap-1 bg-ai-accent hover:bg-ai-accent/90 text-white"
  disabled={publishingId === blog._id}
  onClick={() => {
    setPublishingId(blog._id);
    router.push(
      `/dashboard/wordpress?blogId=${blog._id}&title=${encodeURIComponent(
        blog.title
      )}&content=${encodeURIComponent(blog.blog)}`
    );
  }}
>
  <UploadIcon className="size-4" />
  {publishingId === blog._id ? "Preparing…" : "Publish to WordPress"}
</Button>

      <Button
        size="sm"
        variant="outline"
        className="w-full border-ai-accent/40 hover:bg-ai-accent/10"
        onClick={() => setSelectedBlog(blog)}
      >
        View Draft
      </Button>
    </>
  )}

  {/* PUBLISHED → View Live + Edit on WP */}
  {blog.status === "published" && (
    <>
      {blog.wordpressPublicLink && (
        <Button
          size="sm"
          className="w-full bg-green-600 hover:bg-green-600/90 text-white"
          onClick={() => window.open(blog.wordpressPublicLink, "_blank")}
        >
          View Live
        </Button>
      )}

      {blog.wordpressEditLink && (
        <Button
          size="sm"
          variant="outline"
          className="w-full border-green-500/40 hover:bg-green-500/10"
          onClick={() => window.open(blog.wordpressEditLink, "_blank")}
        >
          Edit on WordPress
        </Button>
      )}
    </>
  )}
</div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Blog preview modal */}
        <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
          <DialogContent
            className="
              max-w-4xl rounded-2xl bg-card/80 backdrop-blur-xl
              border border-border/60 shadow-[0_0_40px_-10px_var(--ai-accent)]
              animate-in fade-in-50 zoom-in-90
            "
          >
            <DialogHeader>
              <DialogTitle className="font-heading text-xl tracking-tight">
                {selectedBlog?.title}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="preview" className="mt-4">
              <TabsList className="bg-secondary/40 border border-border/50 rounded-xl p-1">
                {["preview", "html"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="
                      rounded-lg text-sm font-medium
                      data-[state=active]:bg-ai-accent/20
                      data-[state=active]:text-ai-accent
                    "
                  >
                    {tab === "preview" ? "Preview" : "HTML"}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent
                value="preview"
                className="prose dark:prose-invert max-h-[70vh] overflow-y-auto border rounded-xl p-4 bg-background/60"
              >
                <div
  dangerouslySetInnerHTML={{
    __html: marked.parse(selectedBlog?.blog || "")as string,
  }}
/>
              </TabsContent>

              <TabsContent value="html">
                <MonacoEditor
                  height="70vh"
                  defaultLanguage="html"
                  value={selectedBlog?.blog || ""}
                  theme="vs-dark"
                  options={{ readOnly: true, minimap: { enabled: false } }}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </LocalErrorBoundary>
  );
}

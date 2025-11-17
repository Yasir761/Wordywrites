
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, PlusIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBlogs } from "@/hooks/useBlogs";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function BlogsPage() {
  const router = useRouter();
  const { data, error, isLoading } = useBlogs();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  // --- Normalize blogs ---
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
        status: b.status === "published" ? "Published" : "Draft",
        blog: blogContent,
      };
    });
  }, [data]);

  // --- Search filter ---
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: any) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  // --- Handle loading ---
  if (isLoading)
    return <p className="text-center py-10 text-muted-foreground">Loading blogs...</p>;

  if (error)
    return <p className="text-center py-10 text-red-500">Failed to load blogs.</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
          Your Blogs
        </h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-full sm:w-64"
          />

          <Link
            href={{
              pathname: "/dashboard/create",
              query: { onSuccess: "true" },
            }}
          >
            <Button className="gap-1">
              <PlusIcon className="size-4" /> Create New
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-purple-500/40 to-cyan-500/40" />

      {/* Blogs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog: any, index: number) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
          >
            <Card className="group transition-all hover:shadow-xl hover:ring-1 hover:ring-purple-500/40 hover:bg-gradient-to-br from-white/60 to-white/90 dark:from-gray-900/60 dark:to-gray-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {blog.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4 opacity-70" />
                    {blog.createdAt}
                  </span>
                </div>

                <div>
                  <span>Word Count: </span>
                  <strong className="text-gray-800 dark:text-gray-100">
                    {blog.wordCount}
                  </strong>
                </div>

                <div className="grid gap-2">
                  <Button
                    size="sm"
                    className="w-full gap-1"
                    onClick={() =>
                      router.push(
                        `/dashboard/wordpress?title=${encodeURIComponent(
                          blog.title
                        )}&content=${encodeURIComponent(blog.blog)}`
                      )
                    }
                  >
                    <UploadIcon className="size-4" /> Publish to WordPress
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    View Blog
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Blog preview modal */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedBlog?.title}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="preview" className="mt-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>

            <TabsContent
              value="preview"
              className="prose dark:prose-invert max-h-[70vh] overflow-y-auto"
            >
              <div
                dangerouslySetInnerHTML={{ __html: selectedBlog?.blog || "" }}
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
  );
}

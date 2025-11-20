

"use client";

import * as React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useUserPlan } from "@/hooks/useUserPlan";
import useSWR from "swr";
import { LocalErrorBoundary } from "./LocalErrorBoundary";
const ITEMS_PER_PAGE = 5;

export default function RecentBlogs() {
  const [page, setPage] = React.useState(0);

  // --- SWR USER PLAN ---
  const { data: planData } = useUserPlan();
  const plan = planData?.plan || "Free";

  // --- SWR BLOGS WITH PAGINATION ---
  const { data, error, isLoading } = useSWR(`/api/createdBlogs?page=${page}`);

  const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
  const totalPages = data?.totalPages || 1;

  const handlePublish = (blog: any) => {
    if (plan !== "Pro") {
      alert("Publishing to WordPress is available only for Pro users.");
      return;
    }

    const content =
      blog.blogAgent?.content ||
      blog.blogAgent?.blog ||
      blog.blog ||
      "";

    if (!content.trim()) {
      alert("Blog content is missing. Please regenerate or fetch full content.");
      return;
    }

    const title = blog.seoAgent?.optimized_title || blog.title || "Untitled";

    window.location.assign(
      `/dashboard/wordpress?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`
    );
  };

  return (
    <LocalErrorBoundary>
    <Card className="w-full mt-10 border border-white/30 bg-white/70 backdrop-blur-md shadow-md rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight text-gray-800">
          Recent Blogs
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 pt-0 overflow-x-auto">
        <div className="relative">
          
          {/* LOADING */}
          {isLoading ? (
            <Skeleton className="w-full h-[280px] rounded-xl bg-gray-100/40 animate-pulse" />
          ) : error ? (
            <div className="flex items-center justify-center h-[280px] text-red-500 text-sm">
              Failed to load blogs.
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">
              No blogs found.
            </div>
          ) : (
            <>
              <div className="overflow-auto max-h-[320px]">
                <Table className="min-w-[700px]">
                  <TableHeader className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/20">
                    <TableRow>
                      {["Title", "Date", "Tone", "Word Count", "Actions"].map((col, i) => (
                        <TableHead
                          key={i}
                          className="text-xs uppercase font-semibold text-gray-500 tracking-wider"
                        >
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {blogs.map((blog: any, i: number) => (
                      <motion.tr
                        key={blog._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group transition-all duration-200 hover:bg-gradient-to-r from-white/60 via-purple-50/30 to-cyan-50/30 backdrop-blur hover:shadow-sm"
                      >
                        <TableCell className="font-medium text-gray-800">
                          {blog.seoAgent?.optimized_title || blog.title || "Untitled Blog"}
                        </TableCell>

                        <TableCell className="text-sm text-gray-600">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <Badge className="text-xs font-medium border bg-blue-100 text-blue-700 border-blue-300">
                            {blog.toneAgent?.tone || "Neutral"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {blog.blogAgent?.wordCount || 0} words
                          </span>
                        </TableCell>

                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={plan !== "Pro"}
                            onClick={() => handlePublish(blog)}
                            className="text-xs"
                          >
                            Publish to WordPress
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-2 px-4 py-4 border-t border-white/20 bg-white/60 backdrop-blur">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  Next
                </Button>
              </div>

            </>
          )}
        </div>
      </CardContent>
    </Card>
    </LocalErrorBoundary>
  );
}

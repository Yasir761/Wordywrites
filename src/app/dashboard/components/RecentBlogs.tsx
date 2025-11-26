

// "use client";

// import * as React from "react";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion } from "framer-motion";
// import { useUserPlan } from "@/hooks/useUserPlan";
// import useSWR from "swr";
// import { LocalErrorBoundary } from "./LocalErrorBoundary";
// const ITEMS_PER_PAGE = 5;

// export default function RecentBlogs() {
//   const [page, setPage] = React.useState(0);

//   // --- SWR USER PLAN ---
//   const { data: planData } = useUserPlan();
//   const plan = planData?.plan || "Free";

//   // --- SWR BLOGS WITH PAGINATION ---
//   const { data, error, isLoading } = useSWR(`/api/createdBlogs?page=${page}`);

//   const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
//   const totalPages = data?.totalPages || 1;

//   const handlePublish = (blog: any) => {
//     if (plan !== "Pro") {
//       alert("Publishing to WordPress is available only for Pro users.");
//       return;
//     }

//     const content =
//       blog.blogAgent?.content ||
//       blog.blogAgent?.blog ||
//       blog.blog ||
//       "";

//     if (!content.trim()) {
//       alert("Blog content is missing. Please regenerate or fetch full content.");
//       return;
//     }

//     const title = blog.seoAgent?.optimized_title || blog.title || "Untitled";

//     window.location.assign(
//       `/dashboard/wordpress?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`
//     );
//   };

//   return (
//     <LocalErrorBoundary>
//     <Card className="w-full mt-10 border border-white/30 bg-white/70 backdrop-blur-md shadow-md rounded-2xl">
//       <CardHeader className="px-6 pt-6 pb-2">
//         <CardTitle className="text-xl font-semibold tracking-tight text-gray-800">
//           Recent Blogs
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="px-0 pt-0 overflow-x-auto">
//         <div className="relative">
          
//           {/* LOADING */}
//           {isLoading ? (
//             <Skeleton className="w-full h-[280px] rounded-xl bg-gray-100/40 animate-pulse" />
//           ) : error ? (
//             <div className="flex items-center justify-center h-[280px] text-red-500 text-sm">
//               Failed to load blogs.
//             </div>
//           ) : blogs.length === 0 ? (
//             <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">
//               No blogs found.
//             </div>
//           ) : (
//             <>
//               <div className="overflow-auto max-h-[320px]">
//                 <Table className="min-w-[700px]">
//                   <TableHeader className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/20">
//                     <TableRow>
//                       {["Title", "Date", "Tone", "Word Count", "Actions"].map((col, i) => (
//                         <TableHead
//                           key={i}
//                           className="text-xs uppercase font-semibold text-gray-500 tracking-wider"
//                         >
//                           {col}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   </TableHeader>

//                   <TableBody>
//                     {blogs.map((blog: any, i: number) => (
//                       <motion.tr
//                         key={blog._id}
//                         initial={{ opacity: 0, y: 4 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.05 }}
//                         className="group transition-all duration-200 hover:bg-gradient-to-r from-white/60 via-purple-50/30 to-cyan-50/30 backdrop-blur hover:shadow-sm"
//                       >
//                         <TableCell className="font-medium text-gray-800">
//                           {blog.seoAgent?.optimized_title || blog.title || "Untitled Blog"}
//                         </TableCell>

//                         <TableCell className="text-sm text-gray-600">
//                           {new Date(blog.createdAt).toLocaleDateString()}
//                         </TableCell>

//                         <TableCell>
//                           <Badge className="text-xs font-medium border bg-blue-100 text-blue-700 border-blue-300">
//                             {blog.toneAgent?.tone || "Neutral"}
//                           </Badge>
//                         </TableCell>

//                         <TableCell>
//                           <span className="text-sm text-gray-700">
//                             {blog.blogAgent?.wordCount || 0} words
//                           </span>
//                         </TableCell>

//                         <TableCell>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             disabled={plan !== "Pro"}
//                             onClick={() => handlePublish(blog)}
//                             className="text-xs"
//                           >
//                             Publish to WordPress
//                           </Button>
//                         </TableCell>
//                       </motion.tr>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* Pagination */}
//               <div className="flex items-center justify-end gap-2 px-4 py-4 border-t border-white/20 bg-white/60 backdrop-blur">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={page === 0}
//                   onClick={() => setPage((p) => Math.max(0, p - 1))}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={page >= totalPages - 1}
//                   onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//                 >
//                   Next
//                 </Button>
//               </div>

//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//     </LocalErrorBoundary>
//   );
// }





"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useUserPlan } from "@/hooks/useUserPlan";
import useSWR from "swr";
import { LocalErrorBoundary } from "./LocalErrorBoundary";

export default function RecentBlogs() {
  const [page, setPage] = React.useState(0);

  // Plan check
  const { data: planData } = useUserPlan();
  const plan = planData?.plan || "Free";

  // Blogs paginated
  const { data, error, isLoading } = useSWR(`/api/createdBlogs?page=${page}`);
  const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
  const totalPages = data?.totalPages || 1;

  const handlePublish = (blog: any) => {
    if (plan !== "Pro") {
      alert("Publishing to WordPress is available only for Pro users.");
      return;
    }

    const content =
      blog.blogAgent?.content || blog.blogAgent?.blog || blog.blog || "";

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
      <Card
        className="
       w-full mt-12 rounded-2xl bg-card/70 backdrop-blur-xl
    border border-border/60
    shadow-[0_0_25px_-10px_rgba(0,0,0,0.25)]
    hover:shadow-[0_0_35px_-8px_var(--ai-accent)]
    transition-all
        "
      >
        <CardHeader className="px-6 pt-6 pb-2">
          <CardTitle className="text-lg font-heading font-semibold text-foreground">
            Recent Blogs
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0 pt-0">
  {isLoading ? (
    <Skeleton className="w-full h-[260px] rounded-lg bg-muted/30 animate-pulse" />
  ) : error ? (
    <div className="flex items-center justify-center h-[260px] text-red-500 text-sm">
      Failed to load blogs.
    </div>
  ) : blogs.length === 0 ? (
    <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
      No blogs yet — start writing your first one 
    </div>
  ) : (
    <div
      className="
        grid gap-4 p-6
        sm:grid-cols-2 lg:grid-cols-3
      "
    >
      {blogs.map((blog: { seoAgent: { optimized_title: any; score: any; }; title: any; toneAgent: { tone: string; }; blogAgent: { wordCount: number; }; _id: React.Key | null | undefined; createdAt: string | number | Date; }, index: number) => {
        const title =
          blog.seoAgent?.optimized_title ||
          blog.title ||
          "Untitled Blog";

        const tone = blog.toneAgent?.tone || "Neutral";
        const seoScore = blog.seoAgent?.score;
        const wordCount = blog.blogAgent?.wordCount || 0;

        return (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="
              group rounded-xl border border-border bg-card
              shadow-[0_0_0_1px_var(--border)]
              hover:shadow-[0_0_0_1px_var(--ai-accent)]
              transition-all p-5 flex flex-col justify-between
              cursor-pointer
            "
          >
            {/* Title */}
            <h3 className="font-heading text-[15px] font-semibold leading-tight text-foreground line-clamp-2">
              {title}
            </h3>

            {/* Tone + SEO + Words */}
            <div className="mt-2 flex gap-2 flex-wrap">
              <Badge
                className="text-[10px] bg-ai-accent/10 text-ai-accent border border-ai-accent/30"
              >
                {tone}
              </Badge>

              {seoScore && (
                <Badge className="text-[10px] bg-secondary/60 text-foreground border border-border">
                  SEO {seoScore}
                </Badge>
              )}

              <Badge className="text-[10px] bg-secondary/40 text-muted-foreground border border-border">
                {wordCount} words
              </Badge>
            </div>

            {/* Updated At */}
            <p className="mt-2 text-[11px] text-muted-foreground">
              Updated {new Date(blog.createdAt).toLocaleDateString()}
            </p>

            {/* CTA Buttons on Hover */}
            <div
              className="
                mt-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100
                transition-all duration-200
              "
            >
              <Button
                size="sm"
                className="w-full text-[12px] font-heading"
                onClick={() =>
                  window.location.assign(`/dashboard/blog/${blog._id}`)
                }
              >
                Continue Editing
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={plan !== "Pro"}
                onClick={() => handlePublish(blog)}
                className="w-full text-[12px] font-heading disabled:opacity-40"
              >
                Publish to WordPress
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  )}

  {/* Pagination */}
  {blogs.length > 0 && (
    <div className="flex items-center justify-end gap-2 px-6 pb-6">
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
  )}
</CardContent>
      </Card>
    </LocalErrorBoundary>
  );
}

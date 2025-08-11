"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

type Blog = {
  _id: string
  title: string
  createdAt: string
  wordCount: number
  status: "Published" | "Draft"
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  // --- Normalize blogs so we can reuse it for both initial fetch and new blogs ---
  const normalizeBlogs = useCallback((data: any[]) => {
    return data.map((b: any) => {
      const blogContent = b?.blogAgent?.blog || ""
      const plainText = blogContent.replace(/[#_*~`>!-]/g, "").trim()
      const wordCount =
        b?.blogAgent?.wordCount ||
        plainText.split(/\s+/).filter(Boolean).length
      const titleMatch = blogContent.match(/^\s*#\s+(.*)/m)

      return {
        _id: b._id,
        title: titleMatch?.[1]?.trim() || b?.blogAgent?.keyword || "Untitled",
        createdAt: b.createdAt?.slice(0, 10) || "N/A",
        wordCount,
        status: b.status === "published" ? "Published" as const : "Draft" as const,
      }
    })
  }, [])

  // --- Fetch blogs from API on mount ---
  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch("/api/createdBlogs")
      if (!res.ok) return
      const data = await res.json()
      setBlogs(normalizeBlogs(data) as Blog[])
    }
    fetchBlogs()
  }, [normalizeBlogs])

  // --- Function to add a new blog instantly ---
  const addNewBlog = (newBlog: any) => {
    setBlogs((prev) => [normalizeBlogs([newBlog])[0], ...prev])
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
          Your Blogs
        </h1>
        <Link
          href={{
            pathname: "/dashboard/create",
            query: { onSuccess: "true" }, // optional if you want to signal callback
          }}
          className="inline-flex items-center"
        >
          <Button className="gap-1">
            <PlusIcon className="size-4" />
            Create New
          </Button>
        </Link>
      </div>

      <Separator className="bg-gradient-to-r from-purple-500/40 to-cyan-500/40" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="group transition-all hover:shadow-xl hover:ring-1 hover:ring-purple-500/40 hover:border-transparent hover:bg-gradient-to-br from-white/60 to-white/90 dark:from-gray-900/60 dark:to-gray-900/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base line-clamp-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs">
                    <CalendarIcon className="w-4 h-4 opacity-70" />
                    {blog.createdAt}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Word Count: </span>
                  <strong className="text-gray-800 dark:text-gray-100">
                    {blog.wordCount}
                  </strong>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

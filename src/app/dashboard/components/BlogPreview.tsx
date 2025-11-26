"use client"

import React from "react"
import { cn } from "@/lib/utils" 
import DOMPurify from "dompurify"

export default function BlogPreview({ content }: { content: string }) {
  if (!content) return null

  return (
    <article
      className={cn(
        "prose prose-base sm:prose-lg lg:prose-xl max-w-none mx-auto text-gray-800",
        "prose-headings:font-semibold prose-headings:text-gray-900 prose-a:text-indigo-600 hover:prose-a:underline prose-img:rounded-lg"
      )}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content),
      }}
    />
  )
}

"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Download,
  Code,
} from "lucide-react"
import { useMounted } from "@/lib/use-mouted"
import dynamic from "next/dynamic"
import { LocalErrorBoundary } from "@/app/dashboard/components/LocalErrorBoundary"


const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function BlogEditor({
  content,
  onSave,
}: {
  content: string
  onSave: (updated: string) => void
}) {
  const mounted = useMounted()
  const [showHtml, setShowHtml] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "ProseMirror focus:outline-none max-w-full min-h-[300px] border border-border rounded-md bg-card px-4 py-3",
      },
    },
    immediatelyRender: false,
  })

  const handleExportMarkdown = () => {
    if (!editor) return
    const markdown = editor.getText()
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "blog.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleHtmlView = () => {
    if (!editor) return
    if (!showHtml) {
      // switching to HTML mode → load current TipTap HTML
      setHtmlContent(editor.getHTML())
    } else {
      // switching back → update TipTap with edited HTML
      editor.commands.setContent(htmlContent)
    }
    setShowHtml(!showHtml)
  }

  if (!mounted || !editor) return null

  return (
    <LocalErrorBoundary>   <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {!showHtml && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-muted" : ""}
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-muted" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-muted" : ""}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 className="w-4 h-4" />
            </Button>
          </>
        )}
        <div className="ml-auto flex gap-2">
          {!showHtml && (
            <Button variant="secondary" size="sm" onClick={handleExportMarkdown}>
              <Download className="w-4 h-4 mr-1" />
              Export MD
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleHtmlView}
            className={showHtml ? "bg-muted" : ""}
          >
            <Code className="w-4 h-4 mr-1" />
            {showHtml ? "Back to Editor" : "View HTML"}
          </Button>
        </div>
      </div>

      {/* Toggle between Editor and HTML */}
      {!showHtml ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="h-[400px] border border-border rounded-md overflow-hidden">
          <MonacoEditor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={htmlContent}
            onChange={(val) => setHtmlContent(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      )}
    </div>
    </LocalErrorBoundary>
 
  )
}

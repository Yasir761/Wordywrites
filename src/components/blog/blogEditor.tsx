"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { Button } from "@/components/ui/button"
import {
  Bold, Italic, Underline as UnderlineIcon, Undo2, Redo2,
  Heading1, Heading2, List, ListOrdered, Download
} from "lucide-react"
import {useMounted} from "@/lib/use-mouted"

export default function BlogEditor({
  content,
  onSave,
}: {
  content: string
  onSave: (updated: string) => void
}) {
  const mounted = useMounted()

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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-full min-h-[300px] border border-border rounded-md bg-white px-4 py-3",
      },
    },
    immediatelyRender: false
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

  if (!mounted || !editor) return null

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "bg-muted" : ""}>
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "bg-muted" : ""}>
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "bg-muted" : ""}>
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}>
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}>
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "bg-muted" : ""}>
          <List className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "bg-muted" : ""}>
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" />
        </Button>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleExportMarkdown}>
            <Download className="w-4 h-4 mr-1" />
            Export MD
          </Button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Save */}
      {/* <Button className="mt-6" onClick={() => onSave(editor.getHTML())}>
        Save Blog
      </Button> */}
    </div>
  )
}

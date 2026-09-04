"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyTemplateButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = content
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-brand-100 hover:text-brand-700"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? "已复制" : "复制模板"}
    </button>
  )
}

"use client"

import { Download } from "lucide-react"

export function DownloadTemplateButton({ content, filename }: { content: string; filename: string }) {
  function handleDownload() {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-brand-100 hover:text-brand-700"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      导出 Markdown
    </button>
  )
}

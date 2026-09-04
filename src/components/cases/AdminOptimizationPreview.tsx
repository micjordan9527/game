"use client"

import { RefreshCw } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { CaseIframeVersionPanel } from "@/components/cases/CaseIframeVersionPanel"

type AdminOptimizationPreviewProps = {
  src: string
  version?: string | null
  updatedAt?: string | null
}

export function AdminOptimizationPreview({
  src,
  version = null,
  updatedAt = null,
}: AdminOptimizationPreviewProps) {
  const [previewSrc, setPreviewSrc] = useState(src)
  const [refreshVersion, setRefreshVersion] = useState<string | null>(null)

  const refreshSrc = useCallback(() => {
    const [basePath, anchor] = src.split("#", 2)
    const separator = basePath.includes("?") ? "&" : "?"
    const nextVersion = `rev-${Date.now()}`
    const rebuilt = `${basePath}${separator}cache=${encodeURIComponent(nextVersion)}${anchor ? `#${anchor}` : ""}`
    setPreviewSrc(rebuilt)
    setRefreshVersion(nextVersion)
  }, [src])

  const displayedVersion = useMemo(() => refreshVersion ?? "初始加载", [refreshVersion])

  return (
    <div className="rounded-lg border border-line bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <CaseIframeVersionPanel
          version={version}
          updatedAt={updatedAt}
          extraText={`当前加载版本：${displayedVersion}`}
          label="当前预览版本"
          compact
        />
        <button
          type="button"
          onClick={refreshSrc}
          className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-brand-100 hover:text-brand-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          重新拉取预览
        </button>
      </div>
      <iframe
        src={previewSrc}
        title="后台优化案例预览"
        className="h-[78vh] w-full bg-white"
        loading="lazy"
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
      />
    </div>
  )
}

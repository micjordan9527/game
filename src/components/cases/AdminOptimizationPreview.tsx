"use client"
import { RefreshCw } from "lucide-react"
import { useRef, useState } from "react"
import { AdminRoleGuide } from "@/components/enrichment/AdminRoleGuide"
import { assetPath } from "@/lib/assets"
export function AdminOptimizationPreview({ src }: { src: string }) {
  const initial = assetPath(src)
  const [previewSrc, setPreviewSrc] = useState(initial)
  const [tourStep, setTourStep] = useState(0)
  const [tourRole, setTourRole] = useState<string | null>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  function openTour(role: string, page: string, step: number) {
    setTourStep(step)
    setTourRole(role)
    const [base] = initial.split("#", 2)
    setPreviewSrc(`${base}&tour=${encodeURIComponent(role + page + step + Date.now())}#version=optimized&page=${encodeURIComponent(page)}`)
    frameRef.current?.scrollIntoView({ block: "start", behavior: "instant" })
  }
  function reload() {
    const url = new URL(previewSrc, window.location.origin)
    url.searchParams.set("cache", String(Date.now()))
    setPreviewSrc(url.pathname + url.search + url.hash)
  }
  return (
    <>
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <span className="text-sm font-semibold text-ink">交互演示</span>
        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted hover:text-brand-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          重新加载
        </button>
      </div>
      <iframe
        ref={frameRef}
        onLoad={() => {
          if (tourRole) frameRef.current?.contentDocument?.querySelector<HTMLButtonElement>(`.role-tab[data-role="${tourRole}"]`)?.click()
          if (tourStep === 2) frameRef.current?.contentDocument?.querySelector<HTMLButtonElement>("#tableBody [data-detail]")?.click()
        }}
        src={previewSrc}
        title="后台优化案例预览"
        className="scroll-mt-20 h-[78vh] w-full bg-white"
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
      />
    </div>
    <AdminRoleGuide onOpen={openTour} />
    </>
  )
}

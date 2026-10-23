"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"
import { materialStandards } from "@/data/materialStandards"
import { assetPath } from "@/lib/assets"

export function MaterialStandardsViewer() {
  const searchParams = useSearchParams()
  const selectedModule = materialStandards.find((item) => item.slug === searchParams.get("module"))
  const previewSrc = assetPath(`/case-assets/material-standards/index.html${selectedModule ? `#${selectedModule.slug}` : ""}`)
  const [previewState, setPreviewState] = useState<"loading" | "ready" | "fallback">("loading")
  const loadTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    setPreviewState("loading")
    const timer = window.setTimeout(() => setPreviewState("fallback"), 15000)
    loadTimer.current = timer
    return () => window.clearTimeout(timer)
  }, [previewSrc])

  return (
    <div className="container-shell py-12">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
        <Link href="/design" className="text-sm font-semibold text-brand-700">设计体验</Link>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink md:text-3xl">代理素材规范</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted">查看品牌标识、首页与运营活动的 PC / H5 素材规格、实际页面预览和 Figma 源稿。全民代理素材可在下方「运营活动」中查看。</p>
            <p className="mt-3 text-sm text-muted">V1.86</p>
          </div>
          <a href={previewSrc} target="_blank" rel="noopener" className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            新窗口打开
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="mt-8 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        {previewState !== "ready" ? (
          <div className="p-6 text-sm leading-7 text-muted" role="status">
            <p>{previewState === "loading" ? "正在加载素材预览…" : "预览暂时无法显示，可以打开完整规范查看尺寸、源图和页面示例。"}</p>
            <a href={previewSrc} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 font-semibold text-brand-700">
              打开完整规范 <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : null}
        <iframe
          key={selectedModule?.slug ?? "quick"}
          src={previewSrc}
          title="代理素材规范 V1.86"
          className={previewState === "fallback" ? "hidden" : "h-[82vh] min-h-[600px] w-full bg-white"}
          loading="eager"
          onLoad={(event) => {
            const previewDocument = event.currentTarget.contentDocument
            if (previewDocument?.body?.childElementCount && previewDocument.URL !== "about:blank") {
              window.clearTimeout(loadTimer.current)
              setPreviewState("ready")
            }
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </section>
    </div>
  )
}

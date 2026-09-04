"use client"

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import type { AiWorkflowOutput } from "@/data/aiWorkflowLibrary"

export function AiWorkflowOutputGallery({ outputs }: { outputs: AiWorkflowOutput[] }) {
  const titleId = useId()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isPinned, setIsPinned] = useState(false)
  const [pinnedStyle, setPinnedStyle] = useState({ left: 0, width: 0 })
  const galleryRef = useRef<HTMLDivElement>(null)
  const selectedOutput = outputs[selectedIndex] ?? outputs[0]
  const activeOutput = lightboxIndex === null ? null : outputs[lightboxIndex] ?? null
  const canNavigate = outputs.length > 1
  const topOffsetPx = 64
  const controlsHeight = 72

  const showPrevious = () => {
    setLightboxIndex((index) => {
      if (index === null || outputs.length === 0) return index
      return (index + outputs.length - 1) % outputs.length
    })
  }

  const showNext = () => {
    setLightboxIndex((index) => {
      if (index === null || outputs.length === 0) return index
      return (index + 1) % outputs.length
    })
  }

  const updatePinnedState = () => {
    const galleryEl = galleryRef.current

    if (!galleryEl) return

    const galleryRect = galleryEl.getBoundingClientRect()
    const shouldPin = galleryRect.top <= topOffsetPx && galleryRect.bottom > topOffsetPx + controlsHeight

    setIsPinned(shouldPin)
    if (shouldPin) {
      setPinnedStyle({
        left: galleryRect.left,
        width: galleryRect.width,
      })
    }
  }

  useEffect(() => {
    updatePinnedState()
    window.addEventListener("scroll", updatePinnedState, { passive: true })
    window.addEventListener("resize", updatePinnedState)

    return () => {
      window.removeEventListener("scroll", updatePinnedState)
      window.removeEventListener("resize", updatePinnedState)
    }
  }, [outputs.length, topOffsetPx])

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null)
      if (!canNavigate) return
      if (event.key === "ArrowLeft") showPrevious()
      if (event.key === "ArrowRight") showNext()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [canNavigate, lightboxIndex, outputs.length])

  if (!selectedOutput) {
    return <div className="mt-8 rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">暂无输出结果。</div>
  }

  const renderOutputTabs = (visible = true, compact = false) => (
    <div
      className={[
        compact ? "mt-0.5 flex gap-1.5 overflow-x-auto px-1 py-0.5" : "mt-3 flex gap-2 overflow-x-auto px-0.5 py-1",
        visible ? "" : "invisible",
      ].join(" ")}
      role="tablist"
      aria-label="切换输出图片"
    >
      {outputs.map((output, index) => (
        <button
          key={output.title}
          type="button"
          role="tab"
          aria-selected={selectedIndex === index}
          onClick={() => setSelectedIndex(index)}
          className={[
            compact ? "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition" : "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition",
            selectedIndex === index ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
          ].join(" ")}
        >
          输出 {index + 1}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <div ref={galleryRef} className="relative mt-8 rounded-lg border border-line bg-white shadow-sm">
        <div
          className="border-b border-line p-3"
        >
          <div className="flex items-center justify-between gap-3 pb-2">
            <p className="text-sm font-semibold text-ink">{selectedOutput.title}</p>
            <span className="shrink-0 rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">
              {selectedIndex + 1} / {outputs.length}
            </span>
          </div>
          {canNavigate ? renderOutputTabs(!isPinned) : null}
        </div>

        {isPinned ? (
          <div
            className="fixed z-50 border-b border-line/80 bg-white/90 backdrop-blur p-2 shadow-sm"
            style={{
              top: `${topOffsetPx}px`,
              left: `${pinnedStyle.left}px`,
              width: `${pinnedStyle.width}px`,
            }}
          >
            {canNavigate ? renderOutputTabs(true, true) : null}
          </div>
        ) : null}

        <button
          type="button"
          className="group relative block w-full cursor-zoom-in bg-paper p-3 text-left"
          onClick={() => setLightboxIndex(selectedIndex)}
        >
          <img src={selectedOutput.image} alt={selectedOutput.alt} className="mx-auto h-auto w-full max-w-5xl rounded-md bg-white shadow-sm" loading="lazy" />
          <span className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">查看大图</span>
          </span>
        </button>

        {canNavigate ? (
          <div className="border-t border-line bg-white p-3">
            <div className="grid auto-cols-[4.25rem] grid-flow-col gap-2 overflow-x-auto px-0.5 py-1">
              {outputs.map((output, index) => (
                <button
                  key={output.title}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={[
                    "relative h-20 overflow-hidden rounded-md border p-0.5 ring-1 transition",
                    selectedIndex === index ? "border-brand-700 ring-brand-200" : "border-line ring-transparent hover:border-brand-100",
                  ].join(" ")}
                  aria-label={`查看${output.title}`}
                >
                  <img src={output.image} alt="" className="h-full w-full rounded-sm object-cover" loading="lazy" />
                  <span className={["absolute left-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white", selectedIndex === index ? "bg-brand-700" : "bg-ink/60"].join(" ")}>
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {activeOutput ? (
        <div aria-labelledby={titleId} aria-modal="true" className="fixed inset-0 z-[70] bg-ink/80 p-4 backdrop-blur-sm sm:p-6" role="dialog">
          <div className="mx-auto flex h-full max-w-6xl flex-col rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold leading-6 text-ink sm:text-base" id={titleId}>
                {activeOutput.title}
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                {canNavigate ? (
                  <>
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink" onClick={showPrevious} type="button" aria-label="上一张">
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-12 text-center text-xs font-medium text-muted">
                      {(lightboxIndex ?? 0) + 1} / {outputs.length}
                    </span>
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink" onClick={showNext} type="button" aria-label="下一张">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </>
                ) : null}
                <button className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink" onClick={() => setLightboxIndex(null)} type="button" aria-label="关闭">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-paper p-3 sm:p-5">
              <img src={activeOutput.image} alt={activeOutput.alt} className="mx-auto h-auto w-full max-w-5xl rounded-md bg-white shadow-sm" />
            </div>
            {canNavigate ? (
              <div className="border-t border-line bg-white p-3">
                <div className="grid auto-cols-[3rem] grid-flow-col gap-2 overflow-x-auto px-0.5 py-1">
                  {outputs.map((output, index) => (
                    <button
                      key={output.title}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className={[
                        "relative h-16 overflow-hidden rounded-md border p-0.5 ring-1 transition",
                        lightboxIndex === index ? "border-brand-700 ring-brand-200" : "border-line ring-transparent hover:border-brand-100",
                      ].join(" ")}
                      aria-label={`切换到${output.title}`}
                    >
                      <img src={output.image} alt="" className="h-full w-full rounded-sm object-cover" loading="lazy" />
                      <span className={["absolute left-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white", lightboxIndex === index ? "bg-brand-700" : "bg-ink/60"].join(" ")}>
                        {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}

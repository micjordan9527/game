"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, X } from "lucide-react"

type SavedProgress = {
  percent: number
  offset: number
  updatedAt: number
}
export const READING_PROGRESS_PREFIX = "wg-article-reading:"
export const LAST_READING_KEY = "wg-reading-last"

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function ReadingProgress({ slug, title }: { slug: string; title: string }) {
  const [progress, setProgress] = useState(0)
  const [saved, setSaved] = useState<SavedProgress | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const lastWrite = useRef(0)

  useEffect(() => {
    setDismissed(false)
    setSaved(null)
    setProgress(0)

    const article = document.getElementById("article-content")
    if (!article) return

    const key = READING_PROGRESS_PREFIX + slug
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as SavedProgress
        if (typeof parsed.percent === "number" && typeof parsed.offset === "number" &&
          Number.isFinite(parsed.percent) && Number.isFinite(parsed.offset) &&
          parsed.percent >= 5 && parsed.percent < 99) {
          setSaved(parsed)
        }
      }
    } catch {
      // Storage might be blocked; reading still works.
    }

    let frame = 0
    function measure() {
      if (!article) return { percent: 0, offset: 0 }
      const rect = article.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const start = Math.max(0, top - 150)
      const end = Math.max(start + 1, top + rect.height - window.innerHeight + 160)
      const percent = Math.round(clamp((window.scrollY - start) / (end - start), 0, 1) * 100)
      setProgress(percent)
      frame = 0
      return { percent, offset: Math.max(0, window.scrollY - top + 120) }
    }

    function update() {
      const position = measure()
      if (position.percent < 1 || Date.now() - lastWrite.current < 600) return
      lastWrite.current = Date.now()
      const updatedAt = Date.now()
      try {
        window.localStorage.setItem(key, JSON.stringify({ ...position, updatedAt }))
        window.localStorage.setItem(LAST_READING_KEY, JSON.stringify({ slug, title, percent: position.percent, updatedAt }))
      } catch {
        // Browsing and progress display remain usable without storage.
      }
      if (window.scrollY > 170) setDismissed(true)
    }

    function onScroll() {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }
    function onResize() {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    }

    onResize()
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null
    resizeObserver?.observe(article)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      resizeObserver?.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [slug, title])

  function resumeReading() {
    if (!saved) return
    const article = document.getElementById("article-content")
    if (!article) return
    const top = article.getBoundingClientRect().top + window.scrollY
    const end = document.documentElement.scrollHeight - window.innerHeight
    const target = clamp(top + saved.offset - 120, 0, Math.max(0, end))
    setDismissed(true)
    window.scrollTo({ top: target, behavior: "smooth" })
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-1 bg-brand-600 transition-[width]" style={{ width: progress + "%" }} aria-hidden="true" />
      {saved && !dismissed ? (
        <div className="container-shell max-w-6xl pt-4">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm">
            <span className="min-w-0 flex-1 text-ink">上次阅读到约 {saved.percent}% · 仅保存于本设备浏览器</span>
            <button type="button" onClick={resumeReading} className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline">
              <ArrowDown className="h-4 w-4" aria-hidden="true" /> 继续上次阅读
            </button>
            <button type="button" onClick={() => setDismissed(true)} className="rounded p-1 text-muted hover:text-ink" aria-label="关闭上次阅读提示">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

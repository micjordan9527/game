"use client"

import { useEffect, useMemo, useState } from "react"
import type { ArticleHeading } from "@/lib/articles"

type ArticleTocProps = {
  headings: ArticleHeading[]
  readingMinutes: number
}

export function ArticleToc({ headings, readingMinutes }: ArticleTocProps) {
  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings])
  const [activeId, setActiveId] = useState(headingIds[0] ?? "")

  useEffect(() => {
    setActiveId(headingIds[0] ?? "")
    if (headingIds.length === 0) return

    let frame = 0
    function updateActiveHeading() {
      let current = headingIds[0]
      // getBoundingClientRect uses the viewport, unlike offsetTop.
      for (const id of headingIds) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= 140) current = id
      }
      setActiveId((previous) => previous === current ? previous : current)
      frame = 0
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateActiveHeading)
    }
    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [headingIds])

  if (headings.length === 0) return null

  const currentIndex = Math.max(0, headingIds.indexOf(activeId)) + 1

  return (
    <aside className="rounded-lg border border-line bg-white p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <details className="lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-ink">文章目录 · {currentIndex}/{headings.length} 节 · 约 {readingMinutes} 分钟</summary>
        <TocLinks headings={headings} activeId={activeId} onActivate={setActiveId} />
      </details>
      <div className="hidden lg:block">
        <div className="text-sm font-semibold text-ink">文章目录</div>
        <div className="mt-1 text-xs text-muted">第 {currentIndex}/{headings.length} 节 · 预计阅读 {readingMinutes} 分钟</div>
        <TocLinks headings={headings} activeId={activeId} onActivate={setActiveId} />
      </div>
    </aside>
  )
}

function TocLinks({ headings, activeId, onActivate }: { headings: ArticleHeading[]; activeId: string; onActivate: (id: string) => void }) {
  return (
    <nav className="mt-4 space-y-1" aria-label="本文章节">
      {headings.map((heading) => {
        const active = activeId === heading.id
        return (
          <a key={heading.level + "-" + heading.id} href={"#" + heading.id} aria-current={active ? "location" : undefined}
            onClick={() => onActivate(heading.id)}
            className={[
              "block rounded-md px-2 py-1.5 text-sm leading-6 transition",
              active ? "bg-brand-50 font-medium text-brand-700" : "text-muted hover:bg-paper hover:text-ink",
              heading.level === 3 ? "pl-5 text-xs" : "",
            ].join(" ")}>
            {heading.text}
          </a>
        )
      })}
    </nav>
  )
}

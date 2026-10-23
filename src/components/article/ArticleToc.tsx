"use client"

import { useEffect, useMemo, useState } from "react"
import type { ArticleHeading } from "@/lib/articles"

type ArticleTocProps = {
  headings: ArticleHeading[]
  readingMinutes: number
}

export function ArticleToc({ headings, readingMinutes }: ArticleTocProps) {
  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings])
  const headingKey = headingIds.join("|")
  const [activeId, setActiveId] = useState(headingIds[0] ?? "")

  useEffect(() => {
    setActiveId(headingIds[0] ?? "")
  }, [headingIds])

  useEffect(() => {
    if (headingIds.length === 0) return

    function updateActiveHeading() {
      let nextActiveId = headingIds[0]
      const readingLine = window.scrollY + 112

      for (const id of headingIds) {
        const element = document.getElementById(id)

        if (!element) continue
        if (element.offsetTop <= readingLine) {
          nextActiveId = id
        }
      }

      setActiveId((currentId) => (currentId === nextActiveId ? currentId : nextActiveId))
    }

    updateActiveHeading()
    window.addEventListener("scroll", updateActiveHeading, { passive: true })
    window.addEventListener("resize", updateActiveHeading)

    return () => {
      window.removeEventListener("scroll", updateActiveHeading)
      window.removeEventListener("resize", updateActiveHeading)
    }
  }, [headingIds, headingKey])

  if (headings.length === 0) return null

  return (
    <aside className="rounded-lg border border-line bg-white p-4 lg:sticky lg:top-24">
      <details className="lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-ink">文章目录 · 预计阅读 {readingMinutes} 分钟</summary>
        <TocLinks headings={headings} activeId={activeId} onActivate={setActiveId} />
      </details>
      <div className="hidden lg:block">
        <div className="text-sm font-semibold text-ink">文章目录</div>
        <div className="mt-1 text-xs text-muted">预计阅读 {readingMinutes} 分钟</div>
        <TocLinks headings={headings} activeId={activeId} onActivate={setActiveId} />
      </div>
    </aside>
  )
}

function TocLinks({ headings, activeId, onActivate }: { headings: ArticleHeading[]; activeId: string; onActivate: (id: string) => void }) {
  return (
    <nav className="mt-4 space-y-1">
      {headings.map((heading) => {
        const active = activeId === heading.id

        return (
          <a
            key={`${heading.level}-${heading.id}`}
            href={`#${heading.id}`}
            aria-current={active ? "true" : undefined}
            onClick={() => onActivate(heading.id)}
            className={[
              "block rounded-md px-2 py-1.5 text-sm leading-6 transition",
              active ? "bg-brand-50 font-medium text-brand-700" : "text-muted hover:bg-paper hover:text-ink",
              heading.level === 3 ? "pl-5 text-xs" : "",
            ].join(" ")}
          >
            {heading.text}
          </a>
        )
      })}
    </nav>
  )
}

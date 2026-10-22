"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, BookOpen } from "lucide-react"

type ArticleInfo = { slug: string; title: string }
type LastRead = { slug: string; title: string; percent: number; updatedAt: number }

const LAST_READING_KEY = "wg-reading-last"

export function ContinueReading({ articles }: { articles: ArticleInfo[] }) {
  const [last, setLast] = useState<LastRead | null>(null)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LAST_READING_KEY)
      if (!stored) return
      const parsed = JSON.parse(stored) as LastRead
      const article = articles.find((item) => item.slug === parsed.slug)
      if (article && Number.isFinite(parsed.percent) && parsed.percent >= 5 && parsed.percent < 99) {
        setLast({ ...parsed, title: article.title })
      }
    } catch {
      // The page works even when browser storage is unavailable.
    }
  }, [articles])

  if (!last) return null

  return (
    <section className="container-shell pt-2" aria-label="继续阅读">
      <Link href={"/articles/" + last.slug} className="flex flex-wrap items-center gap-4 rounded-lg border border-brand-100 bg-brand-50 p-4 transition hover:border-brand-200 hover:shadow-soft">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700"><BookOpen className="h-5 w-5" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-brand-700">继续上次阅读 · 约 {last.percent}%</span>
          <span className="mt-1 block truncate text-sm font-semibold text-ink">{last.title}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
      </Link>
    </section>
  )
}

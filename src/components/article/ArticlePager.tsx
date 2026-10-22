import Link from "next/link"
import { ArrowLeft, ArrowRight, List } from "lucide-react"
import type { ArticleReadingNavigation } from "@/lib/reading-order"

export function ArticlePager({ navigation }: { navigation: ArticleReadingNavigation }) {
  const { previous, next, pathHref, pathTitle, position, total } = navigation

  return (
    <nav className="container-shell max-w-4xl border-t border-line py-9" aria-label="连续阅读">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">继续学习 · {pathTitle}</h2>
          <p className="mt-1 text-sm text-muted">当前专题第 {position} / {total} 篇</p>
        </div>
        <Link href={pathHref} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
          <List className="h-4 w-4" aria-hidden="true" /> 查看专题目录
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link href={"/articles/" + previous.slug} className="rounded-lg border border-line bg-white p-5 hover:border-brand-200 hover:shadow-soft">
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 上一篇
            </div>
            <div className="mt-2 font-semibold leading-7 text-ink">{previous.title}</div>
          </Link>
        ) : <div className="hidden sm:block" />}

        {next ? (
          <Link href={"/articles/" + next.slug} className="rounded-lg border border-brand-100 bg-brand-50 p-5 text-right hover:border-brand-200 hover:shadow-soft">
            <div className="flex items-center justify-end gap-2 text-sm font-semibold text-brand-700">
              下一篇 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="mt-2 font-semibold leading-7 text-ink">{next.title}</div>
          </Link>
        ) : (
          <Link href={pathHref} className="rounded-lg border border-brand-100 bg-brand-50 p-5 text-right hover:shadow-soft">
            <div className="flex items-center justify-end gap-2 text-sm font-semibold text-brand-700">
              返回专题 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="mt-2 font-semibold leading-7 text-ink">本专题已读到最后一篇</div>
          </Link>
        )}
      </div>
    </nav>
  )
}

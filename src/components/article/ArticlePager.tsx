import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Article } from "@/data/articles"

type ArticlePagerProps = {
  previous?: Article
  next?: Article
}

export function ArticlePager({ previous, next }: ArticlePagerProps) {
  if (!previous && !next) return null

  return (
    <nav className="container-shell max-w-4xl border-t border-line py-8" aria-label="文章导航">
      <div className="grid gap-4 md:grid-cols-2">
        {previous ? (
          <Link href={`/articles/${previous.slug}`} className="rounded-lg border border-line bg-white p-5 hover:border-brand-100 hover:shadow-soft">
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              上一篇
            </div>
            <div className="mt-2 font-semibold leading-7 text-ink">{previous.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/articles/${next.slug}`} className="rounded-lg border border-line bg-white p-5 text-right hover:border-brand-100 hover:shadow-soft">
            <div className="flex items-center justify-end gap-2 text-sm font-medium text-muted">
              下一篇
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="mt-2 font-semibold leading-7 text-ink">{next.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
